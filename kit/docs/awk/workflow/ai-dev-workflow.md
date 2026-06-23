# AI-Oriented Development Workflow

Status: GitHub-first baseline draft

This repository is the working home for the workflow. Earlier planning notes from other repositories
are source material only; durable decisions for this kit now belong here.

The baseline:

> Humans own product and architecture judgment. Agents execute prepared work, propose architecture,
> review evidence, and create small PRs. CI remains deterministic. Agents do not merge.

The goal is to shift important thinking left so implementation agents can work independently without
creating architecture debt, hidden scope, or unnecessary merge conflicts.

This is the canonical AWK operating reference. `github-first-flow.md` only explains how GitHub
surfaces carry this loop state.

## Operating Surfaces

Use the smallest durable surface that matches the job:

- `AGENTS.md`: project-owned repository rules with a small marked AWK usage block.
- `.agents/skills/awk/`: installed AWK skills organized by category.
- GitHub issues: active work items, discussion, human answers, and collaboration state.
- GitHub PRs: proposed durable docs or code changes and their review gates.
- GitHub labels: lightweight issue type and review signals.
- `docs/development/`: accepted durable project truth such as vision briefs, specs, ADRs, spike
  writeups, and planning records.
- `docs/awk/`: AWK process references and workflow decisions.
- Runtime worker loops: ephemeral execution bindings such as a Codex goal, a headless Claude prompt,
  an opencode session, a local script invocation, or a human working session.
- CI: deterministic checks such as tests, typecheck, lint, formatting, build, and architecture
  checks.

Project development docs live in the single repo, but they must remain separate from user-facing docs
and excluded from any published product surface when needed. Active AWK procedure stays in
`.agents/skills/awk/` and `docs/awk/`; project-specific durable artifacts stay in
`docs/development/`.

## Core Rule

```text
Agents may execute prepared work.
Agents may propose architecture.
Agents may not silently decide architecture.
Agents may not expand scope.
Agents may not merge.
Agents may not hide uncertainty.
```

## Local Skill Set

Active skills use this shape:

```text
.agents/skills/awk/<category>/<skill-name>/SKILL.md
```

The final folder must remain the skill name, and the frontmatter `name` is still the invocation
name. Category folders are for navigation and install organization. Category READMEs may explain
what belongs there, but they must not duplicate procedural instructions from individual skills.

Current categories:

| Category | Use for |
| --- | --- |
| `process/` | Planning, orchestration, implementation routing, review routing, and workflow improvement. |
| `specialist/` | Concrete expert procedures that are not already covered by the process loop, currently TDD and bug diagnosis. |
| `domain/` | Project or business-domain skills with domain vocabulary, records, policies, reports, or workflows. |

Process: planning and orchestration:

| Skill | Purpose | May edit code? |
| --- | --- | --- |
| `init-awk` | Initialize AWK in a target repo, require pushed GitHub state, labels, and initial issues before workflow execution. | No |
| `maintain-awk` | Update, repair, or migrate an AWK install while preserving project-owned files and workflow state. | No |
| `triage-backlog` | Review open work items and classify what needs attention. | No |
| `pick-next-item` | Recommend the best next work item based on readiness, risk, dependencies, and value. | No |
| `continue-work` | Inspect GitHub issues, PRs, labels, and repo docs to choose the next safe workflow verb. | No |
| `groom-issue` | Turn an unclear work item into a task, spec, ADR, spike, bug, refactor, drop, or defer. | No |
| `discover-vision` | Orchestrate early high-interaction product, UX, creative, platform, or architecture discovery before specs. | Docs only |
| `draft-artifact` | Draft or update one durable spec, ADR, or spike from groomed direction. | Docs only |
| `review-artifact` | Review and accept or route revision for a durable vision brief, spec, or ADR. | Docs only |
| `breakdown-issue` | Decompose accepted direction into independent merge-safe child work items. | No |
| `prepare-implementation` | Re-brief a stale or incomplete Ready work item into a compact worker prompt. | Docs/issues only when asked |
| `improve-workflow` | Triage process feedback and propose workflow improvements. | Docs/issues only when asked |

