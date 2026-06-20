#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

function parseArgs(argv) {
  let cwd = process.cwd();
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--cwd') {
      cwd = argv[i + 1];
      i += 1;
    } else if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/validate-archon-pack.mjs [--cwd <repo>]');
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return resolve(cwd);
}

const cwd = parseArgs(process.argv.slice(2));

const requiredFiles = [
  '.archon/config.yaml',
  '.archon/workflows/awk-continue-work.yaml',
  '.archon/workflows/awk-groom-issue.yaml',
  '.archon/workflows/awk-discover-vision.yaml',
  '.archon/workflows/awk-draft-spec.yaml',
  '.archon/workflows/awk-breakdown-work-item.yaml',
  '.archon/workflows/awk-prepare-implementation.yaml',
  '.archon/workflows/awk-work-issue-local.yaml',
  '.archon/workflows/awk-review-local-changes.yaml',
  '.archon/workflows/awk-validate-process-pack.yaml',
  '.archon/commands/awk-continue-work.md',
  '.archon/commands/awk-groom-issue.md',
  '.archon/commands/awk-discover-vision.md',
  '.archon/commands/awk-draft-spec.md',
  '.archon/commands/awk-breakdown-work-item.md',
  '.archon/commands/awk-prepare-implementation.md',
  '.archon/commands/awk-implementation-preflight.md',
  '.archon/commands/awk-work-issue-local.md',
  '.archon/commands/awk-review-local-changes.md',
  'docs/development/workflow/ai-dev-workflow.md',
  'docs/development/workflow/adr-archon-portable-skills.md',
  'docs/development/workflow/archon-recovery-runbook.md',
  'scripts/validate-workflow.mjs',
  '.gitignore',
];

const errors = [];

function read(path) {
  return readFileSync(join(cwd, path), 'utf8');
}

for (const path of requiredFiles) {
  if (!existsSync(join(cwd, path))) errors.push(`Missing required file: ${path}`);
}

if (existsSync(join(cwd, '.archon/config.yaml'))) {
  const config = read('.archon/config.yaml');
  if (!config.includes('loadDefaultCommands: false')) {
    errors.push('.archon/config.yaml must disable bundled default commands for this spike');
  }
  if (!config.includes('loadDefaultWorkflows: false')) {
    errors.push('.archon/config.yaml must disable bundled default workflows for this spike');
  }
  if (!config.includes('assistant: codex')) {
    errors.push('.archon/config.yaml must keep Codex as the default assistant for this kit');
  }
  if (!config.includes('codexBinaryPath: /Applications/Codex.app/Contents/Resources/codex')) {
    errors.push('.archon/config.yaml must pin the Codex binary path for compiled Archon validation');
  }
  if (!config.includes('baseBranch: main')) {
    errors.push('.archon/config.yaml must set worktree.baseBranch: main for local repos without origin/HEAD');
  }
  if (!config.includes('awk-continue-work')) {
    errors.push('.archon/config.yaml should recommend awk-continue-work as the dashboard entry point');
  }
  if (!config.includes('awk-groom-issue')) {
    errors.push('.archon/config.yaml should recommend awk-groom-issue as the first planning fallback');
  }
  if (!config.includes('awk-discover-vision')) {
    errors.push('.archon/config.yaml should recommend awk-discover-vision for early product discovery');
  }
  if (!config.includes('awk-draft-spec')) {
    errors.push('.archon/config.yaml should recommend awk-draft-spec for spec drafting');
  }
  if (!config.includes('awk-breakdown-work-item')) {
    errors.push('.archon/config.yaml should recommend awk-breakdown-work-item for accepted direction');
  }
}

if (existsSync(join(cwd, '.archon/workflows'))) {
  for (const file of readdirSync(join(cwd, '.archon/workflows')).filter(name => name.endsWith('.yaml'))) {
    const path = join('.archon/workflows', file);
    const text = read(path);
    if (!/^name:/m.test(text)) errors.push(`${path} is missing a workflow name`);
    if (!/^nodes:/m.test(text)) errors.push(`${path} is missing DAG nodes`);
  }
}

