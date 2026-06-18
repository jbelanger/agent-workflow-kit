# Agent Workflow Kit

Status: seed repository.

This repository is a working kit for building a GitHub-native, agent-assisted development workflow.
It is intentionally being built with its own workflow: groom vague ideas, convert them into specs or
ADRs when needed, implement narrow slices, review with agents and humans, and keep decisions
auditable.

## Start Here

- Workflow draft: `docs/development/workflow/ai-dev-workflow.md`
- Buy-vs-build mapping: `docs/development/workflow/ai-dev-workflow-buy-vs-build.md`
- Rebuild trace: `docs/development/workflow/rebuild-trace.md`
- GitHub Project setup script: `scripts/setup-github-project.sh`
- GitHub Project setup guide: `docs/development/workflow/project-setup-script.md`
- Development docs policy: `docs/development/README.md`
- Future agent instructions: `docs/development/agents/AGENTS.md`
- Draft skills: `docs/development/agents/skills/`

## Current Goal

Dogfood the workflow by creating the first initiative and grooming it into specs, ADRs, issues, and
CI checks for this repository.

The initial working assumption:

- single repository by default
- durable development artifacts under `docs/development/`
- GitHub Issues and Projects as the planning surface
- local-first Codex agents
- Codex-in-CI for detailed advisory review
- no autonomous merge