Process: execution and review:

| Skill | Purpose | May edit code? |
| --- | --- | --- |
| `work-issue-local` | Implement one prepared work item, bug, refactor, PR revision, or superseding child item. | Yes |
| `review-local-changes` | Lightweight local diff review before PR. | No, unless explicitly asked to fix |
| `review-revision-triage` | Strong architecture-sensitive PR review, revision routing, and human-review escalation. | Docs/specs only when safe |

Specialist skills:

| Skill | Purpose |
| --- | --- |
| `tdd` | Behavior-first red/green/refactor through the highest useful public seam. |
| `diagnose-bug` | Build a tight red-capable bug feedback loop before implementation. |

Do not create one mega-skill for the whole workflow. Skills should match the verbs people actually
say. Product, UX, creative, architecture, and validation discovery are lenses inside
`discover-vision`, not separate specialist skill files. Add specialist or domain skills only when
repeated work needs durable procedural knowledge that is not part of the process loop.

## GitHub-First Orchestration

Use `docs/awk/adrs/github-first-orchestration.md` as the accepted boundary for the active workflow
model. Use `docs/awk/workflow/github-first-flow.md` as the GitHub surface companion.

The source-of-truth model is:

```text
GitHub issue
  -> active work item, discussion, human answers, and collaboration state

GitHub PR
  -> proposed durable doc or code change plus review gate

GitHub labels
  -> lightweight issue type and review signals

repo docs under docs/development/
  -> accepted durable truth after review

.agents/skills/awk/
  -> workflow procedure

runtime worker loop
  -> ephemeral execution binding for one Ready work item
```

Use `continue-work` when the human asks to resume without remembering the current state. It reads
GitHub issues, linked PRs, comments, labels, and repo docs, then routes to the next workflow verb. It
may recommend issue comments or label updates; it must not silently mutate scope, accept artifacts,
decide architecture, implement code, push, merge, or close work.

### Runtime Worker Loops

AWK's execution contract is tool-neutral: one runtime worker loop works one Ready issue in one
branch or worktree and opens one PR. A Codex goal, a headless Claude prompt, an opencode session, a
local script invocation, or a human working session are runtime bindings of that contract. They are
not durable workflow state.

Keep runtime prompts thin. They should name the work item, point to `AGENTS.md`, the selected AWK
skill, and the issue's Definition of Ready fields, then state the definition of done for the current
worker loop. Do not copy the full workflow rules into every runtime prompt; keep those rules in the
installed skills, process docs, issue bodies, PR bodies, and accepted repo artifacts where the next
worker can read them.

When a work item is already self-contained and Ready, route directly to `work-issue-local` after the
human authorizes implementation. Use `prepare-implementation` only when the Ready issue is stale,
spread across too many comments or links for a fresh worker, or missing a compact task contract that
would let the worker start safely.

Every meaningful workflow pass should include process feedback when it notices workflow weakness.
That feedback belongs in the issue comment or PR summary where it was observed, then routes through
`improve-workflow` when it needs a durable change.

### Visible Grooming Gate

Do not start implementation from a fresh issue only because the issue has a goal and acceptance
criteria. Before `work-issue-local`, the issue, comment thread, linked artifact, or implementation
re-brief must record a visible grooming result:

- `DIRECT_TASK` with why no spec, ADR, spike, discovery, or human question is needed.
- Accepted spec, ADR, discovery, or spike direction plus breakdown/implementation boundaries.
- Self-contained Ready issue body or prepared implementation re-brief produced after grooming.

If meaningful ambiguity remains, the grooming record must also capture the clarification question
asked and answered, or explain why that ambiguity does not affect the next slice.

For doc or code changes, `Status = Review` requires a linked GitHub PR. Local commits without a PR
remain `In Progress`; issue-only review is only for decisions or artifact text fully visible in the
issue thread.

GitHub draft state is not the default workflow holding pen. Open PRs as ready for review when the
branch is pushed, validation has run, and the PR body records issue linkage and current review state.
Use draft only when work is knowingly incomplete, validation is missing, or the PR is exposing a WIP
diff without asking for attention.