for (const path of requiredFiles.filter(path => path.startsWith('.archon/commands/'))) {
  if (!existsSync(join(cwd, path))) continue;
  const text = read(path);
  if (!text.startsWith('---\n')) errors.push(`${path} must start with frontmatter`);
  if (!text.includes('$ARTIFACTS_DIR/')) {
    errors.push(`${path} must write or name an artifact path under $ARTIFACTS_DIR`);
  }
  if (!text.includes('## Adapter Boundary')) {
    errors.push(`${path} must name its Adapter Boundary so it does not become a parallel skill`);
  }
}

if (existsSync(join(cwd, '.gitignore'))) {
  const gitignore = read('.gitignore');
  for (const snippet of ['.archon/artifacts/', '.archon/logs/']) {
    if (!gitignore.includes(snippet)) {
      errors.push(`.gitignore must ignore Archon runtime path: ${snippet}`);
    }
  }
}

const commandSkillRefs = new Map([
  ['.archon/commands/awk-continue-work.md', '.agents/skills/process/pick-next-item/SKILL.md'],
  ['.archon/commands/awk-groom-issue.md', '.agents/skills/process/groom-issue/SKILL.md'],
  ['.archon/commands/awk-discover-vision.md', '.agents/skills/process/discover-vision/SKILL.md'],
  ['.archon/commands/awk-draft-spec.md', '.agents/skills/process/draft-artifact/SKILL.md'],
  ['.archon/commands/awk-breakdown-work-item.md', '.agents/skills/process/breakdown-issue/SKILL.md'],
  ['.archon/commands/awk-prepare-implementation.md', '.agents/skills/process/prepare-implementation/SKILL.md'],
  ['.archon/commands/awk-work-issue-local.md', '.agents/skills/process/work-issue-local/SKILL.md'],
  ['.archon/commands/awk-review-local-changes.md', '.agents/skills/process/review-local-changes/SKILL.md'],
]);

for (const [path, skillPath] of commandSkillRefs) {
  if (!existsSync(join(cwd, path))) continue;
  if (!existsSync(join(cwd, skillPath))) {
    errors.push(`${path} references missing owning skill ${skillPath}`);
  }
  if (!read(path).includes(skillPath)) {
    errors.push(`${path} must reference owning skill ${skillPath}`);
  }
}

const implementationWorkflow = existsSync(join(cwd, '.archon/workflows/awk-work-issue-local.yaml'))
  ? read('.archon/workflows/awk-work-issue-local.yaml')
  : '';
const approvalIndex = implementationWorkflow.indexOf('approval:');
const implementIndex = implementationWorkflow.indexOf('command: awk-work-issue-local');
if (approvalIndex === -1) {
  errors.push('awk-work-issue-local workflow must include an approval gate');
}
if (implementIndex === -1) {
  errors.push('awk-work-issue-local workflow must include the implementation command');
}
if (approvalIndex !== -1 && implementIndex !== -1 && approvalIndex > implementIndex) {
  errors.push('awk-work-issue-local approval gate must appear before implementation command');
}
if (!implementationWorkflow.includes('worktree:\n  enabled: true')) {
  errors.push('awk-work-issue-local workflow must require an Archon worktree');
}

const structuredPreflightSnippets = [
  'id: preflight-status',
  'script: |',
  'runtime: bun',
  'Status:\\s*(READY|STOP|NEEDS_DECISION)',
  'id: stop-preflight',
  'cancel: "Implementation preflight stopped:',
  'id: decision-preflight',
  'cancel: "Implementation preflight needs a human decision:',
  'trigger_rule: none_failed_min_one_success',
  'when: "$preflight-status.output.status == \'READY\'"',
];

for (const snippet of structuredPreflightSnippets) {
  if (!implementationWorkflow.includes(snippet)) {
    errors.push(`awk-work-issue-local workflow is missing structured preflight snippet: ${snippet}`);
  }
}

if (implementationWorkflow.includes('output_format:')) {
  errors.push('awk-work-issue-local workflow must route preflight through artifact parsing, not Codex output_format');
}

const continueWorkflow = existsSync(join(cwd, '.archon/workflows/awk-continue-work.yaml'))
  ? read('.archon/workflows/awk-continue-work.yaml')
  : '';

