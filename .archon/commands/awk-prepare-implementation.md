---
description: Prepare a local Codex implementation brief from a ready or nearly-ready issue.
argument-hint: <issue-number|issue-url|description>
---

# Agent Workflow Kit: Prepare Implementation

**Input**: $ARGUMENTS

---

## Mission

Run the portable `prepare-implementation` workflow verb inside Archon. Do not edit code. Do not
create a branch, commit, PR, issue, or comment unless the user explicitly asked for that outside
this workflow.

## Adapter Boundary

This command is an Archon adapter, not a second source of process truth.

1. Read `AGENTS.md`.
2. Read `docs/development/workflow/ai-dev-workflow.md`.
3. Read `.agents/skills/process/prepare-implementation/SKILL.md`.
4. Follow that skill as the owning procedure.
5. Use this command only to enforce the Archon artifact path and artifact shape below.

The output artifact path is:

```text
$ARTIFACTS_DIR/implementation-brief.md
```

## Artifact Shape

Write exactly this structure to `$ARTIFACTS_DIR/implementation-brief.md`:

```markdown
# Implementation Brief

## Readiness
Status:
Reason:

## Goal

## Non-goals

## Source docs/code

## Owned area

## Allowed files/directories

## Forbidden files/directories

## Architecture boundary

## Contracts/APIs/storage/user surfaces touched

## Parent/child context

## Acceptance criteria

## Feedback loop / test seam

## Required tests

## Validation command

## Merge risk

## Human decision needed

## Required PR summary

## Process feedback
```

If the work is not ready, keep the brief useful: explain the missing evidence and the next workflow
verb (`groom-issue`, `breakdown-issue`, or human decision).
