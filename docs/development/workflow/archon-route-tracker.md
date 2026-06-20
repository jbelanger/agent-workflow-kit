# Archon Route Tracker

Status: active tracker

This tracker records the experiment to take the Archon route as far as practical on the
`archon-workflow-pack` branch while keeping `main` centered on portable skills.

## Goal

Prove whether `agent-workflow-kit` can use Archon as an execution runtime without making Archon the
source of truth for planning, architecture decisions, or long-term workflow memory.

## Current Direction

Updated: 2026-06-20

The active dogfood thread is to use a small creative browser Tetris game as a target project for the
Archon route. The point is to improve Agent Workflow Kit and prove the workflow loop, not to
hand-build the game from this repo or bypass Archon.

The target workflow is:

```text
groom idea
  -> discover and accept high-level vision when the idea is vague product/design work
  -> draft durable spec
  -> review/accept direction
  -> break down into child work items
  -> prepare one implementation item
  -> implement through an approved Archon worktree run
```

The current missing-product-work class is still early planning: draft and review the game V0 spec
through installed `awk-*` workflows before any game implementation starts.

When resuming, inspect live Git state and Archon artifacts in the target repo rather than trusting
old chat context. If the next useful project step cannot be expressed by an installed `awk-*`
workflow, improve this kit first, reinstall it into the target repo, validate the installed copy,
and commit the workflow-pack update before continuing.

The desired shape:

```text
Canonical intent/state:
  AGENTS.md, .agents/skills, docs/development/work-items, docs/development, and
  optional GitHub issues/PRs when a remote collaboration anchor is needed

Execution:
  Archon workflows, runs, artifacts, worktrees, approval gates, and dashboard

Policy:
  AGENTS.md and .agents/skills/

Adapter:
  thin .archon commands/scripts that invoke the portable workflow verbs and write Archon artifacts
```

## Working Decision

Continue the Archon route, but only as an optional execution profile around the portable skills
workflow. The accepted boundary is recorded in
`docs/development/workflow/adr-archon-portable-skills.md`.

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
- `docs/development/work-items/` for portable planning records.
- `docs/development/` for durable workflow, spec, ADR, and spike records.
- GitHub issues/PRs when the work item or review discussion needs a remote collaboration anchor.

Archon artifacts may feed these sources, but they do not replace them.

GitHub Project fields may remain useful as a dashboard, but they are optional derived state for this
route, not a mandatory source of workflow truth.

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
- Dogfooded `awk-work-issue-local` through the `READY` path from a source-complete worktree:
  preflight passed, approval paused, CLI resume continued the run, implementation edited one doc, and
  validation passed.
- Dogfooded `awk-work-issue-local` through the `NEEDS_DECISION` path; the preflight artifact named
  the missing architecture decision and the deterministic parser routed to cancellation before
  approval or implementation.
- Dogfooded CLI rejection from an approval pause; the run cancelled, implementation did not run, and
  the worktree stayed clean.
- Dogfooded failed-run recovery from Archon runtime state; a preflight failure was diagnosed from
  SQLite state and logs, then classified as non-resumable because it had no completed nodes.
- Added `docs/development/workflow/archon-recovery-runbook.md` as the repo-visible recovery stub.
- Captured the initial buy-vs-build stance in
  `docs/development/workflow/ai-dev-workflow-buy-vs-build.md`.
- Added `docs/development/workflow/archon-concept-spikes.md` to split Archon adoption into
  short evidence-gathering spikes.
- Accepted `docs/development/workflow/adr-archon-portable-skills.md`: portable skills and standing
  docs own workflow behavior; Archon commands are optional adapters.
- Refactored `.archon/commands/awk-*` prompts to make adapter responsibilities explicit and avoid
  competing with portable skills.
- Added read-only `awk-continue-work` as the first dashboard-visible router over Archon runtime
  state and portable planning state.
- Dogfooded `awk-continue-work`; it produced a `GROOM_OR_TRIAGE` route artifact and exposed the
  missing read-only grooming adapter.
- Added read-only `awk-groom-issue` so the first planning fallback can run inside the Archon
  dashboard while still using the portable `groom-issue` skill.
- Completed `ARCHON-SPIKE-010`; Codex-backed Archon workflows must use explicit adapter prompt
  routing to `.agents/skills`, not workflow YAML `skills:` as a scoping mechanism.
- Added a portable installer and clean-repo proof for two install profiles: portable skills only,
  and portable skills plus the optional Archon adapter pack.
- Removed the copied Archon adapter dependency on this branch's route tracker so installed projects
  read their own local planning state instead of the kit experiment tracker.