for (const snippet of [
  'id: runtime-state',
  "workflow_name != 'awk-continue-work'",
  'remote_agent_workflow_runs',
  'remote_agent_isolation_environments',
  'git status --short',
  'command: awk-continue-work',
  'output_type: continue-work-route',
]) {
  if (!continueWorkflow.includes(snippet)) {
    errors.push(`awk-continue-work workflow is missing runtime router snippet: ${snippet}`);
  }
}

if (continueWorkflow.includes('worktree:\n  enabled: true')) {
  errors.push('awk-continue-work must stay read-only without a worktree');
}

if (existsSync(join(cwd, '.archon/commands/awk-continue-work.md'))) {
  const continueCommand = read('.archon/commands/awk-continue-work.md');
  for (const snippet of ['.agents/skills/process/discover-vision/SKILL.md', 'awk-discover-vision', 'DISCOVER_VISION']) {
    if (!continueCommand.includes(snippet)) {
      errors.push(`awk-continue-work command is missing discovery routing snippet: ${snippet}`);
    }
  }
}

const groomWorkflow = existsSync(join(cwd, '.archon/workflows/awk-groom-issue.yaml'))
  ? read('.archon/workflows/awk-groom-issue.yaml')
  : '';

for (const snippet of [
  'name: awk-groom-issue',
  'command: awk-groom-issue',
  'output_type: grooming-report',
  'worktree:\n  enabled: false',
]) {
  if (!groomWorkflow.includes(snippet)) {
    errors.push(`awk-groom-issue workflow is missing required snippet: ${snippet}`);
  }
}

if (existsSync(join(cwd, '.archon/commands/awk-groom-issue.md'))) {
  const groomCommand = read('.archon/commands/awk-groom-issue.md');
  if (!groomCommand.includes('## Human decision needed')) {
    errors.push('awk-groom-issue command must include a machine-readable human decision field');
  }
  for (const snippet of ['## Grooming status', 'READY_FOR_DRAFT', 'NEEDS_INTERVIEW', 'NEEDS_RESEARCH']) {
    if (!groomCommand.includes(snippet)) {
      errors.push(`awk-groom-issue command is missing grooming readiness snippet: ${snippet}`);
    }
  }
  if (!groomCommand.includes('awk-discover-vision')) {
    errors.push('awk-groom-issue command must route unresolved product/design discovery to awk-discover-vision');
  }
}

const discoverVisionWorkflow = existsSync(join(cwd, '.archon/workflows/awk-discover-vision.yaml'))
  ? read('.archon/workflows/awk-discover-vision.yaml')
  : '';

for (const snippet of [
  'name: awk-discover-vision',
  'interactive: true',
  'command: awk-discover-vision',
  'id: discovery-status',
  'READY_FOR_SPEC',
  'id: accept-vision',
  'approval:',
  'capture_response: true',
  'id: record-vision-acceptance',
  "node <<'NODE'",
  'APPROVAL_RESPONSE=$accept-vision.output',
  'process.env.APPROVAL_RESPONSE',
  'Vision state: Accepted',
  'output_type: discovery-report',
  'worktree:\n  enabled: false',
]) {
  if (!discoverVisionWorkflow.includes(snippet)) {
    errors.push(`awk-discover-vision workflow is missing required snippet: ${snippet}`);
  }
}

if (discoverVisionWorkflow.includes('const approval = $accept-vision.output')) {
  errors.push('awk-discover-vision workflow must not inject raw approval output into JavaScript');
}

if (existsSync(join(cwd, '.archon/commands/awk-discover-vision.md'))) {
  const discoverVisionCommand = read('.archon/commands/awk-discover-vision.md');
  for (const snippet of [
    'docs/development/discovery/',
    '$ARTIFACTS_DIR/discover-vision.md',
    '.agents/skills/process/discover-vision/SKILL.md',
    'product-strategy',
    'technical-architecture',
    'validation-strategy',
    'ux-direction',
    'creative-direction',
    'READY_FOR_SPEC',
    'Vision state: Draft',
    'plain relative paths without backticks',
  ]) {
    if (!discoverVisionCommand.includes(snippet)) {
      errors.push(`awk-discover-vision command is missing required snippet: ${snippet}`);
    }
  }
}

