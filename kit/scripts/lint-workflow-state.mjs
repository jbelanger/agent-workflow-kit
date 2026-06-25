#!/usr/bin/env node
// Runtime linter for the AWK routing-state contract on live GitHub issues and PRs.
//
// Bodies are for readable work context; labels route work; comments preserve handoff details; the
// workflow cache is rebuilt from GitHub when agents need a structured read model. Body metadata
// blocks, if present, are ignored.
//
// Usage:
//   node scripts/lint-workflow-state.mjs --issue 123 [--repo owner/name]
//   node scripts/lint-workflow-state.mjs --pr 45 [--repo owner/name]
//   node scripts/lint-workflow-state.mjs --all-open [--repo owner/name]
//   node scripts/lint-workflow-state.mjs --self-test
//   node scripts/lint-workflow-state.mjs --body-file body.md --labels next:groom-issue,task --kind issue
//
// Exit codes: 0 = clean (warnings allowed), 1 = lint errors found or bad invocation.
// If the GitHub CLI is unavailable, the run is skipped (exit 0) unless --strict is passed.

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { nextWorkflowVerbs } from './workflow-labels.mjs';

const NEXT_PREFIX = 'next:';
const KNOWN_NEXT_LABELS = new Set(nextWorkflowVerbs.map((verb) => `${NEXT_PREFIX}${verb}`));
const REVISION_ESCALATION_THRESHOLD = 2;

// ---- Pure, offline-testable core ------------------------------------------------------------

function labelsFor(item) {
  return (item.labels ?? []).map((label) => (typeof label === 'string' ? label : label.name)).filter(Boolean);
}

function textFor(item) {
  const comments = (item.comments ?? []).map((comment) => comment.body ?? '').join('\n\n');
  return [item.body ?? '', comments].join('\n\n');
}

function latestRevisionCycles(item) {
  const matches = [...textFor(item).matchAll(/\bRevision cycles:\s*(\d+)/gi)];
  if (matches.length === 0) return null;
  return Number(matches.at(-1)[1]);
}

// item: { kind: 'issue'|'pr', number, body, labels: string[], comments?: [] }
// returns { errors: string[], warnings: string[] }
export function lintItem(item) {
  const errors = [];
  const warnings = [];
  const labels = labelsFor(item);
  const nextLabels = labels.filter((label) => label.startsWith(NEXT_PREFIX));

  if (nextLabels.length === 0) {
    errors.push('No next:* routing label present; expected exactly one');
  } else if (nextLabels.length > 1) {
    errors.push(`Multiple next:* labels present (${nextLabels.join(', ')}); keep exactly one`);
  } else if (!KNOWN_NEXT_LABELS.has(nextLabels[0])) {
    errors.push(`Unknown next:* routing label: ${nextLabels[0]}`);
  }

  if (item.kind === 'pr') {
    const cycles = latestRevisionCycles(item);
    const nextVerb = nextLabels.length === 1 ? nextLabels[0].slice(NEXT_PREFIX.length) : null;
    if (
      cycles === REVISION_ESCALATION_THRESHOLD - 1
      && labels.includes('revision-needed')
      && nextVerb === 'work-issue-local'
    ) {
      errors.push(
        `Revision cycles=${cycles} and revision-needed would dispatch the second unresolved agent revision pass; `
        + 'route to next:human-decision instead of next:work-issue-local',
      );
    }
    if (
      cycles !== null
      && cycles >= REVISION_ESCALATION_THRESHOLD
      && labels.includes('revision-needed')
      && nextVerb !== 'human-decision'
    ) {
      errors.push(
        `Revision cycles=${cycles} (>=${REVISION_ESCALATION_THRESHOLD}) but PR is still in the agent loop; `
        + 'route to next:human-decision',
      );
    }
    if (nextVerb === 'human-decision' && !labels.includes('needs-human-review')) {
      warnings.push("next:human-decision is present without 'needs-human-review'");
    }
  }

  return { errors, warnings };
}

// ---- GitHub CLI layer -----------------------------------------------------------------------

