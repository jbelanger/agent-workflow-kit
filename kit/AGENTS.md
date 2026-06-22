# Agent Workflow Kit

<!-- BEGIN_AGENT_WORKFLOW_KIT -->
## Agent Workflow Kit

This project uses Agent Workflow Kit (AWK) for GitHub-first planning, implementation routing, and
review handoffs.

### Flow At A Glance

AWK is a Kanban-like GitHub issue flow:

```text
Inbox -> Grooming -> Discovery/Vision or Drafting -> Breakdown -> Ready -> In Progress -> Review -> Done
```

- Start with `init-awk` in a new repo. Do not run the workflow until the repo is pushed, labels are
  set up, and initial work exists as GitHub issues.
- Use `continue-work` to read issues, PRs, repo docs, and optional Project fields, then choose the
  next workflow verb.
- Route unclear work to `groom-issue`; use `discover-vision`, `draft-artifact`, or
  `review-artifact` only when grooming shows direction or durable docs are needed.
- Route accepted direction to `breakdown-issue`, then use `prepare-implementation` to make one Ready
  child issue executable by one agent.
- Route prepared implementation work to `work-issue-local`.
- Route local diffs or PRs without a recorded agent review to `review-local-changes`; use
  `review-revision-triage` for non-trivial PR feedback or architecture-sensitive review.
- Do not skip from vague idea or Inbox directly to implementation.

- AWK skills live under `.agents/skills/awk/`.
- AWK process docs live under `docs/awk/`.
- Project-owned durable artifacts live under `docs/development/`.
- Use `.agents/skills/awk/process/init-awk/SKILL.md` before starting AWK workflow in a new repo.
- Do not start AWK implementation work until the repo is pushed to GitHub and the work is represented
  by GitHub issues.
- Use `.agents/skills/awk/process/continue-work/SKILL.md` when asked to infer the next workflow step
  from GitHub issues, PRs, and repo docs.
- Agents must not merge.
<!-- END_AGENT_WORKFLOW_KIT -->
