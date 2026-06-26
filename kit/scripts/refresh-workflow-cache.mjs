#!/usr/bin/env node
// Rebuild a disposable local AWK workflow snapshot from GitHub.
//
// The cache is a read model for agents, not durable state. Delete it freely and rebuild it whenever
// GitHub state may have changed.
//
// Usage:
//   node scripts/refresh-workflow-cache.mjs [--repo owner/name] [--output .awk/cache/state.json]
//   node scripts/refresh-workflow-cache.mjs --help

import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { issueTypeLabels, nextWorkflowVerbs, reviewSignalLabels } from './workflow-labels.mjs';

const DEFAULT_OUTPUT = '.awk/cache/state.json';
const DEFAULT_LIMIT = 100;
const NEXT_LABEL_PREFIX = 'next:';
const REVISION_ESCALATION_THRESHOLD = 2;

const issueTypeNames = new Set(issueTypeLabels.map(([name]) => name));
const reviewSignalNames = new Set(reviewSignalLabels.map(([name]) => name));
const nextLabelNames = new Set(nextWorkflowVerbs.map((verb) => `${NEXT_LABEL_PREFIX}${verb}`));

function parseArgs(argv) {
  const opts = { output: DEFAULT_OUTPUT, limit: DEFAULT_LIMIT };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => argv[(i += 1)];
    if (arg === '--repo') opts.repo = next();
    else if (arg === '--output') opts.output = next();
    else if (arg === '--limit') opts.limit = Number(next());
    else if (arg === '--self-test') opts.selfTest = true;
    else if (arg === '--help' || arg === '-h') opts.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!Number.isInteger(opts.limit) || opts.limit < 1) {
    throw new Error('--limit must be a positive integer');
  }
  return opts;
}

function usage() {
  console.log(
    'Usage: node scripts/refresh-workflow-cache.mjs [--repo owner/name] '
      + '[--output .awk/cache/state.json] [--limit 100]\n'
      + '       node scripts/refresh-workflow-cache.mjs --self-test',
  );
}

function ghJson(args) {
  const out = execFileSync('gh', args, { encoding: 'utf8' });
  return JSON.parse(out);
}

function repoNameWithOwner(repo) {
  if (repo) return repo;
  return ghJson(['repo', 'view', '--json', 'nameWithOwner']).nameWithOwner;
}

function labelNames(item) {
  return (item.labels ?? []).map((label) => label.name ?? label).filter(Boolean).sort();
}

function commentText(item) {
  return (item.comments ?? []).map((comment) => comment.body ?? '').join('\n\n');
}

function allText(item) {
  return [item.body ?? '', commentText(item)].join('\n\n');
}

function uniqueNumbers(matches) {
  return [...new Set(matches.map(Number).filter((number) => (
    Number.isInteger(number) && number > 0
  )))].sort((a, b) => a - b);
}

