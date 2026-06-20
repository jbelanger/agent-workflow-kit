# Agent Workflow Kit

Status: seed repository.

This repository is a working kit for building a GitHub-native, agent-assisted development workflow.
It is intentionally being built with its own workflow: groom vague ideas, convert them into specs or
ADRs when needed, discover product vision before vague specs, implement narrow slices, review
locally with agents and humans, and keep decisions auditable.

## Start Here

- Workflow draft: `docs/development/workflow/ai-dev-workflow.md`
- Install contract: `docs/development/workflow/installing-agent-workflow-kit.md`
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
- high-interaction discovery for vague product/design direction before low-interaction execution
- deterministic CI only for now
- no Codex-in-CI baseline yet
- no autonomous merge
- experimental optional `.archon/` execution profile with bundled Archon defaults disabled

Useful Archon entry point:

```bash
archon workflow run awk-continue-work --cwd /Users/joel/Dev/agent-workflow-kit "continue work"
```

The first planning fallback is also available in Archon:

```bash
archon workflow run awk-groom-issue --cwd /Users/joel/Dev/agent-workflow-kit "Groom ARCHON-010"
```

Early product/design discovery is available when grooming reports unresolved vision work:

```bash
archon workflow run awk-discover-vision --cwd /Users/joel/Dev/agent-workflow-kit "Discover vision for <work item>"
```

Dashboard-first artifact review is available for draft vision briefs, specs, and ADRs:

```bash
archon workflow run awk-review-artifact --cwd /Users/joel/Dev/agent-workflow-kit "Review docs/development/specs/<spec>.md"
```

## Install Into Another Repo

Portable skills only:

```bash
node scripts/install-workflow-kit.mjs --target /path/to/project
```

Portable skills plus the optional Archon dashboard/runtime profile:

```bash
node scripts/install-workflow-kit.mjs --target /path/to/project --with-archon
```

Proof from clean temporary repos:

```bash
node scripts/prove-portable-install.mjs
```
