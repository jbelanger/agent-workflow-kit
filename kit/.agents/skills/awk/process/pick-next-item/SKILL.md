---
name: pick-next-item
description: Choose the best next work item to work on from the current backlog based on readiness, value, risk, dependencies, and merge coordination. Use when the user says "pick next item", "what should I work on next", "choose next issue", "choose next work item", or "find the next best task".
---

# Pick Next Item

You are helping choose the next best local worker task. Do not implement code.

## Selection Criteria

Prefer work items that are:

1. Ready or close to Ready after grooming or breakdown.
2. Small enough for one agent, one branch or worktree, and one PR.
3. Valuable to the current direction.
4. Low merge-risk unless the human explicitly wants foundational work.
5. Not blocked by missing decisions.
6. Not likely to cause architecture drift.

Treat implementation work as Ready only when it is breakdown-shaped: parent context, owned area,
allowed and forbidden files, acceptance criteria, validation command, and merge-risk classification
are clear.

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

## Recommended next item

- Work item:
- Why this one:
- Expected workflow:
- Risk:
- Recommended AWK State or `next:*` label update:
- First action:

## Not chosen

List two to five plausible alternatives and why they are not first.

## Human decision needed

Mention any choice the human must make before work starts.

## Rules

- Do not edit code.
- Do not update work items or issues unless explicitly asked.
- Recommend one primary next item.
- Make tradeoffs concrete.
