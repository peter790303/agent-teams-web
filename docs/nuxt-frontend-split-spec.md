# Nuxt frontend split

## User request

把前端拆掉 改用nuxt

我另外建立了一個 agent-teams-web 放在那個專案底下

一樣在專案底下建立 自己的docker 目錄參考 prosales-web

並且建立 AGENTS.md 參考文獻 都在 obsidian

派luna 執行 cladue 驗收 你整合。

## Scope

- `agent-teams-web` owns `/`, `/settings/models`, and `/office/tasks/:id` pixel-office UI.
- UI is split into Nuxt layers (`base`, `domain`, `office`, `model-settings`), Vue components, composables, typed repositories, and domain types.
- Browser requests use the public runtime `apiBase` and connect directly to Nest; Nest permits only the local web origins with an explicit CORS method/header allowlist. Backend provider credentials never enter client code.
- The migrated pages preserve the pixel office role map, task state, blockers, QA report, intervention resume/submit, model policies, candidate scores/capabilities, role capacity, provider health, stale metadata, and affected-model data.
- Backend retains JSON task, office state, model policy, provider health, and intervention APIs while removing server-rendered HTML UI routes.
- Backend remains on `127.0.0.1:30678`; web publishes `30679` and uses `host.docker.internal:30678` in Docker.
