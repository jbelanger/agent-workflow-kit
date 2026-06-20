---
description: Read-only preflight before one scoped implementation pass.
argument-hint: <issue-number|issue-url|implementation-brief-path|description>
---

# Agent Workflow Kit: Implementation Preflight

**Input**: $ARGUMENTS

---

## Mission

Run the Archon-only safety gate before code-changing work. Do not edit files. Do not stage, commit,
push, open a PR, or update issues.

## Adapter Boundary

This command is an Archon adapter around the portable implementation rules. It exists because the
`awk-work-issue-local` workflow needs deterministic `READY`, `STOP`, and `NEEDS_DECISION` routing
before the approval node.

1. Read `AGENTS.md`.
2. Read `docs/development/workflow/ai-dev-workflow.md`.
3. Read `.agents/skills/process/prepare-implementation/SKILL.md`.
4. Read `.agents/skills/process/work-issue-local/SKILL.md`.
5. Read the issue or implementation brief named by `$ARGUMENTS`.
6. Inspect `git status --short`.
7. Inspect only the source files needed to verify the planned boundary and test seam.
8. Decide whether implementation may proceed after human approval.
9. Write the artifact.
10. Return the final structured JSON response.

The output artifact path is:

```text
$ARTIFACTS_DIR/implementation-preflight.md
```

## Routing Status

Return `STOP` if implementation must not proceed because the work is not ready or the local state is
unsafe, and no architecture decision would make this run safe as-is:

- The issue is not Ready.
- Allowed/forbidden files are unclear.
- Validation cannot be run or interpreted.
- The working tree has unrelated changes that overlap the task.

Return `NEEDS_DECISION` if implementation must not proceed because a human decision is missing:

- The implementation would silently choose architecture direction.
- Public API, ownership, storage, migration, or long-term abstraction changes need human choice.
- The change would require compatibility bridges, aliases, fallback paths, or migration shims not
  explicitly approved.

Return `READY` only if implementation may proceed after human approval.

## Artifact Shape

Write this structure to `$ARTIFACTS_DIR/implementation-preflight.md`:

```markdown
# Implementation Preflight

## Proceed after approval
YES/NO:
Status: READY/STOP/NEEDS_DECISION
Reason:
Decision needed:
Artifact path: $ARTIFACTS_DIR/implementation-preflight.md

## Goal

## Non-goals

## Owned area

## Allowed files

## Forbidden files

## Architecture direction check
Problem:
Current model:
Intended model:
Ownership boundary:
Public surfaces / contracts / storage touched:
Alternatives:
Cheap/minimal shortcuts rejected:
Human decision needed:

## Feedback loop / test seam

## Validation command

## Merge risk

## Git state

## Approval note
```

If `Proceed after approval` is `NO`, the approval note must tell the human what decision or evidence
is missing.

## Final Response

After writing `$ARTIFACTS_DIR/implementation-preflight.md`, your final assistant response must be
JSON only. Do not include Markdown fences, prose, headings, or commentary outside the JSON.

Use this exact object shape:

```json
{
  "status": "READY",
  "reason": "Implementation can proceed after human approval.",
  "decision_needed": "",
  "artifact_path": "$ARTIFACTS_DIR/implementation-preflight.md"
}
```

Rules:

- `status` must be exactly `READY`, `STOP`, or `NEEDS_DECISION`.
- `reason` must briefly explain the status.
- `decision_needed` must be an empty string unless status is `NEEDS_DECISION`.
- `artifact_path` must be `$ARTIFACTS_DIR/implementation-preflight.md`.