A linked PR is not automatically human-ready, whether GitHub marks it draft or ready for review. If
an implementation or general doc/code PR or issue does not record an agent `review-local-changes`
result, keep the work agent-owned and route the next step to local review. If a linked PR exists to
review a durable vision brief, spec, ADR, or spike, route to `review-artifact`; that review is the
agent review pass for artifact acceptance or revision routing.
After the agent fixes or classifies findings and records the result, ordinary cleanup can continue in
the agent loop. The next human approval handoff is merge approval. If review finds architecture
ambiguity, ownership drift, public-surface risk, storage risk, or an unclear long-term model, route
to human architecture judgment before merge.

PR bodies should use `Closes #issue` only when the PR fully satisfies the issue acceptance criteria
and needs no post-merge reconciliation. Use `Refs #issue` for initiatives, parent work, partial
completion, deferred work, review-triage follow-up, architecture ambiguity, or uncertainty.

`Review` means the change is visible for acceptance. It should not create heavyweight ceremony for
low-risk docs, process, or chore work when validation is clean and the human explicitly approves.
Meaningful review remains required for architecture-sensitive, ownership, storage, public-surface,
or unclear model changes.

The default installed kit should work in a fresh repo with issues, PRs, labels, and repo docs only.

## Work Items

A work item is the workflow's unit of planning. In the default profile it is a GitHub issue. A
repo-local Markdown record under `docs/development/work-items/` is a fallback for projects that
cannot use GitHub.

New repositories start with `init-awk`. Initialization must create the initial GitHub issue surface
before ordinary workflow execution: a parent initiative when there is a larger outcome, child issues
for the first real slices or unresolved decisions, links to source docs or imported plans, issue type
labels, a canonical `AWK State` block, and one `next:*` routing label for each issue. Do not start
implementation from an imported plan, README, or local Markdown record until that state exists in
GitHub.

During initialization, create the parent issue before child issues and update links after GitHub
assigns issue numbers. A detailed plan may be accepted enough for artifact review or breakdown
without being accepted enough for implementation; implementation still requires visible grooming,
accepted direction, task boundaries, and a self-contained Ready issue body or equivalent readiness
record.

Use this authority model:

```text
GitHub issue
  -> active workflow state

accepted vision brief / spec / ADR / spike under docs/development/
  -> durable planning truth

PR
  -> proposed change and review gate
```

Grooming classifies unclear work. Drafting creates proposed specs, ADRs, or spikes. Breakdown
creates child work items only after direction is accepted. Re-briefing turns a stale or incomplete
Ready work item into a compact worker prompt only when the issue body is not already enough.

## Routing Owner

The workflow is not meant to be one rigid ladder. Use the smallest route that leaves enough visible
state for the next agent, reviewer, or human to resume safely.

`continue-work` owns the detailed task-shape routing table. This document records the rule, not a
second copy of the matrix: pick the shortest route that preserves visible state, a visible grooming
result or `DIRECT_TASK` rationale, validation, review, and human escalation for architecture,
ownership, public-surface, storage, or scope disagreement.

Fast lane means fewer artifacts, not hidden state. If GitHub is available, active work still belongs
in issues before implementation. A chat-only instruction can authorize the current turn, but durable
state must be updated before downstream agents rely on it.

## AWK State And Routing Labels

Issues and PRs carry one `AWK State` block delimited by `<!-- awk-state:start -->` and
`<!-- awk-state:end -->`. The block is the human-readable source for current status, issue type,
next workflow verb, owner, merge risk, blocker, linked PR, accepted direction, last agent review,
and revision cycles.

When GitHub labels are available, each active item should have exactly one `next:*` label matching
the block's `Next workflow verb`. Use labels for routing queries and the state block for context.
Do not create a second workflow model in external tracker fields.

The direct-task fast lane uses `.github/ISSUE_TEMPLATE/direct-task.yml`. It is for tiny, clear work
with a visible `DIRECT_TASK` rationale, one-agent scope, acceptance criteria, validation, merge risk,
and PR requirements. It skips separate discovery/spec/ADR/breakdown artifacts only when they would
add no useful evidence.

