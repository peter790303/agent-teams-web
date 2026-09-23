# Manual task deletion and CLI health panel

## Scope and acceptance

The Office task list lets a user request deletion of a task explicitly. The UI must identify the task, ask for confirmation, prevent duplicate submissions, render API failures, and update the shared task list and current selection only after successful deletion. A task with an active lifecycle stage cannot be deleted; the UI explains the API's safe rejection. Never delete an existing user task during acceptance: create a disposable task for the delete check.

Add a separate LLM service panel that reports a real check against the configured host-side LLM CLI runner. It must have a manual recheck action and clearly distinguish success, unavailable/unconfigured, and failed checks. Provider API health is a different capability and must not be presented as CLI health. Unknown, absent, or failed responses must never render as healthy.

## Frontend scope and API handoff

- This change owns frontend presentation and repository/composable boundaries only. Backend API implementation is handled separately.
- The task repository calls `DELETE /tasks/:id`; the UI confirms first, prevents duplicate in-flight requests, preserves the task until success, then removes it from task/state collections. API errors stay visible through the existing Office error alert. The API must safely reject non-terminal tasks; the UI disables deletion for active tasks.
- The LLM repository calls `POST /llm-cli-health/check`. The panel combines returned CLI health providers with the existing `/model-policies/catalog` model inventory to render one distinct Vuetify card per known service, including a service icon (provider-matched when recognized, generic otherwise), name/id, available models and CLI, individual status, check time, and error. The catalog is inventory metadata only and never implies CLI health. Checking is labeled `連線中`, connected `已連線`, unavailable `離線`, and unknown/unconfigured `尚未確認`; no unsupported value is treated as healthy. Missing metadata is labeled `API 未提供`. If health checking is unavailable, catalog-backed cards remain visible with unknown status and a clear overall error; API-only providers are also shown. The API currently has a collective check operation, so the panel exposes a collective recheck button and does not imply that one card can be checked independently. No providers are invented when neither source supplies them.
- Overall and per-provider CLI status must come from a real authenticated runner request. A provider HTTP health check or binary version check is not a substitute. Unknown, absent, failed, or unsupported data must never render as healthy.

## UI acceptance

Confirm dialog cancellation leaves task/list/selection unchanged; duplicate delete is blocked while pending; success removes the task and clears selection; 404/409/5xx/network errors remain visible and preserve consistent state. Verify distinct provider cards on desktop and mobile, partial provider failures, empty/unconfigured and unavailable states, collective recheck, direct refresh, and hydration. Record actual results and environmental limitations in the project docs.

## Frontend validation record

- Node 22 `nuxt typecheck`, `nuxt build`, Prettier check, and whole-repository ESLint completed successfully. ESLint reports three existing `vue/no-v-html` warnings in `PixelOfficeMap.vue` and `WorkstationRoster.vue`; no lint errors.
- Reopened the existing Arc page at `http://localhost:30679/` and confirmed it loaded and hydrated. The live `POST http://localhost:30678/llm-cli-health/check` returned `404 Not Found`, while `/model-policies/catalog` provided four inventory-backed cards: Anthropic, OpenAI, agy, and xAI. The desktop screenshot showed service icons, names, provider IDs, model lists, and `尚未確認` status for all four, alongside the explicit CLI health 404 error; no card was shown as connected. Mobile breakpoint, partial-health results, and checking animation remain unverified.
- Did not issue a delete against the existing task visible in the environment. A disposable task could not be created with the connected service, so end-to-end delete pending/success/failure behavior remains unverified in a live API. The UI implementation retains the task on failure and guards repeated in-flight deletes; a backend implementing `DELETE /tasks/:id` is still required for successful live acceptance.
