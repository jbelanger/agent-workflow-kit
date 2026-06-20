# Agent Workflow Kit

Status: seed repository.

This repository is a working kit for building a GitHub-native, agent-assisted development workflow.
It is intentionally being built with its own workflow: groom vague ideas, convert them into specs or
ADRs when needed, implement narrow slices, review locally with agents and humans, and keep decisions
auditable.

## Start Here

- Workflow draft: `docs/development/workflow/ai-dev-workflow.md`
- Buy-vs-build mapping: `docs/development/workflow/ai-dev-workflow-buy-vs-build.md`
- Archon portability ADR: `docs/development/workflow/adr-archon-portable-skills.md`
- Archon route tracker: `docs/development/workflow/archon-route-tracker.md`
- Archon concept spikes: `docs/development/workflow/archon-concept-spikes.md`
- Rebuild trace: `docs/development/workflow/rebuild-trace.md`
- Development docs policy: `docs/development/README.md`
- Active agent instructions: `AGENTS.md`
- Local Codex skills: `.agents/skills/` category folders

## Current Goal

Dogfood a stripped-down local Codex workflow before adding automation. The Archon branch tests an
optional execution profile on top of the portable skills workflow instead of replacing the copied
repo workflow with an Archon-only process.

The initial working assumption:

- single repository by default
- durable development artifacts under `docs/development/`
- GitHub Issues and Projects as the planning surface
- local-first Codex agents
- repeated workflow verbs captured as local skills
- deterministic CI only for now
- no Codex-in-CI baseline yet
- no autonomous merge
- experimental optional `.archon/` execution profile with bundled Archon defaults disabled
