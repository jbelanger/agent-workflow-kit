#!/usr/bin/env node
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const kitRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const portableEntries = [
  'AGENTS.md',
  '.github/ISSUE_TEMPLATE',
  '.github/PULL_REQUEST_TEMPLATE.md',
  '.agents/skills',
  'docs/development/README.md',
  'docs/development/adrs/github-first-orchestration.md',
  'docs/development/workflow/ai-dev-workflow.md',
  'docs/development/workflow/github-first-flow.md',
  'docs/development/workflow/installing-agent-workflow-kit.md',
  'scripts/setup-github-project.mjs',
  'docs/development/discovery/.gitkeep',
  'docs/development/specs/.gitkeep',
  'docs/development/adrs/.gitkeep',
  'docs/development/spikes/.gitkeep',
  'scripts/validate-workflow.mjs',
];

function usage() {
  return `Usage: node scripts/install-workflow-kit.mjs --target <repo> [--force] [--dry-run]

Installs the GitHub-first Agent Workflow Kit into another repository.

Installs:
  AGENTS.md, .github templates, .agents/skills/, workflow docs, and scripts/validate-workflow.mjs

Safety:
  existing identical files are left alone
  existing different files fail unless --force is passed`;
}

function parseArgs(argv) {
  const options = {
    target: undefined,
    force: false,
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--target') {
      options.target = argv[i + 1];
      i += 1;
    } else if (arg === '--force') {
      options.force = true;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--help' || arg === '-h') {
      console.log(usage());
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}\n\n${usage()}`);
    }
  }

  if (!options.target) {
    throw new Error(`Missing --target <repo>\n\n${usage()}`);
  }

  return {
    ...options,
    target: resolve(options.target),
  };
}

function collectFiles(entry) {
  const source = join(kitRoot, entry);
  if (!existsSync(source)) {
    throw new Error(`Install source is missing: ${entry}`);
  }

  const stat = statSync(source);
  if (stat.isFile()) return [entry];

  const files = [];
  for (const name of readdirSync(source)) {
    const child = join(entry, name);
    const childStat = statSync(join(kitRoot, child));
    if (childStat.isDirectory()) {
      files.push(...collectFiles(child));
    } else if (childStat.isFile()) {
      files.push(child);
    }
  }
  return files;
}

function copyFile(relativePath, options, result) {
  const source = join(kitRoot, relativePath);
  const target = join(options.target, relativePath);

  if (existsSync(target)) {
    const sourceText = readFileSync(source);
    const targetText = readFileSync(target);
    if (sourceText.equals(targetText)) {
      result.unchanged.push(relativePath);
      return;
    }
    if (!options.force) {
      result.conflicts.push(relativePath);
      return;
    }
    result.overwritten.push(relativePath);
  } else {
    result.created.push(relativePath);
  }

  if (!options.dryRun) {
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, readFileSync(source));
  }
}

function install(options) {
  if (!existsSync(options.target)) {
    throw new Error(`Target repository does not exist: ${options.target}`);
  }

  const files = [...new Set(portableEntries.flatMap(collectFiles))].sort();
  const result = {
    created: [],
    overwritten: [],
    unchanged: [],
    conflicts: [],
  };

  for (const file of files) {
    copyFile(file, options, result);
  }

  return result;
}

function printList(label, values) {
  if (values.length === 0) return;
  console.log(`${label}:`);
  for (const value of values) console.log(`  ${value}`);
}

try {
  const options = parseArgs(process.argv.slice(2));
  const result = install(options);

  if (result.conflicts.length > 0) {
    console.error('Agent Workflow Kit install found existing files with different content.');
    printList('Conflicts', result.conflicts);
    console.error('\nRe-run with --force only after reviewing the target repo changes manually.');
    process.exit(1);
  }

  console.log(`Installed Agent Workflow Kit into ${relative(process.cwd(), options.target) || '.'}`);
  console.log('Profile: GitHub-first workflow');
  if (options.dryRun) console.log('Dry run: no files were written.');
  printList('Created', result.created);
  printList('Overwritten', result.overwritten);
  if (result.unchanged.length > 0) {
    console.log(`Unchanged: ${result.unchanged.length} file(s) already matched.`);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
