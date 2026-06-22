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
  ['kit/AGENTS.md', 'AGENTS.md'],
  ['.github/ISSUE_TEMPLATE', '.github/ISSUE_TEMPLATE'],
  ['.github/PULL_REQUEST_TEMPLATE.md', '.github/PULL_REQUEST_TEMPLATE.md'],
  ['kit/.agents/skills/awk', '.agents/skills/awk'],
  ['docs/development/README.md', 'docs/development/README.md'],
  ['docs/awk/README.md', 'docs/awk/README.md'],
  ['docs/awk/adrs/github-first-orchestration.md', 'docs/awk/adrs/github-first-orchestration.md'],
  ['docs/awk/workflow/ai-dev-workflow.md', 'docs/awk/workflow/ai-dev-workflow.md'],
  ['docs/awk/workflow/github-first-flow.md', 'docs/awk/workflow/github-first-flow.md'],
  ['docs/awk/workflow/installing-agent-workflow-kit.md', 'docs/awk/workflow/installing-agent-workflow-kit.md'],
  ['scripts/workflow-labels.mjs', 'scripts/workflow-labels.mjs'],
  ['scripts/setup-github-labels.mjs', 'scripts/setup-github-labels.mjs'],
  ['scripts/validate-workflow.mjs', 'scripts/validate-workflow.mjs'],
];

const awkBlockStart = '<!-- BEGIN_AGENT_WORKFLOW_KIT -->';
const awkBlockEnd = '<!-- END_AGENT_WORKFLOW_KIT -->';

function usage() {
  return `Usage: node scripts/install-workflow-kit.mjs --target <repo> [--force] [--dry-run]

Installs the GitHub-first Agent Workflow Kit into another repository.

Installs:
  a minimal AWK block in AGENTS.md, .github templates, .agents/skills/awk/, docs/awk/,
  docs/development/README.md, and lightweight setup/validation scripts

Safety:
  AGENTS.md is merged by replacing or appending the marked AWK block
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

function collectFiles(sourceEntry, targetEntry = sourceEntry) {
  const source = join(kitRoot, sourceEntry);
  if (!existsSync(source)) {
    throw new Error(`Install source is missing: ${sourceEntry}`);
  }

  const stat = statSync(source);
  if (stat.isFile()) return [{ source: sourceEntry, target: targetEntry }];

  const files = [];
  for (const name of readdirSync(source)) {
    const childSource = join(sourceEntry, name);
    const childTarget = join(targetEntry, name);
    const childStat = statSync(join(kitRoot, childSource));
    if (childStat.isDirectory()) {
      files.push(...collectFiles(childSource, childTarget));
    } else if (childStat.isFile()) {
      files.push({ source: childSource, target: childTarget });
    }
  }
  return files;
}

function mergeAgentsText(currentText, blockText) {
  const blockStart = blockText.indexOf(awkBlockStart);
  const blockEnd = blockText.indexOf(awkBlockEnd);
  if (blockStart === -1 || blockEnd === -1 || blockEnd < blockStart) {
    throw new Error('Install source kit/AGENTS.md is missing the marked AWK block.');
  }

  const block = blockText.slice(blockStart, blockEnd + awkBlockEnd.length);
  const currentStart = currentText.indexOf(awkBlockStart);
  const currentEnd = currentText.indexOf(awkBlockEnd);

  if (currentStart !== -1 && currentEnd !== -1 && currentEnd > currentStart) {
    return `${currentText.slice(0, currentStart)}${block}${currentText.slice(
      currentEnd + awkBlockEnd.length
    )}`;
  }

  const trimmed = currentText.trimEnd();
  return `${trimmed}\n\n${block}\n`;
}

function copyFile(file, options, result) {
  const source = join(kitRoot, file.source);
  const target = join(options.target, file.target);

  if (file.target === 'AGENTS.md' && existsSync(target)) {
    const sourceText = readFileSync(source, 'utf8');
    const targetText = readFileSync(target, 'utf8');
    const mergedText = mergeAgentsText(targetText, sourceText);
    if (mergedText === targetText) {
      result.unchanged.push(file.target);
      return;
    }

    result.merged.push(file.target);
    if (!options.dryRun) {
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, mergedText);
    }
    return;
  }

  if (existsSync(target)) {
    const sourceText = readFileSync(source);
    const targetText = readFileSync(target);
    if (sourceText.equals(targetText)) {
      result.unchanged.push(file.target);
      return;
    }
    if (!options.force) {
      result.conflicts.push(file.target);
      return;
    }
    result.overwritten.push(file.target);
  } else {
    result.created.push(file.target);
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

  const filesByTarget = new Map();
  for (const [source, target] of portableEntries) {
    for (const file of collectFiles(source, target)) {
      filesByTarget.set(file.target, file);
    }
  }
  const files = [...filesByTarget.values()].sort((a, b) => a.target.localeCompare(b.target));
  const result = {
    created: [],
    merged: [],
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
  printList('Merged', result.merged);
  printList('Overwritten', result.overwritten);
  if (result.unchanged.length > 0) {
    console.log(`Unchanged: ${result.unchanged.length} file(s) already matched.`);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
