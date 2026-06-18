## Outcome

Build the first usable version of the agent workflow kit by using the workflow itself: groom vague ideas, convert them into specs or ADRs where needed, implement narrow slices, review with agents/humans, and keep decisions auditable.

## Context

Seed materials are now in the repository:

- docs/development/workflow/ai-dev-workflow.md
- docs/development/workflow/ai-dev-workflow-buy-vs-build.md
- docs/development/agents/AGENTS.md
- docs/development/agents/skills/
- .github/ISSUE_TEMPLATE/
- .github/PULL_REQUEST_TEMPLATE.md

## Non-goals

- Do not build a heavy framework before the workflow has been tested.
- Do not assume Codex Cloud as the baseline execution model.
- Do not skip architecture-direction challenge just because the repo is small.

## First grooming questions

1. What is the smallest useful v1 deliverable for this kit?
2. Which parts must be GitHub config now versus docs-only guidance?
3. What should Codex-in-CI review first: PR template compliance, architecture direction, or issue readiness?
4. Which artifact should be groomed into the first accepted spec?
