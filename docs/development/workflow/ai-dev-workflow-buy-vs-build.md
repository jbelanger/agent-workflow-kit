# AI Dev Workflow Buy-Vs-Build

Status: draft

## Decision Frame

Archon changes the build question. The kit should not become a competing workflow engine if Archon
can provide the runtime primitives safely enough.

Keep this repository focused on the process bar:

- GitHub-native planning contracts.
- Local-first Codex defaults and explicit model choice.
- Definition of Ready.
- Merge-risk classification.
- Human architecture decision gates.
- Review triage that treats feedback as evidence.
- Deterministic validators and templates.

Use Archon for runtime orchestration only where the workflow pack can preserve those rules.

## What Archon Should Own

- DAG workflow execution.
- Fresh-context node handoff through artifacts.
- Worktree isolation.
- Provider and model routing.
- Approval nodes.
- CLI and optional web run surfaces.
- Run history and artifacts outside the target repo.

## What Agent Workflow Kit Should Own

- `AGENTS.md` standing rules.
- `.agents/skills/` process and specialist procedures.
- `.github/ISSUE_TEMPLATE/` planning contracts.
- `.github/PULL_REQUEST_TEMPLATE.md` review and decision capture.
- `.archon/commands/awk-*.md` command wrappers that encode this kit's policy.
- `.archon/workflows/awk-*.yaml` orchestration that gates unsafe autonomy.
- `scripts/validate-*.mjs` deterministic checks for pack wiring.

## Current Archon Adoption Stance

Active tracker: `docs/development/workflow/archon-route-tracker.md`
Concept spike index: `docs/development/workflow/archon-concept-spikes.md`

Accepted for the trivial first pass:

- Add an experimental repo-local `.archon/` pack.
- Disable bundled Archon defaults for this repo so broad autonomous workflows are not accidentally
  the baseline.
- Add read-only prepare and review workflows.
- Add an implementation workflow with a human approval gate before the mutating node.
- Add a dependency-free validator for the pack wiring.

Deferred until dogfooding:

- Automatic PR creation.
- Self-fix review loops.
- Posting issue or PR comments from workflows.
- Background or fire-and-forget implementation runs.
- Remote chat adapters.
- Codex permission hardening inside Archon.

Human decision needed before enabling:

- Whether Archon's Codex provider permission posture is acceptable for code-changing runs.
- Whether any workflow may push branches or open draft PRs automatically.
- Whether Archon should become a required dependency for using this kit, or remain an optional
  runtime profile.
- Whether workflow artifacts should be copied into repo docs, linked from issues, or stay only in
  Archon's artifact store.

## First Workflows

| Workflow | Mutates code? | Purpose |
| --- | --- | --- |
| `awk-prepare-implementation` | No | Produce a Ready/not-ready implementation brief. |
| `awk-work-issue-local` | Yes, after approval | Preflight one prepared issue, pause, then implement one scoped pass. |
| `awk-review-local-changes` | No | Review local diff before PR. |
| `awk-validate-process-pack` | No | Validate the `.archon` pack files and safety invariants. |

## Validation

Run:

```bash
node scripts/validate-archon-pack.mjs
```

This check is intentionally small. It verifies the pack exists, bundled Archon defaults are disabled,
implementation has a human approval gate before the mutating command, and prohibited merge/staging
patterns are absent from the pack.

## Non-Goals

- Recreate Archon's DAG executor.
- Recreate Archon's worktree manager.
- Replace GitHub issues as the planning surface.
- Make Archon the mandatory runtime before this profile is dogfooded.
- Normalize autonomous merge, autonomous PR creation, or broad self-fix loops.

## Open Questions

1. Should all future code-changing Archon workflows remain worktree-required, or are there narrow
   cases where a live checkout is acceptable when the human invokes it explicitly?
2. Should this repo ship only Codex workflows, or should it include Claude variants where per-node
   tool restrictions are stronger?
3. Should `prepare-implementation` update GitHub issue fields, or stay read-only and leave updates
   to the human until the pack proves reliable?
