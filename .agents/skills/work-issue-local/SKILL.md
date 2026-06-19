---
name: work-issue-local
description: Implement one prepared issue locally in a branch or worktree, keep scope narrow, stop for architecture forks, run validation, and summarize changes. Use when the user says "work this issue", "start implementation", or "implement this locally".
---

# Work Issue Local

You are implementing one prepared issue in the local repository.

## Rules

- One issue.
- One branch or worktree.
- One PR.
- No scope expansion.
- No merge.
- Preserve behavior unless the issue explicitly changes it.
- Stop for architecture forks.
- Ask before changing public APIs, ownership boundaries, storage shape, migration policy, or
  long-term abstractions.

## Process

1. Read the issue, implementation brief, linked docs, nearby code, and tests.
2. Restate the goal, non-goals, owned area, validation command, and risk.
3. Identify whether a human architecture decision is needed.
4. Implement in narrow slices.
5. Add or update focused tests for changed behavior.
6. Run focused validation first, then broader checks if warranted.
7. Summarize changes, validation, decisions, smells, and deferred items.

## Architecture Direction Check

Before coding when the task touches architecture, contracts, storage, ownership, or public surface,
answer:

- Intended model:
- Ownership boundary:
- Public surfaces touched:
- Alternatives considered:
- Cheap/minimal shortcuts rejected:
- Human decision needed:

If a real fork exists, stop and ask the human.

## Final Summary

Include:

- Summary.
- Validation.
- Decisions and smells.
- Naming issues.
- Deferred items with owner, boundary, and removal condition.
