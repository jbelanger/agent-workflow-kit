# Agent Workflow Kit

<!-- BEGIN_AGENT_WORKFLOW_KIT -->
## Agent Workflow Kit

This project uses Agent Workflow Kit (AWK) for GitHub-first planning, implementation routing, and
review handoffs.

### Flow At A Glance

AWK is a lightweight agent-loop contract. Route by task shape first; do not force every item through
every gate. `continue-work` owns the detailed task-shape routing table.

```text
Intake -> Shape -> Execute -> Review -> Improve
```

- Start with `init-awk` in a new repo. Do not run the workflow until the repo is pushed, labels are
  set up, and initial work exists as GitHub issues.
- Use `continue-work` to read issues, PRs, repo docs, and labels, then choose the next workflow
  verb.
- **Intake:** `init-awk`, `groom-issue`.
- **Shape:** `discover-vision`, `draft-artifact`, `review-artifact`, `breakdown-issue`.
- **Execute:** `work-issue-local`; use `prepare-implementation` only to re-brief a stale or
  incomplete Ready issue before handing it to a worker.
- **Review:** `review-local-changes`, `review-revision-triage`.
- **Improve:** `triage-finding`, `improve-workflow`.

Do not skip from vague idea or Inbox directly to implementation. A fast lane still needs visible
issue state, a `DIRECT_TASK` rationale, one-agent scope, acceptance criteria, validation, and merge
risk. Runtime worker loops are ephemeral; GitHub issues, PRs, and repo docs remain the durable AWK
state.

When a planning skill changes the next workflow verb, stop after recording the handoff. A human
choosing a path, slice, or route during grooming is routing input, not implementation authorization;
start implementation only from a separate `work-issue-local` assignment after visible Ready state
exists.

When any skill surfaces a material finding that may change product/design direction, architecture,
validation targets, scope, or accepted artifacts, stop and route the finding to the owning thinking
step before more execution. Use `triage-finding` when the route is not obvious; record the evidence,
why it matters, the owner, and the recommended next workflow verb in durable issue/PR state.

- AWK skills live under `.agents/skills/awk/`.
- AWK process docs live under `docs/awk/`.
- Project-owned durable artifacts live under `docs/development/`.
- Use `.agents/skills/awk/process/init-awk/SKILL.md` before starting AWK workflow in a new repo.
- Do not start AWK implementation work until the repo is pushed to GitHub and the work is represented
  by GitHub issues.
- Use `.agents/skills/awk/process/continue-work/SKILL.md` when asked to infer the next workflow step
  from GitHub issues, PRs, and repo docs.
- When modifying installed AWK workflow files, keep the Agent Workflow Kit source package in sync:
  promote the same change by cherry-pick or PR when possible, or explicitly tell the human that this
  repo's AWK workflow now differs from the package and should be synced.
- Agents must not merge.
<!-- END_AGENT_WORKFLOW_KIT -->
