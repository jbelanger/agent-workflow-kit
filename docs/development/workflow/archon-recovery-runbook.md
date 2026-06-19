# Archon Recovery Runbook

Status: stub

Use this when an Archon run is active, paused, failed, cancelled, or stale and the next step must be
recoverable without chat memory.

## Rule

Recover from observable state, not from conversation memory.

Start with:

1. Archon run status.
2. The run worktree path.
3. The run artifact directory.
4. Canonical repo or GitHub planning state.

Archon runtime state is evidence. It is not accepted planning truth until a human or accepted workflow
promotes it into repo docs, issues, PRs, or a future planning ledger.

## Local Commands

Verified CLI commands for the local route:

```bash
archon workflow status --cwd /Users/joel/Dev/agent-workflow-kit
archon isolation list --cwd /Users/joel/Dev/agent-workflow-kit
```

Known workflow-control primitives from Archon source/docs:

```text
/workflow status
/workflow cancel
/workflow resume <id>
/workflow abandon <id>
/workflow approve <id> [comment]
/workflow reject <id> [reason]
```

Treat Web UI and GitHub-comment controls as future documentation until this kit has dogfooded those
surfaces.

## Recovery Table

| Run State | Human Action | Durable Follow-Up |
| --- | --- | --- |
| running | Check `archon workflow status`; wait if expected, cancel if unsafe. | None unless artifacts change accepted repo/GitHub truth. |
| paused at approval | Inspect the preflight or review artifact, worktree diff, and approval message. Approve only if scope and validation are still acceptable. | Record the accepted decision only if it changes docs, issue readiness, or architecture direction. |
| failed | Inspect the failed node, logs, artifacts, and worktree status. Resume only when the cause is understood. | Capture workflow bugs or process gaps in tracker docs or issues. |
| cancelled | Confirm whether cancellation was intentional. Rerun only from canonical planning state. | Do not treat partial artifacts as accepted truth. |
| abandoned | Treat the run as discarded runtime state. | Preserve useful evidence manually before cleanup, then remove stale worktree state when safe. |

## Artifact Handling

- Preflight, review, and implementation artifacts are evidence by default.
- Promote only the parts that are accepted into repo docs, issues, PRs, or a future ledger.
- Do not promote architecture decisions, Definition of Ready changes, artifact summaries, or review
  classifications automatically.
- If artifacts disagree with source docs, source docs win until explicitly changed.

## Worktree Checks

Before approving a mutating run:

1. Confirm the worktree contains the source docs, scripts, and files named by the brief.
2. Confirm `git status --short` does not include unrelated overlapping changes.
3. Confirm validation commands named by the brief exist in that worktree.
4. Confirm the workflow is based on the intended branch or source-complete commit.

If the worktree is missing route docs, validator scripts, or tracker files, reject or cancel and
rerun from a source-complete branch.

## Current Gaps

- CLI approval/rejection ergonomics still need dogfooding.
- Web UI recovery details are source-backed but not locally verified here.
- GitHub comment approval and rejection remain unsafe for mutating workflows until route allowlists,
  approval binding, raw response capture, and provider permissions are settled.
- `continue work` should link here when it finds active, paused, failed, cancelled, or stale Archon
  runs.
