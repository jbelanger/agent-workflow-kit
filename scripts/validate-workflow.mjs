#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const requiredPortableFiles = [
  'AGENTS.md',
  '.agents/skills/awk/README.md',
  '.agents/skills/awk/process/README.md',
  '.agents/skills/awk/specialist/README.md',
  '.agents/skills/awk/domain/README.md',
  'docs/development/README.md',
  'docs/awk/README.md',
  'docs/awk/workflow/ai-dev-workflow.md',
  'docs/awk/workflow/github-first-flow.md',
  'docs/awk/adrs/github-first-orchestration.md',
  'docs/awk/workflow/installing-agent-workflow-kit.md',
  '.github/ISSUE_TEMPLATE/adr.yml',
  '.github/ISSUE_TEMPLATE/discovery.yml',
  '.github/ISSUE_TEMPLATE/initiative.yml',
  '.github/ISSUE_TEMPLATE/spec.yml',
  '.github/ISSUE_TEMPLATE/task.yml',
  '.github/PULL_REQUEST_TEMPLATE.md',
  'scripts/workflow-labels.mjs',
  'scripts/setup-github-labels.mjs',
  'scripts/validate-workflow.mjs',
];

const requiredSkills = [
  '.agents/skills/awk/process/init-awk/SKILL.md',
  '.agents/skills/awk/process/maintain-awk/SKILL.md',
  '.agents/skills/awk/process/triage-backlog/SKILL.md',
  '.agents/skills/awk/process/pick-next-item/SKILL.md',
  '.agents/skills/awk/process/continue-work/SKILL.md',
  '.agents/skills/awk/process/groom-issue/SKILL.md',
  '.agents/skills/awk/process/discover-vision/SKILL.md',
  '.agents/skills/awk/process/draft-artifact/SKILL.md',
  '.agents/skills/awk/process/breakdown-issue/SKILL.md',
  '.agents/skills/awk/process/prepare-implementation/SKILL.md',
  '.agents/skills/awk/process/work-issue-local/SKILL.md',
  '.agents/skills/awk/process/review-local-changes/SKILL.md',
  '.agents/skills/awk/process/review-revision-triage/SKILL.md',
  '.agents/skills/awk/process/improve-workflow/SKILL.md',
  '.agents/skills/awk/specialist/product-strategy/SKILL.md',
  '.agents/skills/awk/specialist/technical-architecture/SKILL.md',
  '.agents/skills/awk/specialist/validation-strategy/SKILL.md',
  '.agents/skills/awk/specialist/ux-direction/SKILL.md',
  '.agents/skills/awk/specialist/creative-direction/SKILL.md',
  '.agents/skills/awk/specialist/diagnose-bug/SKILL.md',
  '.agents/skills/awk/specialist/tdd/SKILL.md',
];

const legacyAwkOwnedPaths = [
  '.agents/skills/process/init-awk/SKILL.md',
  '.agents/skills/process/maintain-awk/SKILL.md',
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
  'docs/development/workflow/ai-dev-workflow.md',
  'docs/development/workflow/github-first-flow.md',
  'docs/development/workflow/installing-agent-workflow-kit.md',
  'docs/development/adrs/github-first-orchestration.md',
];

const issueTemplateLabels = new Map([
  ['.github/ISSUE_TEMPLATE/adr.yml', 'adr'],
  ['.github/ISSUE_TEMPLATE/discovery.yml', 'discovery'],
  ['.github/ISSUE_TEMPLATE/initiative.yml', 'initiative'],
  ['.github/ISSUE_TEMPLATE/spec.yml', 'spec'],
  ['.github/ISSUE_TEMPLATE/task.yml', 'task'],
]);

const flowAtGlanceSnippets = [
  'Flow At A Glance',
  'Inbox -> Grooming -> Discovery/Vision or Drafting -> Breakdown -> Ready -> In Progress -> Review -> Done',
  'continue-work',
  'groom-issue',
  'breakdown-issue',
  'prepare-implementation',
  'work-issue-local',
  'review-local-changes',
  'review-revision-triage',
  'Do not skip from vague idea or Inbox directly to implementation',
];

