# ARCHON-SPIKE-014: Recovery From Failed Or Paused Runs

Status: complete

## Question

Can a human recover from paused, failed, cancelled, or abandoned Archon runs without chat memory?

## Setup

Docs/source spike only. No Archon server was started and no workflow runs were created.

## Evidence

Archon exposes deterministic workflow-control commands:

```text
/workflow status
/workflow cancel
/workflow resume <id>
/workflow abandon <id>
/workflow approve <id> [comment]
/workflow reject <id> [reason]
```

Ref: `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/reference/commands.md:29`.

`/workflow status` reports active workflow name, status, id, working path, and start time, then
points users to cancel running runs or approve/reject paused runs.

Ref: `/Users/joel/Dev/Archon/packages/core/src/handlers/command-handler.ts:654`.

Approval nodes persist paused status and approval context, then wait for approval or rejection.
Paused runs block the worktree path guard, and approve/reject resumes or cancels through explicit
workflow operations.

Ref: `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/guides/approval-nodes.md:48`.

The Web UI exposes run status, paused Approve/Reject buttons, result cards, artifact links, execution
detail pages, logs, DAG node status, and resume/cancel/abandon actions.

Ref: `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/adapters/web.md:132`.

## Result

Pass with a repo-doc requirement.

Archon appears to have enough primitives for recovery without chat memory, but this kit still needs a
repo-visible runbook that tells humans which Archon command to use for each state and what state must
be promoted back into repo/GitHub truth.

CLI dogfood later confirmed:

- Approval and rejection can resolve paused approval gates.
- A failed run whose first node failed has no completed-node resume point.
- `abandon` rejects already-terminal failed runs.
- Recovery for that class is inspect DB/log/artifact state, record the cause, and rerun from
  canonical source state after the workflow issue is fixed.

## What This Means For Agent Workflow Kit

Recommended recovery decision table:

| Run State | Human Action | Durable Follow-Up |
| --- | --- | --- |
| running | `/workflow status`; wait or `/workflow cancel` if unsafe | None unless the run produced useful artifacts |
| paused at approval | inspect artifact and run path; approve or reject with reason | Promote accepted decision only if it changes issue/doc/ledger truth |
| failed | inspect detail page/logs/artifacts; `/workflow resume <id>` only if cause is understood | Record failure cause if it changes workflow policy |
| cancelled | inspect whether cancellation was intentional; rerun only from canonical planning state | Do not treat partial artifacts as accepted truth |
| abandoned | treat as discarded runtime state | Preserve useful evidence manually before cleanup |

`continue work` should link to this runbook when it finds active, paused, failed, or stale runs.

## Follow-Up Work

- Created `docs/development/workflow/archon-recovery-runbook.md` as a stub before
  background/GitHub-triggered workflows become normal.
- CLI approval, rejection, and failed-run recovery are dogfooded in this route; Web UI and GitHub
  comment surfaces remain future recovery documentation.
- Add artifact-promotion guidance from ARCHON-SPIKE-013.
