---
name: breakdown-issue
description: Decompose an accepted work item, spec, ADR, spike result, initiative, or groomed direction into independent merge-safe child work items. Use when the user says "break this down", "create tasks", "make sub-issues", "orchestrate this work", or when accepted direction must become one-agent/one-worktree/one-PR tasks before implementation.
---

# Breakdown Work Item

You are the orchestration step between accepted direction and implementation. Do not write production
code. Decompose work until each resulting child work item can be handled by one agent in one branch
or worktree and one PR.

A work item can be a repo-local Markdown record, a GitHub issue, or another tracker entry. Treat
repo-local records under `docs/development/work-items/` as the portable default when no external
tracker is required. Scratch notes and tool output are evidence until a human or explicit workflow
promotes them into a durable work item.

## Core Stance

- Breakdown is the task factory after grooming, spec, ADR, spike, or direct direction is accepted.
- Breakdown protects parallel execution.
- Every child work item needs a clear parent, owned area, allowed files, forbidden files,
  acceptance criteria, feedback loop or test seam, validation command, and merge-risk
  classification.
- Do not mark implementation work `Ready` until child work item boundaries are clear enough for
  autonomous work.
- Do not hide architecture decisions inside task splitting. If decomposition exposes a real fork,
  send the work back to grooming, spec, ADR, or spike.
- Prefer fewer well-shaped child work items over many tiny noisy tasks.
- Prefer merge-safe ownership boundaries over superficial equal sizing.

## Inputs To Read

Read the parent work item and all accepted source artifacts before proposing child work items:

- Accepted spec, ADR, spike result, or groomed direction.
- Parent goal, non-goals, acceptance criteria, and discussion.
- Relevant source docs or code references.
- Known ownership boundaries, public surfaces, contracts, storage, or migrations.
- Existing open work items, issues, or PRs in the same area when available.

## Breakdown Process

1. Restate the parent outcome and non-goals.
2. Identify owned areas and shared surfaces.
3. Identify sequencing constraints and merge-conflict risks.
4. Split the work into child work items that each have one primary owner area.
5. Assign each child work item a merge-risk value:
   - `Parallel-safe`: isolated or unrelated to other active work.
   - `Needs coordination`: can proceed in parallel with explicit sequencing or communication.
   - `Serial only`: should not run in parallel with related work.
6. Mark child work items that need more clarification as `Grooming`, not `Ready`.
7. Mark executable child work items `Ready` only when they meet the Definition of Ready.

## Definition Of Ready For Child Work Items

Each child work item must have:

- Parent work item link.
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

If any item is missing, the child work item is not ready.

## Merge-Safety Rules

- Do not assign two parallel child work items to edit the same owned module unless the conflict is
  intentional and coordination is explicit.
- If two child work items touch the same public contract, storage shape, migration, shared helper, or
  architecture rule, mark at least one as `Needs coordination` or `Serial only`.
- If a shared utility change becomes architectural, stop and route the decision through grooming,
  spec, or ADR instead of burying it in a child work item.
- If a child work item needs broad repo edits, split by ownership boundary or mark it `Serial only`.
- If one child work item supersedes another implementation path, preserve the original record and
  create a linked child work item instead of rewriting history.

## Parent Work Item Status

Recommend parent status explicitly:

- Keep the parent in `Breakdown` while executable child work items are still being shaped.
- Move child work items to `Ready` when they satisfy the Definition of Ready.
- For an initiative or outcome tracker, keep the parent active while child work items execute.
- For a spec, ADR, or spike whose artifact is accepted and whose implementation work items are
  linked, recommend `Complete` for the artifact work item unless it is also serving as the active
  tracker.
- Use `Blocked` only when a real decision, dependency, access problem, or failed prerequisite stops
  progress.

## Output

Return:

```md
## Parent outcome

## Decomposition strategy

## Merge-safety map

## Proposed child work items

### Work item: ...
Work item type:
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

## Child work items not ready yet

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
