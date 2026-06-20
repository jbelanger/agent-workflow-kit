---
description: Orchestrate early product/design discovery and draft a vision brief before specs.
argument-hint: <work-item|grooming-artifact|idea|description>
---

# Agent Workflow Kit: Discover Vision

**Input**: $ARGUMENTS

---

## Mission

Run the portable `discover-vision` workflow verb inside Archon. You may create or update one
discovery bundle under `docs/development/discovery/<slug>/`. Do not edit production code, create a
spec, create child work items, stage, commit, push, open a PR, update issues, or mark a vision
accepted.

## Adapter Boundary

This command is an Archon adapter, not a second source of process truth.

1. Read `AGENTS.md`.
2. Read `docs/development/workflow/ai-dev-workflow.md`.
3. Read `.agents/skills/process/discover-vision/SKILL.md`.
4. Read the source work item, grooming artifact, issue, prior discovery bundle, or description named
   by `$ARGUMENTS`.
5. Select only the relevant specialist lenses. Default lenses are:
   - `.agents/skills/specialist/product-strategy/SKILL.md`
   - `.agents/skills/specialist/technical-architecture/SKILL.md`
   - `.agents/skills/specialist/validation-strategy/SKILL.md`
6. Add conditional lenses only when the intake needs them:
   - `.agents/skills/specialist/ux-direction/SKILL.md`
   - `.agents/skills/specialist/creative-direction/SKILL.md`
7. Follow `discover-vision` as the owning procedure.
8. Use this command only to enforce the Archon artifact path and artifact shape below.

The output artifact path is:

```text
$ARTIFACTS_DIR/discover-vision.md
```

Dashboard output rules:

- Do not format local filesystem paths as Markdown links. Print paths in backticks or fenced
  `text` blocks only; the dashboard may rewrite absolute Markdown links into broken HTTP URLs.
- If the discovery report status is `NEEDS_INTERVIEW`, `NEEDS_RESEARCH`, or `NEEDS_DECISION`, tell
  the operator to answer or rerun discovery with the missing decision in the normal chat/workflow
  prompt. Do not imply that a spec or implementation step should start.
- If the status is `READY_FOR_SPEC`, the workflow approval gate is for accepting the draft vision as
  authoritative before spec drafting.

## Discovery Bundle

When discovery artifacts are useful, write or update:

```text
docs/development/discovery/<slug>/00-intake.md
docs/development/discovery/<slug>/vision-brief.md
docs/development/discovery/<slug>/decision-log.md
docs/development/discovery/<slug>/research-notes.md   # only when research exists
```

Use `Vision state: Draft` until the downstream approval gate records acceptance.

Do not create `specialist-briefs.md` or `next-question.md` by default. Specialist output should be
synthesized into the vision brief and decision log unless the human explicitly asks to preserve raw
briefs.

## Artifact Shape

Write this structure to `$ARTIFACTS_DIR/discover-vision.md`:

```markdown
# Discover Vision Report

## Status
READY_FOR_VISION | NEEDS_INTERVIEW | NEEDS_RESEARCH | NEEDS_DECISION | READY_FOR_SPEC | DIRECT_TASK | DROP | DEFER

## Discovery bundle
Slug:
Intake path:
Vision brief path:
Decision log path:
Research notes path:

## Selected lenses

## Skipped lenses

## Synthesis

## Decision map

## Human question
Question:
Options:
1.
2.
3.
Recommendation:
Why:

## Next workflow step

## Process feedback
```

Use `READY_FOR_SPEC` only when the draft vision is coherent enough for human acceptance. If the
status is `NEEDS_INTERVIEW`, `NEEDS_RESEARCH`, or `NEEDS_DECISION`, the workflow must not continue
to spec drafting.

Write bundle paths as plain relative paths without backticks so deterministic workflow nodes can
parse them.

In the final response, include the report artifact path as plain text, status, selected lenses,
vision brief path if created, and next workflow step.
