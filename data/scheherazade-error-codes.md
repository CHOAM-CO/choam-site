# Error codes

Every red line or red dot this app shows starts with a code in square brackets,
for example `[CLI_LOGIN_EXPIRED] Claude Code 로그인이 만료됐어요 …`. The code is
the first thing on the line so it survives truncation, a translation, and a
screenshot sent to someone else. The sentence after it says what happened in
the language the app is set to.

Two families reach the red surfaces:

- **Agent status** (`onboarding/agent-status.cjs`'s `AGENT_STATUS_CODES`) — the
  agent did not start, or it stopped. Shown on the header line next to the red
  dot, and on the setup screen's "Failed to start" card.
- **Turn errors** (`onboarding/public/js/status-dot.cjs`) — the agent is up but
  its last model call failed. Shown on the chat status dot's hover and on the
  red banner above the chat.

The code column is the machine value. The UI uppercases it inside the brackets.

## Agent status

| Code | What it means | What you do (ko / en) | Raised at |
| --- | --- | --- | --- |
| `cli_login_expired` | The Claude Code login on this computer has expired. | "터미널에서 `claude`를 한 번 실행하거나 설정 > 모델에서 다시 로그인해 주세요." / "Run `claude` once in a terminal to refresh it, or log in again from Settings > Model." | `provider-env.cjs:744` (mapping), `provider-env.cjs:862`; stamped by `main.cjs:2469` |
| `cli_login_missing` | There is no Claude Code login on this computer. | "설정 > 모델에서 로그인하거나 터미널에서 `claude`를 한 번 실행해 주세요." / "Log in from Settings > Model, or run `claude` once in a terminal." | `provider-env.cjs:745`, `:747`, `:748`; stamped by `main.cjs:2469` |
| `cli_credentials_unreadable` | The Claude Code login exists but could not be read. | "다시 시도해 주세요. 계속 그러면 설정 > 모델에서 다시 로그인해 주세요." / "Try again. If it keeps failing, log in again from Settings > Model." | `provider-env.cjs:751`; stamped by `main.cjs:2469` |
| `credentials_missing` | The key or token for the chosen model connection is not on file. | "설정 > 모델에서 입력해 주세요." / "Enter it in Settings > Model." | `provider-env.cjs:1331`; stamped by `main.cjs:2469` |
| `model_missing` | The chosen model connection has no model selected. | "설정 > 모델에서 골라 주세요." / "Pick one in Settings > Model." | `provider-env.cjs:957`, `:1050`; stamped by `main.cjs:2469` |
| `config_incomplete` | The proxy address for the custom connection is empty. | "설정 > 모델에서 Base URL을 입력해 주세요." / "Enter the Base URL in Settings > Model." | `provider-env.cjs:1032`; stamped by `main.cjs:2469` |
| `lane_unavailable` | A service you connected cannot be used with its saved key, model or address. | "설정 > 모델 및 제공자에서 키와 모델을 다시 확인해 주세요." / "Recheck its key and model in Settings > Model & Providers." | `provider-env.cjs:1276`, `:1279`; stamped by `main.cjs:2469` |
| `timeout_boot_stage` | Startup stalled before the engine came up. | "로그를 확인해 주세요. 앱을 다시 시작하고, 계속 그러면 엔진 설정을 확인해 주세요." / "Open Logs. Restart the app; if it repeats, check the engine settings." | `onboarding/http-server.cjs:366` |
| `timeout_engine_spawn` | The engine did not come up in time after the agent process started. | "로그를 확인해 주세요. 앱을 다시 시작하고, 계속 그러면 다른 모델이나 제공자를 골라 주세요." / "Open Logs. Restart the app; if it repeats, pick another model or provider." | `onboarding/http-server.cjs:364` |
| `timeout_no_heartbeat` | Startup finished but the agent never reported that it was connected. | "로그를 확인해 주세요. 앱을 다시 시작하고, 계속 그러면 채널 연결을 확인해 주세요." / "Open Logs. Restart the app; if it repeats, check the channel connection." | `onboarding/http-server.cjs:365` |
| `timeout` | Startup took too long and the app has no information about the stage it stopped at. | "로그를 확인해 주세요." / "Open Logs." | `onboarding/http-server.cjs:367` |
| `key_error` | The stored provider key could not be read from the OS credential store. | "설정 > 모델에서 키를 다시 저장해 주세요." / "Re-save the key in Settings > Model." | `main.cjs:2457` |
| `login_required` | The model connection needs a sign-in that has not happened yet. | "설정 > 모델에서 로그인해 주세요. 로그인하면 에이전트가 스스로 시작해요." / "Log in from Settings > Model. The agent starts by itself once you are signed in." | `main.cjs:2508`, `:2539` |
| `provider_not_wired` | The saved provider name is not one the app knows, or its setup is invalid. | "설정 > 모델에서 제공자를 다시 골라 주세요." / "Pick a provider again in Settings > Model." | `main.cjs:2476` |
| `model_selection_failed` | The chosen model or effort level was rejected. | "설정 > 모델에서 다른 모델이나 추론 강도를 골라 주세요." / "Pick a different model or effort in Settings > Model." | `dsh-lane.mjs:2247` |
| `cli_missing` | The Antigravity command-line tool could not be installed. | "인터넷 연결을 확인하고 앱을 다시 열어 주세요." / "Check your internet connection, then reopen the app." | `main.cjs:2553` |
| `proxy_unavailable` | The local proxy the chosen connection needs did not come up. | "앱을 다시 시작해 주세요. 계속 그러면 다른 제공자를 골라 주세요." / "Restart the app. If it repeats, pick another provider." | `main.cjs:2512`, `:2528`, `:2596` |
| `ollama_unavailable` | The local Ollama service is not running. | "Ollama를 실행한 뒤 다시 시작해 주세요." / "Start Ollama, then restart the agent." | `onboarding/agent-status.cjs:134` (older builds' markers) |
| `app_files_missing` | A file the app ships is missing from its own install. | "앱을 다시 설치해 주세요." / "Reinstall the app." | `main.cjs:2407` |
| `harness_stale` | The agent's instruction files could not be updated for this version. | "앱을 다시 열어 주세요. 다시 열면 갱신을 다시 시도해요." / "Reopen the app. Reopening retries the update." | `main.cjs:2308` |
| `app_written_damaged` | The record of the files you edited is damaged. | "재설정해 주세요. 수정한 내용은 그대로 남아요." / "Reset it. Your edits stay." | `main.cjs:2308` |
| `harness_error` | The agent's delegation instructions could not be updated. | "앱을 다시 열어 주세요. 계속 그러면 로그를 확인해 주세요." / "Reopen the app. If it repeats, open Logs." | `main.cjs:2443` |
| `spawn_failed` | The agent process could not be started at all. | "앱을 다시 시작해 주세요. 계속 그러면 로그를 확인해 주세요." / "Restart the app. If it repeats, open Logs." | `main.cjs:2139`, `:2857`, `:3338` |
| `crash_loop` | The agent process keeps exiting shortly after it starts. | "앱을 종료했다가 다시 열어 주세요. 계속 그러면 설정 값을 확인해 주세요." / "Quit and reopen the app. If it repeats, check the values you entered at setup." | `supervisor.mjs:341` |
| `engine_start_failed` | The same quick-exit streak, and the engine recorded its own startup error. | "설정 > 모델에서 다른 모델을 고르거나 제공자를 끈 뒤 다시 시작해 주세요." / "Pick another model or turn a provider off in Settings > Model, then start again." | `supervisor.mjs:338` |
| `agent_exited` | The agent process started and then exited on its own. | "다시 시작해 주세요. 계속 그러면 로그를 확인해 주세요." / "Start it again. If it repeats, open Logs." | `main.cjs:2896` |
| `stop_unconfirmed` | A stop or restart could not confirm the old process really ended. | "잠시 기다린 뒤 다시 시도해 주세요." / "Wait a moment, then try again." | `main.cjs:3140`, `:3179`, `:3306` |
| `discord_token_bad` | The Discord bot token is missing or was rejected. | "채널에서 Discord를 다시 연결해 주세요." / "Reconnect Discord in Channels." | `channel.mjs:124`, `:1674` (channel-scoped marker) |
| `slack_token_bad` | A Slack token is missing or was rejected. | "채널에서 Slack 토큰 두 개를 다시 확인해 주세요." / "Recheck both Slack tokens in Channels." | `channel-slack.mjs:117`, `:1174` |
| `telegram_token_bad` | The Telegram bot token is missing or was rejected. | "채널에서 텔레그램 토큰을 다시 확인해 주세요." / "Recheck the Telegram token in Channels." | `channel-telegram.mjs:96`, `:928` |
| `channel_token_error` | A messenger token could not be read from the credential store. | "채널에서 그 메신저를 다시 연결해 주세요." / "Reconnect that messenger in Channels." | `main.cjs:2245` and the channel scripts' credential-failure paths |
| `unknown` | Something failed and the app cannot name the cause. | "잠시 기다린 뒤 상태를 다시 확인해 주세요." / "Wait a moment, then check the status again." | `onboarding/agent-status.cjs:179` (coercion of an unrecognized code) |

## Turn errors (last model call failed)

| Code | What it means | What you do (ko / en) | Raised at |
| --- | --- | --- | --- |
| `RATE_LIMIT` | The model service says a usage or rate limit was reached. | "잠시 기다렸다가 다시 보내 주세요. 필요하면 다른 모델을 골라 주세요." / "Wait a little and send again; pick another model if needed." | `onboarding/public/js/status-dot.cjs:31`, `:40` (lane code passed through; `429` details classify here) |
| `AUTH` | The model connection's login is expired or rejected. | "다시 로그인해 주세요." / "Log in again." | `onboarding/public/js/status-dot.cjs:32`, `:41` (marker subtype `AUTH`; `401`/`403` details classify here) |
| `SERVER` | The model service is overloaded or returning server errors. | "잠시 후 다시 보내 주세요." / "Try again in a little while." | `onboarding/public/js/status-dot.cjs:33`, `:42` (marker subtype `SERVER`; `529`/`5xx` details classify here) |
| `TIMEOUT` | The model did not answer in time. | "다시 보내 주세요. 계속 그러면 다른 모델을 골라 주세요." / "Send again; pick another model if it repeats." | `onboarding/public/js/status-dot.cjs:34` |
| `AGY_TURN_ERROR` | The Antigravity model call failed. | "다시 보내 주세요. 계속 그러면 설정 > 모델에서 다른 모델을 골라 주세요." / "Send again; if it repeats, pick another model in Settings > Model." | lane marker subtype, passed through at `onboarding/public/js/status-dot.cjs:76` |
| `PI_AI_ERROR` | The provider refused or failed the call. | "요청을 바꿔 다시 보내 주세요. 계속 그러면 제공자 상태를 확인해 주세요." / "Send a different request; if it repeats, check the provider's status." | lane marker subtype, passed through at `onboarding/public/js/status-dot.cjs:76` |
| `INVALID_REQUEST` | The provider rejected the request (for example, an image on a text-only model). | "입력을 바꿔 다시 보내 주세요." / "Change the input and send again." | lane marker subtype, passed through at `onboarding/public/js/status-dot.cjs:76` |
| `TURN_FAILED` | The last reply failed and the app cannot classify why. | "다시 보내 주세요. 계속 그러면 로그를 확인해 주세요." / "Send again; if it repeats, open Logs." | `onboarding/public/js/status-dot.cjs:77` (fallback) |

Any other uppercase code the lane writes into `.last-turn-error.json` is shown
verbatim inside the brackets, so a new lane failure names itself without an app
update. Codes not matching that form are classified from the provider's detail
and fall back to `TURN_FAILED`.
