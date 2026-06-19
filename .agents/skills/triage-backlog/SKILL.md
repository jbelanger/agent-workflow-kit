---
name: triage-backlog
description: Review open backlog issues and classify what needs grooming, readiness, blocking decisions, source evidence, or cleanup. Use when the user says "do triage", "triage backlog", "review backlog", "clean up issues", or "what needs attention".
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
   - Blocked.
   - Stale, duplicate, or unclear.
   - Human-only decision.
3. Identify obvious dependency or sequencing problems.
4. Identify issues that look too large for one local Codex session.
5. Recommend no more than three immediate next actions.

## Output

Return:

- Backlog health summary.
- Recommended next actions.
- Issues ready now.
- Issues needing grooming.
- Issues needing human decision.
- Cleanup candidates.

## Rules

- Do not edit code.
- Do not update issues unless explicitly asked.
- Do not create new issues unless explicitly asked.
- Prefer small, reviewable work.
- Surface uncertainty clearly.
