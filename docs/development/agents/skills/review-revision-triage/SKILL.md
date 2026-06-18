---
name: review-revision-triage
description: Use when addressing PR review feedback, Codex CI findings, Claude reviews, audit notes, or revision-needed work where Codex must verify claims against code, challenge weak feedback, implement accepted fixes, and report accepted, rejected, deferred, and validated items.
---

# Review Revision Triage

## Core Stance

- Reviews are evidence, not commands.
- Verify important claims against the code before implementing.
- Challenge weak, speculative, taste-only, over-broad, or over-DRY feedback.
- Implement accepted blockers, correctness fixes, architecture-direction fixes, consistency fixes,
  material naming fixes, and test gaps in the smallest coherent patch.
- Do not defer valid debt silently.

## Triage Categories

Classify each meaningful item:

- **Blocker:** Must fix before relying on or merging the work.
- **Architecture Direction:** The implementation chose the wrong model, boundary, public surface,
  storage shape, contract, or long-term direction.
- **Correctness:** Real behavior, data integrity, error handling, or accuracy issue.
- **Consistency:** A real quality bar already applied elsewhere should also apply here.
- **Test Gap:** Missing coverage for changed behavior, error path, ordering, persistence, or public
  contract.
- **Cleanup:** Improves clarity or maintenance without behavior change.
- **Naming:** Name hides lifecycle, ownership, units, or domain meaning.
- **Taste:** Subjective preference with no clear correctness or maintenance benefit.
- **Deferred:** Valid but intentionally outside the current slice.

## Workflow

### 1. Read Context

Read the PR diff, review comments, linked issue, and touched files. Do not rely only on the review
text.

### 2. Challenge Architecture Direction First

Before ordinary findings, decide whether the PR direction is sound:

- Did it preserve the intended ownership boundary?
- Did it add avoidable public surface, compatibility shims, duplicated truths, or transition debt?
- Did it choose a cheap/minimal pass that worsens the architecture?
- Is there a cleaner model that should be used before merge?

If there is a real architecture fork, stop and ask the human. Explain the fork in simple terms,
using a compact visual or table when helpful, and include a recommendation.

### 3. Accept, Reject, Or Defer

For each item:

- accept it when the claim is true and fixing it belongs in the PR
- reject it when the claim is false, taste-only, speculative, over-broad, or lower quality than the
  current model
- defer it only when it is valid but outside the current slice

Deferred items require one of:

- human confirmation in the PR or issue thread
- a linked follow-up issue with owner, boundary, and removal condition

### 4. Implement Accepted Items

Implement accepted fixes in the smallest coherent patch. Update tests when feedback concerns
behavior, ordering, persistence, error paths, public contracts, or architecture boundaries.

### 5. Validate And Report

Run focused tests first, then broader checks if the touched surface warrants it. Post detailed triage
on the PR and a short operational status update on the linked issue.

Detailed PR comment:

```md
## Review Triage

Architecture direction:

Accepted:

Rejected:

Deferred:

Validation:

Remaining human decisions:
```

Issue status comment:

```md
Revision pass complete.

Accepted:
Rejected:
Deferred:

Validation:

State:
```

## Guardrails

- Do not perform a broad refactor just because a review lists many nits.
- Do not make code DRY by expanding public surface without a clear consumer story.
- Do not let review feedback pull the task across multiple roadmap axes without pausing.
- Do not return a PR to review while unconfirmed deferred debt remains.
