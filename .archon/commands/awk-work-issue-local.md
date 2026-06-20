---
description: Implement one approved, prepared issue locally without merging.
argument-hint: <issue-number|issue-url|implementation-brief-path|description>
---

# Agent Workflow Kit: Work Issue Local

**Input**: $ARGUMENTS
**Approval response**: $approve-scope.output

---

## Mission

Run the portable `work-issue-local` workflow verb inside Archon after preflight and approval.
Preserve behavior unless the issue explicitly changes it. Do not merge.

## Adapter Boundary

This command is an Archon adapter, not a second source of process truth.

1. Read `AGENTS.md`.
2. Read `docs/development/workflow/ai-dev-workflow.md`.
3. Read `.agents/skills/process/work-issue-local/SKILL.md`.
4. Read `$ARTIFACTS_DIR/implementation-preflight.md`.
5. If the preflight says `Proceed after approval: NO`, stop and report why.
6. If the approval response adds constraints, treat them as binding unless they conflict with
   `AGENTS.md` or the issue scope.
7. Run `git status --short` and ensure unrelated overlapping changes are not present.
8. Follow the `work-issue-local` skill as the owning procedure.
9. Use this command only to enforce the Archon artifact path and artifact shape below.

The output artifact path is:

```text
$ARTIFACTS_DIR/implementation-report.md
```

## Artifact Shape

Write this structure to `$ARTIFACTS_DIR/implementation-report.md`:

```markdown
# Implementation Report

## Summary

## Files changed

## Feedback loop / test seam

## Validation

## Architecture direction
Still holds:
Human decision needed:
Shortcuts rejected:

## Review triage
Accepted:
Rejected:
Deferred:
Human decision needed:

## Decisions and smells

## Deferred items

## Parent issue resolution

## Process feedback
```

In the final user-facing response, include the same core facts: summary, validation, architecture
direction, and any human decision needed.
