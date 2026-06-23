---
name: review-artifact
description: "Review a durable planning artifact and record human acceptance or revision routing. Use after a vision brief, spec, or ADR is drafted and needs human approval before the workflow can move to spec drafting, breakdown, or implementation preparation."
---

# Review Artifact

Use this when a durable planning artifact is ready for human review. This skill promotes accepted
planning truth or routes the artifact back to revision; it does not draft, break down, or implement
work. When the artifact is proposed through a linked PR, this skill is the agent review pass for that
artifact PR.

## Inputs To Read

- The artifact under review:
  - `docs/development/discovery/<slug>/vision-brief.md`
  - `docs/development/specs/<name>.md`
  - `docs/development/adrs/<name>.md`
- Related decision log, if one exists.
- Linked issue or PR that exposes the proposed artifact diff, if review is happening through GitHub.
- Source provenance named by the artifact only when needed to verify the review decision.

## Review Rules

- Accept only when the human explicitly approves the artifact as authoritative for the next workflow
  stage.
- Route back to revision when the human gives feedback that requires changes before the next
  workflow stage.
- Do not silently resolve open product, architecture, ownership, storage, public-surface, or
  validation forks during review.
- Do not create child work items, implementation briefs, branches, commits, or PRs.
- Do not route an artifact PR to `review-local-changes` only because it is a PR. Use
  `review-artifact` to review artifact substance, state, decision history, source linkage, and next
  workflow routing. Use `review-local-changes` for implementation or general doc/code diffs that are
  not durable artifact acceptance reviews.
- Preserve the audit trail. Record acceptance decisions and durable revision requests with reviewer
  response, timestamp, and next action.

## State Changes

Supported first-pass state transitions:

| Artifact | Draft state | Accepted state | Next workflow |
| --- | --- | --- | --- |
| Vision brief | `Vision state: Draft` | `Vision state: Accepted` | `draft-artifact` |
| Spec | `Spec state: Draft` | `Spec state: Accepted` | `breakdown-issue` |
| ADR | `Status: Proposed` | `Status: Accepted` | depends on ADR consequence |

If the artifact is already accepted, report that no state change is needed. If it is implemented,
superseded, blocked, or in an unknown state, stop and ask for the intended review action.

## Decision Record

Prefer an existing sibling decision log when present:

- Vision briefs normally use `decision-log.md` in the same discovery directory.
- Specs and ADRs normally record review history in the artifact itself under
  `## Human decision history`.

For revision requests, keep the artifact in its draft/proposed state and record the requested
change where the next agent can find it. The revision request should name the artifact path, the
requested change, and whether a human decision is still needed.

## Output

Return:

```md
## Artifact review
Path:
Type:
Decision: Accepted | Rejected | No-op | Blocked

## State change

## Decision record

## Next action

## Process feedback
```
