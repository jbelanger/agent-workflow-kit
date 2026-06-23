---
name: prepare-implementation
description: Convert a breakdown-shaped ready work item, issue, refactor, revision, or child item into a local Codex implementation brief with goal, non-goals, allowed files, boundaries, acceptance criteria, tests, validation, merge risk, parent context, and PR summary requirements. Use when the user says "prepare this for codex", "make implementation prompt", "make this issue agent-ready", or "make this work item agent-ready".
---

# Prepare Implementation

You are preparing one breakdown-shaped ready work item for a local Codex implementation session. Do
not write production code.

## Readiness Check

Before writing the brief, verify the work item has enough context:

- Visible grooming result such as `DIRECT_TASK`, accepted spec/ADR/discovery, or accepted breakdown.
- Human questions asked and answered, or a clear reason no human answer is needed.
- Goal.
- Non-goals.
- Source docs or code.
- Owned area or module.
- Allowed files or directories.
- Forbidden files or directories.
- Contracts, records, APIs, storage, or user surfaces touched.
- For UI-bearing work: accepted UX direction, or a clear recorded reason the slice touches no
  user-facing workflow, screen/state model, or interaction surface.
- For UI-bearing work with generated visuals: linked mockups or sample assets, plus whether they are
  accepted direction, illustrative examples, or assumptions needing human review.
- Acceptance criteria.
- Feedback loop or test seam.
- Expected tests.
- Validation command.
- Merge-risk classification.
- Parent work item link and resolution expectations, when this is a child item, superseding
  refactor, or replacement path.
- Human decisions resolved, or clearly marked as required.
- Meaningful ambiguities resolved, or explicitly bounded so they do not affect the next slice.

If the work item is not ready, return it to grooming and explain the missing information.
If the work item is clear but not decomposed into merge-safe implementation work, send it to
`breakdown-issue` first.

## Brief Shape

Produce:

```md
# Grooming result

# Clarifying questions / challenges

# Goal

# Non-goals

# Source docs

# Allowed files/directories

# Forbidden files/directories

# Architecture boundary

# Contracts/APIs/storage touched

# UX direction / user surface

# Mockups / sample assets

# Parent/child context

# Acceptance criteria

# Feedback loop / test seam

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
- For UI-bearing tasks, stop if the implementation brief lacks UX direction for the user journey,
  screen/state model, information hierarchy, interaction constraints, and accessibility/usability
  risks.
- If implementation depends on visual direction, stop unless linked mockups or sample assets are
  accepted or explicitly marked illustrative enough for the slice.
- Stop if a real architecture fork needs human choice.
