# AGENTS.md

This file is guidance for working inside the Agent Workflow Kit source repository.

This repository is not an installed target of Agent Workflow Kit. It is the source package where we
improve the kit itself: installable instructions, skills, issue templates, workflow docs, validation
scripts, and optional setup helpers.

## Core Rule

Do not use the kit workflow on this repository as if this repository were a normal target project.

That means:

- Do not create GitHub issues, PRs, Project items, or workflow status updates just to manage ordinary
  self-improvement work in this repo.
- Do not force this repo through `continue-work`, `groom-issue`, `breakdown-issue`,
  `prepare-implementation`, or `work-issue-local` as mandatory gates.
- Do not treat local source changes here as needing the installed target-repo handoff loop.
- Do not recursively dogfood the kit on itself unless the human explicitly asks for that experiment.

Use direct repository work instead: inspect the source, discuss the change with the human, edit the
source files, run validation, and commit or push only when asked.

## Source vs Installed Guidance

- Root `AGENTS.md` is for this source repository only.
- `kit/AGENTS.md` is the installable guidance copied into target repositories.
- `kit/.agents/skills/` contains installable skills for target repositories.
- `.github/ISSUE_TEMPLATE/` and `.github/PULL_REQUEST_TEMPLATE.md` are package assets for target
  repositories, not process requirements for this source repository.
- `docs/development/` records durable design and workflow guidance that ships with or explains the
  kit.

When changing installed behavior, update the installable files under `kit/`, `.github/`,
`docs/development/`, and `scripts/` deliberately. Keep root-only guidance out of the installed
package unless the human explicitly wants it installed into target repos.

## Self-Improvement Policy

Self-improvement work in this repo should stay lightweight and explicit:

- Prefer small source edits over new process machinery.
- Record important lessons in README or durable docs when they should shape future kit behavior.
- Validate with `node scripts/validate-workflow.mjs` and `node scripts/prove-portable-install.mjs`
  when installed files or installer behavior change.
- Use the separate dogfood target repo for realistic workflow trials.
- Promote only useful lessons from dogfood runs back into this source repo.

If a request is vague, ask a normal clarification question. Do not start the kit workflow to discover
what the human meant.

## GitHub

Agents must not merge. For this source repository, do not open PRs or create issue workflow state
unless the human explicitly asks. If the human says to commit or push, commit or push directly on the
current branch after validation.
