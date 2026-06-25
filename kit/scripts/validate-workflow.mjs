#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import {
  issueTypeLabels,
  nextWorkflowLabels,
  requiredLabels,
  reviewSignalLabels,
} from './workflow-labels.mjs';

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
  '.github/ISSUE_TEMPLATE/config.yml',
  '.github/ISSUE_TEMPLATE/discovery.yml',
  '.github/ISSUE_TEMPLATE/direct-task.yml',
  '.github/ISSUE_TEMPLATE/initiative.yml',
  '.github/ISSUE_TEMPLATE/spec.yml',
  '.github/ISSUE_TEMPLATE/task.yml',
  '.github/PULL_REQUEST_TEMPLATE.md',
  'scripts/workflow-labels.mjs',
  'scripts/setup-github-labels.mjs',
  'scripts/validate-workflow.mjs',
  'scripts/lint-workflow-state.mjs',
  'scripts/refresh-workflow-cache.mjs',
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
  '.agents/skills/awk/process/review-artifact/SKILL.md',
  '.agents/skills/awk/process/prepare-implementation/SKILL.md',
  '.agents/skills/awk/process/work-issue-local/SKILL.md',
  '.agents/skills/awk/process/review-local-changes/SKILL.md',
  '.agents/skills/awk/process/review-revision-triage/SKILL.md',
  '.agents/skills/awk/process/improve-workflow/SKILL.md',
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
  '.agents/skills/awk/specialist/product-strategy/SKILL.md',
  '.agents/skills/awk/specialist/technical-architecture/SKILL.md',
  '.agents/skills/awk/specialist/validation-strategy/SKILL.md',
  '.agents/skills/awk/specialist/ux-direction/SKILL.md',
  '.agents/skills/awk/specialist/creative-direction/SKILL.md',
  '.agents/skills/specialist/product-strategy/SKILL.md',
  '.agents/skills/specialist/technical-architecture/SKILL.md',
  '.agents/skills/specialist/validation-strategy/SKILL.md',
  '.agents/skills/specialist/ux-direction/SKILL.md',
  '.agents/skills/specialist/creative-direction/SKILL.md',
  '.agents/skills/specialist/diagnose-bug/SKILL.md',
  '.agents/skills/specialist/tdd/SKILL.md',
  'scripts/optional/setup-github-project.mjs',
  'docs/development/workflow/ai-dev-workflow.md',
  'docs/development/workflow/github-first-flow.md',
  'docs/development/workflow/installing-agent-workflow-kit.md',
  'docs/development/adrs/github-first-orchestration.md',
];

const sourceOnlyLegacyPayloadPaths = [
  '.github/ISSUE_TEMPLATE/adr.yml',
  '.github/ISSUE_TEMPLATE/config.yml',
  '.github/ISSUE_TEMPLATE/discovery.yml',
  '.github/ISSUE_TEMPLATE/direct-task.yml',
  '.github/ISSUE_TEMPLATE/initiative.yml',
  '.github/ISSUE_TEMPLATE/spec.yml',
  '.github/ISSUE_TEMPLATE/task.yml',
  '.github/PULL_REQUEST_TEMPLATE.md',
  'docs/awk/README.md',
  'docs/awk/adrs/github-first-orchestration.md',
  'docs/awk/workflow/ai-dev-workflow.md',
  'docs/awk/workflow/github-first-flow.md',
  'docs/awk/workflow/installing-agent-workflow-kit.md',
  'scripts/setup-github-labels.mjs',
  'scripts/validate-workflow.mjs',
  'scripts/workflow-labels.mjs',
  'scripts/lint-workflow-state.mjs',
  'scripts/refresh-workflow-cache.mjs',
];

const issueTemplateLabels = new Map([
  ['.github/ISSUE_TEMPLATE/adr.yml', 'adr'],
  ['.github/ISSUE_TEMPLATE/discovery.yml', 'discovery'],
  ['.github/ISSUE_TEMPLATE/direct-task.yml', 'task'],
  ['.github/ISSUE_TEMPLATE/initiative.yml', 'initiative'],
  ['.github/ISSUE_TEMPLATE/spec.yml', 'spec'],
  ['.github/ISSUE_TEMPLATE/task.yml', 'task'],
]);

const loopStopSnippets = [
  '## Loop Stop Conditions',
  'human decision needed',
  'no ready item exists',
  'PR is waiting for human merge',
  'validation cannot run',
  'architecture fork detected',
  'next workflow verb changes',
];

const flowAtGlanceSnippets = [
  'Flow At A Glance',
  'Intake -> Shape -> Execute -> Review -> Improve',
  'continue-work',
  'groom-issue',
  'breakdown-issue',
  'prepare-implementation',
  'work-issue-local',
  'review-local-changes',
  'review-revision-triage',
  'Do not skip from vague idea or Inbox directly to implementation',
  'Runtime worker loops are ephemeral',
];

