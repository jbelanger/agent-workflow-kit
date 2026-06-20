---
description: Groom an unclear work item, issue, idea, tracker item, or spike candidate without implementing.
argument-hint: <work-item|issue-number|issue-url|tracker-item|description>
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
6. If the input is vague product, design, creative, game, workflow, architecture, or platform work,
   preserve interview/research mode from the owning skill. Do not compress the idea into a draftable
   spec just because the operator asked for a narrow first implementation.
7. Use this command only to enforce the Archon artifact path and artifact shape below.

The output artifact path is:

```text
$ARTIFACTS_DIR/groom-issue.md
```

Dashboard output rules:

- Do not format local filesystem paths as Markdown links. Print paths in backticks or fenced
  `text` blocks only; the dashboard may rewrite absolute Markdown links into broken HTTP URLs.
- If a human decision is needed, say that the dashboard will show an approval/input gate for the
  answer. If no gate appears, the operator should answer in the normal chat box or rerun the next
  workflow with the answer included in the prompt.
- Do not imply that grooming continues automatically into discovery, spec drafting, or
  implementation.

## Artifact Shape

Write this structure to `$ARTIFACTS_DIR/groom-issue.md`:

```markdown
# Groom Issue

## Current understanding

## Grooming status

## Recommended work item type

## Draft goal

## Draft non-goals

## Vision / design analysis

## Research needed or completed

## Source evidence needed

## Acceptance criteria draft

## Merge risk

## Architecture / ownership implications

## Recommended work item fields, labels, or status

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

`## Grooming status` must be one of:

- `READY_FOR_DRAFT`
- `NEEDS_INTERVIEW`
- `NEEDS_RESEARCH`
- `NEEDS_DECISION`
- `DIRECT_TASK`
- `DROP`
- `DEFER`

`## Human decision needed` must be `YES` or `NO`, followed by a short reason.

Use `READY_FOR_DRAFT` only when a downstream spec can be drafted without inventing meaningful
product behavior, creative direction, architecture, platform shape, ownership, or acceptance
criteria.

Use `NEEDS_INTERVIEW` for vague product/design/creative work that needs a human answer before a
useful spec can exist. Use `NEEDS_RESEARCH` when market, genre, comparable-product, platform,
architecture, or source-code evidence must be gathered before the next decision.

When status is `NEEDS_INTERVIEW`, `NEEDS_RESEARCH`, or `NEEDS_DECISION` for product/design vision
work, recommend `awk-discover-vision` as the next workflow step instead of `awk-draft-spec`.

If no clarification question is needed, write `None` under `## Clarification question`.

In the final response, include the artifact path as plain text, recommended work item type, next
action, and whether a human decision is needed. If human decision is `YES`, include the clarification
question and say that the answer should be supplied through the dashboard approval/input gate.
