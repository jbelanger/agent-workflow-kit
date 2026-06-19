# Archon Route Tracker

Status: active tracker

This tracker records the experiment to take the Archon route as far as practical on the
`archon-workflow-pack` branch while keeping `main` centered on portable skills.

## Goal

Prove whether `agent-workflow-kit` can use Archon as an execution runtime without making Archon the
source of truth for planning, architecture decisions, or long-term workflow memory.

The desired shape:

```text
Canonical intent/state:
  repo docs, skills, and an explicit planning ledger or GitHub issues

Execution:
  Archon workflows, runs, artifacts, worktrees, approval gates, and dashboard

Policy:
  AGENTS.md and .agents/skills/

Bridge:
  thin .archon commands/scripts that read and write the canonical sources
```

## Working Decision

Continue the Archon route, but only as an execution profile.

Archon should own:

- DAG workflow execution.
- Fresh-context node handoff through artifacts.
- Worktree isolation.
- Approval nodes and run resume/cancel/approve operations.
- Runtime artifacts, logs, and dashboard views.

Archon must not own:

- The planning source of truth.
- Definition of Ready.
- Board or ledger taxonomy.
- Architecture decision authority.
- Review triage policy.
- Skill content.
- The durable answer to "what should exist and why?"

## Source Of Truth Rule

Execution artifacts are evidence, not accepted truth.

Accepted planning state must live in one of these durable surfaces:

- `AGENTS.md` for standing agent rules.
- `.agents/skills/` for portable process and specialist procedures.
- `docs/development/` for durable workflow, spec, ADR, and spike records.
- GitHub issues/PRs when the work item or review discussion needs a remote collaboration anchor.
- A future repo-local planning ledger if the GitHub Project board becomes optional.

Archon artifacts may feed these sources, but they do not replace them.

## Completed In This Branch

- Added repo-local `.archon/` workflow pack.
- Disabled bundled Archon defaults in `.archon/config.yaml`.
- Kept Codex and explicit model choice as the default execution profile.
- Added read-only prepare and review workflows.
- Added one implementation workflow with preflight and human approval before the mutating node.
- Added a structured implementation preflight gate with `READY`, `STOP`, and `NEEDS_DECISION`
  routing before human approval or implementation.
- Added `scripts/validate-archon-pack.mjs` for pack wiring and basic safety invariants.
- Installed local Bun and Archon CLI, then validated the workflow pack with Archon's real validators.
- Pinned Archon's Codex binary path to the local Codex app binary and ran the deterministic
  `awk-validate-process-pack` workflow successfully.
- Dogfooded `awk-prepare-implementation`; it produced a `READY` implementation brief artifact.
- Dogfooded `awk-work-issue-local` through the `STOP` path; a deterministic artifact parser routed
  the preflight artifact to cancellation before approval or implementation.
- Added `docs/development/workflow/archon-recovery-runbook.md` as the repo-visible recovery stub.
- Captured the initial buy-vs-build stance in
  `docs/development/workflow/ai-dev-workflow-buy-vs-build.md`.
- Added `docs/development/workflow/archon-concept-spikes.md` to split Archon adoption into
  short evidence-gathering spikes.

## Open Work Items

| ID | Status | Item | Outcome |
| --- | --- | --- | --- |
| ARCHON-001 | Validated | Add a structured preflight gate. | Preflight writes `READY`, `STOP`, or `NEEDS_DECISION` to the artifact; a deterministic parser routes `STOP` to cancellation before approval or implementation. `NEEDS_DECISION` and `READY` dogfood remain. |
| ARCHON-002 | Open | Add `awk-continue-work`. | Workflow checks Archon runs first, then canonical planning state, and routes to resume, prepare, work, review, groom, or ask. |
| ARCHON-003 | Open | Decide canonical planning state for the Archon route. | Pick GitHub issues/project, repo-local ledger, or hybrid; do not default to Archon DB/artifacts. |
| ARCHON-004 | Open | Reduce duplicated policy in `.archon/commands`. | Commands become wrappers around the owning skill/rule documents instead of parallel procedural truth. |
| ARCHON-005 | Complete | Dogfood one read-only prepare run. | `awk-prepare-implementation` produced a useful `READY` brief artifact without repo edits. |
| ARCHON-006 | Partial | Dogfood one gated implementation run. | Worktree creation and `STOP` cancellation are proven. Full approval and implementation are blocked until the worktree starts from a source-complete branch/commit. |
| ARCHON-007 | Complete | Validate real Archon CLI compatibility. | Archon's workflow and command validators pass, and the deterministic validation workflow executes; AI workflow smoke tests remain separate. |
| ARCHON-008 | Open | Decide whether GitHub Project boards remain mandatory. | Either keep board state canonical, make it a derived mirror, or replace it with a repo-local ledger. |
| ARCHON-009 | Stubbed | Add recovery docs for failed/paused runs. | `archon-recovery-runbook.md` covers the core recovery table and artifact rules; Web UI and GitHub-comment details remain follow-up. |
| ARCHON-010 | Open | Run concept spikes for Archon machinery. | Each concept we may depend on has a short spike result before becoming durable workflow. |