## Workflow

```text
Intake -> Shape -> Execute -> Review -> Improve
```

Granular workflow words fit under those phases: Intake covers triage and grooming; Shape covers
discovery, drafting, artifact review, and breakdown; Execute covers ready work, implementation, and
revision passes; Review covers local, artifact, and PR review; Improve covers completed,
deferred, and process-feedback work.

`Deferred` is an explicit parking state. `Blocked` is not a normal phase; represent blockers with
labels and a clear issue comment.

### 1. Triage Backlog

Use `triage-backlog` when the human asks to triage, clean up work items, or find what needs
attention.

Triage groups work items into:

- Ready.
- Needs grooming.
- Needs spec.
- Needs ADR.
- Needs spike.
- Needs breakdown.
- Blocked.
- Stale, duplicate, or unclear.
- Human-only decision.

Triage recommends next actions. It does not implement anything.

### 2. Pick Next Item

Use `pick-next-item` when the human asks what to work on next.

Prefer work that is:

- Valuable to the current direction.
- Ready or close to Ready.
- Small enough for one agent session after breakdown.
- Low merge-risk unless foundational work is intentional.
- Not blocked by missing decisions.
- Unlikely to cause architecture drift.

The output names the recommended work item, why it wins, why plausible alternatives are not first,
the risk, and the suggested next mode.

### 3. Groom Issue

Use `groom-issue` when a work item, issue, or idea is unclear.

Grooming answers:

- What problem are we solving operationally?
- What is already true?
- What is missing?
- Which source docs or code are authoritative?
- What is explicitly out of scope?
- Which ownership boundary is involved?
- What architecture risks exist?
- Is this parallel-safe, needs coordination, or serial only?

For product, design, game, interaction, or other user-facing creative work, grooming owns the
classification and handoff into vision discovery. It should not turn a vague product prompt into a
minimal implementation slice by guessing the product. It should identify the unresolved audience,
experience goals, core loop or workflow, comparable products or genre expectations, design risks, and
platform options, then route interactive interview work to `discover-vision`. When current market,
competitor, genre, library, or platform evidence would materially change the recommendation, gather
evidence or route to a spike before drafting.

Choose the smallest useful output:

- Direct direction when the work is clear enough to decompose into implementation work items.
- Bug when actual behavior differs from expected behavior.
- Refactor when the goal is behavior-preserving structure.
- Spec when behavior, contracts, records, user-visible semantics, or acceptance criteria need to be
  settled.
- ADR when architecture direction, ownership, storage, public surface, or operating policy changes.
- Spike when evidence is missing and production work would otherwise guess.
- Drop or defer when the work should not move now.

Ask one clarification question at a time. Include options, a recommendation, and why the answer
matters. Explain concepts in operational terms, assuming the human has not looked at the codebase
recently. Use compact visuals or tables when they make the decision easier.

Grooming status values:

| Grooming Status | Meaning |
| --- | --- |
| `READY_FOR_DRAFT` | The next durable spec, ADR, or spike can be drafted without inventing meaningful decisions. |
| `NEEDS_INTERVIEW` | One human answer is needed before useful durable text can exist. |
| `NEEDS_RESEARCH` | Evidence must be gathered before the next decision or draft. |
| `NEEDS_DECISION` | A known architecture, product, ownership, storage, public surface, or policy decision blocks progress. |
| `DIRECT_TASK` | The work is tiny and ready for `work-issue-local` once the issue records rationale, scope, acceptance, validation, and merge risk; no discovery, spec, ADR, spike, breakdown, or re-brief is needed. |
| `DROP` | The work should not be done. |
| `DEFER` | The work may be valid but should not move now. |

`draft-artifact` should consume grooming only when the status is `READY_FOR_DRAFT` or the current
human response resolves the blocking question. Otherwise the workflow should keep the item in
grooming for ordinary clarification, run `discover-vision` for interactive product or vision
interviews, or run the named research spike.

### 4. Discover Vision

