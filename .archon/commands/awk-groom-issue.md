---
description: Groom an unclear issue, idea, tracker item, or spike candidate without implementing.
argument-hint: <issue-number|issue-url|tracker-item|description>
---

# Agent Workflow Kit: Groom Issue

**Input**: $ARGUMENTS

---

## Mission

Run the portable `groom-issue` workflow verb inside Archon. Do not edit code. Do not stage, commit,
push, open a PR, update issues, or start another workflow.

## Adapter Boundary

This command is an Archon adapter, not a second source of process truth.

1. Read `AGENTS.md`.
2. Read `docs/development/workflow/ai-dev-workflow.md`.
3. Read `.agents/skills/process/groom-issue/SKILL.md`.
4. Read any source docs, tracker items, issues, PRs, specs, ADRs, or spike notes referenced by
   `$ARGUMENTS`.
5. Follow the `groom-issue` skill as the owning procedure.
6. Use this command only to enforce the Archon artifact path and artifact shape below.

The output artifact path is:

```text
$ARTIFACTS_DIR/groom-issue.md
```

## Artifact Shape

Write this structure to `$ARTIFACTS_DIR/groom-issue.md`:

```markdown
# Groom Issue

## Current understanding

## Recommended issue type

## Draft goal

## Draft non-goals

## Source evidence needed

## Acceptance criteria draft

## Merge risk

## Architecture / ownership implications

## Recommended issue fields, labels, or status

## Human decision needed

## Next action

## Clarification question
Question:
Options:
1.
2.
3.
Recommendation:
Why:

## Process feedback
```

`## Human decision needed` must be `YES` or `NO`, followed by a short reason.

If no clarification question is needed, write `None` under `## Clarification question`.

In the final response, include the artifact path, recommended issue type, next action, and whether a
human decision is needed.
