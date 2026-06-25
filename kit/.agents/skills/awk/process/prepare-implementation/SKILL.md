---
name: prepare-implementation
description: Re-brief a stale, scattered, or incomplete Ready work item into a compact worker prompt with goal, non-goals, allowed files, boundaries, acceptance criteria, tests, validation, merge risk, parent context, and PR summary requirements. Use when the user says "prepare implementation", "make implementation prompt", "make this issue agent-ready", or "make this work item agent-ready".
---

# Prepare Implementation

You are preparing one breakdown-shaped Ready work item for a runtime worker loop. Do not write
production code.

The issue body is the normal implementation task contract. Use this skill only when the issue is
stale, has important decisions scattered through comments, or lacks a compact worker contract. If
the issue is already self-contained, do not duplicate it; say that no separate brief is needed and
route to `work-issue-local` after the human authorizes implementation.

## Readiness Check

Before writing a re-brief, verify the work item has enough context:

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

## Re-Brief Shape

Produce a compact prompt or issue comment. Keep it as a pointer to durable state, not a second copy
of the workflow rules:

```md
# Workflow comment and label update

# Runtime worker loop

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

The `Runtime worker loop` section should bind the worker to one issue and one done condition. Example:
"Implement issue #N in one branch or worktree using `AGENTS.md` and
`.agents/skills/awk/process/work-issue-local/SKILL.md`; done means the acceptance criteria pass,
required validation has run, and a PR is open with the required summary."

## Rules

- Do not broaden scope.
- Do not guess missing architecture decisions.
- Make allowed and forbidden areas concrete.
- Call out public surfaces, storage, migrations, and cross-module contracts.
- For UI-bearing tasks, stop if the issue or re-brief lacks UX direction for the user journey,
  screen/state model, information hierarchy, interaction constraints, and accessibility/usability
  risks.
- If implementation depends on visual direction, stop unless linked mockups or sample assets are
  accepted or explicitly marked illustrative enough for the slice.
- Stop if a real architecture fork needs human choice.

## Loop Stop Conditions

After this step, stop and hand off instead of silently choosing another workflow verb when:

- human decision needed;
- no ready item exists;
- PR is waiting for human merge;
- validation cannot run;
- architecture fork detected;
- next workflow verb changes.