## Spike Findings

| Spike | Result | Finding | Route Impact |
| --- | --- | --- | --- |
| ARCHON-SPIKE-001 | Pass | After installing Bun and Archon CLI, Archon's real validators pass and the deterministic validation workflow executes. | Keep `scripts/validate-archon-pack.mjs` for kit-specific policy; treat AI workflow execution as a separate smoke test. |
| ARCHON-SPIKE-003 | Pass with constraint | Direct Codex `output_format` routing was unreliable in the installed CLI; parsing the preflight artifact with a deterministic Bun node routes `STOP` safely. | Keep artifact parsing as the gate; dogfood `NEEDS_DECISION` and `READY` before implementation is trusted. |
| ARCHON-SPIKE-007 | Conditional | GitHub comments can trigger local read-only work, but only safely with explicit `/workflow run`, webhook/App/auth controls, allowlisted users, and no mutating workflows at first. | Treat GitHub adapter as a narrow remote trigger/report surface, not a general natural-language control plane. |
| ARCHON-SPIKE-008 | Conditional | GitHub comments can approve/reject paused workflows, but this is not safe yet for `awk-work-issue-local`. | Do not expose mutating GitHub workflows until route allowlists, approval binding, raw response capture, and resume semantics are settled. |
| ARCHON-SPIKE-009 | Pass with boundary | Archon run DB/dashboard state is useful runtime evidence, but not accepted planning truth. | Keep source-of-truth promotion explicit and repo/GitHub-visible. |
| ARCHON-SPIKE-011 | Conditional | Codex nodes cannot be hard-restricted by Archon `allowed_tools`, `denied_tools`, or sandbox fields. | Treat Codex as broad-access trusted local execution; use Claude/Pi variants for workflows requiring enforced tool restrictions. |
| ARCHON-SPIKE-012 | Conditional | `continue work` can inspect Archon active runs first, but must then read canonical planning state outside Archon. | Implement as a thin router only after canonical planning state is chosen. |
| ARCHON-SPIKE-013 | Conditional | Artifact promotion is viable only through narrow, append-only, provenance-rich reporting paths. | Do not auto-promote planning, policy, architecture, readiness, or ledger truth without human review. |
| ARCHON-SPIKE-014 | Pass with requirement | Archon has enough status, approval, resume, cancel, abandon, dashboard, and artifact primitives for recovery. | Add a repo-visible recovery runbook before background or GitHub-triggered workflows become normal. |

## Candidate Native AI Flow

The target "continue work" behavior should be explicit:

```text
continue work
  -> inspect active Archon runs
  -> if paused: summarize gate and ask/route approval
  -> if failed: inspect artifact/log and recommend recovery
  -> if running: report status
  -> if no active run: inspect canonical planning state
  -> choose next workflow verb
  -> run read-only step unless mutating work has an approval gate
```

This flow may be implemented in Archon, but the state it reads and writes must remain inspectable
outside Archon.

## Rejected Or Constrained Paths

- Do not use Archon's DB as the sole planning database.
- Do not treat Archon run IDs as durable work item IDs.
- Do not let artifacts become accepted specs, ADRs, or issue readiness without promotion.
- Do not require GitHub Project boards if a repo-local ledger meets the same goals better.
- Do not add autonomous PR creation, branch pushes, or self-fix loops until the source-of-truth model
  and permission posture are settled.
- Do not expose `awk-work-issue-local` through GitHub comments until route allowlisting, approval
  binding, raw approval capture, and provider permission posture are settled.
- Do not describe Codex Archon nodes as read-only, no-shell, or tool-restricted unless a later
  provider capability change makes that enforcement real.
- Do not run mutating Archon workflows from a branch whose required route docs and validator scripts
  exist only as uncommitted or untracked local files; isolated worktrees start from committed source
  state and may not be source-complete.

## Human Decisions Still Needed

1. Is the canonical planning state GitHub issues/project fields, a repo-local ledger, or a hybrid?
2. Should `main` get an orchestrator skill before or after the Archon route proves `continue work`?
3. Should the Archon profile stay optional forever, or become a supported runtime once dogfooded?
4. Which Archon artifacts, if any, should be promoted automatically into repo docs or issue comments?

## Validation

Current local checks:

```bash
ARCHON_TELEMETRY_DISABLED=1 archon validate workflows --cwd /Users/joel/Dev/agent-workflow-kit --json
ARCHON_TELEMETRY_DISABLED=1 archon validate commands --cwd /Users/joel/Dev/agent-workflow-kit --json
ARCHON_TELEMETRY_DISABLED=1 archon workflow run awk-validate-process-pack --cwd /Users/joel/Dev/agent-workflow-kit
node scripts/validate-archon-pack.mjs
node --check scripts/validate-archon-pack.mjs
git diff --check
```

Required before calling the Archon route proven:

- Dogfood the structured preflight `STOP`, `NEEDS_DECISION`, and `READY` paths.
- Dogfood the structured preflight `NEEDS_DECISION` and `READY` paths.
- Run one gated mutating workflow in a source-complete worktree through approval and implementation.
- Recover from one paused or failed run without using chat memory.
