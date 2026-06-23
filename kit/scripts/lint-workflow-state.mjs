#!/usr/bin/env node
// Runtime linter for the AWK State contract on live GitHub issues and PRs.
//
// validate-workflow.mjs proves the kit *templates and skills* carry the AWK State block, the
// next:* label vocabulary, and the loop-stop conditions. It cannot prove that a *live* issue or PR
// is honest. This linter closes that gap: it reads an actual item via the GitHub CLI and fails when
// the machine-readable routing state (block, next:* label, revision counter) is missing, stale, or
// self-contradictory.
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

const REQUIRED_FIELDS = [
  'Status', 'Issue Type', 'Next workflow verb', 'Owner', 'Merge Risk',
  'Blocked by', 'Linked PR', 'Accepted direction', 'Last agent review', 'Revision cycles',
];

const MERGE_RISKS = ['Parallel-safe', 'Needs coordination', 'Serial only', 'Unknown'];
const EMPTY_VALUES = new Set(['', 'tbd', 'todo', 'fixme', '...', '<fill>', '<value>']);
const REVISION_ESCALATION_THRESHOLD = 2;

const START = '<!-- awk-state:start -->';
const END = '<!-- awk-state:end -->';

// ---- Pure, offline-testable core ------------------------------------------------------------

export function parseAwkState(body) {
  const text = String(body ?? '');
  const start = text.indexOf(START);
  const end = text.indexOf(END);
  const startCount = text.split(START).length - 1;
  const endCount = text.split(END).length - 1;
  const blockErrors = [];

  if (startCount > 1 || endCount > 1) {
    blockErrors.push(`Expected exactly one AWK State block, found ${startCount} start marker(s) and ${endCount} end marker(s)`);
  }

  if (start === -1 || end === -1 || end < start) {
    return { found: false, fields: {}, blockErrors };
  }
  const inner = text.slice(start + START.length, end);
  const fields = {};
  for (const rawLine of inner.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('##') || line.startsWith('<!--')) continue;
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    fields[key] = value;
  }
  return { found: true, fields, blockErrors };
}

function isEmpty(value) {
  return value === undefined || EMPTY_VALUES.has(String(value).trim().toLowerCase());
}

