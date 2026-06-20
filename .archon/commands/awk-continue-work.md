---
description: Route the next safe workflow step from Archon runtime state and portable planning state.
argument-hint: [optional goal, issue, PR, or context]
---

# Agent Workflow Kit: Continue Work

**Input**: $ARGUMENTS
**Runtime state**: $runtime-state.output

---

## Mission

Decide the next safe workflow step for this repository. This is a read-only router. Do not edit
files. Do not stage, commit, push, open a PR, update issues, approve runs, reject runs, cancel runs,
resume runs, or start another workflow.

## Adapter Boundary

This command is an Archon adapter, not a second source of process truth.

1. Read `AGENTS.md`.
2. Read `docs/development/workflow/ai-dev-workflow.md`.
3. Read `docs/development/workflow/adr-archon-portable-skills.md`.
4. Read `docs/development/workflow/archon-route-tracker.md`.
5. Read `docs/development/workflow/archon-recovery-runbook.md`.
6. Read the relevant portable skill only after choosing the likely verb:
   - `.agents/skills/process/pick-next-item/SKILL.md`
   - `.agents/skills/process/groom-issue/SKILL.md`
   - `.agents/skills/process/prepare-implementation/SKILL.md`
   - `.agents/skills/process/work-issue-local/SKILL.md`
   - `.agents/skills/process/review-local-changes/SKILL.md`
7. Use this command only to enforce the Archon artifact path and artifact shape below.

The output artifact path is:

```text
$ARTIFACTS_DIR/continue-work.md
```

## Routing Rules

Use `$runtime-state.output` first. Ignore the current `awk-continue-work` run if it appears in
runtime state.

If another Archon run is active:

- `running`: recommend waiting, checking status, or cancelling only if unsafe.
- `paused`: summarize the approval gate and recommend inspect/approve/reject using the Web UI or CLI.
- `failed`: summarize the failure and route to `docs/development/workflow/archon-recovery-runbook.md`.

If no other Archon run is active:

1. Inspect `git status --short`.
2. If there are local changes, recommend `awk-review-local-changes` before new implementation work.
3. If `$ARGUMENTS` names a specific issue, PR, brief, or goal, recommend the narrowest matching
   workflow verb.
4. If no specific target is supplied, inspect the route tracker and recommend the next open,
   read-only workflow step.
5. Recommend `awk-work-issue-local` only when the next step is already prepared and it will still go
   through preflight and human approval.
6. If the next step would decide architecture, ownership, board policy, public surface, storage, or
   permission posture, return `HUMAN_DECISION`.

## Artifact Shape

Write this structure to `$ARTIFACTS_DIR/continue-work.md`:

```markdown
# Continue Work Route

## Runtime state
Other active run:
Run id:
Workflow:
Status:
Working path:
Recovery action:

## Planning state
Current branch:
Git state:
Portable sources read:
Relevant tracker item:
Human decision needed:

## Recommended route
Status:
Workflow:
Command:
Mutating:
Approval required:
Reason:

## Evidence

## Next operator action

## Process feedback
```

`Status` must be one of:

- `RUNNING`
- `PAUSED`
- `FAILED_RECOVERY`
- `REVIEW_LOCAL_CHANGES`
- `PREPARE_IMPLEMENTATION`
- `WORK_ISSUE_LOCAL`
- `GROOM_OR_TRIAGE`
- `HUMAN_DECISION`
- `NO_ACTION`

In the final response, include the artifact path, status, recommended command, and whether the next
step is mutating.