function linkedIssueNumbers(item, closingIssuesReferences = []) {
  const fromText = [...allText(item).matchAll(/#(\d+)/g)].map((match) => match[1]);
  const closing = closingIssuesReferences.map((issue) => issue.number);
  return uniqueNumbers([...fromText, ...closing]);
}

function linkedPrNumbers(item) {
  const matches = [...allText(item).matchAll(/\b(?:PR|pull request)\s*#(\d+)/gi)].map(
    (match) => match[1],
  );
  return uniqueNumbers(matches);
}

function isDependencyAutomationPr(kind, item, labels) {
  if (kind !== 'pr') return false;
  const author = String(item.author?.login ?? '');
  const isDependencyBot = /dependabot|renovate/i.test(author);
  return isDependencyBot && labels.includes('dependencies');
}

function terminalPrState(kind, item) {
  const state = String(item.state ?? '');
  if (kind !== 'pr' || state === '' || state === 'OPEN') return null;
  return state.toLowerCase();
}

function revisionCycleValues(text) {
  const values = [];
  for (const line of String(text ?? '').split(/\r?\n/)) {
    const match = line.match(
      /^\s*(?:[-*]\s*)?(?:\*\*)?Revision cycles(?:\s*:\s*\*\*|\s*\*\*\s*:|\s*:)\s*(?:\*\*)?(\d+)\b/i,
    );
    if (match) values.push(Number(match[1]));
  }
  return values;
}

function revisionCycles(item) {
  const comments = [...(item.comments ?? [])].sort((a, b) => (
    String(a.createdAt ?? '').localeCompare(String(b.createdAt ?? ''))
  ));
  const values = [
    ...revisionCycleValues(item.body),
    ...comments.flatMap((comment) => revisionCycleValues(comment.body)),
  ];
  return values.length > 0 ? values.at(-1) : null;
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, got ${actual}`);
  }
}

function runSelfTest() {
  assertEqual(
    revisionCycles({
      comments: [
        { createdAt: '2026-01-01T00:00:00Z', body: 'Revision cycles: 0\nNext workflow verb: work-issue-local' },
        {
          createdAt: '2026-01-01T00:01:00Z',
          body: 'A fresh PR stays at `Revision cycles: 0`; record `Revision cycles: 1` after the pass.',
        },
        { createdAt: '2026-01-01T00:02:00Z', body: 'Revision routing:\n- Revision cycles: 1' },
      ],
    }),
    1,
    'latest state line wins over explanatory prose',
  );
  assertEqual(
    revisionCycles({ comments: [{ body: '- **Revision cycles:** 2' }] }),
    2,
    'bold markdown state line parses',
  );
  assertEqual(
    revisionCycles({ comments: [{ body: 'Inline example `Revision cycles: 2` should not parse.' }] }),
    null,
    'inline example is ignored',
  );
  const dependencyBotPr = summarize('pr', {
    number: 24,
    title: 'chore(deps-dev): bump vite',
    state: 'OPEN',
    author: { login: 'dependabot[bot]' },
    labels: [{ name: 'dependencies' }],
    body: 'Bumps vite. Upstream notes mention #12345.',
    comments: [],
  });
  assertEqual(
    dependencyBotPr.linkedIssueNumbers.length,
    0,
    'dependency bot upstream release-note issue links are ignored',
  );
  assertEqual(
    dependencyBotPr.warnings.length,
    0,
    'dependency bot PRs do not require next labels',
  );
  assertEqual(
    dependencyBotPr.automation,
    'dependency-update',
    'dependency bot PR automation is recorded',
  );
  const mergedPr = summarize('pr', {
    number: 27,
    title: 'merged implementation PR',
    state: 'MERGED',
    labels: [{ name: 'next:human-merge' }],
    comments: [],
  });
  assertEqual(
    mergedPr.warnings.length,
    0,
    'merged PR next labels do not produce stale-route warnings',
  );
  assertEqual(
    mergedPr.nextVerb,
    null,
    'merged PR next labels are ignored for effective routing',
  );
  assertEqual(
    mergedPr.ignoredNextLabels.join(','),
    'next:human-merge',
    'merged PR next labels are preserved as ignored labels',
  );
  assertEqual(mergedPr.terminalState, 'merged', 'merged PR terminal state is recorded');
  console.log('refresh-workflow-cache self-test passed.');
}

function excerpt(text, max = 320) {
  const compact = String(text ?? '').replace(/\s+/g, ' ').trim();
  if (compact.length <= max) return compact;
  return `${compact.slice(0, max - 1)}...`;
}

function recentWorkflowComments(item) {
  return (item.comments ?? [])
    .filter((comment) => (
      /workflow|state change|next:|revision cycles|blocked|accepted|review/i.test(
        comment.body ?? '',
      )
    ))
    .slice(-5)
    .map((comment) => ({
      author: comment.author?.login ?? null,
      createdAt: comment.createdAt ?? null,
      url: comment.url ?? null,
      excerpt: excerpt(comment.body),
    }));
}

function deriveWarnings(kind, labels, nextLabels, cycles, item) {
  const warnings = [];
  const terminalState = terminalPrState(kind, item);
  const requiresActiveRoute = (
    kind !== 'pr' || (item.state === 'OPEN' && !isDependencyAutomationPr(kind, item, labels))
  );
  if (requiresActiveRoute) {
    if (nextLabels.length === 0) {
      warnings.push('Missing next:* routing label');
    } else if (nextLabels.length > 1) {
      warnings.push(`Multiple next:* routing labels: ${nextLabels.join(', ')}`);
    } else if (!nextLabelNames.has(nextLabels[0])) {
      warnings.push(`Unknown next:* routing label: ${nextLabels[0]}`);
    }
  }

  if (kind === 'pr' && !terminalState) {
    const nextVerb = nextLabels[0]?.slice(NEXT_LABEL_PREFIX.length);
    if (
      cycles === REVISION_ESCALATION_THRESHOLD - 1
      && labels.includes('revision-needed')
      && nextVerb === 'work-issue-local'
    ) {
      warnings.push(
        'Revision cycles=1 with revision-needed would dispatch a second unresolved agent revision pass',
      );
    }
    if (
      cycles !== null
      && cycles >= REVISION_ESCALATION_THRESHOLD
      && labels.includes('revision-needed')
      && nextVerb !== 'human-decision'
    ) {
      warnings.push(`Revision cycles=${cycles} should route to next:human-decision`);
    }
  }

  return warnings;
}

function summarize(kind, item) {
  const labels = labelNames(item);
  const nextLabels = labels.filter((label) => label.startsWith(NEXT_LABEL_PREFIX));
  const terminalState = terminalPrState(kind, item);
  const effectiveNextLabels = terminalState ? [] : nextLabels;
  const cycles = kind === 'pr' ? revisionCycles(item) : null;
  const closingIssuesReferences = item.closingIssuesReferences ?? [];
  const dependencyAutomation = isDependencyAutomationPr(kind, item, labels);
  const closingIssueNumbers = closingIssuesReferences.map((issue) => issue.number);

  return {
    kind,
    number: item.number,
    title: item.title,
    state: item.state,
    url: item.url,
    updatedAt: item.updatedAt,
    author: item.author?.login ?? null,
    assignees: (item.assignees ?? []).map((assignee) => (
      assignee.login ?? assignee
    )).filter(Boolean),
    labels,
    typeLabels: labels.filter((label) => issueTypeNames.has(label)),
    reviewLabels: labels.filter((label) => reviewSignalNames.has(label)),
    nextLabels,
    ignoredNextLabels: terminalState ? nextLabels : [],
    nextVerb: effectiveNextLabels.length === 1 && effectiveNextLabels[0].startsWith(NEXT_LABEL_PREFIX)
      ? effectiveNextLabels[0].slice(NEXT_LABEL_PREFIX.length)
      : null,
    linkedIssueNumbers: dependencyAutomation
      ? uniqueNumbers(closingIssueNumbers)
      : linkedIssueNumbers(item, closingIssuesReferences),
    linkedPrNumbers: linkedPrNumbers(item),
    automation: dependencyAutomation ? 'dependency-update' : null,
    revisionCycles: cycles,
    terminalState,
    isDraft: item.isDraft ?? null,
    mergedAt: item.mergedAt ?? null,
    mergeStateStatus: item.mergeStateStatus ?? null,
    reviewDecision: item.reviewDecision ?? null,
    recentWorkflowComments: recentWorkflowComments(item),
    bodyExcerpt: excerpt(item.body),
    warnings: deriveWarnings(kind, labels, nextLabels, cycles, item),
  };
}

function fetchIssues(repo, limit) {
  return ghJson([
    'issue', 'list',
    '--repo', repo,
    '--state', 'open',
    '--limit', String(limit),
    '--json', 'number,title,state,labels,assignees,author,updatedAt,url,body,comments',
  ]);
}

function fetchPullRequests(repo, limit) {
  return ghJson([
    'pr', 'list',
    '--repo', repo,
    '--state', 'all',
    '--limit', String(limit),
    '--json', [
      'number,title,state,isDraft,labels,assignees,author,updatedAt,url,body,comments',
      'closingIssuesReferences,reviewDecision,mergeStateStatus,mergedAt',
    ].join(','),
  ]);
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    usage();
    return;
  }
  if (opts.selfTest) {
    runSelfTest();
    return;
  }

  const repo = repoNameWithOwner(opts.repo);
  const issues = fetchIssues(repo, opts.limit).map((issue) => summarize('issue', issue));
  const pullRequests = fetchPullRequests(repo, opts.limit).map((pr) => summarize('pr', pr));
  const output = resolve(opts.output);
  const cache = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    repo,
    source: 'GitHub via gh CLI',
    notes: [
      'Disposable AWK workflow read model.',
      'GitHub issues, PRs, labels, comments, repo docs, and native PR state remain authoritative.',
      'Delete and rebuild this file whenever it may be stale.',
    ],
    issues,
    pullRequests,
  };

  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, `${JSON.stringify(cache, null, 2)}\n`, 'utf8');

  const warnings = [...issues, ...pullRequests].flatMap((item) => (
    item.warnings.map((warning) => `${item.kind} #${item.number}: ${warning}`)
  ));

  console.log(`Wrote ${output}`);
  console.log(`Cached ${issues.length} open issue(s) and ${pullRequests.length} recent PR(s) for ${repo}.`);
  if (warnings.length > 0) {
    console.log('Warnings:');
    for (const warning of warnings) console.log(`- ${warning}`);
  }
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
