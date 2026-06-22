# Agent Workflow Kit

Agent Workflow Kit is a source package for a GitHub-first agent workflow. It contains installable
agent guidance, skills, issue templates, workflow docs, validation scripts, and setup helpers.

This repository is not a normal installed target of the kit. Change it directly: inspect the source,
edit the relevant files, run validation, and commit or push only when asked.

## Repository Map

- `AGENTS.md`: source-repo operating rules for Codex and other agents.
- `kit/AGENTS.md`: minimal AWK usage block merged into target repository guidance.
- `kit/.agents/skills/awk/`: namespaced installable workflow and specialist skills.
- `.github/`: issue and PR templates copied into target repositories.
- `docs/awk/`: installable AWK process and reference docs copied into target repositories.
- `docs/development/`: durable source-repo decisions, dogfood results, specs, and spikes.
- `scripts/`: installer, validation, label setup, and optional setup helpers.

## Current Dogfood Mode

When improving the workflow through a realistic run, use a separate dogfood target repository.

The current focus is the detailed-plan path, not vague-idea discovery. If a real plan already
exists, do not start by re-interviewing the human as if the idea were blank. Start by having a
delegated agent inspect the plan, classify whether it is accepted enough to build from, identify any
missing decisions, and route to `review-artifact`, `breakdown-issue`, or
`prepare-implementation` as appropriate.

For vague ideas, still start from the beginning of the process so the run teaches us about the full
loop:

1. Reset or confirm the target baseline.
2. Create or select the initial work item.
3. Groom or inspect it carefully.
4. Discover, review, draft, spike, or decide only when the intake step proves that is needed.
5. Break accepted direction into one-agent, one-worktree, one-PR tasks.
6. Prepare implementation briefs.
7. Dispatch workers.
8. Review worker quality.
9. Promote useful lessons back into this source repo.

Use subagents to mimic handoffs between future agents. The main thread is the supervisor: it
orchestrates, delegates, monitors quality, records handoff state, and captures lessons. It should
not personally perform the workflow step being tested.

Each subagent should own one bounded workflow step or task. The goal is to see whether individual
agents follow the installed protocol from the state they receive. The supervisor evaluates their
work, asks the human when a delegated agent surfaces a real decision, and redirects the run when a
handoff fails instead of quietly doing the work itself.

Grooming should receive the most effort for vague ideas. Detailed-plan runs should spend their effort
on plan quality, readiness, decomposition, implementation briefs, and whether downstream agents can
follow the plan without hidden chat context.

## Future Vision

The intended flow is an autonomous fan-out loop where GitHub state is enough for agents to resume
without chat memory:

- grooming records the real problem and unresolved decisions,
- breakdown creates independent task boundaries,
- a dispatcher assigns prepared tasks to worktrees,
- worker agents open linked PRs,
- reviewer agents monitor quality and route revisions,
- humans retain architecture, product, approval, and merge decisions.

Until that dispatcher exists, simulate the sequence deliberately and record process feedback where
the workflow feels unclear, too heavy, too loose, or unsafe.

## Validation

Run source validation after changing installable files or workflow scripts:

```bash
node scripts/validate-workflow.mjs
node scripts/prove-portable-install.mjs
```
