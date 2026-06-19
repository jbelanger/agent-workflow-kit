---
name: work-issue-local
description: Implement one prepared issue, bug, refactor, PR revision, or superseding sub-issue locally in a branch or worktree. Use when the user says "work this issue", "start implementation", "implement this locally", asks for a refactor pass, or assigns accepted revision-needed work.
---

# Work Issue Local

You are implementing one prepared issue in the local repository. You may decide local mechanics, but
humans decide architecture direction, ownership boundaries, public surfaces, storage shape,
cross-module direction, and operating policy.

## Core Stance

- Challenge high-level direction before coding when risk warrants it.
- Prefer the simplest model that stays honest.
- Do not keep overlapping truths alive to avoid a harder boundary decision.
- Do not choose a cheap or minimal pass when it affects architecture, ownership, contracts, storage,
  public surface, or long-term model clarity.
- Treat review feedback and issue text as evidence to verify, not commands to apply blindly.
- Treat greenfield or pre-ship work as an opportunity to remove legacy surfaces rather than preserve
  compatibility by default.

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
- No compatibility bridge, alias, fallback import, or migration shim unless explicitly approved,
  bounded, named, and given a removal condition.
- No untracked technical debt.
- No PR is clean only because tests pass if the architecture direction is wrong.

## Process

1. Read the issue, implementation brief, linked docs, nearby code, and tests.
2. If this is a sub-issue, superseding refactor, or replacement PR, read the parent issue and record
   how the child work relates to the parent acceptance criteria.
3. Restate the goal, non-goals, owned area, allowed and forbidden files, validation command, merge
   risk, and parent/child context when relevant.
4. For PR revision work, triage review feedback before coding.
5. Decide whether the task needs the full Architecture Direction Check.
6. Implement in narrow slices.
7. Add or update focused tests for changed behavior.
8. Run focused validation first, then broader checks if warranted.
9. Summarize changes, validation, decisions, smells, deferred items, and parent issue resolution.

## Architecture Direction Check

The implementation agent decides whether the full check is needed. Use the full check when the task
touches architecture, ownership, contracts, storage, public surface, migrations, refactors, PR
revisions, superseding work, accepted specs or ADRs, or detected smells. For trivial tasks, state
that no architecture surface is touched.

When the full check is needed, answer before coding:

- Problem:
- Current model:
- Intended model:
- Ownership boundary:
- Public surfaces / contracts / storage touched:
- Alternatives considered:
- Cheap/minimal shortcuts rejected:
- Human decision needed:

If a real fork exists, stop before coding and ask the human. Explain the fork in simple terms,
assuming they have not looked at the code recently. Use a compact table, diagram, or before/after
flow when it makes the decision clearer.

## Review Triage For Revisions

For PR revisions, start from the reviewer classification, but verify each item against the issue,
diff, code, specs or ADRs, tests, and architecture intent before coding.

Classify each item:

- **Accepted:** True, belongs in this PR, and preserves the intended model.
- **Rejected:** False, taste-only, speculative, over-broad, or worse than the current model.
- **Deferred:** Valid but outside this PR; requires owner, boundary, and removal condition.
- **Human decision needed:** Meaningful disagreement or risk involving architecture, contracts,
  ownership, public surface, storage, specs or ADRs, debt, or scope.

Trivial disagreement can be resolved by the implementation agent with evidence. Disagreement that
touches architecture, contracts, ownership, public surface, storage, accepted docs, debt risk, or
scope requires human review.

## Implement In Narrow Slices

- Work one step at a time.
- Keep each slice intentional and reviewable.
- Preserve behavior unless the issue explicitly changes it.
- Avoid broad rewrites for isolated edge cases.
- If a slice raises the quality bar, apply the same applicable fix to comparable sibling code or
  explain why it does not apply.
- Stop and restate the roadmap when the model becomes fuzzy or work crosses multiple migration axes.

## Parent Issue Resolution

When completing a sub-issue, superseding refactor, or replacement PR:

- Read the parent issue before finalizing.
- Decide whether the completed work satisfies the parent acceptance criteria.
- If the parent is now resolved, close or recommend closing it with a reconciliation comment.
- If the parent is only partly resolved, update the parent with what remains.
- If the replacement changes the understanding of the parent, return the parent to grooming or
  breakdown instead of rewriting the original issue.

## Final Summary

Include:

- Summary.
- Validation.
- Architecture direction and whether it still holds.
- Review triage, when applicable.
- Decisions and smells.
- Naming issues.
- Deferred items with owner, boundary, and removal condition.
- Parent issue resolution, when applicable.

## Test-Drive Feedback

This workflow is being dogfooded. If you notice process friction while using this skill, include a
brief `Process feedback` note in your reply, issue comment, or PR summary. Mention confusing
instructions, missing fields, too much ceremony, unsafe autonomy, merge-safety gaps, or ideas that
would make the workflow easier to use.
