# ARCHON-SPIKE-010: Skills With Codex

Status: complete

## Question

How does Archon actually expose `.agents/skills` to Codex nodes, and can workflow YAML scope them?

## Setup

This was a docs/source spike plus live dogfood evidence from the current Archon route. I inspected
the local Archon source under `/Users/joel/Dev/Archon` and the current `agent-workflow-kit`
`.archon/` adapter commands. No production workflow change was made as part of this spike.

Relevant live dogfood:

- `awk-continue-work` produced a `GROOM_OR_TRIAGE` routing artifact and recommended grooming.
- `awk-groom-issue` successfully used the portable `groom-issue` skill instructions and produced a
  spike-shaped recommendation for this question.

Relevant kit files:

- `.archon/commands/awk-continue-work.md`
- `.archon/commands/awk-groom-issue.md`
- `.agents/skills/process/groom-issue/SKILL.md`
- `docs/development/workflow/adr-archon-portable-skills.md`

## Evidence

Archon's DAG executor passes raw node fields to providers through `nodeConfig`. That includes
`skills: node.skills`, and capability warnings only check whether the provider claims it supports a
feature. The executor does not itself resolve skill names for all providers.

Source: `/Users/joel/Dev/Archon/packages/workflows/src/dag-executor.ts:547`,
`/Users/joel/Dev/Archon/packages/workflows/src/dag-executor.ts:612-638`.

Codex reports `skills: true`, but the capability comment is explicit: this means filesystem
autodiscovery from `.agents/skills/`, not per-node injection, and `nodeConfig.skills` is ignored.

Source: `/Users/joel/Dev/Archon/packages/providers/src/codex/capabilities.ts:3-8`.

The Codex provider starts or resumes a Codex SDK thread with `workingDirectory: cwd`, then handles
MCP and structured output request options. In the inspected send path, it reads
`requestOptions.nodeConfig.mcp`; it does not translate `requestOptions.nodeConfig.skills` into Codex
thread or turn options.

Source: `/Users/joel/Dev/Archon/packages/providers/src/codex/provider.ts:78-94`,
`/Users/joel/Dev/Archon/packages/providers/src/codex/provider.ts:725-765`.

Archon's resource validator treats workflow YAML `skills:` as a `.claude/skills` check. It looks for
`<cwd>/.claude/skills/<name>/SKILL.md` and `~/.claude/skills/<name>/SKILL.md`, then warns if missing.
It does not validate this repo's `.agents/skills` tree for that field.

Source: `/Users/joel/Dev/Archon/packages/workflows/src/validator.ts:468-499`.

Pi is different. The Pi provider explicitly resolves `nodeConfig.skills` through the shared skill
resolver, warns on missing skills, and passes resolved paths as `additionalSkillPaths`.

Source: `/Users/joel/Dev/Archon/packages/providers/src/community/pi/provider.ts:375-386`,
`/Users/joel/Dev/Archon/packages/providers/src/community/pi/provider.ts:471-477`.

Archon's shared skill resolver is `.agents`-aware. Its search order is project `.agents/skills`,
project `.claude/skills`, user `.agents/skills`, then user `.claude/skills`. That resolver only
matters for providers that call it. Pi does; Codex does not in the inspected code path.

Source: `/Users/joel/Dev/Archon/packages/providers/src/shared/skills.ts:12-27`,
`/Users/joel/Dev/Archon/packages/providers/src/shared/skills.ts:49-91`.

## Behavior Matrix

| Case | Behavior | AWK posture |
| --- | --- | --- |
| Local Codex in this repo | Codex can see repo-local skill files through the normal working directory context exposed by the Codex environment. | Keep portable skills as the source of truth. |
| Archon Codex with explicit skill instructions in the command prompt | Works in current dogfood: adapter commands can tell Codex exactly which `.agents/skills/.../SKILL.md` owns the procedure. | Keep this pattern. |
| Archon Codex with workflow YAML `skills:` only | Not a reliable selection mechanism. Codex capability says `nodeConfig.skills` is ignored, and the provider send path does not translate it. | Do not use this to scope Codex skills. |
| Archon Pi with workflow YAML `skills:` | Real name-based resolution through `.agents/skills` / `.claude/skills`, passed as `additionalSkillPaths`. | Viable provider variant if Pi is otherwise suitable. |
| Archon validator for `skills:` | Checks `.claude/skills`, not `.agents/skills`. | Do not rely on Archon's validator to prove AWK skill wiring. |

## Result

Conditional.

Archon can run Codex against this repo and the adapter commands can successfully route Codex to the
portable skills, but Archon's workflow YAML `skills:` field is not the Codex scoping mechanism we
want. For Codex, skill use is either native filesystem/context discovery or explicit prompt routing.
It is not per-node skill injection by Archon.

## What This Means For Agent Workflow Kit

- Keep `.agents/skills` as the portable workflow source of truth.
- Keep `.archon/commands/awk-*` as adapter prompts that explicitly name the owning skill and artifact
  contract.
- Do not add `skills:` to Codex-backed AWK workflows as if it enforced or selected the skill.
- Keep `scripts/validate-archon-pack.mjs` checking that each adapter command points to the owning
  skill, because Archon's own validator will not catch missing `.agents/skills` references for
  Codex.
- If a workflow genuinely needs Archon-level name-based skill injection, evaluate a Pi variant
  separately from the current Codex-default route.

## Follow-Up Work

- Add a kit policy check if any Codex-backed AWK workflow starts declaring `skills:`.
- Keep dogfooding new adapters by asking them to read the portable skill path explicitly.
- Consider an upstream Archon issue or PR so validator/provider docs distinguish Codex filesystem
  autodiscovery from provider-level `skills:` injection.
