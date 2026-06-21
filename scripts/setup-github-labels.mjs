#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { requiredLabels } from './workflow-labels.mjs';

function usage() {
  return `Usage: node scripts/setup-github-labels.mjs [--repo <owner/name>] [--dry-run] [--verify-only]

Creates the lightweight GitHub labels used by the Agent Workflow Kit issue templates.
This does not create a GitHub Project board.

Options:
  --repo <owner/name>  Repository to configure. Defaults to the current gh repo.
  --dry-run           Print the labels that would be ensured without calling GitHub.
  --verify-only       Fail if labels are missing or differ; do not create labels.
  --help, -h          Show this help.

Auth:
  gh must be authenticated with repo scope.`;
}

function runGh(args, { parseJson = true } = {}) {
  const result = spawnSync('gh', args, { encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`gh ${args.join(' ')} failed:\n${result.stderr || result.stdout}`);
  }

  if (!parseJson) return result.stdout.trim();
  return JSON.parse(result.stdout || 'null');
}

function parseArgs(argv) {
  const options = {
    repo: undefined,
    dryRun: false,
    verifyOnly: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--repo') {
      options.repo = argv[i + 1];
      i += 1;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--verify-only') {
      options.verifyOnly = true;
    } else if (arg === '--help' || arg === '-h') {
      console.log(usage());
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}\n\n${usage()}`);
    }
  }

  return options;
}

function inferRepo() {
  return runGh(['repo', 'view', '--json', 'nameWithOwner']).nameWithOwner;
}

function printLabelContract() {
  console.log('Workflow labels:');
  for (const [name, color, description] of requiredLabels) {
    console.log(`- ${name} (#${color}): ${description}`);
  }
}

function getLabels(repo) {
  return runGh(['label', 'list', '--repo', repo, '--json', 'name,color,description', '--limit', '200']);
}

function ensureLabels(options) {
  const repo = options.repo ?? inferRepo();
  const existingLabels = getLabels(repo);
  const byName = new Map(existingLabels.map((label) => [label.name.toLowerCase(), label]));
  const actions = {
    created: [],
    unchanged: [],
    missing: [],
    mismatched: [],
  };

  for (const [name, color, description] of requiredLabels) {
    const existing = byName.get(name.toLowerCase());
    if (!existing) {
      if (options.verifyOnly) {
        actions.missing.push(name);
      } else {
        runGh(['label', 'create', name, '--repo', repo, '--color', color, '--description', description], { parseJson: false });
        actions.created.push(name);
      }
      continue;
    }

    if (existing.color?.toLowerCase() !== color.toLowerCase() || (existing.description ?? '') !== description) {
      actions.mismatched.push(name);
    } else {
      actions.unchanged.push(name);
    }
  }

  return { repo, actions };
}

function printSummary(repo, actions) {
  console.log(`Workflow label setup for ${repo}`);
  for (const [title, values] of [
    ['Created', actions.created],
    ['Unchanged', actions.unchanged],
    ['Missing', actions.missing],
    ['Different', actions.mismatched],
  ]) {
    if (values.length > 0) console.log(`${title}: ${values.join(', ')}`);
  }
  if (actions.created.length + actions.unchanged.length + actions.missing.length + actions.mismatched.length === 0) {
    console.log('No labels checked.');
  }
}

try {
  const options = parseArgs(process.argv.slice(2));
  if (options.dryRun) {
    printLabelContract();
    process.exit(0);
  }

  const { repo, actions } = ensureLabels(options);
  printSummary(repo, actions);

  if (options.verifyOnly && (actions.missing.length > 0 || actions.mismatched.length > 0)) {
    process.exit(1);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
