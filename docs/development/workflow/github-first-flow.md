# GitHub-First Workflow Flow

Status: draft

This is the v0 operating flow for Agent Workflow Kit. The goal is not to build an agent platform
first. The goal is to make work resumable from GitHub state so a human can answer from GitHub
Mobile and a local agent can later continue without chat memory.

## Product Promise

```text
Human leaves the keyboard
  -> answers a question or approves direction in GitHub
  -> later asks Codex to continue work
  -> Codex reads GitHub issues, PRs, and repo docs
  -> Codex knows the next safe workflow step
```

The setup script is supporting machinery. It should encode and reproduce this flow, but it is not
the source of truth for the workflow.

Issues and PRs are the default coordination surface. Keep current state visible in issue comments,
linked PRs, labels, validation summaries, and repo docs.

## Surfaces

| Surface | Owns | Does not own |
| --- | --- | --- |
| GitHub Issue | Work item, discussion, human answers, process feedback, source links. | Accepted durable specs or architecture truth by itself. |
| GitHub PR | Proposed repo doc or code change, review discussion, validation summary. | Autonomous merge or hidden acceptance. |
| `docs/development/` | Accepted durable truth after review: vision, specs, ADRs, spikes, workflow docs. | Raw scratch planning. |
| `.agents/skills/` | Procedural rules for agents. | Project-specific accepted direction. |

## Issue And PR State

The active issue or PR should make the next move legible:

| State Need | Where It Lives |
| --- | --- |
| Work shape | Issue title, issue template, and labels such as `task`, `spec`, `adr`, `bug`, or `refactor`. |
| Current status | Latest issue or PR comment, linked PR state, and labels such as `revision-needed`. |
| Human decision needed | Explicit issue or PR comment that asks one question or names the needed approval. |
| Accepted durable truth | Repo docs under `docs/development/` after review. |
| Proposed doc/code change | Linked PR with validation and issue linkage. |
| Merge readiness | PR review, checks, validation summary, and unresolved labels. |

Avoid hidden blocker state. A blocker should be expressed as a clear issue or PR comment, with a
label such as `needs-human-review` or `needs-source-evidence` when useful.

## Review Handoff Rule

For doc or code changes, `Status = Review` requires a linked GitHub PR that exposes the diff. Local
commits without a PR stay `In Progress`; the issue comment should record the commit and make opening
a PR the next action.

GitHub draft state is not the default workflow holding pen. Open PRs as ready for review when the
branch is pushed, validation has run, and the PR body records issue linkage and current review state.
Use draft only when work is knowingly incomplete, validation is missing, or the PR is exposing a WIP
diff without asking for attention.

A linked PR is the first review surface for the agent, whether GitHub marks it draft or ready for
review. Until the issue or PR records a completed agent review pass, route the next `continue-work`
pass to `review-local-changes`. The agent should fix accepted findings or classify them before
asking the human for merge approval. If review finds architecture ambiguity, ownership drift,
public-surface risk, storage risk, or an unclear long-term model, route to human architecture
judgment instead of treating it as ordinary cleanup.

`Review` is a visible acceptance handoff, not mandatory heavyweight ceremony. For low-risk docs,
process, or chore changes, clean validation plus explicit human approval is enough to move to the
human-owned merge step. Use deeper review when the change affects architecture, ownership, public
surface, storage, or an unclear long-term model.

Issue-only decisions may be reviewed in the issue thread when there is no repo diff to inspect. In
that case, the issue comment must name the exact question, artifact, or decision being reviewed.

## Issue Linkage Rule

PR bodies should use GitHub closing keywords only when the PR can close the work item by itself.
Use `Closes #issue` when the PR fully satisfies the issue acceptance criteria and needs no
post-merge reconciliation. Use `Refs #issue` for initiatives, parent work, partial completion,
deferred work, review-triage follow-up, architecture ambiguity, or uncertainty.

## Continue-Work Loop

When the human says "continue work," the agent should:

1. Read open PRs first.
2. Read open issues, preferring ones named by the user, recently updated, assigned, labeled, or
   linked from docs.
3. Prefer ready-looking items with clear acceptance criteria and validation.
4. Read the selected issue, comments, linked PRs, and named repo docs.
5. Choose one workflow verb.
6. Either ask one question, update or draft docs, review an artifact, break down accepted direction,
   prepare implementation, or implement only when the user has clearly authorized implementation.
7. Keep doc/code work `In Progress` until a linked PR exists; do not mark local-only commits as
   `Review`.
