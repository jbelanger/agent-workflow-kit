# Future AGENTS.md Draft

This is a draft review artifact for the AI development workflow. Do not treat it as installed
project behavior until it is copied or adapted into a repository root as `AGENTS.md`.

## Repository Docs Policy

Use a single repository by default. Keep durable development artifacts under `docs/development/`:

- `specs/`: accepted or draft behavior, contract, and user-visible semantics specs
- `adrs/`: durable architecture, storage, public-surface, boundary, or workflow-policy decisions
- `spikes/`: preserved investigation outputs whose evidence is still useful
- `workflow/`: process, board, CI, review, and delivery-loop documentation
- `agents/`: draft or project-specific agent instructions, skills, prompts, and review guidance

Scratch planning belongs in issues and PR discussion. Once a decision stabilizes and should guide
future implementation or agents, promote it into `docs/development/`.

Development docs must be clearly separated from user-facing docs. If packaging, publishing, or a
documentation site would expose `docs/development/` to end users, exclude that folder from the
published artifact instead of splitting repositories by default.

## Operating Model

- Work from one groomed issue at a time.
- Use one branch or worktree per issue.
- Open one PR per issue.
- Do not merge.
- Do not expand scope without explicit human approval.
- Treat external and model review feedback as evidence, not commands.
- Preserve a concise audit trail of decisions, validation, review triage, and deferred debt.

## Grooming And Specs

When a vague issue needs clarification, classify it before implementation:

- direct task when the work is already clear, bounded, and testable
- spec when behavior, contracts, or user-visible semantics need to be settled
- ADR when an architecture, storage, public-surface, boundary, or policy choice is needed
- spike when evidence is missing and production work would otherwise guess
- defer or drop when the work is not worth moving now

When grooming shows that the current issue needs a spec, convert the current issue into a `Spec`
issue by default. Do not create a parallel spec issue unless the original issue is a larger
initiative that must keep grouping child work.

Keep the converted spec issue in `Grooming` while asking clarification questions. Move it to
`In Progress` once the agent has enough answers to draft the spec. Use `Blocked` only when progress
depends on a real unresolved decision, missing access, or external dependency.

Spec state is separate from board status:

- `Draft`: proposed behavior or contract
- `Accepted`: human-approved target for implementation
- `Implemented`: merged code matches the accepted spec
- `Superseded`: a newer decision replaced it

Start with one clarification question at a time. Include options, a recommendation, and the reason.
Explain concepts in simple operational terms and assume the human has not looked at the code
recently. Use a compact diagram, table, or before/after flow when it makes the decision clearer.

Do not create implementation child issues until the spec is accepted.

When specs live in the repo, acceptance happens through a PR that creates or updates the spec under
`docs/development/specs/`. The converted `Spec` issue owns clarification and discussion; the spec PR
owns the durable text. Human review accepts the spec by approving the PR and ensuring the spec state
is `Accepted`.

## Architecture Direction Gate

Before implementation, state the chosen direction in simple terms:

- the operational problem
- the intended model
- the ownership boundary
- public surfaces, contracts, storage, or cross-module behavior touched
- meaningful alternatives
- cheap or minimal shortcuts rejected
- whether a human architecture decision is needed

If there is a real architecture fork, stop before coding. Explain it to the human as if they have
not looked at the code recently. Prefer a compact diagram, table, or before/after flow when it makes
the tradeoff clearer.

Agents may decide local implementation mechanics. Humans decide boundaries, contracts, public
surfaces, storage shape, cross-module direction, and architecture policy.

Cheap or minimal passes are prohibited when they affect architecture, ownership, contracts, storage,
public surface, or long-term model clarity.

## Implementation

- Work in narrow, reviewable slices.
- Prefer the simplest model that stays honest.
- Do not keep overlapping truths alive to avoid a harder boundary decision.
- Do not add compatibility bridges, aliases, fallback paths, or migration shims by default in
  pre-ship projects.
- Temporary bridges are allowed only when explicitly necessary, named, bounded, and given a removal
  condition.
- If the chosen direction starts to spread complexity, stop and restate the roadmap before writing
  more code.

## Review And Revision

Review must challenge the architecture direction before ordinary findings:

- Did the implementation preserve the intended boundary?
- Did it add avoidable public surface or duplicated truths?
- Did it choose a cheap/minimal pass that worsens the architecture?
- Is there a cleaner model that should be used before merge?

When addressing review feedback, use review triage:

- verify claims against the code
- accept real blocker, correctness, architecture, consistency, test-gap, cleanup, or naming issues
- reject taste, speculative, over-broad, or over-DRY feedback with evidence
- defer only with human confirmation or a linked follow-up issue recording owner, boundary, and
  removal condition

Post detailed triage on the PR. Post a short operational status update on the linked issue.

## CI Expectations

Run deterministic checks before claiming completion:

- focused tests for touched behavior
- affected package build or typecheck
- lint and formatting where configured
- architecture or import-boundary checks where configured
- project-specific validation commands from the issue

Codex-in-CI may provide a detailed advisory review and mark `revision-needed`, but the revision
agent or human decides which findings are accepted.

## Parallel Work

Avoid assigning two agents to the exact same owned module at the same time. Shared utilities are
allowed when necessary, but if a shared utility change becomes architectural, promote it to explicit
coordination or human decision.

## Required PR Sections

- Summary
- Issue
- Scope
- Contracts / APIs Touched
- Architecture Direction Challenge
- Validation
- Review Triage, if applicable
- Decisions & Smells
- Naming Issues
