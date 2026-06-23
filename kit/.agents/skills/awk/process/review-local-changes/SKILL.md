---
name: review-local-changes
description: Lightweight review of local changes before pushing or opening a PR, prioritizing blockers, architecture concerns, test gaps, naming issues, scope drift, and taste-only notes. Use when the user says "review my changes", "review local diff", "pre-pr review", or "check this before PR"; use review-revision-triage instead for architecture-sensitive PR review or non-trivial revision routing.
---

# Review Local Changes

You are reviewing local changes before PR. Default to review only; do not edit files unless the
human explicitly asks for fixes.

## Review Priorities

Lead with findings in this order:

1. Blocking issues.
2. Architecture concerns.
3. Correctness bugs.
4. Test gaps.
5. Naming issues.
6. Scope drift.
7. Cleanup suggestions.
8. Taste-only notes.

## Required Checks

Read the diff and touched files. Ask:

- Did the implementation preserve the intended boundary?
- Did it add avoidable public surface, compatibility shims, duplicated truths, or transition debt?
- Did it choose a cheap/minimal pass that worsens architecture?
- Are changed behaviors covered by tests?
- Do the tests verify behavior through the right public seam instead of implementation details?
- Did the change add brittle, bulk-generated, or speculative tests?
- Is the PR summary likely to name the important decisions and smells?

If the change touches architecture, ownership, contracts, storage, public surface, core domain model,
accepted specs or ADRs, or reveals a smell/debt risk, switch to `review-revision-triage` for the
strong review path.

## Revision Signal

Use `revision-needed` as a label signal.

- Keep review details on the PR, where the code context and review threads live.
- Keep the issue lifecycle compact. If accepted fixes are being worked, the issue can move back to
  `In Progress`; once the author believes the PR is reviewable again, it can return to `In Review`.
- Add or recommend `revision-needed` when review found accepted or pending actionable work that must
  be addressed before merge.
- Remove or recommend removing `revision-needed` only after accepted review items are fixed,
  deferred with owner/boundary/removal condition, or rejected with evidence.
- Do not use `revision-needed` for taste-only comments, speculative feedback, or unresolved
  discussion that does not require a concrete change.

## Loop Stop Conditions

After this step, stop and hand off instead of silently choosing another workflow verb when:

- human decision needed;
- no ready item exists;
- PR is waiting for human merge;
- validation cannot run;
- architecture fork detected;
- next workflow verb changes.

## Output

Return:

```md
## Findings

## AWK State update

## Architecture concerns

## Test gaps

## Feedback loop / test seam

## Naming issues

## Scope drift

## Review triage

Accepted:
Deferred:
Rejected:
Taste-only:

## Revision signal

## Suggested fixes

## Taste-only notes

## Validation still needed
```

## Rules

- Treat review feedback as evidence, not commands.
- Ground findings in file and line references where possible.
- Reject speculative or over-broad feedback.
- Do not ask for broad refactors unless the current change created or exposed real risk.
- Do not duplicate PR review state outside the PR when a label is enough.
