# ADR: GitHub-First Orchestration Surface

Status: Accepted

## Context

Agent Workflow Kit needs a simple coordination surface that humans and local agents can both read.
The workflow should stay resumable from durable state instead of depending on chat memory, local
scratch files, a custom runtime UI, or tracker setup.

Tracker-style status fields would make fresh repos feel like they need tracker setup before doing
real work. The kit should copy only the guidance and templates needed to start work in an ordinary
repository.

## Decision

Use GitHub as the active orchestration surface for normal Agent Workflow Kit work. AWK owns the
loop contract:

```text
Intake -> Shape -> Execute -> Review -> Improve
```

AWK does not own the runtime. Codex, Claude, opencode, humans, or a thin local script can execute
prepared work as long as they read and write the same durable state:

- GitHub Issues hold work items, conversation, human answers, and current collaboration state.
- GitHub PRs hold proposed durable docs or code changes and their review gates.
- Repo docs under `docs/development/` hold accepted durable project truth: vision briefs, specs,
  ADRs, spikes, project-specific workflow notes, and source evidence.
- AWK docs under `docs/awk/` hold workflow procedure references and accepted AWK process decisions.
- Local skills under `.agents/skills/awk/` hold workflow procedure.
- Local Codex, Claude, opencode, and humans are interchangeable workers that read the same issues,
  PRs, docs, and labels.
- Runtime worker loops such as Codex goals, headless prompts, opencode sessions, local scripts, or
  human working sessions are ephemeral bindings to one Ready issue. They are not the AWK durable
  state model.
- GitHub labels are lightweight repo configuration for issue type and review signals. The default
  templates assign those labels after `scripts/setup-github-labels.mjs` creates them.
- Do not use a separate planning tracker as part of the AWK contract. If a repository has another
  human planning surface, AWK agents should still resume from issues, PRs, docs, and labels.

## Orchestrator Contract

The `continue-work` skill is the read-only router for GitHub-first operation. It should inspect
issues, comments, linked PRs, repo docs, and labels, then choose the next workflow verb:

- `triage-backlog`
- `pick-next-item`
- `groom-issue`
- `discover-vision`
- `draft-artifact`
- `review-artifact`
- `breakdown-issue`
- `prepare-implementation`
- `work-issue-local`
- `review-local-changes`
- `review-revision-triage`

It may recommend issue comments or label changes. It must not silently mutate scope, accept
artifacts, decide architecture, implement code, push, merge, or close work without explicit human
instruction.

Every planning reply should make the next state explicit:

```text
Status:
Owner:
Blocker:
Next Step:
```

## Packaging Boundary

The default installed kit includes:

- `AGENTS.md`.
- `.agents/skills/awk/`.
- `docs/awk/`.
- GitHub issue and PR templates.
- `docs/development/` project artifacts, with subfolders created only when an artifact exists.
- `scripts/validate-workflow.mjs`.


## Consequences

The workflow becomes easier to operate remotely because GitHub Mobile can supply human answers and
approvals directly in the issue thread.

The kit stops competing with existing products on runtime machinery. It instead sharpens the parts
existing products do not fully solve for this workflow: planning state, readiness, architecture
guardrails, and agent-resumable next steps.

Ready issue bodies are the normal implementation task contract. A separate preparation pass is only for
stale or fragmented handoffs that need a compact worker prompt before execution starts.

The cost is that fresh repos need one small label setup command before issue-template labels apply:
`node scripts/setup-github-labels.mjs`. Execution fan-out remains outside the default kit until the
manual loop is proven.

## Alternatives Considered

| Alternative | Rejected because |
| --- | --- |
| Build or adopt a custom runtime UI first | That would create runtime machinery before proving the simpler GitHub issue/PR coordination loop. |
| Use a separate planning tracker as optional workflow state | That leaves two sources of workflow truth and invites drift from issue/PR state. |
| Build a custom local runner first | That would recreate platform machinery before proving the simpler GitHub issue/PR coordination loop. |
| Repo-local Markdown work items as primary state | Useful as a fallback, but weaker for mobile operation, comments, PR linkage, and agent handoff. |

## Validation

The decision is valid when:

- `continue-work` exists as a process skill.
- Workflow docs identify GitHub Issues and PRs as the default orchestration surface.
- Install and validation scripts copy only the default kit package.
- A fresh repo can install the kit, create issues/PRs, and reach a reviewed change without any tracker
  setup.
