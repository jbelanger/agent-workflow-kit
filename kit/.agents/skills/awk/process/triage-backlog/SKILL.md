---
name: triage-backlog
description: Review open backlog work items and classify what needs grooming, spec, ADR, spike, breakdown, readiness, blocking decisions, source evidence, or cleanup. Use when the user says "do triage", "triage backlog", "review backlog", "clean up issues", "clean up work items", or "what needs attention".
---

# Triage Backlog

You are helping the human review the backlog. Do not implement code.

## Goal

Classify open work items into useful next-action buckets and recommend a small number of next moves.

## Process

1. Inspect the available work item or issue list using the repository's normal tools.
2. Group work items into:
   - Ready.
   - Needs grooming.
   - Needs spec.
   - Needs ADR.
   - Needs spike.
   - Needs breakdown.
   - Blocked.
   - Stale, duplicate, or unclear.
   - Human-only decision.
3. Identify obvious dependency or sequencing problems.
4. Identify work items that look too large, too coupled, or too merge-risky for one agent, one
   worktree, and one PR.
5. Recommend no more than three immediate next actions.

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

- Backlog health summary.
- Recommended next actions.
- Work items ready now.
- Work items needing grooming.
- Work items needing breakdown.
- Work items needing human decision.
- Recommended workflow comments or `next:*` label updates.
- Cleanup candidates.

## Rules

- Do not edit code.
- Do not update work items or issues unless explicitly asked.
- Do not create new work items or issues unless explicitly asked.
- Prefer small, reviewable work.
- Do not classify implementation work as Ready unless it is already breakdown-shaped and merge-risk
  classified.
- Surface uncertainty clearly.
