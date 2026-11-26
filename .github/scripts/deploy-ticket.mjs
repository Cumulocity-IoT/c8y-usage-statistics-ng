// After a release, open a CST (Customer Support Tickets) Jira ticket asking Ops
// to deploy it, but only when the release fixes something that reaches
// production. A release counts as a prod fix when, since the previous tag:
//   - a merged PR title starts with "Fix prod Dependabot alerts" (the cloud
//     routine's PRs), or
//   - an issue labeled prod-dependency-alert was closed (the triage workflow
//     closes it once no prod alert is left), or
//   - a microservice (Maven) Dependabot alert outside test scope was fixed, or
//   - a commit message contains [prod-fix] (manual override).
//
// Usage (repo root, full git history): node .github/scripts/deploy-ticket.mjs
//
// Env:
//   GITHUB_REPOSITORY  owner/repo
//   RELEASE_TAG        tag that was released, e.g. v1.2.7
//   GH_TOKEN           reads PRs, issues and releases
//   ALERTS_TOKEN       reads Dependabot alerts (DEPENDABOT_ALERTS_TOKEN); optional
//   JIRA_BASE_URL      default https://cumulocity.atlassian.net
//   JIRA_EMAIL, JIRA_API_TOKEN  Atlassian account that files the ticket
//   DRY_RUN            "true" prints the ticket instead of creating it
//   GITHUB_STEP_SUMMARY  set by Actions; the result is appended to it

import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';

const repo = process.env.GITHUB_REPOSITORY;
const tag = process.env.RELEASE_TAG;
const ghToken = process.env.GH_TOKEN;
const alertsToken = process.env.ALERTS_TOKEN || '';
const jiraBase = (process.env.JIRA_BASE_URL || 'https://cumulocity.atlassian.net').replace(/\/$/, '');
const jiraEmail = process.env.JIRA_EMAIL || '';
const jiraToken = process.env.JIRA_API_TOKEN || '';
const dryRun = process.env.DRY_RUN === 'true';

const PROJECT = 'CST';
const ISSUE_TYPE_ID = '10353'; // Support
const TARGET = 'all public cloud instances';

if (!repo || !tag || !ghToken) {
  console.error('GITHUB_REPOSITORY, RELEASE_TAG and GH_TOKEN are required');
  process.exit(2);
}

const summary = (line) => {
  console.log(line);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, line + '\n');
};
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();