function ghAvailable() {
  try {
    execFileSync('gh', ['--version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function gh(args) {
  const out = execFileSync('gh', args, { encoding: 'utf8' });
  return JSON.parse(out);
}

function repoArgs(repo) {
  return repo ? ['--repo', repo] : [];
}

function repoNameWithOwner(repo) {
  return repo ?? gh(['repo', 'view', '--json', 'nameWithOwner']).nameWithOwner;
}

function repoParts(repo) {
  const nameWithOwner = repoNameWithOwner(repo);
  const [owner, name] = nameWithOwner.split('/');
  if (!owner || !name) throw new Error(`Invalid repository name '${nameWithOwner}'; expected owner/name`);
  return { owner, name };
}

function fetchItem(kind, number, repo) {
  const data = gh([kind, 'view', String(number), ...repoArgs(repo), '--json', 'number,body,labels,comments']);
  return {
    kind,
    number: data.number,
    body: data.body ?? '',
    labels: data.labels ?? [],
    comments: data.comments ?? [],
  };
}

function listOpenNumbers(kind, repo) {
  const { owner, name } = repoParts(repo);
  const connection = kind === 'pr' ? 'pullRequests' : 'issues';
  const query = `
    query($owner: String!, $name: String!, $after: String) {
      repository(owner: $owner, name: $name) {
        ${connection}(states: OPEN, first: 100, after: $after) {
          nodes { number }
          pageInfo { hasNextPage endCursor }
        }
      }
    }
  `;
  const numbers = [];
  let cursor = null;

  while (true) {
    const args = [
      'api', 'graphql',
      '-f', `query=${query}`,
      '-F', `owner=${owner}`,
      '-F', `name=${name}`,
    ];
    if (cursor) args.push('-F', `after=${cursor}`);

    const data = gh(args);
    const page = data.repository?.[connection];
    if (!page) throw new Error(`Could not list open ${kind === 'pr' ? 'PRs' : 'issues'} for ${owner}/${name}`);

    numbers.push(...page.nodes.map((node) => node.number));
    if (!page.pageInfo.hasNextPage) return numbers;
    cursor = page.pageInfo.endCursor;
  }
}

// ---- CLI ------------------------------------------------------------------------------------

function parseArgs(argv) {
  const opts = { strict: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => argv[(i += 1)];
    if (arg === '--issue') opts.issue = Number(next());
    else if (arg === '--pr') opts.pr = Number(next());
    else if (arg === '--repo') opts.repo = next();
    else if (arg === '--all-open') opts.allOpen = true;
    else if (arg === '--self-test') opts.selfTest = true;
    else if (arg === '--strict') opts.strict = true;
    else if (arg === '--body-file') opts.bodyFile = next();
    else if (arg === '--labels') opts.labels = next();
    else if (arg === '--kind') opts.kind = next();
    else if (arg === '--help' || arg === '-h') opts.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return opts;
}

function usage() {
  console.log('Usage: node scripts/lint-workflow-state.mjs [--issue N | --pr N | --all-open] [--repo owner/name] [--strict]');
  console.log('       node scripts/lint-workflow-state.mjs --self-test');
  console.log('       node scripts/lint-workflow-state.mjs --body-file f --labels a,b --kind issue|pr');
}

function selfTest() {
  const cases = [
    {
      name: 'valid issue label only',
      item: { kind: 'issue', number: 1, labels: ['task', 'next:work-issue-local'], body: '' },
      errors: [],
    },
    {
      name: 'missing next label',
      item: { kind: 'issue', number: 2, labels: ['task'], body: '' },
      errors: ['No next:* routing label present; expected exactly one'],
    },
    {
      name: 'duplicate next labels',
      item: { kind: 'issue', number: 3, labels: ['next:groom-issue', 'next:work-issue-local'], body: '' },
      errors: ['Multiple next:* labels present (next:groom-issue, next:work-issue-local); keep exactly one'],
    },
    {
      name: 'revision cycle guard',
      item: {
        kind: 'pr',
        number: 5,
        labels: ['next:work-issue-local', 'revision-needed'],
        body: 'Revision cycles: 1',
      },
      errors: [
        'Revision cycles=1 and revision-needed would dispatch the second unresolved agent revision pass; route to next:human-decision instead of next:work-issue-local',
      ],
    },
  ];

  let failed = 0;
  for (const test of cases) {
    const actual = lintItem(test.item);
    const errors = JSON.stringify(actual.errors);
    const expectedErrors = JSON.stringify(test.errors ?? []);
    const warnings = JSON.stringify(actual.warnings);
    const expectedWarnings = JSON.stringify(test.warnings ?? []);
    if (errors !== expectedErrors || warnings !== expectedWarnings) {
      failed += 1;
      console.error(`Self-test failed: ${test.name}`);
      console.error(`  errors expected ${expectedErrors}, got ${errors}`);
      console.error(`  warnings expected ${expectedWarnings}, got ${warnings}`);
    }
  }
  if (failed > 0) {
    console.error(`Workflow-state lint self-test failed: ${failed} failure(s).`);
    process.exit(1);
  }
  console.log('Workflow-state lint self-test passed.');
}

function printResult(item, result) {
  for (const warning of result.warnings) {
    console.warn(`warning: ${item.kind} #${item.number}: ${warning}`);
  }
  for (const error of result.errors) {
    console.error(`error: ${item.kind} #${item.number}: ${error}`);
  }
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    usage();
    return;
  }
  if (opts.selfTest) return selfTest();

  if (opts.bodyFile) {
    const item = {
      kind: opts.kind ?? 'issue',
      number: 0,
      body: readFileSync(opts.bodyFile, 'utf8'),
      labels: opts.labels ? opts.labels.split(',').filter(Boolean) : [],
      comments: [],
    };
    const result = lintItem(item);
    printResult(item, result);
    process.exit(result.errors.length > 0 ? 1 : 0);
  }

  if (!ghAvailable()) {
    const msg = 'GitHub CLI (gh) not available; skipping live workflow-state lint.';
    if (opts.strict) throw new Error(msg);
    console.warn(msg);
    return;
  }

  const items = [];
  if (opts.issue) items.push(fetchItem('issue', opts.issue, opts.repo));
  if (opts.pr) items.push(fetchItem('pr', opts.pr, opts.repo));
  if (opts.allOpen) {
    for (const number of listOpenNumbers('issue', opts.repo)) items.push(fetchItem('issue', number, opts.repo));
    for (const number of listOpenNumbers('pr', opts.repo)) items.push(fetchItem('pr', number, opts.repo));
  }

  if (items.length === 0) {
    usage();
    process.exit(1);
  }

  let errorCount = 0;
  for (const item of items) {
    const result = lintItem(item);
    printResult(item, result);
    errorCount += result.errors.length;
  }

  if (errorCount > 0) {
    console.error(`Workflow-state lint failed: ${errorCount} error(s).`);
    process.exit(1);
  }
  console.log('Workflow-state lint passed.');
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
