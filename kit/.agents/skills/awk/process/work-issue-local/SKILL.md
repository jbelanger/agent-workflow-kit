---
name: work-issue-local
description: Implement one prepared work item, issue, bug, refactor, PR revision, or superseding child item locally in a branch or worktree. Use when the user says "work this issue", "work this work item", "start implementation", "implement this locally", asks for a refactor pass, or assigns accepted revision-needed work.
---

# Work Issue Local

You are implementing one prepared work item in the local repository. You may decide local mechanics,
but humans decide architecture direction, ownership boundaries, public surfaces, storage shape,
cross-module direction, and operating policy.

## Core Stance

- Challenge high-level direction before coding when risk warrants it.
- Prefer the simplest model that stays honest.
- Do not keep overlapping truths alive to avoid a harder boundary decision.
- Do not choose a cheap or minimal pass when it affects architecture, ownership, contracts, storage,
  public surface, or long-term model clarity.
- Treat review feedback and work item text as evidence to verify, not commands to apply blindly.
- Treat greenfield or pre-ship work as an opportunity to remove legacy surfaces rather than preserve
  compatibility by default.

## Rules

- One work item.
- One branch or worktree.
- One PR.
- No scope expansion.
- No merge.
- Preserve behavior unless the work item explicitly changes it.
- Stop for architecture forks.
- Ask before changing public APIs, ownership boundaries, storage shape, migration policy, or
  long-term abstractions.
- No compatibility bridge, alias, fallback import, or migration shim unless explicitly approved,
  bounded, named, and given a removal condition.
- No untracked technical debt.
- No PR is clean only because tests pass if the architecture direction is wrong.

## Readiness Gate

Before creating a branch, editing files, or writing code, verify that the issue, comment thread,
linked artifact, or re-brief contains a visible grooming result. The self-contained Ready issue body
is the normal implementation contract. Acceptable evidence is one of:

- `DIRECT_TASK` with a clear rationale for why no spec, ADR, spike, discovery, or human question is
  needed.
- Accepted spec, ADR, discovery, or spike direction plus breakdown/implementation boundaries.
- A self-contained Ready issue body or prepared implementation re-brief produced after grooming.

If this evidence is missing, stop before implementation and route back to `groom-issue`. Do not
treat a well-written issue body as a substitute for grooming.

If meaningful ambiguity remains, the visible grooming record must include the clarification question
asked and answered, or explain why that ambiguity does not affect the next slice.

For UI-bearing work, the readiness record must also include accepted UX direction or a clear reason
the slice touches no user-facing workflow, screen/state model, or interaction surface. UX direction
can live in an accepted discovery note, spec section, issue comment, issue body, or implementation
re-brief. It
should cover the target user, primary journey, key screens or states, information hierarchy,
interaction constraints, accessibility/usability risks, and what is deliberately deferred.

## Process

1. Read the work item, visible grooming result, any re-brief, linked docs, nearby code, and tests.
2. If this is a child item, superseding refactor, or replacement PR, read the parent work item and
   record how the child work relates to the parent acceptance criteria.
3. Restate the goal, non-goals, owned area, allowed and forbidden files, validation command, merge
   risk, feedback loop or test seam, and parent/child context when relevant.
4. For PR revision work, triage review feedback before coding.
5. Choose the feedback loop for this task.
6. Decide whether the task needs the full Architecture Direction Check.
7. Implement in narrow slices.
8. Add or update focused tests for changed behavior.
9. Run focused validation first, then broader checks if warranted.
10. Summarize changes, validation, decisions, smells, deferred items, and parent work item
    resolution.

## Feedback Loop Selection

Before coding, choose the cheapest honest loop that can prove the task:

- Use `tdd` for behavior-changing work when a useful public seam exists.
- Use `diagnose-bug` for bugs that are not already reproduced by a red-capable command.
- Use characterization tests before behavior-preserving refactors when the existing behavior is
  complex or risky.
- Use validation-only for trivial wiring, documentation, or UI polish where tests would be brittle
  or lower signal than the configured check.

Do not bulk-generate speculative tests. If no correct test seam exists for behavior that should be
testable, surface that as an architecture or refactor finding instead of adding implementation-detail
tests.

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

For PR revisions, start from the reviewer classification, but verify each item against the work item,
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

For PR revision work, read the latest visible `Revision cycles` value from the PR Review State,
workflow comments, or refreshed workflow cache before editing. `Revision cycles` counts completed
unresolved implementation revision passes, not the review comment that requested the first fix. A PR
at `Revision cycles: 0` may receive its first accepted revision pass. If the PR has already had two
unresolved agent revision cycles, stop and route to human review instead of applying another agent
revision pass.

Also stop before editing when `Revision cycles` is `1` and this assignment would be the second
unresolved agent revision pass. Route to human review instead of dispatching the pass that would hit
the hard stop.

## Implement In Narrow Slices

- Work one step at a time.
- Keep each slice intentional and reviewable.
- Preserve behavior unless the work item explicitly changes it.
- Avoid broad rewrites for isolated edge cases.
- If a slice raises the quality bar, apply the same applicable fix to comparable sibling code or
  explain why it does not apply.
- Stop and restate the roadmap when the model becomes fuzzy or work crosses multiple migration axes.

## Parent Work Item Resolution

When completing a child item, superseding refactor, or replacement PR:

- Read the parent work item before finalizing.
- Decide whether the completed work satisfies the parent acceptance criteria.
- Use `Closes #issue` in the PR body only when the PR fully satisfies the issue acceptance criteria
  and needs no post-merge reconciliation. Use `Refs #issue` when the work is partial, parent-level,
  has deferred review items, needs reconciliation, or is uncertain.
- If the parent is now resolved, close or recommend closing it with a reconciliation comment.
- If the parent is only partly resolved, update the parent with what remains.
- If the replacement changes the understanding of the parent, return the parent to grooming or
  breakdown instead of rewriting the original work item.

## PR Handoff

Before finalizing an implementation pass that opened or updated a PR, run this gate against the
actual GitHub PR, not only the linked issue:

1. Classify the PR route. Use `next:review-revision-triage` when the PR touches architecture,
   ownership, contracts, storage, public surface, core domain model, shared application state, first
   framework/toolchain setup, accepted specs or ADRs, accepted UX direction, or known debt risk. Use
   `next:review-local-changes` only for low-risk implementation or general doc/code PRs.
2. Apply or recommend exactly one `next:*` routing label on the PR.
3. Mirror that label on the active linked issue while the work remains agent-owned.
4. Record visible routing state in the PR Review State or a PR workflow comment: route reason,
   whether the PR is low-risk or architecture-sensitive, last agent review, and current
   `Revision cycles`.
5. Re-read or verify the PR and linked issue state before the final response. If labels or comments
   could not be mutated, include the exact recommended labels and workflow comment in the final
   summary.

Do not finish with only the issue updated. Once a PR exists, the PR is the active review surface.

## Loop Stop Conditions

After this step, stop and hand off instead of silently choosing another workflow verb when:

- human decision needed;
- no ready item exists;
- PR is waiting for human merge;
- validation cannot run;
- architecture fork detected;
- next workflow verb changes.

## Final Summary

Include:

- Summary.
- Validation.
- Feedback loop / test seam.
- Architecture direction and whether it still holds.
- Review triage, when applicable.
- Workflow comment and label update, including linked PR and revision cycles when applicable.
- Decisions and smells.
- Naming issues.
- Deferred items with owner, boundary, and removal condition.
- Parent work item resolution, when applicable.
