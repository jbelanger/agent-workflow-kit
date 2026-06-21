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
  'docs/development/workflow/github-first-flow.md',
  'docs/development/adrs/github-first-orchestration.md',
  'docs/development/workflow/installing-agent-workflow-kit.md',
  'scripts/setup-github-project.mjs',
  '.github/ISSUE_TEMPLATE/adr.yml',
  '.github/ISSUE_TEMPLATE/discovery.yml',
  '.github/ISSUE_TEMPLATE/initiative.yml',
  '.github/ISSUE_TEMPLATE/spec.yml',
  '.github/ISSUE_TEMPLATE/task.yml',
  '.github/PULL_REQUEST_TEMPLATE.md',
  'docs/development/discovery/.gitkeep',
  'docs/development/adrs/.gitkeep',
  'docs/development/specs/.gitkeep',
  'docs/development/spikes/.gitkeep',
  'scripts/validate-workflow.mjs',
];

const requiredSkills = [
  '.agents/skills/process/triage-backlog/SKILL.md',
  '.agents/skills/process/pick-next-item/SKILL.md',
  '.agents/skills/process/continue-work/SKILL.md',
  '.agents/skills/process/groom-issue/SKILL.md',
  '.agents/skills/process/discover-vision/SKILL.md',
  '.agents/skills/process/draft-artifact/SKILL.md',
  '.agents/skills/process/breakdown-issue/SKILL.md',
  '.agents/skills/process/prepare-implementation/SKILL.md',
  '.agents/skills/process/work-issue-local/SKILL.md',
  '.agents/skills/process/review-local-changes/SKILL.md',
  '.agents/skills/process/review-revision-triage/SKILL.md',
  '.agents/skills/process/improve-workflow/SKILL.md',
  '.agents/skills/specialist/product-strategy/SKILL.md',
  '.agents/skills/specialist/technical-architecture/SKILL.md',
  '.agents/skills/specialist/validation-strategy/SKILL.md',
  '.agents/skills/specialist/ux-direction/SKILL.md',
  '.agents/skills/specialist/creative-direction/SKILL.md',
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
      'docs/development/workflow/adr-archon-portable-skills.md',
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

  if (existsSync(join(cwd, '.agents/skills/process/groom-issue/SKILL.md'))) {
    const groomSkill = read(cwd, '.agents/skills/process/groom-issue/SKILL.md');
    for (const snippet of ['Interview And Research Mode', 'Grooming status', 'NEEDS_INTERVIEW', 'NEEDS_RESEARCH', 'discover-vision']) {
      if (!groomSkill.includes(snippet)) {
        errors.push(`groom-issue skill is missing interview/readiness snippet: ${snippet}`);
      }
    }
  }

  if (existsSync(join(cwd, '.agents/skills/process/discover-vision/SKILL.md'))) {
    const discoverSkill = read(cwd, '.agents/skills/process/discover-vision/SKILL.md');
    for (const snippet of ['product-strategy', 'technical-architecture', 'validation-strategy', 'ux-direction', 'creative-direction', 'READY_FOR_SPEC', 'DIRECT_TASK', 'real fork']) {
      if (!discoverSkill.includes(snippet)) {
        errors.push(`discover-vision skill is missing required snippet: ${snippet}`);
      }
    }
  }

  if (existsSync(join(cwd, '.agents/skills/process/continue-work/SKILL.md'))) {
    const continueSkill = read(cwd, '.agents/skills/process/continue-work/SKILL.md');
    for (const snippet of ['Next Actor', 'Decision Needed', 'GitHub Project', 'Next workflow verb', 'work-issue-local', 'linked PR', 'Local commits without a PR', 'PR without recorded agent review', 'human architecture', 'merge approval', 'Closes #issue', 'Refs #issue']) {
      if (!continueSkill.includes(snippet)) {
        errors.push(`continue-work skill is missing GitHub routing snippet: ${snippet}`);
      }
    }
  }

  if (existsSync(join(cwd, 'docs/development/workflow/github-first-flow.md'))) {
    const githubFlow = read(cwd, 'docs/development/workflow/github-first-flow.md');
    for (const snippet of ['Review Handoff Rule', 'Issue Linkage Rule', 'Status = Review', 'linked GitHub PR', 'commits without a PR', 'visible acceptance handoff', 'linked PRs without', 'draft/ready state', 'architecture ambiguity', 'merge approval', 'Closes #issue', 'Refs #issue']) {
      if (!githubFlow.includes(snippet)) {
        errors.push(`GitHub-first flow is missing review handoff snippet: ${snippet}`);
      }
    }
  }

  if (existsSync(join(cwd, 'scripts/setup-github-project.mjs'))) {
    const setupScript = read(cwd, 'scripts/setup-github-project.mjs');
    for (const snippet of ['Agent Workflow Kit v0', 'Decision Needed', 'Artifact State', '--verify-only', '--dry-run', 'gh auth refresh -s repo -s project']) {
      if (!setupScript.includes(snippet)) {
        errors.push(`setup-github-project script is missing required snippet: ${snippet}`);
      }
    }
  }

  if (existsSync(join(cwd, '.github/PULL_REQUEST_TEMPLATE.md'))) {
    const prTemplate = read(cwd, '.github/PULL_REQUEST_TEMPLATE.md');
    for (const snippet of ['Issue Linkage', 'Closes #', 'Refs #', 'Reason:']) {
      if (!prTemplate.includes(snippet)) {
        errors.push(`pull request template is missing issue-linkage snippet: ${snippet}`);
      }
    }
  }

  if (existsSync(join(cwd, '.agents/skills/process/draft-artifact/SKILL.md'))) {
    const draftSkill = read(cwd, '.agents/skills/process/draft-artifact/SKILL.md');
    for (const snippet of ['NEEDS_INTERVIEW', 'Human decision needed: YES', 'thin rules-only spec']) {
      if (!draftSkill.includes(snippet)) {
        errors.push(`draft-artifact skill is missing unresolved-grooming guard snippet: ${snippet}`);
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
