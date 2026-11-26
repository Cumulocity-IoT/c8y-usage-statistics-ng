// Decide whether a release must be deployed because it fixes something that
// reaches production, and draft the CST (Customer Support Tickets) Jira ticket
// asking Ops to deploy it. Filing the ticket is left to the caller: the daily
// cloud routine reads this output and creates the ticket through the Atlassian
// connector, so no Jira credentials live in this repository.
//
// A release counts as a prod fix when, since the previous tag:
//   - a merged PR title starts with "Fix prod Dependabot alerts" (the cloud
//     routine's PRs),
//   - an issue labeled prod-dependency-alert was closed (the triage workflow
//     closes it once no prod alert is left),
//   - a microservice (Maven) Dependabot alert outside test scope was fixed
//     (only checked when ALERTS_TOKEN is set), or
//   - a commit message has a line starting with [prod-fix] (manual override).
//
// Closed issues and fixed alerts count only when this release contains a
// lockfile or pom change from the 25 hours before them, so a late close is not
// counted again for the next release.
//
// Usage (repo root, full git history and tags):
//   node .github/scripts/deploy-ticket.mjs            # human-readable
//   node .github/scripts/deploy-ticket.mjs --json     # for the routine
//
// Env:
//   GITHUB_REPOSITORY  owner/repo, default Cumulocity-IoT/c8y-usage-statistics-ng
//   RELEASE_TAG        release to check, default the latest published release
//   GH_TOKEN           optional; the repo is public, so reads work without it
//   ALERTS_TOKEN       optional; reads Dependabot alerts (needs "Dependabot alerts: read")

import { execFileSync } from 'node:child_process';

const repo = process.env.GITHUB_REPOSITORY || 'Cumulocity-IoT/c8y-usage-statistics-ng';
const ghToken = process.env.GH_TOKEN || '';
const alertsToken = process.env.ALERTS_TOKEN || '';
const asJson = process.argv.includes('--json');

const TARGET = 'all public cloud instances';
const SEV = { critical: 0, high: 1, medium: 2, low: 3 };

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();

async function ghRaw(url, token) {
  const res = await fetch(url.startsWith('http') ? url : `https://api.github.com${url}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
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

function finish(result) {
  if (asJson) {
    console.log(JSON.stringify(result, null, 2));
  } else if (!result.deploy) {
    console.log(`${result.tag}: ${result.message}`);
  } else {
    console.log(`${result.tag}: deployment needed\n\n${result.summary}\n\n${result.description}`);
  }
  process.exit(0);
}

// 1. Which release, and what changed since the previous tag -----------------------

const release = process.env.RELEASE_TAG
  ? await gh(`/repos/${repo}/releases/tags/${process.env.RELEASE_TAG}`).catch(() => null)
  : await gh(`/repos/${repo}/releases/latest`);
const tag = process.env.RELEASE_TAG || release.tag_name;

let prevTag = '';
try {
  prevTag = git('describe', '--tags', '--abbrev=0', `${tag}^`);
} catch {
  finish({ tag, deploy: false, message: `No tag before ${tag}.` });
}
const since = git('log', '-1', '--format=%cI', prevTag);
const until = git('log', '-1', '--format=%cI', tag);
const ts = (d) => (d ? new Date(d).getTime() : NaN);
const mergedInRelease = (d) => ts(d) > ts(since) && ts(d) <= ts(until);

// Issue closes and Dependabot "fixed" dates lag the fixing merge by up to a day
// (the triage job runs daily), so they can fall after this tag or even after the
// next one. Attribute such an event to this release only if the release contains
// a dependency change (lockfile or pom, merged into main) in the 25 hours before it.
const LAG = 25 * 3600 * 1000;
const depChanges = git('log', '--first-parent', '-m', '--format=%cI', `${prevTag}..${tag}`, '--',
  'usage-statistics-app/package-lock.json', 'metrics-aggregator/pom.xml').split('\n').filter(Boolean).map(ts);
const fixedByThisRelease = (d) => depChanges.some((c) => c <= ts(d) && c >= ts(d) - LAG);

const reasons = [];

if (/^\[prod-fix\]/im.test(git('log', '--format=%B', `${prevTag}..${tag}`))) {
  reasons.push('A commit in this release is marked as a production fix.');
}

const prs = (await ghAll(`/repos/${repo}/pulls?state=closed&base=main&sort=updated&direction=desc`))
  .filter((p) => mergedInRelease(p.merged_at) && /^Fix prod Dependabot alerts/i.test(p.title));
for (const p of prs) reasons.push(`Merged [#${p.number}](${p.html_url}): ${p.title}`);

const issues = (await ghAll(`/repos/${repo}/issues?state=closed&labels=prod-dependency-alert`))
  .filter((i) => !i.pull_request && fixedByThisRelease(i.closed_at));
for (const i of issues) reasons.push(`Closed the production alert tracking issue [#${i.number}](${i.html_url}).`);

const fixedAlerts = [];
if (alertsToken) {
  const alerts = await ghAll(`/repos/${repo}/dependabot/alerts?state=fixed`, alertsToken);
  for (const a of alerts) {
    const maven = a.dependency?.package?.ecosystem === 'maven' && a.dependency.manifest_path?.startsWith('metrics-aggregator/');
    if (maven && a.dependency.scope !== 'development' && fixedByThisRelease(a.fixed_at)) fixedAlerts.push(a);
  }
  fixedAlerts.sort((a, b) => SEV[a.security_advisory.severity] - SEV[b.security_advisory.severity] || b.number - a.number);
  if (fixedAlerts.length) reasons.push(`Fixed ${fixedAlerts.length} microservice Dependabot alert(s) outside test scope.`);
}

if (!reasons.length) {
  finish({ tag, previousTag: prevTag, deploy: false, message: `No production fix between ${prevTag} and ${tag}, so no deployment ticket.` });
}

// 2. Ticket text (Markdown) ------------------------------------------------------------

const releaseUrl = release?.html_url || `https://github.com/${repo}/releases/tag/${tag}`;
const assets = (release?.assets || []).map((a) => `- [${a.name}](${a.browser_download_url})`);

const summary = `Deploy Usage Statistics ${tag} (security fix) on ${TARGET}`;
const description = [
  'Hi,',
  '',
  `please update the **Usage Statistics** web application and the **metrics-aggregator** microservice to **${tag}** on ${TARGET} where they are installed. This release fixes security issues in code that ships to production.`,
  '',
  `**Release:** [${tag}](${releaseUrl})`,
  '',
  ...(assets.length ? ['**Downloads:**', ...assets] : ['**Downloads:** attached to the release above.']),
  '',
  '**Why a deployment is needed:**',
  ...reasons.map((r) => `- ${r}`),
  ...(fixedAlerts.length ? ['', '**Fixed microservice alerts (worst first):**',
    ...fixedAlerts.slice(0, 10).map((a) => `- [#${a.number}](${a.html_url}) ${a.dependency.package.name} (${a.security_advisory.severity}): ${a.security_advisory.summary.trim()}`),
    ...(fixedAlerts.length > 10 ? [`- ... and ${fixedAlerts.length - 10} more`] : [])] : []),
  '',
  `**Changes since ${prevTag}:** [compare](https://github.com/${repo}/compare/${prevTag}...${tag})`,
  '',
  `_Created automatically for ${repo}._`,
].join('\n');

finish({ tag, previousTag: prevTag, deploy: true, publishedAt: release?.published_at || null, summary, description });