Use `discover-vision` when grooming reports unresolved product, UX, creative, game, platform, or
architecture direction that should be settled before a useful spec can exist.

Discovery is the workflow's high-human-interaction stage. Its job is to decide the high-level
vision: who the work is for, what experience or operational outcome matters, which direction is
distinctive or useful, which technical shape is credible, and what evidence will prove the direction
is good enough to specify.

For products with a UI, user-facing workflow, interaction model, screen/state model, or meaningful
operator experience, UX direction is a readiness gate before implementation. This gate can be light,
but it must exist: an accepted discovery note, spec section, issue comment, Ready issue body, or
implementation re-brief must record the target user, primary journey, key screens or states,
information hierarchy, interaction constraints, accessibility/usability risks, and what is
deliberately deferred. Backend or infrastructure-only slices may bypass the gate only by recording
why no user-facing surface is touched.

The human should review direction, not create it from a blank page. For UI-bearing work, discovery
should prepare a compact UX direction draft from the plan, existing screens, comparable references,
and stated constraints. The draft can be a discovery bundle, issue comment, or spec section, but it
must distinguish recommendations from assumptions and open questions. Ask the human one blocking
question only when the next direction cannot be drafted responsibly.

When visuals would make review easier, the same worker may generate sample assets or mockups as
review aids. These can be wireframes, screen-state mockups, sample empty/error states, generated
bitmap images, HTML/CSS screenshots, or lightweight asset studies. Store them only when created,
inside `docs/development/discovery/<slug>/mockups/` or beside a UX spec in
`docs/development/specs/<slug>-assets/`. Label them as non-production until accepted, and record
which assumptions the visual is testing. Do not let polished visuals substitute for unresolved
product or interaction decisions.

Visual artifacts need rendered-preview validation when tooling is available. Syntax checks such as
SVG XML validation are not enough: the worker or reviewer should render the artifact or screenshot
the preview and check that important text, controls, and panels are visible without clipping or
overlap. Record the preview command or tool in the PR or issue comment.

Discovery interviews should be interactive. The agent asks one highest-leverage question, then stops
unless the human answers in the same turn. In an async GitHub run, the question lives in the issue
and the next actor is `Human`; in live chat, the agent asks in chat and waits. The agent must not
treat its own recommendation as accepted direction.

`discover-vision` acts as the orchestrator. It chooses discovery lenses conditionally:

- Default for vague product or platform work: product, technical, and validation lenses.
- Add a UX lens only when journey, interaction, information architecture, usability, or accessibility
  materially affects the direction.
- Add a creative lens only when brand, tone, content, game design, emotional target, visual or audio
  language, or memorability materially affects the direction.

Discovery lenses are advisory. They produce observations, options, recommendations, risks,
questions, evidence needs, and readiness impact. They do not create accepted truth or ask the human
directly. The orchestrator reconciles conflicts, deduplicates findings, and asks exactly one
highest-leverage human question.

Discovery artifacts live under:

```text
docs/development/discovery/<slug>/
  00-intake.md
  vision-brief.md
  decision-log.md
  research-notes.md   # only when research exists
  mockups/            # only when generated visual review aids exist
```

Avoid permanent lens transcript files by default. Later workflow stages should read the accepted
`vision-brief.md` and `decision-log.md`, not raw brainstorming.

Vision state is artifact state, not queue state:

| Vision State | Meaning |
| --- | --- |
| `Draft` | Proposed direction; not authoritative for autonomous specification. |
| `Accepted` | Human-approved direction for spec drafting and breakdown. |
| `Superseded` | A newer vision, spec, or ADR replaced it. |

After the vision is accepted, route to `draft-artifact` for a spec, ADR, or spike. Later stages
should interrupt the human only for real forks: choices that would materially change the accepted
vision, platform, ownership, storage, public surface, non-goals, or validation strategy.

### 5. Spec, ADR, Spike, Or Direct Direction

Use a spec when behavior, contracts, or user-visible semantics need agreement.

Use an ADR when the decision changes architecture direction, ownership, storage, public surface, or
operating policy.

Use a spike when evidence is missing and production work would otherwise guess.

