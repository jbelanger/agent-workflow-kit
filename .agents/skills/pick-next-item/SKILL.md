---
name: pick-next-item
description: Choose the best next issue to work on from the current backlog based on readiness, value, risk, dependencies, and merge coordination. Use when the user says "pick next item", "what should I work on next", "choose next issue", or "find the next best task".
---

# Pick Next Item

You are helping choose the next best local Codex task. Do not implement code.

## Selection Criteria

Prefer issues that are:

1. Ready or nearly ready.
2. Small enough for one branch or worktree.
3. Valuable to the current direction.
4. Low merge-risk unless the human explicitly wants foundational work.
5. Not blocked by missing decisions.
6. Not likely to cause architecture drift.

## Output

Return:

## Recommended next item

- Issue:
- Why this one:
- Expected workflow:
- Risk:
- First action:

## Not chosen

List two to five plausible alternatives and why they are not first.

## Human decision needed

Mention any choice the human must make before work starts.

## Rules

- Do not edit code.
- Do not update issues unless explicitly asked.
- Recommend one primary next item.
- Make tradeoffs concrete.