const uxGateSnippets = [
  'UX direction is a readiness gate before implementation',
  'The human should review direction, not create it from a blank page',
  'sample assets or mockups',
  'docs/development/discovery/<slug>/mockups/',
  'target user, primary journey, key screens or states, information hierarchy',
  'screen/state model',
  'accessibility/usability risks',
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

function sourcePath(cwd, path) {
  if (
    existsSync(join(cwd, 'kit/AGENTS.md')) &&
    (path === 'AGENTS.md' || path.startsWith('.agents/skills/awk/'))
  ) {
    return join('kit', path);
  }
  return path;
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
    const actualPath = sourcePath(cwd, path);
    if (!existsSync(join(cwd, actualPath))) errors.push(`Missing required portable file: ${actualPath}`);
  }

  for (const path of requiredSkills) {
    const actualPath = sourcePath(cwd, path);
    if (!existsSync(join(cwd, actualPath))) errors.push(`Missing required skill: ${actualPath}`);
  }

  for (const path of legacyAwkOwnedPaths) {
    const candidates = [path];
    if (existsSync(join(cwd, 'kit/AGENTS.md')) && path.startsWith('.agents/')) {
      candidates.push(join('kit', path));
    }

    for (const candidate of candidates) {
      if (existsSync(join(cwd, candidate))) {
        errors.push(`Legacy AWK-owned path should be migrated or removed: ${candidate}`);
      }
    }
  }

  for (const path of ['AGENTS.md', '.agents/skills/awk/README.md']) {
    const actualPath = sourcePath(cwd, path);
    if (existsSync(join(cwd, actualPath))) {
      const text = read(cwd, actualPath);
      for (const snippet of flowAtGlanceSnippets) {
        if (!text.includes(snippet)) {
          errors.push(`${actualPath} is missing flow-at-a-glance snippet: ${snippet}`);
        }
      }
    }
  }

  for (const file of walkFiles(join(cwd, sourcePath(cwd, '.agents/skills/awk')))) {
    const relativePath = file.slice(cwd.length + 1);
    if (relativePath.endsWith('/SKILL.md')) {
      validateSkill(cwd, relativePath, errors);
    }
  }

  const groomSkillPath = sourcePath(cwd, '.agents/skills/awk/process/groom-issue/SKILL.md');
  if (existsSync(join(cwd, groomSkillPath))) {
    const groomSkill = read(cwd, groomSkillPath);
    for (const snippet of ['Interview And Research Mode', 'Grooming status', 'NEEDS_INTERVIEW', 'NEEDS_RESEARCH', 'discover-vision']) {
      if (!groomSkill.includes(snippet)) {
        errors.push(`groom-issue skill is missing interview/readiness snippet: ${snippet}`);
      }
    }
  }

  const discoverSkillPath = sourcePath(cwd, '.agents/skills/awk/process/discover-vision/SKILL.md');
  if (existsSync(join(cwd, discoverSkillPath))) {
    const discoverSkill = read(cwd, discoverSkillPath);
    for (const snippet of ['product-strategy', 'technical-architecture', 'validation-strategy', 'ux-direction', 'creative-direction', 'READY_FOR_SPEC', 'DIRECT_TASK', 'real fork']) {
      if (!discoverSkill.includes(snippet)) {
        errors.push(`discover-vision skill is missing required snippet: ${snippet}`);
      }
    }
  }

  const continueSkillPath = sourcePath(cwd, '.agents/skills/awk/process/continue-work/SKILL.md');
  if (existsSync(join(cwd, continueSkillPath))) {
    const continueSkill = read(cwd, continueSkillPath);
    for (const snippet of ['GitHub issues', 'Next workflow verb', 'work-issue-local', 'visible grooming result', 'direct-task rationale', 'linked PR', 'Local commits without a PR', 'ready for review', 'PR without recorded agent review', 'human architecture', 'merge approval', 'Closes #issue', 'Refs #issue']) {
      if (!continueSkill.includes(snippet)) {
        errors.push(`continue-work skill is missing GitHub routing snippet: ${snippet}`);
      }
    }
  }

  const groomSkillVisiblePath = sourcePath(cwd, '.agents/skills/awk/process/groom-issue/SKILL.md');
  if (existsSync(join(cwd, groomSkillVisiblePath))) {
    const groomSkill = read(cwd, groomSkillVisiblePath);
    for (const snippet of ['Visible Grooming Record', 'Why direct implementation is safe', 'Human question asked']) {
      if (!groomSkill.includes(snippet)) {
        errors.push(`groom-issue skill is missing visible-grooming snippet: ${snippet}`);
      }
    }
  }

  const prepareSkillPath = sourcePath(cwd, '.agents/skills/awk/process/prepare-implementation/SKILL.md');
  if (existsSync(join(cwd, prepareSkillPath))) {
    const prepareSkill = read(cwd, prepareSkillPath);
    for (const snippet of [
      'Visible grooming result',
      'Clarifying questions / challenges',
      'UX direction / user surface',
      'screen/state model',
      'accessibility/usability',
    ]) {
      if (!prepareSkill.includes(snippet)) {
        errors.push(`prepare-implementation skill is missing readiness snippet: ${snippet}`);
      }
    }
  }

  const workIssueSkillPath = sourcePath(cwd, '.agents/skills/awk/process/work-issue-local/SKILL.md');
  if (existsSync(join(cwd, workIssueSkillPath))) {
    const workIssueSkill = read(cwd, workIssueSkillPath);
    for (const snippet of [
      'Readiness Gate',
      'visible grooming result',
      'well-written issue body',
      'accepted UX direction',
      'screen/state model',
    ]) {
      if (!workIssueSkill.includes(snippet)) {
        errors.push(`work-issue-local skill is missing readiness-gate snippet: ${snippet}`);
      }
    }
  }

  const initSkillPath = sourcePath(cwd, '.agents/skills/awk/process/init-awk/SKILL.md');
  if (existsSync(join(cwd, initSkillPath))) {
    const initSkill = read(cwd, initSkillPath);
    for (const snippet of [
      'Initial Issue Bootstrap',
      'Create one parent initiative issue',
      'Create child task, spec, ADR, discovery, or spike issues',
      'Next workflow verb',
      'Do not create coding branches',
      'Detailed Plan Import Rule',
      'Create the parent issue first',
      'Accepted enough for artifact review or breakdown is not accepted enough for implementation',
    ]) {
      if (!initSkill.includes(snippet)) {
        errors.push(`init-awk skill is missing issue-bootstrap snippet: ${snippet}`);
      }
    }
  }

  if (existsSync(join(cwd, 'docs/awk/workflow/installing-agent-workflow-kit.md'))) {
    const installDoc = read(cwd, 'docs/awk/workflow/installing-agent-workflow-kit.md');
    for (const snippet of [
      'Initial Issue Bootstrap',
      'one parent initiative issue',
      'child task, spec, ADR, discovery, or spike issues',
      'Next workflow verb',
      'do not implement from the plan directly',
      'Create the parent issue first',
      'Accepted enough for artifact review or breakdown is not accepted enough for implementation',
    ]) {
      if (!installDoc.includes(snippet)) {
        errors.push(`installing-agent-workflow-kit doc is missing init-bootstrap snippet: ${snippet}`);
      }
    }
  }

  if (existsSync(join(cwd, 'docs/awk/workflow/github-first-flow.md'))) {
    const githubFlow = read(cwd, 'docs/awk/workflow/github-first-flow.md');
    for (const snippet of ['Review Handoff Rule', 'Issue Linkage Rule', 'Status = Review', 'linked GitHub PR', 'commits without a PR', 'visible acceptance handoff', 'visible grooming result', 'Open PRs as ready for review', 'completed agent review pass', 'draft/ready state', 'architecture ambiguity', 'merge approval', 'Closes #issue', 'Refs #issue']) {
      if (!githubFlow.includes(snippet)) {
        errors.push(`GitHub-first flow is missing review handoff snippet: ${snippet}`);
      }
    }
  }

  if (existsSync(join(cwd, 'docs/awk/workflow/ai-dev-workflow.md'))) {
    const aiWorkflow = read(cwd, 'docs/awk/workflow/ai-dev-workflow.md');
    for (const snippet of uxGateSnippets) {
      if (!aiWorkflow.includes(snippet)) {
        errors.push(`AI dev workflow is missing UX readiness snippet: ${snippet}`);
      }
    }
    for (const snippet of ['Create artifact folders only when writing the first artifact', 'Do not keep empty']) {
      if (!aiWorkflow.includes(snippet)) {
        errors.push(`AI dev workflow is missing lazy artifact folder snippet: ${snippet}`);
      }
    }
  }

  if (existsSync(join(cwd, '.github/PULL_REQUEST_TEMPLATE.md'))) {
    const prTemplate = read(cwd, '.github/PULL_REQUEST_TEMPLATE.md');
    for (const snippet of ['Issue Linkage', 'Closes #', 'Refs #', 'Reason:', 'Grooming / Readiness']) {
      if (!prTemplate.includes(snippet)) {
        errors.push(`pull request template is missing issue-linkage snippet: ${snippet}`);
      }
    }
  }

  for (const [path, label] of issueTemplateLabels) {
    if (existsSync(join(cwd, path)) && !read(cwd, path).includes(`labels: ["${label}"]`)) {
      errors.push(`${path} must assign the workflow label '${label}'`);
    }
  }

  if (existsSync(join(cwd, 'scripts/workflow-labels.mjs'))) {
    const workflowLabels = read(cwd, 'scripts/workflow-labels.mjs');
    for (const snippet of ['initiative', 'discovery', 'spec', 'adr', 'task', 'revision-needed', 'needs-human-review']) {
      if (!workflowLabels.includes(`'${snippet}'`)) {
        errors.push(`workflow label contract is missing label: ${snippet}`);
      }
    }
  }

  if (existsSync(join(cwd, '.github/ISSUE_TEMPLATE/task.yml'))) {
    const taskTemplate = read(cwd, '.github/ISSUE_TEMPLATE/task.yml');
    for (const snippet of ['Grooming result', 'human questions asked/answered']) {
      if (!taskTemplate.includes(snippet)) {
        errors.push(`task issue template is missing grooming snippet: ${snippet}`);
      }
    }
  }

  const draftSkillPath = sourcePath(cwd, '.agents/skills/awk/process/draft-artifact/SKILL.md');
  if (existsSync(join(cwd, draftSkillPath))) {
    const draftSkill = read(cwd, draftSkillPath);
    for (const snippet of ['NEEDS_INTERVIEW', 'Human decision needed: YES', 'thin rules-only spec', 'generate a UX spec', 'docs/development/specs/<slug>-assets/']) {
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