Use direct direction only when the desired change is already clear, bounded, and testable.

Specs and ADRs are durable planning records. They may be superseded, but they are not disposable
scratch artifacts. Spike notes are evidence unless their findings are promoted into a spec, ADR, or
task.

Use `draft-artifact` to create or update one durable artifact from groomed direction:

- Draft specs go under `docs/development/specs/` with `Spec state: Draft`.
- Draft ADRs go under `docs/development/adrs/` with `Status: Proposed`.
- Spike plans or results go under `docs/development/spikes/`.
- UX specs may include generated visuals under `docs/development/specs/<slug>-assets/` when mockups
  or sample assets materially improve review.

Create artifact folders only when writing the first artifact in that folder. Do not keep empty
`docs/development/` subfolders as workflow placeholders.

Draft artifacts are reviewable proposals. They are not accepted truth until the human accepts them
through review or an explicit decision. Do not create implementation child work items from a draft
spec or proposed ADR.

For product or design specs, the draft must include a real product/design vision before detailed
rules: intended audience, experience pillars, core loop or workflow, comparable references or
research evidence, differentiators, and design risks. If the source grooming record does not support
that depth, do not draft a thin rules-only spec; return to interview or research.

For UX specs, include or link sample assets and mockups when they clarify layout, states, workflow,
visual hierarchy, or interaction feel. Generated visuals are review aids; the spec must say whether
they are accepted direction, illustrative examples, or assumptions needing human review.

Spec state is artifact state, not queue state:

| Spec State | Meaning |
| --- | --- |
| `Draft` | Proposed behavior or contract; not authoritative for autonomous implementation. |
| `Accepted` | Human-approved target for implementation. |
| `Implemented` | Merged code matches the accepted spec. |
| `Superseded` | A newer spec or ADR replaced this one. |

When a spec lives in the repo, acceptance happens through PR review of the spec document or an
explicit human decision recorded in the issue or PR. Use `review-artifact` to promote the artifact
state and record the decision. After the direction is accepted, send it to `breakdown-issue`. To
request changes without accepting, keep the artifact in draft/proposed state and record the revision
request in the issue, PR, or artifact decision history.

### 6. Breakdown

Use `breakdown-issue` after accepted direction and before implementation readiness.

Breakdown is the orchestration phase. Its job is to decompose accepted direction into independent,
merge-safe child work items. This can be quick and can happen in the same planning session, but it
is still a distinct step. No implementation work item is `Ready` until visible grooming has happened
and breakdown has produced or confirmed task boundaries.

Breakdown must produce child work items that are:

- Linked to the parent work item.
- Small enough for one agent, one branch or worktree, and one PR.
- Clear about goal, non-goals, source docs, owned area, allowed files, and forbidden files.
- Clear about contracts, APIs, storage, migrations, user surfaces, and architecture boundaries
  touched.
- Covered by acceptance criteria, feedback loop or test seam, required tests, and validation
  commands.
- Classified for merge risk.
- Self-contained enough that a runtime worker loop can start from the issue body, then follow links
  to authoritative specs, ADRs, code, or source evidence as needed.

Merge-risk values:

| Merge Risk | Description | When to use |
| --- | --- | --- |
| `Parallel-safe` | Low coordination risk with other branches. | Isolated tests, local bugs, report formatting, or unrelated areas. |
| `Needs coordination` | Can proceed with sequencing or communication. | Shared contracts, common files, public APIs, migrations, or architecture rules. |
| `Serial only` | Should not run in parallel with related work. | Foundational changes, contested design, or likely merge-conflict paths. |

If a child work item is still unclear, keep it in `Grooming`. If decomposition exposes a real design
fork, route back to grooming, spec, ADR, or spike. Do not hide architecture decisions inside task
splitting.

### 7. Prepare Or Re-Brief Implementation

Use `prepare-implementation` only when breakdown or issue history produced a Ready child work item
that is not yet a good worker handoff. The normal path is that `breakdown-issue` writes a complete
task contract into the issue body, and the human can authorize `work-issue-local` directly.

