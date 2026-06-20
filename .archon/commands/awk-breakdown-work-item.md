---
description: Break accepted direction into merge-safe child work items without implementing.
argument-hint: <work-item|issue|spec|ADR|spike|description>
---

# Agent Workflow Kit: Breakdown Work Item

**Input**: $ARGUMENTS

---

## Mission

Run the portable `breakdown-issue` workflow verb inside Archon. Do not edit production code. Do not
create a branch, commit, PR, issue, or repo-local work item unless the user explicitly asked for
that outside this workflow.

## Adapter Boundary

This command is an Archon adapter, not a second source of process truth.

1. Read `AGENTS.md`.
2. Read `docs/development/workflow/ai-dev-workflow.md`.
3. Read `.agents/skills/process/breakdown-issue/SKILL.md`.
4. Read any accepted source artifacts referenced by `$ARGUMENTS`: repo-local work items, GitHub
   issues, specs, ADRs, spikes, implementation notes, or tracker entries.
5. Follow the `breakdown-issue` skill as the owning procedure.
6. Use this command only to enforce the Archon artifact path and artifact shape below.

The output artifact path is:

```text
$ARTIFACTS_DIR/breakdown-work-item.md
```

## Artifact Shape

Write this structure to `$ARTIFACTS_DIR/breakdown-work-item.md`:

```markdown
# Breakdown Work Item

## Parent outcome

## Source artifacts read

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
Allowed files/directories:
Forbidden files/directories:
Contracts/APIs/storage/user surfaces touched:
Acceptance criteria:
Feedback loop / test seam:
Required tests:
Validation command:
Merge risk:
Sequencing notes:
Human decision needed:

## Child work items not ready yet

## Parent status recommendation

## Human decision needed

## Next action

## Process feedback
```

`## Human decision needed` must be `YES` or `NO`, followed by a short reason.

If no executable child work item should be created yet, explain the missing accepted direction and
route back to the next workflow verb: `groom-issue`, spec, ADR, spike, or human decision.

In the final response, include the artifact path, number of proposed child work items, parent status
recommendation, and whether a human decision is needed.
