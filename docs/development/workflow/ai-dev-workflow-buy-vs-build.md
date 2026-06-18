# AI Dev Workflow — Buy vs. Build

A mapping of `ai-dev-workflow.md` to features that already exist. Primary home is **GitHub**;
agent behavior lives in **Claude Code (CC)** and **OpenAI Codex**. "Verdict" says whether to lean
on the tool (Buy), keep it as a written convention (Keep), or actually author config (Build).

Status note: this was the initial buy-vs-build mapping that informed the workflow. The current
baseline for this repository is local-first Codex, not Codex Cloud. Cloud references below are useful
for comparison but are not adopted as the default execution model.

| Doc element | GitHub native | Agent tooling | Verdict |
| --- | --- | --- | --- |
| **Core delivery loop** (groom → spec → initiative → sub-issues → PR → review → merge) | Issues + Projects + Pull Requests + branch protection — this loop *is* the GitHub flow | CC: plan mode + subagents drive it locally. Codex: cloud tasks each return a PR | **Buy** — don't re-describe GitHub's own flow |
| **"Agents may not merge / expand scope / hide uncertainty"** | Branch protection (no direct merge), required reviews, CODEOWNERS, required status checks | CC: tool allowlists + hooks. Codex: PR-only sandbox, can't merge | **Buy** — enforce mechanically, not as prose |
| **Planning repo vs implementation repo** | Separate repo, or `/docs`, Wiki, or Discussions | CC: `CLAUDE.md`. Codex: `AGENTS.md` | **Keep** — a real choice, but a `/docs` folder often beats a second repo |
| **Roles: human owner / primary / secondary model** | CODEOWNERS + required human reviewer | CC: main session + reviewer subagent + Plan agent. Codex: task agent + Codex auto-review agent | **Buy** — primary/secondary = agent + review-agent, already standard |
| **Groom** | Issue triage, labels, Discussions | CC/Codex chat | **Keep** — genuine human+model thinking, no tool replaces it |
| **Spec / ADR / Spike** | Issue templates; markdown in repo | — | **Buy the templates** — ADR (MADR / adr-tools), RFC format, "spike" is XP. Don't reinvent |
| **Breakdown → Initiative + child issues** | Native **sub-issues**, task lists, Milestones, Projects roll-up | — | **Buy** — GitHub now does parent/child issues natively |
| **Assign work: one issue / branch / PR** | Assignee, branch, draft PR | CC: one **git worktree** per task (documented pattern). Codex: one sandbox per task → PR | **Buy** |
| **Review: CI / agent review / human** | Actions (CI), required checks, PR reviews, "conversations resolved" gate | CC: review via GitHub Action / review subagent. Codex: **automatic PR review**, flags P0/P1, follows `AGENTS.md` review rules | **Buy** — all three layers exist off the shelf |
| **Refactor pass** | Just another issue + PR | — | **Keep** — it's a label/issue, needs no machinery |
| **Merge criteria + squash** | Branch protection (checks pass, reviews resolved) + repo "squash merge only" setting | — | **Buy** — every criterion is a repo setting |
| **Board** (Status / Issue Type / Area / Merge Risk; statuses; types) | **Projects v2** single-select custom fields + built-in workflows; Milestones = Target Phase; labels | — | **Buy** — this section is a Projects config written as prose |
| **Definition of Ready / Done** | Issue **forms** (required fields) + PR template checklist + branch protection | — | **Build** — encode as an issue form + the PR template (Scrum origin) |
| **Agent Task Template** | Issue form (YAML) | Standard can also live in `CLAUDE.md` / `AGENTS.md` | **Build** — turn into a `.github` issue form |
| **PR Template** | `.github/PULL_REQUEST_TEMPLATE.md` | — | **Buy / drop-in** — you already wrote it |
| **Generic Quality Rules / Scope Limiters** | CI linters enforce a subset | The real home is `CLAUDE.md` / `AGENTS.md` (per-dir, applied to changed files) | **Build** — move these into agent config, not a standalone doc |
| **Project Overlays** | — | This *is* `CLAUDE.md` (nested) and `AGENTS.md` | **Buy the concept** — overlay = the config file the agents already read |

## What's actually left to build

After deferring to tooling, the doc shrinks to a handful of repo artifacts:

1. A Projects v2 board with the four custom fields + statuses.
2. Issue **forms** for Task / Spec / ADR / Spike (the Definition of Ready becomes required fields).
3. The PR template (done) + branch protection settings (no direct merge, required checks, squash-only).
4. `CLAUDE.md` and/or `AGENTS.md` holding the guardrails, quality rules, scope limiters, and overlay.

Everything else in `ai-dev-workflow.md` is either a GitHub feature described in prose or an
established convention (ADR, spike, DoR/DoD, trunk-based dev).

## Where Codex differs from Claude Code (matters for this workflow)

- **Codex is cloud-first and parallel by default** — you queue many tasks, each runs in its own
  sandbox, results arrive as separate PRs. That maps almost exactly to the doc's "one agent, one
  issue, one branch, one PR" and its parallel/merge-risk concern.
- **Claude Code is local-first** — worktrees + subagents on your machine; parallelism is something
  you orchestrate rather than the default.
- **Both read a config file** (`CLAUDE.md` vs `AGENTS.md`) — that's where the "Project Overlay" and
  "Agents may not…" rules belong.
- **Both auto-review PRs** — Codex posts P0/P1 review comments automatically; Claude Code does review
  via its GitHub Action / a review subagent. This covers the doc's "secondary model / adversarial
  reviewer" role without new process.
