# ARCHON-SPIKE-012: Continue Work Routing

Status: complete

## Question

Can Archon implement `continue work` by checking active runs first, then canonical planning state?

## Setup

This was a docs/source spike only. I inspected the current `agent-workflow-kit` Archon route tracker,
the repo-local `.archon` workflows, and Archon's workflow command, database, and Web UI docs/source.
No Archon server was started and no workflow was run.

Relevant current kit files:

- `docs/development/workflow/archon-route-tracker.md`
- `.archon/workflows/awk-prepare-implementation.yaml`
- `.archon/workflows/awk-work-issue-local.yaml`
- `.archon/workflows/awk-review-local-changes.yaml`

Relevant Archon evidence:

- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/reference/commands.md:29`
- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/reference/database.md:93`
- `/Users/joel/Dev/Archon/packages/core/src/handlers/command-handler.ts:654`
- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/adapters/web.md:116`

## Evidence

Archon already exposes deterministic workflow control commands:

- `/workflow status`
- `/workflow cancel`
- `/workflow resume <id>`
- `/workflow abandon <id>`
- `/workflow approve <id> [comment]`
- `/workflow reject <id> [reason]`
- `/workflow run <name> [args]`

The command reference lists those as deterministic workflow commands in
`/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/reference/commands.md:29`.

The implementation of `/workflow status` calls `getWorkflowStatus()`, prints active run name,
status, id, path, and start time, then points running users to cancel and paused users to
approve/reject. That is enough runtime state for the first half of `continue work`:

```text
active runs?
  running -> report status / allow cancel
  paused -> summarize approval gate / ask for approve or reject
  failed or resumable -> route resume/recovery
```

Source: `/Users/joel/Dev/Archon/packages/core/src/handlers/command-handler.ts:654`.

Archon's database has explicit workflow run and workflow event tables. The workflow runs table tracks
active workflows, locks concurrent execution by working path, stores workflow state and step
progress, and records the parent conversation. The events table records step transitions, artifacts,
and errors for dashboard/detail views. That makes Archon a good runtime state source.

Source: `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/reference/database.md:93`.

The Web UI also exposes this runtime state. It can run workflows, display current status, expose
Approve/Reject for paused approval gates, show result cards, and open run detail pages with DAG
status, logs, artifacts, and resume/cancel/abandon actions.

Source: `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/adapters/web.md:116`.

The missing half is canonical planning state. Archon can tell us whether work is active, paused,
failed, or complete, but the route tracker intentionally says accepted planning state must live in
repo docs, skills, GitHub issues/PRs, or a future ledger, not in Archon's DB/artifacts. Therefore
`continue work` must not stop after "no active workflow." It must then read canonical planning
state and choose one of our kit verbs.

## Result

Conditional.

Archon has enough run-state machinery for the first stage of `continue work`, but the full workflow
is only acceptable if the second stage reads a repo-visible or GitHub-visible planning source instead
of treating Archon's DB, conversations, or artifacts as the backlog.

## What This Means For Agent Workflow Kit

`awk-continue-work` should be a thin router, not a planner. The minimum acceptable behavior is:

```text
continue work
  -> inspect active Archon runs
  -> if running: report workflow, status, id, path, and next safe command
  -> if paused: report gate, artifact/run context, and ask for approve/reject
  -> if failed/resumable: report failure summary and route recovery/resume
  -> if no active run: inspect canonical planning state
  -> choose one read-only workflow by default:
       awk-prepare-implementation
       awk-review-local-changes
       triage/groom route if no ready work exists
  -> require approval before any mutating workflow
```

The router should prefer deterministic Archon commands or scripts for the active-run inspection.
The AI should only make judgment calls after the runtime state and canonical planning state are both
loaded into an explicit artifact.

The canonical planning read is the unresolved design point. It should be one of:

- GitHub issues/project fields.
- A repo-local planning ledger.
- A hybrid where GitHub anchors collaboration and the ledger keeps local deterministic state.

It should not be:

- Archon's `remote_agent_workflow_runs`.
- Archon's conversations/messages.
- `$ARTIFACTS_DIR` files that have not been promoted.

## Follow-Up Work

- Complete ARCHON-SPIKE-009 before implementing this, because the run-store/dashboard boundary needs
  a source-of-truth checklist.
- Complete ARCHON-SPIKE-013 before enabling automatic promotion from run artifacts to issue comments
  or repo docs.
- Implement `awk-continue-work` against the accepted ARCHON-003 portable planning surfaces.
- Add a recovery runbook for the failed/paused paths so the router can link to a durable procedure
  instead of improvising.
