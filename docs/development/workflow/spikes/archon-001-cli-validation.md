# ARCHON-SPIKE-001: Real CLI Validation

Status: complete

## Question

Can Archon's own CLI validate and run this repo's `.archon` workflow pack without relying only on
`scripts/validate-archon-pack.mjs`?

## Setup

Initial docs/source spike plus local command checks showed `archon` and `bun` were missing. Follow-up
environment work installed Bun and the Archon standalone CLI, then reran Archon's real validators.
A deterministic Archon workflow was also executed. AI-node workflows remain a separate dogfood
step.

## Evidence

Initial executable checks:

```text
$ command -v archon
exit 1

$ archon --help
zsh:1: command not found: archon

$ command -v bun
exit 1

$ bun --version
zsh:1: command not found: bun
```

The Archon checkout also has no installed dependencies at:

```text
/Users/joel/Dev/Archon/node_modules
/Users/joel/Dev/Archon/packages/cli/node_modules
```

Follow-up environment fix:

```text
$ bun --version
1.3.14

$ archon version
Archon CLI v0.4.1
  Platform: darwin-arm64
  Build: binary
  Database: sqlite
  Git commit: d83593aa
```

Archon source shows the local source-mode CLI would be:

```text
bun --cwd packages/cli src/cli.ts
```

Refs:

- `/Users/joel/Dev/Archon/package.json:9`
- `/Users/joel/Dev/Archon/packages/cli/package.json:2`

Archon's CLI has validation commands:

```text
archon validate workflows
archon validate commands
```

The CLI reference says workflow validation checks YAML and referenced resources, and command
validation checks `.archon/commands`.

Refs:

- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/reference/cli.md:375`
- `/Users/joel/Dev/Archon/packages/docs-web/src/content/docs/reference/cli.md:389`
- `/Users/joel/Dev/Archon/packages/cli/src/commands/validate.ts:82`
- `/Users/joel/Dev/Archon/packages/cli/src/commands/validate.ts:206`

The generic Archon validator does not replace this kit's local validator. `scripts/validate-archon-pack.mjs`
also checks kit-specific invariants: required docs, bundled defaults disabled, Codex default,
approval before implementation, worktree requirement, artifact references, and prohibited mutating
patterns.

Ref: `scripts/validate-archon-pack.mjs:5`

Real validation results after installing the CLI:

```text
$ archon validate workflows --cwd /Users/joel/Dev/agent-workflow-kit --json
summary: total=4 valid=4 errors=0 warnings=0

$ archon validate commands --cwd /Users/joel/Dev/agent-workflow-kit --json
summary: total=4 valid=4 errors=0

$ node scripts/validate-archon-pack.mjs
Archon workflow pack validation passed.
```

The first deterministic workflow run exposed a missing Codex binary warning from Archon's title
generation path. The repo now pins the Codex app binary in `.archon/config.yaml`:

```yaml
assistants:
  codex:
    codexBinaryPath: /Applications/Codex.app/Contents/Resources/codex
```

After that config fix, the deterministic workflow executed cleanly:

```text
$ archon workflow run awk-validate-process-pack --cwd /Users/joel/Dev/agent-workflow-kit
codex.binary_resolved source=config path=/Applications/Codex.app/Contents/Resources/codex
Archon workflow pack validation passed.
Workflow completed successfully.
```

## Result

Pass for validation and deterministic workflow execution; AI workflow execution still deferred.

Archon's real CLI validates this repo's `.archon` workflows and commands successfully, and can run
the deterministic validation workflow. Keep this validation stack:

```bash
archon validate workflows --cwd /Users/joel/Dev/agent-workflow-kit --json
archon validate commands --cwd /Users/joel/Dev/agent-workflow-kit --json
archon workflow run awk-validate-process-pack --cwd /Users/joel/Dev/agent-workflow-kit
node scripts/validate-archon-pack.mjs
```

## What This Means For Agent Workflow Kit

Use Archon's validator as a first-class check, but keep `scripts/validate-archon-pack.mjs`. The
Archon validator proves generic workflow correctness; the local script proves kit policy.

Do not call the Archon route proven until AI-node workflow execution is also dogfooded.

## Follow-Up Work

- Decide whether any kit-local validator assertions should be upstreamed to Archon.
- Treat read-only AI workflow execution as the next smoke spike because it creates run
  state/artifacts and invokes a real model.
