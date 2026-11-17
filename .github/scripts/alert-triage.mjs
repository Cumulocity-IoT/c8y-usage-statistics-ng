// Classify open Dependabot alerts of the web app as "prod" (a vulnerable
// version ships in the built bundle) or "dev-only" (build, dev-server or
// test tooling, or a bundled copy that is already patched).
//
// Usage (from usage-statistics-app, after `ng build --stats-json`):
//   node ../.github/scripts/alert-triage.mjs
//
// Env:
//   GH_TOKEN        token that can read Dependabot alerts
//   ISSUE_TOKEN     token that writes the tracking issue, default GH_TOKEN. In
//                   Actions this is GITHUB_TOKEN, so the issue comes from
//                   github-actions[bot] and the assignee gets an email (GitHub
//                   never notifies people about their own actions).
//   ISSUE_ASSIGNEE  GitHub login assigned to a new tracking issue; also gets a
//                   comment (and email) when new prod alerts show up
//   GITHUB_REPOSITORY  owner/repo
//   STATS_FILE      default dist/usage-statistics-app/stats.json
//   UPDATE_ISSUE    "true" to create/update/close the tracking issue
//   ALERT_STATE     alert states to read, default open (e.g. "fixed" to test)
//   GITHUB_STEP_SUMMARY  set by Actions; the report is appended to it

import { createRequire } from 'node:module';
import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const appDir = process.cwd();
const require = createRequire(path.join(appDir, 'package.json'));
const semver = require('semver');

const repo = process.env.GITHUB_REPOSITORY;
const token = process.env.GH_TOKEN;
const issueToken = process.env.ISSUE_TOKEN || token;
const assignee = process.env.ISSUE_ASSIGNEE || '';
const statsFile = process.env.STATS_FILE || 'dist/usage-statistics-app/stats.json';
const updateIssue = process.env.UPDATE_ISSUE === 'true';
const ISSUE_LABEL = 'prod-dependency-alert';
const ISSUE_TITLE = 'Dependabot alerts that reach the production bundle';
const MANIFEST_PREFIX = 'usage-statistics-app/';

if (!repo || !token) {
  console.error('GITHUB_REPOSITORY and GH_TOKEN are required');
  process.exit(2);
}

// 1. Bundled packages: name -> Set of installed versions --------------------

function bundledPackages() {
  const stats = JSON.parse(readFileSync(statsFile, 'utf8'));
  const dirs = new Set();
  // Only the resource (after the last "!"), never loader paths like babel-loader.
  // Keep the full path up to the innermost node_modules/<pkg>, so nested copies
  // (node_modules/a/node_modules/b) resolve to the version that is really used.
  const re = /^(.*node_modules[\\/](?:@[^\\/]+[\\/])?[^\\/]+)/;
  const add = (s) => {
    if (!s) return;
    const resource = String(s).split('!').pop().split('?')[0].replace(/ \+ \d+ modules$/, '');
    const m = re.exec(resource);
    if (m) dirs.add(m[1]);
  };
  const walk = (mods) => {
    for (const m of mods || []) {
      add(m.nameForCondition);
      add(m.name);
      walk(m.modules);
    }
  };
  const walkStats = (s) => {
    walk(s.modules);
    for (const c of s.chunks || []) walk(c.modules);
    for (const child of s.children || []) walkStats(child);
  };
  walkStats(stats);

  // The c8y devkit builds Monaco's workers separately into dist/monaco-workers.
  if (existsSync('dist/monaco-workers')) dirs.add('node_modules/monaco-editor');

  const pkgs = new Map();
  for (const rel of dirs) {
    const dir = path.isAbsolute(rel) ? rel : path.join(appDir, rel);
    const pj = path.join(dir, 'package.json');
    if (!existsSync(pj)) continue;
    const { name, version } = JSON.parse(readFileSync(pj, 'utf8'));
    if (!name || !version) continue;
    if (!pkgs.has(name)) pkgs.set(name, new Set());
    pkgs.get(name).add(version);
  }
  return pkgs;
}

// 2. GitHub API ---------------------------------------------------------------

