---
name: prepare-implementation
description: Convert a breakdown-shaped ready issue, refactor, revision, or sub-issue into a local Codex implementation brief with goal, non-goals, allowed files, boundaries, acceptance criteria, tests, validation, merge risk, parent context, and PR summary requirements. Use when the user says "prepare this for codex", "make implementation prompt", or "make this issue agent-ready".
---

# Prepare Implementation

You are preparing a breakdown-shaped ready issue for a local Codex implementation session. Do not
write production code.

## Readiness Check

Before writing the brief, verify the issue has enough context:

- Goal.
- Non-goals.
- Source docs or code.
- Owned area or module.
- Allowed files or directories.
- Forbidden files or directories.
- Contracts, records, APIs, storage, or user surfaces touched.
- Acceptance criteria.
- Expected tests.
- Validation command.
- Merge-risk classification.
- Parent issue link and resolution expectations, when this is a sub-issue, superseding refactor, or
  replacement path.
- Human decisions resolved, or clearly marked as required.

If the issue is not ready, return it to grooming and explain the missing information.
If the issue is clear but not decomposed into merge-safe implementation work, send it to
`breakdown-issue` first.

## Brief Shape

Produce:

```md
# Goal

# Non-goals

# Source docs

# Allowed files/directories

# Forbidden files/directories

# Architecture boundary

# Contracts/APIs/storage touched

# Parent/child context

# Acceptance criteria

# Required tests

# Validation command

# Merge risk

# Required PR summary
```

## Rules

- Do not broaden scope.
- Do not guess missing architecture decisions.
- Make allowed and forbidden areas concrete.
- Call out public surfaces, storage, migrations, and cross-module contracts.
- Stop if a real architecture fork needs human choice.

## Test-Drive Feedback

This workflow is being dogfooded. If you notice process friction while using this skill, include a
brief `Process feedback` note in your reply, issue comment, or PR summary. Mention confusing
instructions, missing fields, too much ceremony, unsafe autonomy, merge-safety gaps, or ideas that
would make the workflow easier to use.
