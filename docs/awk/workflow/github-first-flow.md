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
  -> Codex reads GitHub issues, PRs, repo docs, and Project fields when present
  -> Codex knows the next safe workflow step
```

GitHub Projects are optional coordination surfaces. The default installed kit should work with
ordinary GitHub issues, PRs, and repo docs before any board setup exists.

## Surfaces

| Surface | Owns | Does not own |
| --- | --- | --- |
| GitHub Issue | Work item, discussion, human answers, process feedback, source links. | Accepted durable specs or architecture truth by itself. |
| GitHub Project | Optional operating state: status, next actor, decision needed, area, merge risk, artifact state. | Required baseline workflow or full evidence trail. |
| GitHub PR | Proposed repo doc or code change, review discussion, validation summary. | Autonomous merge or hidden acceptance. |
| `docs/development/` | Accepted durable truth after review: vision, specs, ADRs, spikes, workflow docs. | Raw scratch planning. |
| `.agents/skills/awk/` | Procedural rules for agents. | Project-specific accepted direction. |

## Optional Project Fields

When a repository uses a Project, the Project should make the next move legible:

| Field | Meaning |
| --- | --- |
| `Status` | Coarse lifecycle: `Inbox`, `Grooming`, `Discovery`, `Drafting`, `Breakdown`, `Ready`, `In Progress`, `Review`, `Done`, or `Deferred`. |
| `Issue Type` | The work shape: `Initiative`, `Discovery`, `Spec`, `ADR`, `Spike`, `Task`, `Bug`, or `Refactor`. |
| `Next Actor` | Who should move next: `Human`, `Agent`, or `Either`. |
| `Decision Needed` | Why work cannot continue automatically: `None`, `Question`, `Approval`, `Research`, `Architecture`, or `Access`. |
| `Area` | The affected workflow, docs, CI, guidance, GitHub config, governance, or project area. |
| `Merge Risk` | Coordination risk: `Parallel-safe`, `Needs coordination`, or `Serial only`. |
| `Artifact State` | State of a linked durable artifact: `None`, `Draft`, `Accepted`, `Implemented`, or `Superseded`. |

Avoid `Blocked` as a status. A blocker should always be expressed in a clear issue comment, with
Project fields added only when a Project exists.

## Review Handoff Rule

For doc or code changes, `Status = Review` requires a linked GitHub PR that exposes the diff. Local
commits without a PR stay `In Progress`; the issue comment should record the commit and make opening
a PR the next action.

GitHub draft state is not the default workflow holding pen. Open PRs as ready for review when the
branch is pushed, validation has run, and the PR body records issue linkage and current review state.
Use draft only when work is knowingly incomplete, validation is missing, or the PR is exposing a WIP
diff without asking for attention.

A linked PR is the first review surface for the agent, whether GitHub marks it draft or ready for
review. Until the issue or PR records a completed agent review pass, keep the item `In Progress`
with `Next Actor = Agent` and route the next `continue-work` pass to `review-local-changes`. The
agent should fix accepted findings or classify them before asking the human for merge approval. If
review finds architecture ambiguity, ownership drift, public-surface risk, storage risk, or an
unclear long-term model, route to human architecture judgment instead of treating it as ordinary
cleanup.

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
2. Read the active Project when one exists.
3. Prefer `Ready` items where issue text, labels, comments, or Project fields show the next actor is
   `Agent` or `Either`.
4. Read the selected issue, comments, linked PRs, and named repo docs.
5. Route selected implementation work without a visible grooming result back to `groom-issue`.
6. Choose one workflow verb.
7. Either ask one question, update or draft docs, review an artifact, break down accepted direction,
   prepare implementation, or implement only when the user has clearly authorized implementation.
8. Keep doc/code work `In Progress` until a linked PR exists; do not mark local-only commits as
   `Review`.
9. Do not infer review completion from GitHub draft/ready state.
10. For a linked PR without a recorded agent review result, route to `review-local-changes` before
   human merge approval.
11. End with current state, next actor, decision needed, next step, and process feedback.

The expected reply shape is:

```md
## Continue Work

Selected item:
Reason:
Next workflow verb:

## Current state

Status:
Issue Type:
Next Actor:
Decision Needed:
Artifact State:
Merge Risk:

## Next action

## Recommended GitHub updates

## Process feedback
```

## Human Mobile Loop

When an agent needs human input:

1. The agent asks exactly one question in an issue comment.
2. The issue remains in the relevant planning state.
3. `Next Actor` becomes `Human`.
4. `Decision Needed` becomes `Question`, `Approval`, `Architecture`, `Research`, or `Access`.
5. The human answers in GitHub Mobile or GitHub web.
6. The next `continue-work` run reads that answer and moves the item forward.

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
  -> mark Artifact State = Accepted only after acceptance
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
- `Next Actor` is `Agent` or `Either`,
- `Decision Needed` is `None`,
- acceptance criteria and validation are clear,
- merge risk is classified,
- the user has asked the agent to implement in the current turn.

The current Project fields do not by themselves prove implementation permission. That permission
still comes from the user instruction and should be visible in the issue or current thread.

## Process Feedback Loop

Every meaningful dogfood pass must identify workflow weakness when it sees one. Keep this lightweight
and close to the work:

- missing or confusing Project fields when a repo uses a Project,
- unclear next actor or decision-needed state,
- issue comments that are insufficient for resume,
- too much ceremony before useful work,
- unsafe autonomy or unclear approval boundaries,
- gaps between GitHub Mobile usage and local Codex resume,
- places where setup scripts, docs, templates, or skills fail to explain the real workflow.

Record the weakness in the issue comment or PR summary where it was observed. Route durable changes
through `improve-workflow` when the feedback is actionable.
