#!/usr/bin/env node
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const kitRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function parseArgs(argv) {
  return {
    keep: argv.includes('--keep'),
  };
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? kitRoot,
    encoding: 'utf8',
    stdio: 'pipe',
  });

  if (result.status !== 0) {
    const rendered = [command, ...args].join(' ');
    throw new Error(
      `Command failed: ${rendered}\n\nstdout:\n${result.stdout}\n\nstderr:\n${result.stderr}`
    );
  }

  return result;
}

function initRepo(path) {
  mkdirSync(path, { recursive: true });
  run('git', ['init', '--quiet', path]);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function proveGithubFirst(root) {
  const target = join(root, 'github-first');
  initRepo(target);
  writeFileSync(
    join(target, 'AGENTS.md'),
    '# Project Agents\n\nPreserve this project-owned guidance.\n'
  );
  writeFileSync(join(target, 'README.md'), '# Project README\n');
  writeFileSync(join(target, '.gitignore'), '# Project ignores\nnode_modules/\n');

  run(process.execPath, ['scripts/install-workflow-kit.mjs', '--target', target]);
  run(process.execPath, [join(target, 'scripts/validate-workflow.mjs'), '--cwd', target]);

  const agents = readFileSync(join(target, 'AGENTS.md'), 'utf8');
  const readme = readFileSync(join(target, 'README.md'), 'utf8');
  const gitignore = readFileSync(join(target, '.gitignore'), 'utf8');
  assert(
    agents.includes('Preserve this project-owned guidance.'),
    'Install did not preserve existing project AGENTS.md guidance.'
  );
  assert(
    agents.includes('<!-- BEGIN_AGENT_WORKFLOW_KIT -->') &&
      agents.includes('<!-- END_AGENT_WORKFLOW_KIT -->'),
    'Install did not merge the marked AWK block into AGENTS.md.'
  );
  assert(readme === '# Project README\n', 'Install overwrote the project-owned README.md.');
  assert(
    gitignore.includes('# Project ignores\nnode_modules/\n'),
    'Install did not preserve existing project .gitignore content.'
  );
  assert(
    gitignore.includes('.awk/cache/'),
    'Install did not add .awk/cache/ to .gitignore.'
  );
  assert(
    existsSync(join(target, '.agents/skills/awk/process/init-awk/SKILL.md')),
    'Install did not create namespaced AWK skills.'
  );
  assert(!existsSync(join(target, 'kit')), 'Install copied the source kit/ wrapper into the target.');
  assert(!existsSync(join(target, '.agents/skills/process')), 'Install created old root skill paths.');
  assert(
    existsSync(join(target, 'docs/awk/README.md')) &&
    existsSync(join(target, 'docs/awk/workflow/ai-dev-workflow.md')),
    'Install did not create namespaced AWK process docs.'
  );
  assert(
    !existsSync(join(target, 'docs/development/workflow')),
    'Install created old docs/development workflow docs.'
  );
  assert(
    existsSync(join(target, '.github/ISSUE_TEMPLATE/task.yml')) &&
      existsSync(join(target, 'scripts/setup-github-labels.mjs')) &&
      existsSync(join(target, 'scripts/validate-workflow.mjs')) &&
      existsSync(join(target, 'scripts/refresh-workflow-cache.mjs')),
    'Install did not copy target-root templates and scripts from kit/.'
  );
  for (const lazyPath of [
    'docs/development/adrs',
    'docs/development/discovery',
    'docs/development/specs',
    'docs/development/spikes',
    'docs/development/work-items',
  ]) {
    assert(
      !existsSync(join(target, lazyPath)),
      `Install created unused development artifact folder: ${lazyPath}.`
    );
  }
}

const options = parseArgs(process.argv.slice(2));
const root = mkdtempSync(join(tmpdir(), 'agent-workflow-kit-install-'));

try {
  proveGithubFirst(root);
  console.log('GitHub-first install proof passed.');
  if (options.keep) {
    console.log(`Fixture root kept: ${root}`);
  } else {
    rmSync(root, { recursive: true, force: true });
    console.log(`Fixture root cleaned: ${root}`);
  }
} catch (error) {
  console.error(error.message);
  console.error(`Fixture root kept for inspection: ${root}`);
  process.exit(1);
}
