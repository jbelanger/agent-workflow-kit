#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const requiredFiles = [
  '.archon/config.yaml',
  '.archon/workflows/awk-prepare-implementation.yaml',
  '.archon/workflows/awk-work-issue-local.yaml',
  '.archon/workflows/awk-review-local-changes.yaml',
  '.archon/workflows/awk-validate-process-pack.yaml',
  '.archon/commands/awk-prepare-implementation.md',
  '.archon/commands/awk-implementation-preflight.md',
  '.archon/commands/awk-work-issue-local.md',
  '.archon/commands/awk-review-local-changes.md',
  'docs/development/workflow/ai-dev-workflow-buy-vs-build.md',
  'docs/development/workflow/archon-route-tracker.md',
  'docs/development/workflow/archon-concept-spikes.md',
  'docs/development/workflow/archon-recovery-runbook.md',
];

const errors = [];

function read(path) {
  return readFileSync(path, 'utf8');
}

for (const path of requiredFiles) {
  if (!existsSync(path)) errors.push(`Missing required file: ${path}`);
}

if (existsSync('.archon/config.yaml')) {
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
}

if (existsSync('.archon/workflows')) {
  for (const file of readdirSync('.archon/workflows').filter(name => name.endsWith('.yaml'))) {
    const path = join('.archon/workflows', file);
    const text = read(path);
    if (!/^name:/m.test(text)) errors.push(`${path} is missing a workflow name`);
    if (!/^nodes:/m.test(text)) errors.push(`${path} is missing DAG nodes`);
  }
}

for (const path of requiredFiles.filter(path => path.startsWith('.archon/commands/'))) {
  if (!existsSync(path)) continue;
  const text = read(path);
  if (!text.startsWith('---\n')) errors.push(`${path} must start with frontmatter`);
  if (!text.includes('$ARTIFACTS_DIR/')) {
    errors.push(`${path} must write or name an artifact path under $ARTIFACTS_DIR`);
  }
}

const implementationWorkflow = existsSync('.archon/workflows/awk-work-issue-local.yaml')
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

if (existsSync('.archon/commands/awk-implementation-preflight.md')) {
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
  if (!existsSync(root)) continue;
  for (const file of readdirSync(root)) {
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

if (errors.length > 0) {
  console.error('Archon workflow pack validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Archon workflow pack validation passed.');
