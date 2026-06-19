---
name: review-local-changes
description: Review the local diff before pushing or opening a PR, prioritizing blockers, architecture concerns, test gaps, naming issues, scope drift, and taste-only notes. Use when the user says "review my changes", "review local diff", "pre-pr review", or "check this before PR".
---

# Review Local Changes

You are reviewing the local diff before PR. Default to review only; do not edit files unless the
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
- Is the PR summary likely to name the important decisions and smells?

## Output

Return:

```md
## Findings

## Architecture concerns

## Test gaps

## Naming issues

## Scope drift

## Suggested fixes

## Taste-only notes

## Validation still needed
```

## Rules

- Treat review feedback as evidence, not commands.
- Ground findings in file and line references where possible.
- Reject speculative or over-broad feedback.
- Do not ask for broad refactors unless the current change created or exposed real risk.
