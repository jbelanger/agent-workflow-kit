# Agent Workflow Kit

Status: seed repository.

This repository is a working kit for building a GitHub-native, agent-assisted development workflow.
It is intentionally being built with its own workflow: groom vague ideas, convert them into specs or
ADRs when needed, discover product vision before vague specs, implement narrow slices, review
locally with agents and humans, and keep decisions auditable.

## Start Here

- Workflow draft: `docs/development/workflow/ai-dev-workflow.md`
- Install contract: `docs/development/workflow/installing-agent-workflow-kit.md`
- GitHub-first orchestration ADR: `docs/development/adrs/github-first-orchestration.md`
- Buy-vs-build and Archon experiment evidence:
  - `docs/development/workflow/ai-dev-workflow-buy-vs-build.md`
  - `docs/development/workflow/adr-archon-portable-skills.md`
  - `docs/development/workflow/archon-route-tracker.md`
  - `docs/development/workflow/archon-concept-spikes.md`
- Rebuild trace: `docs/development/workflow/rebuild-trace.md`
- Development docs policy: `docs/development/README.md`
- Active agent instructions: `AGENTS.md`
- Local Codex skills: `.agents/skills/` category folders

## Current Goal

Dogfood a GitHub-first agent workflow before adding custom runtime automation. The Archon branch
produced stronger portable skills, but the active baseline is now GitHub Issues, GitHub Projects,
repo-local durable docs, PR review gates, and local agents.

The initial working assumption:

- single repository by default
- durable development artifacts under `docs/development/`
- GitHub Issues and Projects as the active orchestration surface
- local-first Codex agents
- repeated workflow verbs captured as local skills
- `continue-work` as the GitHub-aware router for resuming from visible state
- high-interaction discovery for vague product/design direction before low-interaction execution
- deterministic CI only for now
- no Codex-in-CI baseline yet
- no autonomous merge
- optional `.archon/` execution profile retained as experiment evidence, not the default path

Plain Codex entry point:

```text
Continue work from the GitHub Project and issues.
```

Codex should read `AGENTS.md`, use `.agents/skills/process/continue-work/SKILL.md`, inspect GitHub
issues/PRs/project fields and repo docs, then recommend the next safe workflow verb.

## Install Into Another Repo

GitHub-first workflow kit:

```bash
node scripts/install-workflow-kit.mjs --target /path/to/project
```

GitHub-first workflow kit plus the optional Archon runtime profile:

```bash
node scripts/install-workflow-kit.mjs --target /path/to/project --with-archon
```

Proof from clean temporary repos:

```bash
node scripts/prove-portable-install.mjs
```