The issue body is the primary implementation task contract. It should contain:

- Goal.
- Non-goals.
- Source docs.
- Allowed files or directories.
- Forbidden files or directories.
- Architecture boundary.
- Contracts, APIs, storage, or user surfaces touched.
- Parent/child context and resolution expectations.
- Acceptance criteria.
- Feedback loop or test seam.
- Required tests.
- Validation command.
- Merge risk.
- Required PR summary sections.

Create a separate compact brief only when the issue is stale, has important decisions scattered
through comments, or would force a fresh worker to reconstruct the task from too many links before
starting. If the work item is clear but not decomposed into merge-safe implementation work, return it
to `breakdown-issue`. If the work item is unclear, return it to `groom-issue`.

### 8. Work Issue Locally

Use `work-issue-local` when a Ready work item is assigned for implementation, refactor, accepted
revision work, or a superseding child item.

Rules:

- One work item.
- One branch or worktree.
- One PR.
- No scope expansion.
- No merge.
- Preserve behavior unless the work item explicitly changes it.
- Stop for architecture forks.
- Ask before changing public APIs, ownership boundaries, storage shape, migration policy, or
  long-term abstractions.

Bind the worker loop to the Ready issue with a thin runtime prompt. The prompt should point to the
issue, `AGENTS.md`, and `work-issue-local`; it should not restate every AWK rule.

The implementation agent decides whether the full Architecture Direction Check is needed. Use the
full check when the task touches architecture, ownership, contracts, storage, public surface,
migrations, refactors, PR revisions, superseding work, accepted specs or ADRs, or detected smells.
For trivial tasks, a short "no architecture surface touched" note is enough.

For PR revisions, the implementation agent starts from the reviewer's classification but verifies
each item against the work item, diff, code, specs or ADRs, tests, and intended architecture before
coding. Review feedback is evidence, not a command.

Before coding, the implementation agent chooses the cheapest honest feedback loop: TDD for
behavior-changing work with a useful public seam, bug diagnosis for unreproduced failures,
characterization tests for risky refactors, or validation-only for trivial work where tests would be
brittle or lower signal.

When completing a child item, superseding refactor, or replacement PR, the implementation agent
reads the parent work item and decides whether the parent is now resolved, partly resolved, or
should return to grooming or breakdown.

### 9. Review

There are two review paths.

Use `review-local-changes` for lightweight pre-PR local diff review. It checks blockers,
architecture concerns, feedback-loop quality, test gaps, naming issues, scope drift, suggested
fixes, and taste-only notes.
When an implementation or general doc/code PR already exists, this same review is still the next
agent-owned step unless the PR or issue records that the agent review pass is complete. Artifact PRs
whose selected verb is `review-artifact` do not need a separate `review-local-changes` pass before
artifact acceptance; `review-artifact` owns that agent review.
If the change touches architecture-sensitive surfaces or reveals a smell, switch to
`review-revision-triage`.

Use `review-revision-triage` for risk-triggered PR review and non-trivial revision routing. Trigger
it when the PR touches architecture, ownership, contracts, storage, public surface, core domain
model, accepted specs or ADRs, or when either agent detects a smell, debt risk, unclear model,
boundary drift, or meaningful non-trivial disagreement.

Strong review must:

- Challenge architecture direction before ordinary findings.
- Verify review claims against code and source docs.
- Classify meaningful feedback as accepted, rejected, deferred, taste-only, or human decision
  needed.
- Add or recommend `revision-needed` when actionable work must be addressed before merge.
- Add or recommend `needs-human-review` when human architecture judgment or product direction is
  required.
- Explain non-trivial issues for a human who has not read the codebase recently.

Either agent can force human review. Both agents must agree before skipping human review. A revision
is agent-pickable only when both agents agree no human-review-worthy smell exists.

Review details stay on the PR. Use `revision-needed` and `needs-human-review` as labels when
available, or as issue comments when labels are not configured.

Use `Revision cycles` in the PR `AWK State` block as a hard loop counter. Increment it when the same
PR moves from review back to implementation for accepted revision work. After two unresolved agent
revision cycles, route to human review with `needs-human-review` and `Next workflow verb:
human-decision` instead of sending the PR through another agent revision pass.

