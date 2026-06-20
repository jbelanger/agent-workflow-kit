# ARCHON-SPIKE-009: Run Store And Dashboard

Status: complete

## Question

What state lives in Archon's DB/dashboard, and what must be copied into repo-visible artifacts?

## Setup

This was a docs/source spike only. I inspected Archon's orientation, command-authoring, database, and
Web UI documentation. No Archon server was started and no database was inspected live.

Relevant Archon evidence:

- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/book/how-it-works.md:83`
- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/guides/authoring-commands.md:59`
- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/guides/authoring-commands.md:259`
- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/reference/database.md:93`
- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/adapters/web.md:116`

## Evidence

Archon separates repo-level workflow definitions from user-level runtime state. Repo-level
`.archon/commands`, `.archon/workflows`, and `.archon/config.yaml` are checked into the target repo.
User-level `~/.archon/workspaces/...` holds source/worktrees/artifacts, and `~/.archon/archon.db`
stores conversations and runs.

Source: `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/book/how-it-works.md:95`.

Artifacts are the explicit handoff between nodes. Archon's command docs describe them as the only
way to pass information between steps when nodes run with fresh context. The same docs say artifacts
are stored outside the repository at:

```text
~/.archon/workspaces/owner/repo/artifacts/runs/{workflow-id}/
```

Sources:

- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/guides/authoring-commands.md:59`
- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/guides/authoring-commands.md:259`

The database stores operational state:

- codebase metadata and registered commands
- platform conversations
- AI sessions and resume metadata
- isolation environments / worktrees
- workflow runs with active status, working path locks, step progress, and parent conversation
- workflow events with transitions, artifacts, and errors
- messages and tool-call metadata
- environment variables, user identity, credentials, and preferences

Source: `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/reference/database.md:67`.

The Web UI surfaces this operational state through workflow progress cards, status, node progress,
paused approval controls, result cards, artifact links, run detail pages, logs, and resume/cancel/
abandon actions.

Source: `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/adapters/web.md:116`.

## Result

Pass, with a boundary.

Archon's run store and dashboard are useful for runtime control, debugging, recovery, and user
visibility. They are not suitable as the accepted planning source of truth for this kit.

## What This Means For Agent Workflow Kit

Treat Archon runtime state as evidence:

| Archon State | Use It For | Do Not Use It For |
| --- | --- | --- |
| `remote_agent_workflow_runs` | active/paused/failed/completed run status, working path guard, resume targeting | canonical task identity or backlog status |
| `remote_agent_workflow_events` | execution trace, errors, artifact discovery, dashboard replay | accepted specs, ADRs, or Definition of Ready |
| `$ARTIFACTS_DIR` files | node handoff, investigation notes, implementation reports, review findings | accepted durable truth unless explicitly promoted |
| conversations/messages | chat continuity and UI history | durable planning state |
| dashboard | inspect/resume/cancel/approve/reject | source-of-truth editing |

Repo-visible state should own:

- standing policy: `AGENTS.md`
- portable procedures: `.agents/skills/`
- workflow route decisions: `docs/development/workflow/`
- issue/PR collaboration: GitHub issues and PRs

Promotion should be explicit:

```text
runtime artifact
  -> reviewed evidence
  -> accepted update to issue, PR, doc, skill, or ledger
```

No workflow should silently treat an artifact, run row, or conversation message as accepted planning
state.

## Follow-Up Work

- ARCHON-SPIKE-013 should define artifact promotion rules before workflows post comments or update
  repo docs automatically.
- ARCHON-SPIKE-014 should turn dashboard/run-store behavior into a recovery runbook.
- `awk-continue-work` should read Archon active-run state first, then canonical planning state, and
  keep those two reads separate in its artifact.