- Dogfooding in `bullet-tetris-lab` exposed that Archon test-drive work must stay inside installed
  `awk-*` workflows, runtime artifacts/logs must be ignored by installed repos, and fresh local repos
  need a default `worktree.baseBranch`.
- Added `docs/development/work-items/` as the portable planning lane and `awk-breakdown-work-item`
  as the read-only Archon adapter between accepted direction and implementation preparation.
- Added `draft-artifact` as the portable durable-artifact drafting skill and `awk-draft-spec` as the
  spec-only Archon adapter between grooming and breakdown.
- Dogfooding in `bullet-tetris-lab` exposed a planning hole: grooming asked a clarification
  question, but `awk-draft-spec` could still proceed from that unresolved artifact and produce a
  thin product spec. Grooming now has explicit interview/research readiness states, product/design
  vision expectations, and `awk-draft-spec` has a deterministic readiness gate that pauses for a
  human answer before drafting from unresolved grooming.
- Added `discover-vision` as the high-interaction PM/PO orchestrator between grooming and spec
  drafting. It uses conditional specialist lenses, writes compact discovery bundles under
  `docs/development/discovery/`, and has an `awk-discover-vision` adapter with one vision-acceptance
  gate before spec drafting.

## Open Work Items

| ID | Status | Item | Outcome |
| --- | --- | --- | --- |
| ARCHON-001 | Complete | Add a structured preflight gate. | Preflight writes `READY`, `STOP`, or `NEEDS_DECISION` to the artifact; a deterministic parser routes `STOP` and `NEEDS_DECISION` to cancellation and `READY` to approval. All three paths are dogfooded. |
| ARCHON-002 | Complete | Add `awk-continue-work`. | Read-only workflow checks Archon runtime state first, then portable planning state, and writes a routing artifact. Dogfood run `366e5b663e69254be5de10fc681ee19e` completed with `GROOM_OR_TRIAGE`. |
| ARCHON-003 | Accepted | Decide canonical planning state for the Archon route. | Portable repo surfaces are canonical: `AGENTS.md`, `.agents/skills`, `docs/development/work-items`, `docs/development`, and optional GitHub issues/PRs when remote collaboration or audit trail is needed. Archon DB/artifacts remain runtime evidence. |
| ARCHON-004 | Complete | Reduce duplicated policy in `.archon/commands`. | Commands are adapter prompts around owning skills/rules and Archon artifact shapes, not parallel procedural truth. |
| ARCHON-005 | Complete | Dogfood one read-only prepare run. | `awk-prepare-implementation` produced a useful `READY` brief artifact without repo edits. |
| ARCHON-006 | Complete | Dogfood one gated implementation run. | Source-complete worktree, `READY` preflight, approval pause, CLI resume, implementation report, and validation are proven. |
| ARCHON-007 | Complete | Validate real Archon CLI compatibility. | Archon's workflow and command validators pass, and the deterministic validation workflow executes; AI workflow smoke tests remain separate. |
| ARCHON-008 | Accepted | Decide whether GitHub Project boards remain mandatory. | GitHub issues/PRs remain collaboration anchors. Project fields are optional derived dashboard state, not mandatory workflow truth. |
| ARCHON-009 | CLI proven | Add recovery docs for failed/paused runs. | `archon-recovery-runbook.md` covers the core recovery table, artifact rules, CLI approval/rejection, and failed-run recovery. Web UI and GitHub-comment details remain follow-up. |
| ARCHON-010 | Open | Run concept spikes for Archon machinery. | Spikes 001, 003, and 007-014 are complete; 010 confirmed the Codex skills boundary. Spikes 002, 004, 005, and 006 remain proposed. |
| ARCHON-011 | Complete | Add breakdown adapter for the local work-item model. | `awk-breakdown-work-item` runs the portable `breakdown-issue` skill and writes a read-only artifact for child work item proposals. |
| ARCHON-012 | Complete | Add spec drafting adapter. | `awk-draft-spec` runs the portable `draft-artifact` skill in spec mode, writes one draft spec under `docs/development/specs/`, and records an Archon report artifact. |
| ARCHON-013 | Complete | Add planning interview/readiness gate. | Vague product/design grooming now routes to `NEEDS_INTERVIEW` or `NEEDS_RESEARCH`; `awk-draft-spec` parses referenced grooming artifacts and pauses for a captured human answer before drafting from unresolved grooming. |
| ARCHON-014 | Complete | Add discovery/vision orchestrator. | `discover-vision` coordinates conditional specialist lenses, stores compact vision artifacts, and `awk-discover-vision` records human vision acceptance before spec drafting. |

## Spike Findings