const draftSpecWorkflow = existsSync(join(cwd, '.archon/workflows/awk-draft-spec.yaml'))
  ? read('.archon/workflows/awk-draft-spec.yaml')
  : '';

for (const snippet of [
  'name: awk-draft-spec',
  'interactive: true',
  'id: draft-readiness',
  'process.env.ARGUMENTS || process.env.USER_MESSAGE',
  'NEEDS_ANSWER',
  'id: answer-clarification',
  'approval:',
  'capture_response: true',
  'id: stop-draft',
  'cancel: "Spec drafting stopped:',
  'command: awk-draft-spec',
  'trigger_rule: none_failed_min_one_success',
  'output_type: draft-spec-report',
  'worktree:\n  enabled: false',
]) {
  if (!draftSpecWorkflow.includes(snippet)) {
    errors.push(`awk-draft-spec workflow is missing required snippet: ${snippet}`);
  }
}

if (existsSync(join(cwd, '.archon/commands/awk-draft-spec.md'))) {
  const draftSpecCommand = read('.archon/commands/awk-draft-spec.md');
  for (const snippet of [
    'docs/development/specs/',
    '$ARTIFACTS_DIR/draft-spec-report.md',
    '## Durable spec path',
    '## Human decision needed',
    'Spec state: Draft',
    'Draft readiness',
    'Interview answer',
    'NEEDS_INTERVIEW',
    'rules-only spec',
    'generic approval',
  ]) {
    if (!draftSpecCommand.includes(snippet)) {
      errors.push(`awk-draft-spec command is missing required snippet: ${snippet}`);
    }
  }
}

const breakdownWorkflow = existsSync(join(cwd, '.archon/workflows/awk-breakdown-work-item.yaml'))
  ? read('.archon/workflows/awk-breakdown-work-item.yaml')
  : '';

for (const snippet of [
  'name: awk-breakdown-work-item',
  'command: awk-breakdown-work-item',
  'output_type: breakdown-report',
  'worktree:\n  enabled: false',
]) {
  if (!breakdownWorkflow.includes(snippet)) {
    errors.push(`awk-breakdown-work-item workflow is missing required snippet: ${snippet}`);
  }
}

if (existsSync(join(cwd, '.archon/commands/awk-breakdown-work-item.md'))) {
  const breakdownCommand = read('.archon/commands/awk-breakdown-work-item.md');
  if (!breakdownCommand.includes('## Human decision needed')) {
    errors.push('awk-breakdown-work-item command must include a machine-readable human decision field');
  }
}

if (existsSync(join(cwd, '.archon/commands/awk-implementation-preflight.md'))) {
  const preflightCommand = read('.archon/commands/awk-implementation-preflight.md');
  for (const snippet of ['READY', 'STOP', 'NEEDS_DECISION', 'JSON only']) {
    if (!preflightCommand.includes(snippet)) {
      errors.push(`awk-implementation-preflight command is missing structured output snippet: ${snippet}`);
    }
  }
}

const mutatingPatterns = [
  /gh\s+pr\s+merge/,
  /git\s+add\s+-A/,
  /git\s+add\s+\./,
  /git\s+add\s+-u/,
  /git\s+reset\s+--hard/,
];

for (const root of ['.archon/workflows', '.archon/commands']) {
  if (!existsSync(join(cwd, root))) continue;
  for (const file of readdirSync(join(cwd, root))) {
    const path = join(root, file);
    if (!/\.(yaml|md)$/.test(file)) continue;
    const text = read(path);
    for (const pattern of mutatingPatterns) {
      if (pattern.test(text)) {
        errors.push(`${path} contains prohibited pattern ${pattern}`);
      }
    }
  }
}

for (const forbidden of [
  'docs/development/workflow/archon-route-tracker.md',
  'docs/development/workflow/archon-concept-spikes.md',
]) {
  for (const root of ['.archon/workflows', '.archon/commands']) {
    if (!existsSync(join(cwd, root))) continue;
    for (const file of readdirSync(join(cwd, root))) {
      const path = join(root, file);
      if (!/\.(yaml|md)$/.test(file)) continue;
      if (read(path).includes(forbidden)) {
        errors.push(`${path} must not depend on kit-local file ${forbidden}`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error('Archon workflow pack validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Archon workflow pack validation passed.');