### 10. Refactor And Superseding PRs

Do not add a dedicated refactor skill yet. Refactor is a work item type and an implementation path
handled by `work-issue-local`, usually routed by `review-revision-triage`.

If a refactor is required before merge:

- Keep it on the same PR when the current PR cannot be accepted without it.
- Create a linked `Refactor` child item and replacement PR when the cleanup is broader than the
  current PR or makes the original PR obsolete.
- Close the original PR as superseded when the replacement path makes it obsolete.
- Do not rewrite the original work item. Link the replacement child item or PR and preserve the audit
  trail.
- Keep the parent work item active while the replacement path is active unless a real blocker exists.

The agent completing the replacement work owns reading the parent work item and deciding whether the
parent is resolved.

### 11. Merge

Only the human merges.

Merge only when:

- The work item acceptance criteria are met.
- Required checks pass.
- Review conversations are resolved or explicitly deferred with owner, boundary, and removal
  condition.
- Architecture boundaries still hold.
- Relevant specs, ADRs, or development docs are updated when behavior, contracts, architecture, or
  accepted decisions changed.
- The PR summary records validation, decisions, smells, naming issues, and review triage when
  applicable.
- The PR body uses `Closes #issue` only for fully completed issues; otherwise it uses `Refs #issue`
  and leaves issue closure to post-merge reconciliation.
- The human approves.

Use squash merge by default so `main` keeps a readable history.

## Queue State

Keep queue state in issue text, the canonical `AWK State` block, `next:*` labels, comments, and
linked PRs. Do not add external tracker fields as a second workflow model. Blocker state belongs in
the state block and explanatory comments. Revision state belongs on the PR state block and review
labels.

## Loop Stop Conditions

After each workflow verb, stop and hand off instead of silently continuing when:

- human decision needed;
- no ready item exists;
- PR is waiting for human merge;
- validation cannot run;
- architecture fork detected;
- next workflow verb changes.

## Definition Of Ready

An implementation work item is Ready only when it has:

1. Parent work item link when applicable.
2. Goal.
3. Non-goals.
4. Relevant source docs or code.
5. Owned area or module.
6. Allowed files or directories.
7. Forbidden files or directories.
8. Contracts, records, APIs, storage, or user surfaces touched.
9. Acceptance criteria.
10. Feedback loop or test seam.
11. Required tests.
12. Validation command.
13. Merge-risk classification.
14. Parent resolution expectations for child items or superseding work.
15. Human decisions resolved, or clearly marked as required.

## Definition Of Done

An implementation work item is done only when:

- The requested behavior exists.
- The chosen feedback loop was run, or the reason for validation-only work is explicit.
- Focused validation has run, or the blocker is explicit.
- Architecture boundaries still hold.
- Durable docs are updated when behavior, contracts, architecture, or accepted decisions changed.
- Review feedback is triaged rather than blindly applied.
- Deferred debt has an owner, boundary, and removal condition.
- Parent work item resolution has been checked when the work is a child item or replacement path.

## CI Policy

CI should stay deterministic:

- Tests.
- Typecheck.
- Lint.
- Formatting.
- Build.
- Architecture or import-boundary checks.
- Issue-link or PR-template checks, when useful.

Codex-in-CI is deferred. It can be revisited later as advisory review or gating after the local
skills loop has proved useful and the security, prompt-injection, trigger, and API-key boundaries are
explicit.

## Later Capabilities

Revisit these after the local workflow is stable:

- Packaging skills as a plugin.
- Codex-in-CI advisory review.
- Structured issue automation.
- Dedicated refactor skill if refactor passes become frequent enough.
- More detailed spec, ADR, and spike templates.

## Process Feedback

Agents should include a brief `Process feedback` note in replies, issue comments, or PR summaries
when they encounter confusing instructions, missing fields, excess ceremony, unsafe autonomy,
merge-safety gaps, or ideas that would make the workflow easier to use. Use `improve-workflow` to
triage those notes before changing the process.
