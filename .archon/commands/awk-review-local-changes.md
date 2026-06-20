---
description: Read-only review of local changes before PR.
argument-hint: [optional scope or issue reference]
---

# Agent Workflow Kit: Review Local Changes

**Input**: $ARGUMENTS

---

## Mission

Run the portable `review-local-changes` workflow verb inside Archon. Do not edit files. Do not
stage, commit, push, create a PR, or update issues.

## Adapter Boundary

This command is an Archon adapter, not a second source of process truth.

1. Read `AGENTS.md`.
2. Read `docs/development/workflow/ai-dev-workflow.md`.
3. Read `.agents/skills/process/review-local-changes/SKILL.md`.
4. Follow that skill as the owning procedure.
5. If the change touches architecture-sensitive surfaces or reveals a smell, use the skill's routing
   rule to escalate to `review-revision-triage`.
6. Use this command only to enforce the Archon artifact path and artifact shape below.

The output artifact path is:

```text
$ARTIFACTS_DIR/local-review.md
```

## Artifact Shape

Write this structure to `$ARTIFACTS_DIR/local-review.md`:

```markdown
# Local Review

## Verdict

## Architecture direction
Problem:
Current model:
Intended model:
Boundary preserved:
Human decision needed:

## Findings

## Accepted

## Rejected

## Deferred

## Taste-only

## Test and validation gaps

## Naming issues

## Recommended next action

## Process feedback
```
