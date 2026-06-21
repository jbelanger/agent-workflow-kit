# Agent Workflow Kit

Status: seed repository.

This repository is a working kit for building a GitHub-native, agent-assisted development workflow.
It is intentionally being built with its own workflow: groom vague ideas, convert them into specs or
ADRs when needed, discover product vision before vague specs, implement narrow slices, review
locally with agents and humans, and keep decisions auditable.

## Start Here

- Workflow draft: `docs/development/workflow/ai-dev-workflow.md`
- GitHub-first flow: `docs/development/workflow/github-first-flow.md`
- Install contract: `docs/development/workflow/installing-agent-workflow-kit.md`
- GitHub-first orchestration ADR: `docs/development/adrs/github-first-orchestration.md`
- Rebuild trace: `docs/development/workflow/rebuild-trace.md`
- Development docs policy: `docs/development/README.md`
- Active agent instructions: `AGENTS.md`
- Local Codex skills: `.agents/skills/` category folders

## Current Goal

Dogfood a GitHub-first agent workflow before adding custom runtime automation. The active baseline
is GitHub Issues, GitHub Projects, repo-local durable docs, PR review gates, and local agents.

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

Proof from clean temporary repos:

```bash
node scripts/prove-portable-install.mjs
```
