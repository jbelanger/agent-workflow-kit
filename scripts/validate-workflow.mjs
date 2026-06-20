#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const requiredPortableFiles = [
  'AGENTS.md',
  '.agents/skills/README.md',
  '.agents/skills/process/README.md',
  '.agents/skills/specialist/README.md',
  '.agents/skills/domain/README.md',
  'docs/development/README.md',
  'docs/development/workflow/ai-dev-workflow.md',
  'docs/development/workflow/adr-archon-portable-skills.md',
  'docs/development/workflow/installing-agent-workflow-kit.md',
  'scripts/validate-workflow.mjs',
];

const requiredSkills = [
  '.agents/skills/process/triage-backlog/SKILL.md',
  '.agents/skills/process/pick-next-item/SKILL.md',
  '.agents/skills/process/groom-issue/SKILL.md',
  '.agents/skills/process/breakdown-issue/SKILL.md',
  '.agents/skills/process/prepare-implementation/SKILL.md',
  '.agents/skills/process/work-issue-local/SKILL.md',
  '.agents/skills/process/review-local-changes/SKILL.md',
  '.agents/skills/process/review-revision-triage/SKILL.md',
  '.agents/skills/process/improve-workflow/SKILL.md',
  '.agents/skills/specialist/diagnose-bug/SKILL.md',
  '.agents/skills/specialist/tdd/SKILL.md',
];

function parseArgs(argv) {
  let cwd = process.cwd();
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--cwd') {
      cwd = argv[i + 1];
      i += 1;
    } else if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/validate-workflow.mjs [--cwd <repo>]');
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return resolve(cwd);
}

function read(cwd, path) {
  return readFileSync(join(cwd, path), 'utf8');
}

function walkFiles(root) {
  if (!existsSync(root)) return [];
  const files = [];
  for (const name of readdirSync(root)) {
    const path = join(root, name);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      files.push(...walkFiles(path));
    } else if (stat.isFile()) {
      files.push(path);
    }
  }
  return files;
}

function validateSkill(cwd, path, errors) {
  const text = read(cwd, path);
  if (!text.startsWith('---\n')) {
    errors.push(`${path} must start with YAML frontmatter`);
    return;
  }

  const end = text.indexOf('\n---', 4);
  if (end === -1) {
    errors.push(`${path} must close YAML frontmatter`);
    return;
  }

  const frontmatter = text.slice(4, end);
  const name = frontmatter.match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const description = frontmatter.match(/^description:\s*(.+)$/m)?.[1]?.trim();
  const expectedName = path.split('/').at(-2);

  if (!name) errors.push(`${path} is missing frontmatter name`);
  if (!description) errors.push(`${path} is missing frontmatter description`);
  if (name && name !== expectedName) {
    errors.push(`${path} frontmatter name '${name}' must match folder '${expectedName}'`);
  }
}

function validate(cwd) {
  const errors = [];

  for (const path of requiredPortableFiles) {
    if (!existsSync(join(cwd, path))) errors.push(`Missing required portable file: ${path}`);
  }

  for (const path of requiredSkills) {
    if (!existsSync(join(cwd, path))) errors.push(`Missing required skill: ${path}`);
  }

  for (const file of walkFiles(join(cwd, '.agents/skills'))) {
    const relativePath = file.slice(cwd.length + 1);
    if (relativePath.endsWith('/SKILL.md')) {
      validateSkill(cwd, relativePath, errors);
    }
  }

  if (existsSync(join(cwd, '.archon'))) {
    for (const path of [
      '.archon/config.yaml',
      'docs/development/workflow/archon-recovery-runbook.md',
      'scripts/validate-archon-pack.mjs',
    ]) {
      if (!existsSync(join(cwd, path))) {
        errors.push(`Archon profile is installed but missing: ${path}`);
      }
    }
  }

  if (existsSync(join(cwd, '.archon/commands'))) {
    for (const file of walkFiles(join(cwd, '.archon/commands'))) {
      if (!file.endsWith('.md')) continue;
      const text = readFileSync(file, 'utf8');
      const relativePath = file.slice(cwd.length + 1);
      if (text.includes('docs/development/workflow/archon-route-tracker.md')) {
        errors.push(`${relativePath} must not depend on the kit repo Archon route tracker`);
      }
      if (text.includes('docs/development/workflow/archon-concept-spikes.md')) {
        errors.push(`${relativePath} must not depend on the kit repo Archon concept spike index`);
      }
    }
  }

  return errors;
}

try {
  const cwd = parseArgs(process.argv.slice(2));
  const errors = validate(cwd);

  if (errors.length > 0) {
    console.error('Agent Workflow Kit validation failed:');
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log('Agent Workflow Kit validation passed.');
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
