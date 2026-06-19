---
name: triage-backlog
description: Review open backlog issues and classify what needs grooming, spec, ADR, spike, breakdown, readiness, blocking decisions, source evidence, or cleanup. Use when the user says "do triage", "triage backlog", "review backlog", "clean up issues", or "what needs attention".
---

# Triage Backlog

You are helping the human review the backlog. Do not implement code.

## Goal

Classify open issues into useful next-action buckets and recommend a small number of next moves.

## Process

1. Inspect the available issue list using the repository's normal tools.
2. Group issues into:
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
4. Identify issues that look too large, too coupled, or too merge-risky for one agent, one worktree,
   and one PR.
5. Recommend no more than three immediate next actions.

## Output

Return:

- Backlog health summary.
- Recommended next actions.
- Issues ready now.
- Issues needing grooming.
- Issues needing breakdown.
- Issues needing human decision.
- Cleanup candidates.

## Rules

- Do not edit code.
- Do not update issues unless explicitly asked.
- Do not create new issues unless explicitly asked.
- Prefer small, reviewable work.
- Do not classify implementation work as Ready unless it is already breakdown-shaped and merge-risk
  classified.
- Surface uncertainty clearly.

## Test-Drive Feedback

This workflow is being dogfooded. If you notice process friction while using this skill, include a
brief `Process feedback` note in your reply, issue comment, or PR summary. Mention confusing
instructions, missing fields, too much ceremony, unsafe autonomy, merge-safety gaps, or ideas that
would make the workflow easier to use.