8. Do not infer review completion from GitHub draft/ready state.
9. For a linked PR without a recorded agent review result, route to `review-local-changes` before
   human merge approval.
10. End with current state, next actor, decision needed, next step, and process feedback.

The expected reply shape is:

```md
## Continue Work

Selected item:
Reason:
Next workflow verb:

## Current state

## Next action

## Recommended GitHub updates

## Process feedback
```

## Human Mobile Loop

When an agent needs human input:

1. The agent asks exactly one question in an issue comment.
2. The comment explains why the answer matters and what happens next.
3. The issue can use labels such as `needs-human-review`, `needs-source-evidence`, or `human-only`
   when useful.
4. The human answers in GitHub Mobile or GitHub web.
5. The next `continue-work` run reads that answer and moves the item forward.

The answer should live in the issue thread. Chat-only answers are useful for the current session but
are weak resume state. When a chat answer changes direction, record it in the issue before relying
on it later.

## Durable Artifact Loop

Use durable repo docs when direction should survive beyond an issue thread:

```text
groom issue
  -> discover vision when product/design/platform direction is vague
  -> draft artifact in docs/development/
  -> review through PR or explicit recorded human decision
  -> mark the artifact accepted only after human acceptance
  -> break down accepted direction into executable issues
```

Draft artifacts are proposals. Implementation should not proceed from a draft vision brief, spec,
or ADR unless the human explicitly says to ignore that gate for the current work.

When a draft artifact changes repo docs, review should happen through a PR. Direct issue-thread
approval is reserved for decisions or artifact text that is already fully visible in the issue.

## Implementation Loop

Full agent execution is a later proof after the mobile-resumable loop is working.

For v0, implementation should happen only when:

- the issue is `Ready`,
- acceptance criteria and validation are clear,
- merge risk is classified,
- the user has asked the agent to implement in the current turn.

Issue labels or comments do not by themselves prove implementation permission. That permission
still comes from the user instruction and should be visible in the issue or current thread.

## Process Feedback Loop

Every meaningful dogfood pass must identify workflow weakness when it sees one. Keep this lightweight
and close to the work:

- missing or confusing labels or issue templates,
- unclear next action or decision-needed state,
- issue comments that are insufficient for resume,
- too much ceremony before useful work,
- unsafe autonomy or unclear approval boundaries,
- gaps between GitHub Mobile usage and local Codex resume,
- places where setup scripts, docs, templates, or skills fail to explain the real workflow.

Record the weakness in the issue comment or PR summary where it was observed. Route durable changes
through `improve-workflow` when the feedback is actionable.

## Known V0 Weaknesses

These weaknesses appeared during the first GitHub-first dogfood pass:

- Review handoff was initially too loose: #11 moved to `Review` with only a local commit, so GitHub
  Mobile could not inspect the diff. Accepted rule: doc/code work requires a linked PR before
  `Status = Review`.
- Review handoff then became too ceremonious for low-risk chore/process work. Adjusted rule:
  `Review` means visible acceptance handoff; deeper review is reserved for meaningful risk.
- PR handoff was still too early: #13 showed that PR state plus validation can accidentally ask the
  human to review before the agent has run its own review pass. Accepted rule: linked PRs without
  recorded agent review route to `review-local-changes`, regardless of GitHub draft/ready state.
  Human approval means merge
  approval; architecture ambiguity still routes to the human before merge.
- Draft PRs became ceremony after the agent-review gate moved into comments and fields. Accepted
  rule: open ready PRs by default after validation; use draft only for known WIP, missing
  validation, or intentionally exposed unfinished diffs.
- Issue closure was left to human memory: #13 used `Refs #7`, so merging did not close a simple
  task after it became complete. Accepted rule: agents choose `Closes` only when the PR fully
  completes the issue; otherwise they use `Refs` and let `continue-work` reconcile after merge.
- Implementation permission is not fully represented by issue labels or issue wording. Until the
  workflow has a better signal, the agent must rely on the current user request or a clear issue
  comment before mutating code.
- Ordering dependencies are not first-class. `continue-work` must read issue bodies, comments,
  linked PRs, and source docs, not labels alone.

## Dogfood Path

Use a separate target repository for dogfooding so Agent Workflow Kit does not improve itself through
the same workflow it is packaging. Start from a clean branch in the target project, record only the
minimum issue or PR state needed to explain the direction, and promote lessons back into this repo
after they prove useful.
