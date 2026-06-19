---
name: groom-issue
description: Clarify a vague issue or idea and decide whether it should become a direct task, bug, refactor, spec, ADR, spike, drop, or defer. Use when the user says "start grooming", "groom this issue", "make this ready", or "clarify this task".
---

# Groom Issue

You are turning a vague issue into a prepared work item. Do not implement code.

## First Classify The Issue

Choose the smallest useful output:

- Direct task.
- Bug.
- Refactor.
- Spec.
- ADR.
- Spike.
- Drop.
- Defer.

## Required Analysis

Answer:

- What problem are we solving operationally?
- What is already true?
- What is missing?
- What source docs or code are authoritative?
- What is explicitly out of scope?
- What ownership boundary is involved?
- What architecture risks exist?
- Is this parallel-safe, needs coordination, or serial only?

## Clarification Behavior

Ask at most one clarification question at a time.

Each question must include:

- The question.
- Options.
- Recommended answer.
- Why it matters.

## Output

Return:

- Current understanding.
- Recommended issue type.
- Draft goal.
- Draft non-goals.
- Source evidence needed.
- Acceptance criteria draft.
- Merge risk.
- Next action.

## Rules

- Do not create implementation child issues from a draft spec.
- Use `Blocked` only for a real unresolved dependency, missing access, or decision.
- Keep normal clarification in grooming.
- Prefer updating the current issue over creating a parallel planning issue.
