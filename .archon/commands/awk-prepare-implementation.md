---
description: Prepare a local Codex implementation brief from a ready or nearly-ready issue.
argument-hint: <issue-number|issue-url|description>
---

# Agent Workflow Kit: Prepare Implementation

**Input**: $ARGUMENTS

---

## Mission

Prepare an implementation brief for one local Codex work session. Do not edit code. Do not create a
branch, commit, PR, issue, or comment unless the user explicitly asked for that outside this
workflow.

The output artifact is:

```text
$ARTIFACTS_DIR/implementation-brief.md
```

## Required Context

1. Read `AGENTS.md`.
2. Read `docs/development/workflow/ai-dev-workflow.md`.
3. If `$ARGUMENTS` references a GitHub issue, fetch it with `gh issue view`.
4. Read any linked source docs, specs, ADRs, parent issues, or code references.
5. Inspect nearby files only enough to verify boundaries, existing patterns, and validation seams.

## Readiness Check

Classify the work before writing the brief:

- `READY`: It has goal, non-goals, source docs, owned area, allowed and forbidden files,
  architecture boundary, contracts/APIs/storage touched, acceptance criteria, feedback loop,
  required tests, validation command, merge risk, and parent resolution expectations when needed.
- `NEEDS_BREAKDOWN`: Direction is accepted, but task boundaries are not one-agent/one-PR shaped.
- `NEEDS_GROOMING`: Problem, scope, source evidence, or expected behavior is unclear.
- `NEEDS_HUMAN_DECISION`: Public API, ownership, storage, migration, long-term abstraction, or
  architecture fork needs human choice.

Do not label an issue `READY` just because implementation looks easy.

## Brief Shape

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
