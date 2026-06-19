# ARCHON-SPIKE-003: Structured Preflight

Status: complete

## Question

Can Archon support a fail-closed implementation preflight gate using structured status,
deterministic parsing, `when`, `trigger_rule`, and `cancel` nodes for `READY` / `STOP` /
`NEEDS_DECISION`?

## Setup

Initial docs/source spike, followed by a narrow workflow-pack patch and real Archon validation.

Initial gap before the patch:

- `.archon/workflows/awk-work-issue-local.yaml:15` runs a preflight command.
- `.archon/workflows/awk-work-issue-local.yaml:20` always proceeds to approval after preflight.
- `.archon/commands/awk-implementation-preflight.md:52` emits prose `YES/NO`, not structured routing
  output.
- `.archon/commands/awk-work-issue-local.md:24` asks the implementation command to stop if preflight
  says no, so the current safety gate is prompt-level, not workflow-level.

## Evidence

Archon supports the needed primitives:

- `output_format` exists for command/prompt nodes and validates structured output.
- Codex provider advertises enforced structured output.
- `$node.output.field` references can feed `when:` conditions.
- `when:` conditions fail closed on invalid expressions.
- `trigger_rule: none_failed_min_one_success` can join around skipped branches.
- `cancel` nodes are schema-supported and cancel workflow execution.

Refs:

- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/guides/authoring-workflows.md:141`
- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/guides/authoring-workflows.md:317`
- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/guides/authoring-workflows.md:326`
- `/Users/joel/Dev/Archon/packages/workflows/src/dag-executor.ts:608`
- `/Users/joel/Dev/Archon/packages/workflows/src/dag-executor.ts:1240`
- `/Users/joel/Dev/Archon/packages/workflows/src/condition-evaluator.ts:205`
- `/Users/joel/Dev/Archon/packages/workflows/src/schemas/dag-node.ts:334`
- `/Users/joel/Dev/Archon/packages/providers/src/codex/capabilities.ts:3`

Minimal viable shape:

```yaml
- id: preflight
  command: awk-implementation-preflight
  output_format:
    type: object
    properties:
      status: { type: string, enum: [READY, STOP, NEEDS_DECISION] }
      reason: { type: string }
      decision_needed: { type: string }
      artifact_path: { type: string }
    required: [status, reason, decision_needed, artifact_path]

- id: stop-preflight
  depends_on: [preflight]
  when: "$preflight.output.status == 'STOP'"
  cancel: "Implementation preflight stopped: $preflight.output.reason"

- id: decision-preflight
  depends_on: [preflight]
  when: "$preflight.output.status == 'NEEDS_DECISION'"
  cancel: "Implementation preflight needs a human decision: $preflight.output.decision_needed"

- id: approve-scope
  depends_on: [preflight, stop-preflight, decision-preflight]
  trigger_rule: none_failed_min_one_success
  when: "$preflight.output.status == 'READY'"
  approval:
    message: "Review the preflight artifact before implementation."
    capture_response: true
```

First patched shape in this branch:

- `.archon/workflows/awk-work-issue-local.yaml` gave `preflight` an `output_format` with `READY`,
  `STOP`, and `NEEDS_DECISION`.
- `STOP` and `NEEDS_DECISION` each route to a `cancel` node.
- `approve-scope` only runs when `preflight.output.status == 'READY'`.
- `.archon/commands/awk-implementation-preflight.md` now requires JSON-only structured output.

Validation after installing Archon CLI:

```text
$ archon validate workflows --cwd /Users/joel/Dev/agent-workflow-kit --json
summary: total=4 valid=4 errors=0 warnings=0

$ archon validate commands --cwd /Users/joel/Dev/agent-workflow-kit --json
summary: total=4 valid=4 errors=0

$ node scripts/validate-archon-pack.mjs
Archon workflow pack validation passed.
```

Dogfood showed two Codex-provider problems with direct `output_format` routing in the installed CLI:

1. The first gated run failed before preflight because the structured-output schema lacked
   `additionalProperties: false`.
2. After adding that schema field, Codex emitted multiple JSON-looking progress messages and Archon
   did not receive a clean structured output. The `when` expressions could not parse
   `$preflight.output.status`, so the workflow skipped all branch nodes and incorrectly reported
   success.

Final patched shape:

- The AI preflight command writes `$ARTIFACTS_DIR/implementation-preflight.md`.
- A deterministic Bun `preflight-status` script parses the artifact's
  `Status: READY/STOP/NEEDS_DECISION` line and emits one clean JSON object.
- `STOP`, `NEEDS_DECISION`, and `READY` conditions route from `$preflight-status.output.status`.

Live dogfood result:

```text
Run: b03285b674fdf45e21063fb8d746917c
preflight-status: completed
stop-preflight: cancelled workflow
approve-scope: not reached
implement: not reached
```

The `STOP` reason was correct: the isolated worktree was created from source state that did not
contain the uncommitted Archon route docs or validator script named by the brief.

Source-complete `READY` dogfood result:

```text
Run: b91b8a9a829aaf65caa5a9f555050798
base: archon-workflow-pack
preflight-status: READY
approve-scope: paused
resume: continued after CLI approval
implement: completed
validation: passed
```

## Result

Pass with constraint.

Archon can support a fail-closed preflight gate, but this pack should not route directly from Codex
command output. Route from a deterministic parser over the preflight artifact. The `STOP` and
`READY` branches are dogfooded; `NEEDS_DECISION` still needs live dogfood.

## What This Means For Agent Workflow Kit

ARCHON-001 is implemented as a narrow patch to:

- `.archon/workflows/awk-work-issue-local.yaml`
- `.archon/commands/awk-implementation-preflight.md`

Keep the implementation command's existing preflight check as a secondary guard. Keep the
deterministic parser as the workflow-routing source.

## Follow-Up Work

- Dogfood one NEEDS_DECISION path.