async function gh(method, url, body, auth = token) {
  const res = await fetch(url.startsWith('http') ? url : `https://api.github.com${url}`, {
    method,
    headers: {
      Authorization: `Bearer ${auth}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${url} -> ${res.status}: ${text.slice(0, 300)}`);
  }
  const next = /<([^>]+)>;\s*rel="next"/.exec(res.headers.get('link') || '')?.[1];
  return { data: res.status === 204 ? null : await res.json(), next };
}

async function openAlerts() {
  const out = [];
  let url = `/repos/${repo}/dependabot/alerts?state=${process.env.ALERT_STATE || 'open'}&ecosystem=npm&per_page=100`;
  while (url) {
    const { data, next } = await gh('GET', url);
    out.push(...data);
    url = next;
  }
  return out.filter((a) => a.dependency?.manifest_path?.startsWith(MANIFEST_PREFIX));
}

// 3. Classify -------------------------------------------------------------------

function classify(alert, pkgs) {
  const name = alert.dependency.package.name;
  const range = alert.security_vulnerability.vulnerable_version_range; // ">= 1.0, < 1.2"
  const semverRange = range.split(',').map((p) => p.trim().replace(/\s+/g, '')).join(' ');
  const versions = [...(pkgs.get(name) || [])];
  const vulnerable = versions.filter((v) => semver.satisfies(v, semverRange));
  let cls;
  if (vulnerable.length) cls = 'prod';
  else if (versions.length) cls = 'dev-only (bundled copy patched)';
  else cls = 'dev-only';
  return {
    number: alert.number,
    url: alert.html_url,
    pkg: name,
    severity: alert.security_advisory.severity,
    summary: alert.security_advisory.summary,
    range,
    fix: alert.security_vulnerability.first_patched_version?.identifier || '-',
    dependabotScope: alert.dependency.scope,
    bundled: versions.join(', ') || '-',
    cls,
    prod: cls === 'prod',
  };
}

const SEV = { critical: 0, high: 1, medium: 2, low: 3 };

function table(rows) {
  if (!rows.length) return '_None._\n';
  const esc = (s) => String(s).replace(/\|/g, '\\|');
  return [
    '| Alert | Package | Severity | Vulnerable | Fixed in | Bundled version | Dependabot scope | Summary |',
    '|---|---|---|---|---|---|---|---|',
    ...rows.map((r) =>
      `| [#${r.number}](${r.url}) | \`${r.pkg}\` | ${r.severity} | ${esc(r.range)} | ${r.fix} | ${r.bundled} | ${r.dependabotScope} | ${esc(r.summary)} |`),
  ].join('\n') + '\n';
}

// 4. Tracking issue ---------------------------------------------------------------

async function syncIssue(prodRows) {
  const api = (method, url, body) => gh(method, url, body, issueToken);
  try {
    await api('POST', `/repos/${repo}/labels`, { name: ISSUE_LABEL, color: 'b60205', description: 'Dependabot alert that ships in the production bundle' });
  } catch (e) {
    if (!String(e.message).includes('422')) throw e; // already exists
  }
  const { data: issues } = await api('GET', `/repos/${repo}/issues?state=open&labels=${ISSUE_LABEL}&per_page=10`);
  const issue = issues.find((i) => !i.pull_request);

  if (!prodRows.length) {
    if (issue) {
      await api('POST', `/repos/${repo}/issues/${issue.number}/comments`, { body: 'No open Dependabot alert reaches the production bundle any more. Closing.' });
      await api('PATCH', `/repos/${repo}/issues/${issue.number}`, { state: 'closed', state_reason: 'completed' });
      console.log(`Closed issue #${issue.number}`);
    }
    return;
  }

  const body = [
    'These open Dependabot alerts affect a package version that ships in the built web app (`dist/`). Fix them and cut a release.',
    '',
    table(prodRows),
    'Dev-only alerts (build, dev-server and test tooling) are listed in the latest run of the **Dependabot alert triage** workflow. They do not need a release.',
    '',
    '_Updated by `.github/workflows/alert-triage.yml`._',
  ].join('\n');

  if (issue) {
    if (issue.body?.trim() !== body.trim()) {
      // Body edits send no notification; a comment does, so post one for new alerts.
      const known = new Set([...(issue.body || '').matchAll(/\[#(\d+)\]\(/g)].map((m) => Number(m[1])));
      const added = prodRows.filter((r) => !known.has(r.number));
      await api('PATCH', `/repos/${repo}/issues/${issue.number}`, { body });
      console.log(`Updated issue #${issue.number}`);
      if (added.length) {
        const who = assignee ? `@${assignee} ` : '';
        const list = added.map((r) => `- [#${r.number}](${r.url}) \`${r.pkg}\` (${r.severity}): ${r.summary}`).join('\n');
        await api('POST', `/repos/${repo}/issues/${issue.number}/comments`, { body: `${who}New Dependabot alerts reach the production bundle:\n\n${list}` });
        console.log(`Commented on issue #${issue.number} about ${added.length} new prod alert(s)`);
      }
    }
  } else {
    const { data } = await api('POST', `/repos/${repo}/issues`, {
      title: ISSUE_TITLE, body, labels: [ISSUE_LABEL], ...(assignee ? { assignees: [assignee] } : {}),
    });
    console.log(`Opened issue #${data.number}${assignee ? ` assigned to ${assignee}` : ''}`);
  }
}

// Main ------------------------------------------------------------------------------

const pkgs = bundledPackages();
if (pkgs.size < 10) {
  console.error(`Only ${pkgs.size} bundled packages found in ${statsFile}; the stats format may have changed.`);
  process.exit(2);
}

let alerts;
try {
  alerts = await openAlerts();
} catch (e) {
  console.error(e.message);
  if (/\b(403|404)\b/.test(e.message)) {
    const msg = 'The token cannot read Dependabot alerts. Add a fine-grained token with "Dependabot alerts: read" as the DEPENDABOT_ALERTS_TOKEN secret.';
    // Pull requests (Dependabot's own, forks) get no repo secrets; warn there, fail on main.
    if (!updateIssue) {
      console.log(`::warning::${msg} Skipping the report on this pull request.`);
      process.exit(0);
    }
    console.error(msg);
  }
  process.exit(1);
}

const rows = alerts.map((a) => classify(a, pkgs)).sort((a, b) => (SEV[a.severity] - SEV[b.severity]) || a.number - b.number);
const prod = rows.filter((r) => r.prod);
const dev = rows.filter((r) => !r.prod);

const report = [
  '## Dependabot alert triage',
  '',
  `${pkgs.size} npm packages ship in the production bundle. ${rows.length} open alerts: **${prod.length} prod**, ${dev.length} dev-only.`,
  '',
  '### Prod (fix and release)',
  table(prod),
  '### Dev-only (batch, no release needed)',
  table(dev),
].join('\n');

console.log(report);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, report + '\n');
if (updateIssue) await syncIssue(prod);
