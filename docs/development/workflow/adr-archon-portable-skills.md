# ADR: Portable Skills With Optional Archon Execution

Status: accepted

## Context

`agent-workflow-kit` is copied into other repositories. Those repositories may already have local
skills, repository instructions, project docs, and GitHub issue practices. The kit should improve
that local workflow without making Archon mandatory.

The Archon prototype proved useful runtime primitives:

- workflow DAGs
- fresh-context node handoff through artifacts
- isolated worktrees
- approval gates
- run status, logs, recovery, and dashboard views

The confusing part was the overlap between portable skills and `.archon/commands/awk-*` prompts. If
both become first-class process definitions, the kit has two mental models for the same workflow
verbs.

## Decision

The portable workflow source is:

```text
AGENTS.md
.agents/skills/
docs/development/
GitHub issues and PRs, when remote collaboration or audit trail is needed
```

The optional Archon execution profile is:

```text
.archon/commands/awk-*
.archon/workflows/awk-*
scripts/validate-archon-pack.mjs
```

Skills remain the primary reusable unit of workflow behavior. Archon commands are adapters that make
those workflow verbs executable inside Archon. Archon workflows own orchestration mechanics such as
node order, fresh context, worktree isolation, approval gates, status routing, and artifact handoff.

The mental model is one set of workflow verbs:

```text
triage backlog
pick next item
groom issue
break down issue
prepare implementation
work issue locally
review local changes
continue work
```

Those verbs can run in two ways:

```text
plain Codex:
  use AGENTS.md and .agents/skills directly

Archon:
  run thin awk-* adapters around the same rules and skills
```

## Boundaries

Skills and standing docs own:

- Definition of Ready
- Definition of Done
- architecture decision gates
- review triage policy
- implementation boundaries
- workflow judgment

Archon commands own:

- selecting the workflow verb for an Archon node
- reading the owning skill or rule document
- writing the artifact path and shape required by downstream Archon nodes
- returning structured status when the workflow needs deterministic routing

Archon workflows own:

- DAG execution
- fresh-context boundaries
- worktree or no-worktree choice
- approval pause and resume behavior
- `READY` / `STOP` / `NEEDS_DECISION` routing
- runtime logs and artifacts

Archon must not own:

- accepted architecture direction
- issue readiness truth
- board taxonomy
- skill content
- durable planning memory
- the answer to "what should I work on next?"

## GitHub Boundary

GitHub issues and PRs remain valid collaboration and audit surfaces. GitHub Project fields may be
used as a progress dashboard, but they are not required for the Archon profile.

Archon may eventually write constrained progress updates to GitHub, such as:

- run started
- preflight passed
- approval needed
- run rejected or cancelled
- implementation complete
- validation passed or failed
- artifact summary

Archon must not silently rewrite issue scope, decide architecture, mark specs accepted, or promote
runtime artifacts into durable truth.

## Consequences

This preserves portability for copied repos that do not install Archon.

It also keeps the Archon route useful where runtime machinery matters: approval gates, recoverable
runs, worktree isolation, and visible progress.

The cost is a small adapter layer. To keep that cost bounded, `.archon/commands/awk-*` must stay thin
and must not duplicate skill procedure unless the detail is required for Archon artifact parsing or
workflow routing.

## Validation

The route is valid only while these checks hold:

```bash
node scripts/validate-archon-pack.mjs
archon validate workflows --cwd /Users/joel/Dev/agent-workflow-kit --json
archon validate commands --cwd /Users/joel/Dev/agent-workflow-kit --json
```
