#!/usr/bin/env node
import { mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const kitRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function parseArgs(argv) {
  return {
    keep: argv.includes('--keep'),
    skipArchonCli: argv.includes('--skip-archon-cli'),
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

function proveSkillsOnly(root) {
  const target = join(root, 'skills-only');
  initRepo(target);
  run(process.execPath, ['scripts/install-workflow-kit.mjs', '--target', target]);
  run(process.execPath, [join(target, 'scripts/validate-workflow.mjs'), '--cwd', target]);
}

function proveSkillsWithArchon(root, skipArchonCli) {
  const target = join(root, 'skills-with-archon');
  initRepo(target);
  run(process.execPath, ['scripts/install-workflow-kit.mjs', '--target', target, '--with-archon']);
  run(process.execPath, [join(target, 'scripts/validate-workflow.mjs'), '--cwd', target]);
  run(process.execPath, [join(target, 'scripts/validate-archon-pack.mjs'), '--cwd', target]);

  if (!skipArchonCli) {
    run('archon', ['validate', 'workflows', '--cwd', target, '--json']);
    run('archon', ['validate', 'commands', '--cwd', target, '--json']);
  }
}

const options = parseArgs(process.argv.slice(2));
const root = mkdtempSync(join(tmpdir(), 'awk-portable-install-'));

try {
  proveSkillsOnly(root);
  proveSkillsWithArchon(root, options.skipArchonCli);
  console.log('Portable install proof passed.');
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
