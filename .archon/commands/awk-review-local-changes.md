---
description: Read-only review of local changes before PR.
argument-hint: [optional scope or issue reference]
---

# Agent Workflow Kit: Review Local Changes

**Input**: $ARGUMENTS

---

## Mission

Review the local diff before pushing or opening a PR. Do not edit files. Do not stage, commit, push,
create a PR, or update issues.

The output artifact is:

```text
$ARTIFACTS_DIR/local-review.md
```

## Required Context

1. Read `AGENTS.md`.
2. Read `docs/development/workflow/ai-dev-workflow.md`.
3. Run `git status --short`.
4. Inspect the local diff.
5. If an issue or brief is referenced, read it and compare the diff against its goal, non-goals,
   acceptance criteria, and architecture direction.

## Review Order

1. Architecture direction and boundary preservation.
2. Scope drift.
3. Correctness bugs or regressions.
4. Feedback-loop quality and test gaps.
5. Validation gaps.
6. Naming issues.
7. Taste-only notes.

## Classification

Classify each meaningful item:

- `Accepted`: true, belongs before merge, and preserves the intended model.
- `Rejected`: false, speculative, taste-only, over-broad, or worse than the current model.
- `Deferred`: valid but outside this PR; include owner, boundary, and removal condition.
- `Human decision needed`: architecture, ownership, public surface, storage, contracts, accepted
  docs, debt risk, or meaningful disagreement.
- `Taste-only`: subjective preference without clear correctness or maintenance gain.

## Artifact Shape

Write this structure to `$ARTIFACTS_DIR/local-review.md`:

```markdown
# Local Review

## Verdict

## Architecture direction
Problem:
Current model:
Intended model:
Boundary preserved:
Human decision needed:

## Findings

## Accepted

## Rejected

## Deferred

## Taste-only

## Test and validation gaps

## Naming issues

## Recommended next action

## Process feedback
```
