## Intent

Set up local Codex to use the human operator's ChatGPT Pro OpenAI account and the intended default model.

Parent initiative: #1

## Why this exists

The workflow is local-first for now. We should not assume Codex Cloud, API-key billing, or an agent-owned credential. The setup needs to make the local Codex install use the human's ChatGPT Pro entitlement and a known model default.

## Scope

- Verify the installed Codex CLI/app can authenticate with ChatGPT sign-in.
- Sign in with the human's ChatGPT Pro account using the normal browser flow, or `codex login --device-auth` if browser callback login does not work.
- Configure the local default model to `gpt-5.5`.
- Prefer OS keychain/keyring credential storage if available.
- Document the final local verification commands for future operators.

## Non-goals

- Do not configure Codex Cloud.
- Do not use an OpenAI Platform API key unless the human explicitly chooses API billing.
- Do not commit, paste, or expose `~/.codex/auth.json`, access tokens, API keys, or screenshots containing credentials.
- Do not automate the human login flow.

## Suggested commands

```shell
codex login status
codex login
codex login --device-auth
codex doctor
codex --model gpt-5.5
```

Suggested `~/.codex/config.toml` entries:

```toml
model = "gpt-5.5"
cli_auth_credentials_store = "keyring"
```

## Acceptance criteria

- [ ] `codex login status` shows a valid ChatGPT sign-in for the intended account/workspace.
- [ ] `~/.codex/config.toml` sets `model = "gpt-5.5"` or the operator confirms an equivalent profile/model selection.
- [ ] `codex doctor` completes without auth/config errors relevant to local Codex use.
- [ ] A short operator note explains exactly what was configured, where credentials are stored, and how to verify without exposing secrets.
- [ ] If the task cannot be completed, the blocking reason is explained in simple terms for someone who has not looked at Codex setup recently.

## Sources

- Codex Authentication: https://developers.openai.com/codex/auth/
- Codex Models: https://developers.openai.com/codex/models/