// item: { kind: 'issue'|'pr', number, body, labels: string[] }
// returns { errors: string[], warnings: string[] }
export function lintItem(item) {
  const errors = [];
  const warnings = [];
  const labels = (item.labels ?? []).map((l) => (typeof l === 'string' ? l : l.name));
  const nextLabels = labels.filter((l) => l.startsWith('next:'));
  const { found, fields, blockErrors } = parseAwkState(item.body);

  errors.push(...blockErrors);

  if (!found) {
    errors.push('AWK State block not found (missing <!-- awk-state:start -->/<!-- awk-state:end --> markers)');
    return { errors, warnings };
  }

  for (const field of REQUIRED_FIELDS) {
    if (!(field in fields)) {
      errors.push(`AWK State is missing required field: ${field}`);
    } else if (isEmpty(fields[field])) {
      errors.push(`AWK State field is empty/placeholder: ${field}`);
    }
  }

  const verb = fields['Next workflow verb'];
  const verbValid = verb && nextWorkflowVerbs.includes(verb);
  if (verb && !verbValid) {
    errors.push(`Next workflow verb '${verb}' is not a known AWK verb`);
  }

  // Exactly one next:* label, and it must mirror Next workflow verb.
  if (nextLabels.length === 0) {
    errors.push('No next:* routing label present; expected exactly one mirroring Next workflow verb');
  } else if (nextLabels.length > 1) {
    errors.push(`Multiple next:* labels present (${nextLabels.join(', ')}); keep exactly one`);
  } else if (verbValid) {
    const expected = `next:${verb}`;
    if (nextLabels[0] !== expected) {
      errors.push(`Label ${nextLabels[0]} does not match Next workflow verb '${verb}' (expected ${expected})`);
    }
  }

  // Revision counter must be a non-negative integer.
  const rawCycles = fields['Revision cycles'];
  let cycles = null;
  if (rawCycles !== undefined && !isEmpty(rawCycles)) {
    if (!/^\d+$/.test(rawCycles)) {
      errors.push(`Revision cycles must be a non-negative integer, got '${rawCycles}'`);
    } else {
      cycles = Number(rawCycles);
    }
  }

  // Escalation guard: a PR stuck at >= threshold revisions must be routed to a human, not re-looped.
  if (cycles !== null && cycles >= REVISION_ESCALATION_THRESHOLD) {
    const stillLooping = labels.includes('revision-needed')
      || verb === 'work-issue-local'
      || verb === 'review-revision-triage';
    if (verb !== 'human-decision' && stillLooping) {
      errors.push(
        `Revision cycles=${cycles} (>=${REVISION_ESCALATION_THRESHOLD}) but item is still in the agent revision loop `
        + `(verb=${verb || 'unset'}); route to human-decision instead of another agent pass`,
      );
    }
    if (verb === 'human-decision' && !labels.includes('needs-human-review')) {
      warnings.push(`Revision cycles=${cycles} routed to human-decision but missing 'needs-human-review' label`);
    }
  }

  // Soft checks.
  const mergeRisk = fields['Merge Risk'];
  if (mergeRisk && !isEmpty(mergeRisk) && !MERGE_RISKS.includes(mergeRisk)) {
    warnings.push(`Merge Risk '${mergeRisk}' is not one of: ${MERGE_RISKS.join(', ')}`);
  }
  if (item.kind === 'pr') {
    const linked = fields['Linked PR'];
    if (linked && !isEmpty(linked) && !/this pr/i.test(linked) && !/#?\d+/.test(linked)) {
      warnings.push(`Linked PR '${linked}' on a PR should be 'This PR' or a PR number`);
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

function fetchItem(kind, number, repo) {
  const data = gh([kind, 'view', String(number), ...repoArgs(repo), '--json', 'number,body,labels']);
  return { kind, number: data.number, body: data.body ?? '', labels: data.labels ?? [] };
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

function reportItem(item) {
  const { errors, warnings } = lintItem(item);
  const tag = `${item.kind} #${item.number}`;
  for (const w of warnings) console.warn(`warning: ${tag}: ${w}`);
  for (const e of errors) console.error(`error: ${tag}: ${e}`);
  return errors.length;
}

const SELF_TEST_CASES = [
  {
    name: 'valid ready task',
    expectErrors: 0,
    item: {
      kind: 'issue', number: 1, labels: ['task', 'next:work-issue-local'],
      body: block({ 'Next workflow verb': 'work-issue-local', 'Revision cycles': '0' }),
    },
  },
  {
    name: 'missing block',
    expectErrors: 1,
    item: { kind: 'issue', number: 2, labels: ['next:groom-issue'], body: 'no state here' },
  },
  {
    name: 'empty field',
    expectErrors: 1,
    item: {
      kind: 'issue', number: 3, labels: ['next:groom-issue'],
      body: block({ 'Next workflow verb': 'groom-issue', 'Owner': '' }),
    },
  },
  {
    name: 'label/verb mismatch',
    expectErrors: 1,
    item: {
      kind: 'issue', number: 4, labels: ['next:groom-issue'],
      body: block({ 'Next workflow verb': 'work-issue-local' }),
    },
  },
  {
    name: 'multiple next labels',
    expectErrors: 1,
    item: {
      kind: 'issue', number: 5, labels: ['next:groom-issue', 'next:work-issue-local'],
      body: block({ 'Next workflow verb': 'groom-issue' }),
    },
  },
  {
    name: 'duplicate state blocks',
    expectErrors: 1,
    item: {
      kind: 'issue', number: 6, labels: ['task', 'next:work-issue-local'],
      body: `${block({ 'Next workflow verb': 'work-issue-local' })}\n\n${block({ 'Next workflow verb': 'review-revision-triage', 'Revision cycles': '2' })}`,
    },
  },
  {
    name: 'non-integer revision cycles',
    expectErrors: 1,
    item: {
      kind: 'pr', number: 7, labels: ['next:review-local-changes'],
      body: block({ 'Next workflow verb': 'review-local-changes', 'Revision cycles': 'two' }),
    },
  },
  {
    name: 'escalation not routed to human',
    expectErrors: 1,
    item: {
      kind: 'pr', number: 8, labels: ['next:work-issue-local', 'revision-needed'],
      body: block({ 'Next workflow verb': 'work-issue-local', 'Revision cycles': '2' }),
    },
  },
  {
    name: 'escalation routed to human',
    expectErrors: 0,
    item: {
      kind: 'pr', number: 9, labels: ['next:human-decision', 'needs-human-review'],
      body: block({ 'Next workflow verb': 'human-decision', 'Revision cycles': '3', 'Blocked by': 'human architecture decision' }),
    },
  },
];

function block(overrides = {}) {
  const base = {
    Status: 'Ready', 'Issue Type': 'Task', 'Next workflow verb': 'work-issue-local',
    Owner: 'Agent', 'Merge Risk': 'Parallel-safe', 'Blocked by': 'None', 'Linked PR': 'None',
    'Accepted direction': 'DIRECT_TASK', 'Last agent review': 'None', 'Revision cycles': '0',
  };
  const merged = { ...base, ...overrides };
  const lines = REQUIRED_FIELDS.map((k) => `${k}: ${merged[k]}`);
  return `${START}\n## AWK State\n${lines.join('\n')}\n${END}`;
}

function runSelfTest() {
  let failures = 0;
  for (const tc of SELF_TEST_CASES) {
    const { errors } = lintItem(tc.item);
    const pass = tc.expectErrors === 0 ? errors.length === 0 : errors.length >= tc.expectErrors;
    if (!pass) {
      failures += 1;
      console.error(`FAIL: ${tc.name} (expected ~${tc.expectErrors} errors, got ${errors.length}: ${errors.join('; ')})`);
    } else {
      console.log(`ok: ${tc.name}`);
    }
  }
  if (failures > 0) {
    console.error(`Self-test failed: ${failures} case(s).`);
    process.exit(1);
  }
  console.log('Self-test passed.');
}

function main() {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }

  if (opts.help) {
    console.log('Usage: node scripts/lint-workflow-state.mjs [--issue N | --pr N | --all-open] [--repo owner/name] [--strict]');
    console.log('       node scripts/lint-workflow-state.mjs --self-test');
    console.log('       node scripts/lint-workflow-state.mjs --body-file f --labels a,b --kind issue|pr');
    process.exit(0);
  }

  if (opts.selfTest) return runSelfTest();

  // Offline mode for testing without gh.
  if (opts.bodyFile) {
    const item = {
      kind: opts.kind ?? 'issue',
      number: 0,
      body: readFileSync(opts.bodyFile, 'utf8'),
      labels: opts.labels ? opts.labels.split(',').map((s) => s.trim()).filter(Boolean) : [],
    };
    process.exit(reportItem(item) > 0 ? 1 : 0);
  }

  if (!ghAvailable()) {
    const msg = 'GitHub CLI (gh) not available; skipping live AWK State lint.';
    if (opts.strict) {
      console.error(`error: ${msg} (--strict)`);
      process.exit(1);
    }
    console.warn(`warning: ${msg}`);
    process.exit(0);
  }

  let errorCount = 0;
  try {
    if (opts.issue) errorCount += reportItem(fetchItem('issue', opts.issue, opts.repo));
    if (opts.pr) errorCount += reportItem(fetchItem('pr', opts.pr, opts.repo));
    if (opts.allOpen) {
      for (const n of listOpenNumbers('issue', opts.repo)) errorCount += reportItem(fetchItem('issue', n, opts.repo));
      for (const n of listOpenNumbers('pr', opts.repo)) errorCount += reportItem(fetchItem('pr', n, opts.repo));
    }
    if (!opts.issue && !opts.pr && !opts.allOpen) {
      console.error('Nothing to lint. Pass --issue, --pr, --all-open, --self-test, or --body-file.');
      process.exit(1);
    }
  } catch (e) {
    console.error(`error: ${e.message}`);
    process.exit(1);
  }

  if (errorCount > 0) {
    console.error(`AWK State lint failed: ${errorCount} error(s).`);
    process.exit(1);
  }
  console.log('AWK State lint passed.');
}

main();
