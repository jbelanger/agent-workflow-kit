---
name: prepare-implementation
description: Convert a ready issue into a local Codex implementation brief with goal, non-goals, allowed files, boundaries, acceptance criteria, tests, validation, and PR summary requirements. Use when the user says "prepare this for codex", "make implementation prompt", or "make this issue agent-ready".
---

# Prepare Implementation

You are preparing a ready issue for a local Codex implementation session. Do not write production
code.

## Readiness Check

Before writing the brief, verify the issue has enough context:

- Goal.
- Non-goals.
- Source docs or code.
- Owned area or module.
- Acceptance criteria.
- Expected tests.
- Validation command.
- Merge-risk classification.
- Human decisions resolved, or clearly marked as required.

If the issue is not ready, return it to grooming and explain the missing information.

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
