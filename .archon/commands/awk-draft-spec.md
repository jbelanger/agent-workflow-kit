---
description: Draft or update one durable repo-local spec from groomed or accepted direction.
argument-hint: <work-item|grooming-artifact|issue|description>
---

# Agent Workflow Kit: Draft Spec

**Input**: $ARGUMENTS

---

## Mission

Run the portable `draft-artifact` workflow verb inside Archon for `Artifact type: Spec`. You may
create or update one draft spec under `docs/development/specs/`. Do not edit production code. Do not
stage, commit, push, open a PR, update issues, start another workflow, mark the spec accepted, or
create implementation child work items.

## Adapter Boundary

This command is an Archon adapter, not a second source of process truth.

1. Read `AGENTS.md`.
2. Read `docs/development/workflow/ai-dev-workflow.md`.
3. Read `.agents/skills/process/draft-artifact/SKILL.md`.
4. Read any source artifacts referenced by `$ARGUMENTS`: repo-local work items, Archon grooming
   artifacts, GitHub issues, specs, ADRs, spikes, implementation notes, or tracker entries.
5. Follow `draft-artifact` as the owning procedure with `Artifact type: Spec`.
6. Choose one durable spec path under `docs/development/specs/`.
7. If the target spec already exists with `Spec state: Accepted`, `Spec state: Implemented`, or
   `Spec state: Superseded`, do not overwrite it unless `$ARGUMENTS` explicitly requests that path
   and update.
8. Write or update the draft spec with `Spec state: Draft`.
9. Use this command only to enforce the Archon artifact path and artifact shape below.

The output artifact path is:

```text
$ARTIFACTS_DIR/draft-spec-report.md
```

## Artifact Shape

Write this structure to `$ARTIFACTS_DIR/draft-spec-report.md`:

```markdown
# Draft Spec Report

## Durable spec path

## Source provenance

## Draft summary

## Spec state
Draft

## Human decision needed

## Next action

## Process feedback
```

`## Human decision needed` must be `YES` or `NO`, followed by a short reason.

If the input is not sufficient to draft a useful spec, do not create a placeholder spec. Write the
report artifact, explain the missing input, and ask one clarification question.

In the final response, include the report artifact path, durable spec path if created or updated,
spec state, next action, and whether a human decision is needed.