const uxGateSnippets = [
  'UX direction is a readiness gate before implementation',
  'The human should review direction, not create it from a blank page',
  'sample assets or mockups',
  'docs/development/discovery/<slug>/mockups/',
  'rendered-preview validation',
  'target user, primary journey',
  'key screens or states',
  'information hierarchy',
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

function isSourcePackage(cwd) {
  return existsSync(join(cwd, 'kit/AGENTS.md'));
}

function sourcePath(cwd, path) {
  return isSourcePackage(cwd) ? join('kit', path) : path;
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

function hasIssueTemplateLabel(text, label) {
  const labelsLine = text.match(/^labels:\s*\[(.+)\]/m)?.[1] ?? '';
  return labelsLine.includes(`"${label}"`) || labelsLine.includes(`'${label}'`);
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
    if (isSourcePackage(cwd)) candidates.push(sourcePath(cwd, path));

    for (const candidate of candidates) {
      if (existsSync(join(cwd, candidate))) {
        errors.push(`Legacy AWK-owned path should be migrated or removed: ${candidate}`);
      }
    }
  }

  if (isSourcePackage(cwd)) {
    for (const path of sourceOnlyLegacyPayloadPaths) {
      if (existsSync(join(cwd, path))) {
        errors.push(`Install payload should live under kit/: ${path}`);
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

  const agentsPath = sourcePath(cwd, 'AGENTS.md');
  if (existsSync(join(cwd, agentsPath))) {
    const agents = read(cwd, agentsPath);
    for (const snippet of ['source package in sync', 'cherry-pick or PR', 'differs from the package']) {
      if (!agents.includes(snippet)) {
        errors.push(`${agentsPath} is missing source-package sync snippet: ${snippet}`);
      }
    }
  }

  for (const file of walkFiles(join(cwd, sourcePath(cwd, '.agents/skills/awk')))) {
    const relativePath = file.slice(cwd.length + 1);
    if (relativePath.endsWith('/SKILL.md')) {
      validateSkill(cwd, relativePath, errors);
    }
  }

  for (const path of requiredSkills.filter((skillPath) => skillPath.startsWith('.agents/skills/awk/process/'))) {
    const actualPath = sourcePath(cwd, path);
    if (existsSync(join(cwd, actualPath))) {
      const skill = read(cwd, actualPath);
      for (const snippet of loopStopSnippets) {
        if (!skill.includes(snippet)) {
          errors.push(`${actualPath} is missing loop-stop snippet: ${snippet}`);
        }
      }
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
    for (const snippet of ['Product:', 'Technical:', 'Validation:', 'UX:', 'Creative:', 'READY_FOR_SPEC', 'DIRECT_TASK', 'real fork']) {
      if (!discoverSkill.includes(snippet)) {
        errors.push(`discover-vision skill is missing required snippet: ${snippet}`);
      }
    }
  }

  const continueSkillPath = sourcePath(cwd, '.agents/skills/awk/process/continue-work/SKILL.md');
  if (existsSync(join(cwd, continueSkillPath))) {
    const continueSkill = read(cwd, continueSkillPath);
    for (const snippet of ['GitHub issues', 'workflow cache', 'next:*', 'Derived Workflow State', 'Revision cycles', 'work-issue-local', 'visible grooming result', 'direct-task rationale', 'linked PR', 'Local commits without a PR', 'ready for review', 'PR without recorded agent review', 'architecture-sensitive', 'human architecture', 'merge approval', 'Closes #issue', 'Refs #issue', 'Runtime worker loops', 'compact re-brief']) {
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
      'no separate brief is needed',
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

  const installDocPath = sourcePath(cwd, 'docs/awk/workflow/installing-agent-workflow-kit.md');
  if (existsSync(join(cwd, installDocPath))) {
    const installDoc = read(cwd, installDocPath);
    for (const snippet of [
      'Initial Issue Bootstrap',
      'one parent initiative issue',
      'child task, spec, ADR, discovery, or spike issues',
      '`next:*` label',
      'do not implement from the plan directly',
      'Create the parent issue first',
      'Accepted enough for artifact review or breakdown is not accepted enough for implementation',
    ]) {
      if (!installDoc.includes(snippet)) {
        errors.push(`installing-agent-workflow-kit doc is missing init-bootstrap snippet: ${snippet}`);
      }
    }
  }

  const githubFlowPath = sourcePath(cwd, 'docs/awk/workflow/github-first-flow.md');
  if (existsSync(join(cwd, githubFlowPath))) {
    const githubFlow = read(cwd, githubFlowPath);
    for (const snippet of ['Review Handoff Rule', 'Issue Linkage Rule', 'Status = Review', 'linked GitHub PR', 'commits without a PR', 'visible acceptance handoff', 'visible grooming result', 'Open PRs as ready for review', 'completed agent review pass', 'draft/ready state', 'architecture-sensitive PRs', 'architecture ambiguity', 'merge approval', 'Closes #issue', 'Refs #issue']) {
      if (!githubFlow.includes(snippet)) {
        errors.push(`GitHub-first flow is missing review handoff snippet: ${snippet}`);
      }
    }
  }

  const aiWorkflowPath = sourcePath(cwd, 'docs/awk/workflow/ai-dev-workflow.md');
  if (existsSync(join(cwd, aiWorkflowPath))) {
    const aiWorkflow = read(cwd, aiWorkflowPath);
    for (const snippet of uxGateSnippets) {
      if (!aiWorkflow.includes(snippet)) {
        errors.push(`AI dev workflow is missing UX readiness snippet: ${snippet}`);
      }
    }
    for (const snippet of ['Runtime Worker Loops', 'tool-neutral', 'self-contained and Ready', 'Use `prepare-implementation` only when']) {
      if (!aiWorkflow.includes(snippet)) {
        errors.push(`AI dev workflow is missing runtime-worker-loop snippet: ${snippet}`);
      }
    }
    for (const snippet of ['Create artifact folders only when writing the first artifact', 'Do not keep empty']) {
      if (!aiWorkflow.includes(snippet)) {
        errors.push(`AI dev workflow is missing lazy artifact folder snippet: ${snippet}`);
      }
    }
  }

  const prTemplatePath = sourcePath(cwd, '.github/PULL_REQUEST_TEMPLATE.md');
  if (existsSync(join(cwd, prTemplatePath))) {
    const prTemplate = read(cwd, prTemplatePath);
    for (const snippet of ['Workflow routing label', 'Issue Linkage', 'Closes #', 'Refs #', 'Reason:', 'Readiness', 'Revision cycles', 'Review route reason', 'exactly one next:* label', 'Loop Stop / Handoff']) {
      if (!prTemplate.includes(snippet)) {
        errors.push(`pull request template is missing issue-linkage snippet: ${snippet}`);
      }
    }
  }

  for (const [path, label] of issueTemplateLabels) {
    const actualPath = sourcePath(cwd, path);
    if (existsSync(join(cwd, actualPath)) && !hasIssueTemplateLabel(read(cwd, actualPath), label)) {
      errors.push(`${actualPath} must assign the workflow label '${label}'`);
    }
  }

  const workflowLabelsPath = sourcePath(cwd, 'scripts/workflow-labels.mjs');
  if (existsSync(join(cwd, workflowLabelsPath))) {
    const workflowLabels = read(cwd, workflowLabelsPath);
    for (const snippet of ['issueTypeLabels', 'reviewSignalLabels', 'nextWorkflowVerbs', 'nextWorkflowLabels', 'requiredLabels']) {
      if (!workflowLabels.includes(snippet)) {
        errors.push(`workflow label contract is missing export or definition: ${snippet}`);
      }
    }

    const expectedLabels = [
      ...issueTypeLabels,
      ...reviewSignalLabels,
      ...nextWorkflowLabels,
    ].map(([name]) => name);
    const requiredLabelNames = new Set(requiredLabels.map(([name]) => name));

    for (const snippet of expectedLabels) {
      if (!requiredLabelNames.has(snippet)) {
        errors.push(`required workflow labels export is missing label: ${snippet}`);
      }
    }
  }

  const taskTemplatePath = sourcePath(cwd, '.github/ISSUE_TEMPLATE/task.yml');
  if (existsSync(join(cwd, taskTemplatePath))) {
    const taskTemplate = read(cwd, taskTemplatePath);
    for (const snippet of ['Readiness evidence', 'Scope and boundaries', 'Architecture, contracts, and user surfaces', 'Feedback loop and validation', 'PR requirements']) {
      if (!taskTemplate.includes(snippet)) {
        errors.push(`task issue template is missing grooming snippet: ${snippet}`);
      }
    }
  }

  const directTaskTemplatePath = sourcePath(cwd, '.github/ISSUE_TEMPLATE/direct-task.yml');
  if (existsSync(join(cwd, directTaskTemplatePath))) {
    const directTaskTemplate = read(cwd, directTaskTemplatePath);
    for (const snippet of ['DIRECT_TASK rationale', 'next:work-issue-local', 'Fast-lane task', 'Merge risk']) {
      if (!directTaskTemplate.includes(snippet)) {
        errors.push(`direct task issue template is missing fast-lane snippet: ${snippet}`);
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
