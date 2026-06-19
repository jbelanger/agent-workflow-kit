# ARCHON-SPIKE-011: Provider Tool Permissions

Status: complete

## Question

Is Codex permission behavior inside Archon acceptable for mutating workflows, or do we need
Claude/Pi variants for stronger node restrictions?

## Setup

- Repo profile defaults to Codex: `.archon/config.yaml:1-7`.
- Spike protocol and result template came from `docs/development/workflow/archon-concept-spikes.md:31-50`; spike 011 asks this exact provider/tool-permission question at `docs/development/workflow/archon-concept-spikes.md:65-67`.
- Evidence source was docs/source inspection only. No dependencies installed, network used, or AI providers run.

## Evidence

- Archon's security doc says automated runs avoid interactive prompts: Claude uses
  `bypassPermissions`, with full read/write/shell access and no per-action confirmation
  (`/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/reference/security.md:12-31`).
- Workflow docs expose `allowed_tools` / `denied_tools` on AI nodes, but still describe them
  as Claude-only and list `sandbox` as Claude-only
  (`/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/guides/authoring-workflows.md:207-230`).
- MCP docs are clearer for Codex: Codex supports per-node `mcp`, but `allowed_tools: []`
  does not make an MCP-only sandbox on Codex
  (`/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/guides/mcp-servers.md:173-202`,
  `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/guides/mcp-servers.md:378-399`).
- The validator resolves the provider and warns when a node sets tool restrictions on a
  provider whose `toolRestrictions` capability is false; it does not fail the workflow
  (`/Users/joel/Dev/Archon/packages/workflows/src/validator.ts:503-540`).
- Registered providers are Claude and Codex built-ins, plus OpenCode, Pi, and Copilot
  community providers (`/Users/joel/Dev/Archon/packages/providers/src/registry.ts:110-181`).

Provider behavior:

| Provider | Tool restrictions | Other relevant limits |
| --- | --- | --- |
| Claude | Yes. Capability true; `allowed_tools` maps to SDK `tools`, `denied_tools` to `disallowedTools`; `sandbox` also passes through. | Still runs with `permissionMode: 'bypassPermissions'` and `allowDangerouslySkipPermissions: true`; sandbox is the stronger extra layer. Refs: `claude/capabilities.ts:3-18`, `claude/provider.ts:275-289`, `claude/provider.ts:408-410`, `claude/provider.ts:904-918`. |
| Codex | No. Capability false; validator warning only. | Supports MCP and structured output, but starts threads with `sandboxMode: 'danger-full-access'`, network enabled, and approval policy `never`; turn options handle output schema only. Refs: `codex/capabilities.ts:3-18`, `codex/provider.ts:78-95`, `codex/provider.ts:281-317`, `codex/provider.ts:736-765`. |
| Pi | Yes. Capability true; filters the seven built-in tools `read`, `bash`, `edit`, `write`, `grep`, `find`, `ls`; `allowed_tools: []` means no tools. | No MCP and no OS sandbox. Refs: `pi/capabilities.ts:19-34`, `pi/options-translator.ts:109-256`. |
| OpenCode | Yes. Capability true; tool permissions are modeled through OpenCode agents and prompt body `tools`. | No sandbox; restrictions require the agent adaptation path. Refs: `opencode/capabilities.ts:18-33`, `opencode/agent-config.ts:58-86`, `opencode/agent-config.ts:134-149`, `opencode/session.ts:55-79`. |
| Copilot | Yes. Capability true; `allowed_tools` maps to `availableTools`, `denied_tools` to `excludedTools`. | No sandbox; SDK permission requests are approved by Archon's `approveAll` callback. Refs: `copilot/capabilities.ts:14-29`, `copilot/provider.ts:183-200`, `copilot/provider.ts:315-347`. |

Codex-specific support/ignore summary:

- Supports: model/reasoning/web-search config, session resume, MCP config injection, env injection,
  filesystem skill autodiscovery, and enforced structured output (`codex/capabilities.ts:3-18`).
- Ignores or lacks: `allowed_tools`, `denied_tools`, hooks, inline agents, cost control, fallback
  model, sandbox, and native in-process tools (`codex/capabilities.ts:6-17`).
- Practical consequence: a Codex node cannot be made "read-only", "no shell", "no write", or
  "MCP-only" by Archon YAML. Any such claim is prompt/process discipline, not an enforced
  provider permission boundary.

## Result

Conditional

Codex-default Archon is acceptable only for trusted local workflows where the node is intended to
have broad worktree access, or for deterministic `bash`/`script` nodes and AI classifier/report
nodes whose safety does not depend on tool restriction enforcement.

It is not acceptable as the sole provider for mutating workflows that require strong per-node
permission separation, such as read-only investigation before implementation, no-shell review,
no-write planning, or MCP-only external lookup. Those need provider variants that actually enforce
tool restrictions: Claude for the strongest current option because it also has `sandbox`, or Pi
when its built-in tool set is sufficient and MCP is not needed.

## What This Means For Agent Workflow Kit

- Keep the current Codex-default profile for now only as a broad-access local default, not as a
  security boundary.
- Any AWK workflow that mutates files should treat Codex nodes as fully capable of shell/file
  changes and rely on worktrees, explicit approvals, narrow prompts, artifact review, and git diff
  inspection.
- Any AWK workflow that wants a real read-only or staged-permission phase should provide a
  Claude variant, or a Pi variant if the needed tool vocabulary is Pi's built-ins and MCP is not
  required.
- Do not document `allowed_tools: []` as meaningful for Codex. If a workflow uses it with Codex,
  the workflow should either switch providers for that node or admit the restriction is not
  enforced.

## Follow-Up Work

- Add route-tracker follow-up after review: classify Codex-default as broad-access, not
  permissioned.
- Audit planned AWK workflows for `allowed_tools` / `denied_tools`; provider-override any node
  whose safety story depends on them.
- Consider a validator/policy check in this kit that fails local AWK workflows when Codex nodes
  declare ignored tool restrictions.