| Spike | Result | Finding | Route Impact |
| --- | --- | --- | --- |
| ARCHON-SPIKE-001 | Pass | After installing Bun and Archon CLI, Archon's real validators pass and the deterministic validation workflow executes. | Keep `scripts/validate-archon-pack.mjs` for kit-specific policy; treat AI workflow execution as a separate smoke test. |
| ARCHON-SPIKE-003 | Pass with constraint | Direct Codex `output_format` routing was unreliable in the installed CLI; parsing the preflight artifact with a deterministic Bun node routes `STOP`, `READY`, and `NEEDS_DECISION` safely. | Keep artifact parsing as the gate. |
| ARCHON-SPIKE-007 | Conditional | GitHub comments can trigger local read-only work, but only safely with explicit `/workflow run`, webhook/App/auth controls, allowlisted users, and no mutating workflows at first. | Treat GitHub adapter as a narrow remote trigger/report surface, not a general natural-language control plane. |
| ARCHON-SPIKE-008 | Conditional | GitHub comments can approve/reject paused workflows, but this is not safe yet for `awk-work-issue-local`. | Do not expose mutating GitHub workflows until route allowlists, approval binding, raw response capture, and resume semantics are settled. |
| ARCHON-SPIKE-009 | Pass with boundary | Archon run DB/dashboard state is useful runtime evidence, but not accepted planning truth. | Keep source-of-truth promotion explicit and repo/GitHub-visible. |
| ARCHON-SPIKE-010 | Conditional | Codex skill support in Archon is filesystem/context discovery, not per-node `skills:` injection. Pi has explicit `.agents/skills` resolution; Archon's validator currently checks `.claude/skills` for YAML `skills:`. | Keep AWK Codex commands as explicit adapters to portable skills; do not use Codex workflow YAML `skills:` as a scoping or enforcement mechanism. |
| ARCHON-SPIKE-011 | Conditional | Codex nodes cannot be hard-restricted by Archon `allowed_tools`, `denied_tools`, or sandbox fields. | Treat Codex as broad-access trusted local execution; use Claude/Pi variants for workflows requiring enforced tool restrictions. |
| ARCHON-SPIKE-012 | Conditional | `continue work` can inspect Archon active runs first, but must then read canonical planning state outside Archon. | Implement as a thin router over the accepted portable planning surfaces. |
| ARCHON-SPIKE-013 | Conditional | Artifact promotion is viable only through narrow, append-only, provenance-rich reporting paths. | Do not auto-promote planning, policy, architecture, readiness, or ledger truth without human review. |
| ARCHON-SPIKE-014 | Pass with requirement | Archon has enough status, approval, resume, cancel, abandon, dashboard, and artifact primitives for recovery. CLI approval/rejection and failed-run recovery are dogfooded. | Keep expanding the recovery runbook before background or GitHub-triggered workflows become normal. |

## Candidate Native AI Flow

The target "continue work" behavior should be explicit:

```text
continue work
  -> inspect active Archon runs
  -> if paused: summarize gate and ask/route approval
  -> if failed: inspect artifact/log and recommend recovery
  -> if running: report status
  -> if no active run: inspect portable planning state
  -> choose next workflow verb
  -> run planning step or route mutating implementation through an approval gate
```

This flow may be implemented in Archon, but the state it reads and writes must remain inspectable
outside Archon.

## Rejected Or Constrained Paths

- Do not use Archon's DB as the sole planning database.
- Do not treat Archon run IDs as durable work item IDs.
- Do not let artifacts become accepted specs, ADRs, or issue readiness without promotion.
- Do not require GitHub Project boards as mandatory workflow truth.
- Do not maintain `.archon/commands/awk-*` as second copies of the portable skills.
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

1. Should `main` get an orchestrator skill before or after the Archon route proves `continue work`?
2. Should the Archon profile stay optional forever, or become a supported runtime once dogfooded?
3. Which Archon artifacts, if any, should be promoted automatically into repo docs or issue comments?

## Validation

Current local checks:

```bash
node scripts/validate-workflow.mjs
node scripts/prove-portable-install.mjs
archon validate workflows --cwd /Users/joel/Dev/agent-workflow-kit --json
archon validate commands --cwd /Users/joel/Dev/agent-workflow-kit --json
archon workflow run awk-validate-process-pack --cwd /Users/joel/Dev/agent-workflow-kit
node scripts/validate-archon-pack.mjs
node --check scripts/validate-archon-pack.mjs
node --check scripts/install-workflow-kit.mjs
node --check scripts/validate-workflow.mjs
node --check scripts/prove-portable-install.mjs
git diff --check
```

Remaining before broadening the Archon route beyond local dogfood:

- Groom and run the next uncompleted Archon concept spike through `awk-groom-issue`.
- Dogfood the installed profile in a real project checkout such as `exitbook`, read-only first.
- Add Web UI and GitHub recovery details only after those surfaces are actually used.