async function ghRaw(url, token) {
  const res = await fetch(url.startsWith('http') ? url : `https://api.github.com${url}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
  });
  if (!res.ok) throw new Error(`GET ${url}: ${res.status} ${await res.text()}`);
  const next = /<([^>]+)>;\s*rel="next"/.exec(res.headers.get('link') || '')?.[1];
  return { data: await res.json(), next };
}
const gh = async (url, token = ghToken) => (await ghRaw(url, token)).data;

// Follows the Link header, which works for both page- and cursor-paginated APIs.
async function ghAll(url, token = ghToken) {
  const out = [];
  let next = `${url}${url.includes('?') ? '&' : '?'}per_page=100`;
  while (next) {
    const page = await ghRaw(next, token);
    out.push(...page.data);
    next = page.next;
  }
  return out;
}

// 1. What changed since the previous tag ----------------------------------------

let prevTag = '';
try {
  prevTag = git('describe', '--tags', '--abbrev=0', `${tag}^`);
} catch {
  summary(`No tag before ${tag}; skipping the deploy ticket.`);
  process.exit(0);
}
const since = git('log', '-1', '--format=%cI', prevTag);
const until = git('log', '-1', '--format=%cI', tag);
const ts = (d) => (d ? new Date(d).getTime() : NaN);
// PRs must be merged before the tagged commit. Issue closes and Dependabot
// "fixed" dates lag the merge (the triage job runs daily), so they count up to now.
const mergedInRelease = (d) => ts(d) > ts(since) && ts(d) <= ts(until);
const sincePrevTag = (d) => ts(d) > ts(since);
const messages = git('log', '--format=%B', `${prevTag}..${tag}`);

const reasons = [];

if (/\[prod-fix\]/i.test(messages)) reasons.push('A commit is marked `[prod-fix]`.');

const prs = (await ghAll(`/repos/${repo}/pulls?state=closed&base=main&sort=updated&direction=desc`))
  .filter((p) => mergedInRelease(p.merged_at) && /^Fix prod Dependabot alerts/i.test(p.title));
for (const p of prs) reasons.push(`Merged ${p.html_url}: ${p.title}`);

const issues = (await ghAll(`/repos/${repo}/issues?state=closed&labels=prod-dependency-alert`))
  .filter((i) => !i.pull_request && sincePrevTag(i.closed_at));
for (const i of issues) reasons.push(`Closed prod tracking issue ${i.html_url}`);

const fixedAlerts = [];
if (alertsToken) {
  try {
    const alerts = await ghAll(`/repos/${repo}/dependabot/alerts?state=fixed`, alertsToken);
    for (const a of alerts) {
      if (!sincePrevTag(a.fixed_at)) continue;
      const maven = a.dependency?.package?.ecosystem === 'maven' && a.dependency.manifest_path?.startsWith('metrics-aggregator/');
      if (maven && a.dependency.scope !== 'development') fixedAlerts.push(a);
    }
  } catch (e) {
    console.log(`::warning::Could not read Dependabot alerts: ${e.message.split('\n')[0]}`);
  }
}
const SEV = { critical: 0, high: 1, medium: 2, low: 3 };
fixedAlerts.sort((a, b) => SEV[a.security_advisory.severity] - SEV[b.security_advisory.severity] || b.number - a.number);
if (fixedAlerts.length) reasons.push(`${fixedAlerts.length} microservice Dependabot alert(s) outside test scope fixed.`);

summary(`## Deploy ticket for ${tag}\n\nChanges ${prevTag}..${tag} (${since} to ${until}).`);
if (!reasons.length) {
  summary('No production fix in this release, so no CST ticket.');
  process.exit(0);
}

// 2. Ticket text ------------------------------------------------------------------

const release = await gh(`/repos/${repo}/releases/tags/${tag}`).catch(() => null);
const releaseUrl = release?.html_url || `https://github.com/${repo}/releases/tag/${tag}`;
const assets = (release?.assets || []).map((a) => `* [${a.name}|${a.browser_download_url}]`);

const title = `Deploy Usage Statistics ${tag} (security fix) on ${TARGET}`;
const description = [
  'Hi,',
  '',
  `please update the *Usage Statistics* web application and the *metrics-aggregator* microservice to *${tag}* on ${TARGET} where they are installed.`,
  'This release fixes security issues in code that ships to production.',
  '',
  `*Release:* [${tag}|${releaseUrl}]`,
  ...(assets.length ? ['*Downloads:*', ...assets] : ['*Downloads:* attached to the release above.']),
  '',
  '*Why a deployment is needed:*',
  ...reasons.map((r) => `* ${r.replace(/`/g, '')}`),
  ...(fixedAlerts.length ? ['', '*Fixed microservice alerts:*',
    ...fixedAlerts.slice(0, 10).map((a) => `* [#${a.number}|${a.html_url}] ${a.dependency.package.name} (${a.security_advisory.severity}): ${a.security_advisory.summary.trim()}`),
    ...(fixedAlerts.length > 10 ? [`* ... and ${fixedAlerts.length - 10} more: [all fixed alerts|https://github.com/${repo}/security/dependabot?q=is%3Aclosed]`] : [])] : []),
  '',
  `*Changes since ${prevTag}:* [compare|https://github.com/${repo}/compare/${prevTag}...${tag}]`,
  '',
  `_Created automatically by .github/workflows/release.yaml in ${repo}._`,
].join('\n');

// 3. Create it (once per tag) ------------------------------------------------------

async function jira(method, url, body) {
  const res = await fetch(`${jiraBase}${url}`, {
    method,
    headers: {
      Authorization: `Basic ${Buffer.from(`${jiraEmail}:${jiraToken}`).toString('base64')}`,
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, data: text ? JSON.parse(text) : null, text };
}

if (dryRun) {
  summary(`Dry run, would create in ${PROJECT}:\n\n**${title}**\n\n\`\`\`\n${description}\n\`\`\``);
  process.exit(0);
}
if (!jiraEmail || !jiraToken) {
  summary(`::warning::JIRA_EMAIL / JIRA_API_TOKEN secrets are missing, so no CST ticket was created. Create it by hand: "${title}".`);
  process.exit(0);
}

const jql = `project = ${PROJECT} AND summary ~ "\\"Usage Statistics ${tag}\\""`;
const found = await jira('POST', '/rest/api/3/search/jql', { jql, fields: ['summary'], maxResults: 1 });
if (!found.ok) throw new Error(`Jira search failed: ${found.status} ${found.text}`);
if (found.data.issues?.length) {
  summary(`CST ticket already exists: ${jiraBase}/browse/${found.data.issues[0].key}`);
  process.exit(0);
}

const fields = {
  project: { key: PROJECT },
  issuetype: { id: ISSUE_TYPE_ID },
  summary: title,
  description,
  labels: ['usage-statistics', 'security-fix'],
};
let created = await jira('POST', '/rest/api/2/issue', { fields });
if (!created.ok && created.status === 400) {
  // Labels may not be on the create screen; the summary is the only required field.
  delete fields.labels;
  created = await jira('POST', '/rest/api/2/issue', { fields });
}
if (!created.ok) throw new Error(`Creating the CST ticket failed: ${created.status} ${created.text}`);
summary(`Created ${jiraBase}/browse/${created.data.key}: ${title}`);
