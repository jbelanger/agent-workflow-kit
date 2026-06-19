---
name: breakdown-issue
description: Decompose an accepted spec, ADR, spike result, initiative, or groomed direction into independent merge-safe implementation issues. Use when the user says "break this down", "create tasks", "make sub-issues", "orchestrate this work", or when accepted direction must become one-agent/one-worktree/one-PR tasks before implementation.
---

# Breakdown Issue

You are the orchestration step between accepted direction and implementation. Do not write production
code. Decompose work until each resulting task can be handled by one agent in one branch or worktree
and one PR.

## Core Stance

- Breakdown protects parallel execution.
- Every implementation task needs a clear parent, owned area, allowed files, forbidden files,
  acceptance criteria, feedback loop or test seam, validation command, and merge-risk
  classification.
- Do not mark implementation work `Ready` until task boundaries are clear enough for autonomous
  work.
- Do not hide architecture decisions inside task splitting. If decomposition exposes a real fork,
  send the work back to grooming, spec, ADR, or spike.
- Prefer fewer well-shaped tasks over many tiny noisy tasks.
- Prefer merge-safe ownership boundaries over superficial equal sizing.

## Inputs To Read

Read the parent issue and all accepted source artifacts before proposing tasks:

- Accepted spec, ADR, spike result, or groomed direction.
- Parent issue goal, non-goals, acceptance criteria, and discussion.
- Relevant source docs or code references.
- Known ownership boundaries, public surfaces, contracts, storage, or migrations.
- Existing open issues or PRs in the same area when available.

## Breakdown Process

1. Restate the parent outcome and non-goals.
2. Identify owned areas and shared surfaces.
3. Identify sequencing constraints and merge-conflict risks.
4. Split the work into tasks that each have one primary owner area.
5. Assign each task a merge-risk value:
   - `Parallel-safe`: isolated or unrelated to other active work.
   - `Needs coordination`: can proceed in parallel with explicit sequencing or communication.
   - `Serial only`: should not run in parallel with related work.
6. Mark tasks that need more clarification as `Grooming`, not `Ready`.
7. Mark executable tasks `Ready` only when they meet the Definition of Ready.

## Definition Of Ready For Child Tasks

Each child task must have:

- Parent issue link.
- Goal.
- Non-goals.
- Source docs or code.
- Owned area or module.
- Allowed files or directories.
- Forbidden files or directories.
- Contracts, records, APIs, storage, or user surfaces touched.
- Acceptance criteria.
- Feedback loop or test seam.
- Required tests.
- Validation command.
- Merge-risk classification.
- Human decisions resolved, or clearly marked as required.

If any item is missing, the child task is not ready.

## Merge-Safety Rules

- Do not assign two parallel tasks to edit the same owned module unless the conflict is intentional
  and coordination is explicit.
- If two tasks touch the same public contract, storage shape, migration, shared helper, or
  architecture rule, mark at least one as `Needs coordination` or `Serial only`.
- If a shared utility change becomes architectural, stop and route the decision through grooming or
  ADR instead of burying it in a task.
- If a task needs broad repo edits, split by ownership boundary or mark it `Serial only`.
- If one task supersedes another implementation path, preserve the original issue and create a
  linked sub-issue instead of rewriting history.

## Parent Status

Recommend parent status explicitly:

- Keep the parent in `Breakdown` while executable child tasks are still being shaped.
- Move child tasks to `Ready` when they satisfy the Definition of Ready.
- For an initiative or outcome tracker, keep the parent active while child tasks execute.
- For a spec, ADR, or spike whose artifact is accepted and whose implementation tasks are linked,
  recommend `Complete` for the artifact issue unless it is also serving as the active tracker.
- Use `Blocked` only when a real decision, dependency, access problem, or failed prerequisite stops
  progress.

## Output

Return:

```md
## Parent outcome

## Decomposition strategy

## Merge-safety map

## Proposed child tasks

### Task: ...
Issue type:
Status:
Parent:
Goal:
Non-goals:
Source docs/code:
Owned area:
Allowed files:
Forbidden files:
Contracts/APIs/storage touched:
Acceptance criteria:
Feedback loop / test seam:
Required tests:
Validation command:
Merge risk:
Sequencing notes:
Human decision needed:

## Tasks not ready yet

## Parent status recommendation

## Open questions
```

Ask at most one clarification question at a time. Include options, a recommendation, and why the
answer matters.

## Test-Drive Feedback

This workflow is being dogfooded. If you notice process friction while using this skill, include a
brief `Process feedback` note in your reply, issue comment, or PR summary. Mention confusing
instructions, missing fields, too much ceremony, unsafe autonomy, merge-safety gaps, or ideas that
would make the workflow easier to use.
