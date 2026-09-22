# Agent Teams Web

Agent Teams Web 是多 Agent 協作系統 **Agent Teams 的操作與監控前端**。你可以在這裡提出開發需求、追蹤各角色的執行狀態、查看阻塞與 QA 結果，並在需要時人工介入，讓多個 AI Agent 的協作過程可見、可操作。

## 核心在做什麼

Agent Teams 將開發工作交給不同角色協作：Leader 接收需求與協調交付，PM 定義需求與驗收條件，RD Leader 規劃工作與審查，RD 實作與測試，QA 驗證成果。整體開發流程為：

```text
需求 → Spec → Plan → RD 實作 → Review → QA → 保存成果 → 清理 → 交付分支
```

這個 repository 提供上述流程的網頁介面。首頁以像素辦公室呈現角色工作站與任務狀態，讓使用者掌握工作進行到哪裡、卡住的原因，以及何時需要介入。實際派工、Agent 執行與流程推進由 Agent Teams 後端負責。

## 可以做什麼

| 功能                         | 用途                                                                     |
| ---------------------------- | ------------------------------------------------------------------------ |
| 辦公室與指揮中心 `/`         | 建立任務，查看角色工作站、任務與資源狀態，掌握團隊目前的工作情況。       |
| 任務詳情 `/office/tasks/:id` | 追蹤任務階段、阻塞原因與 QA 報告，依任務狀態進行人工介入、恢復或提交。   |
| 模型設定 `/settings/models`  | 設定各角色可使用的模型白名單，查看模型能力、評分、供應商健康與角色容量。 |

模型設定只編輯角色白名單；模型評分、能力與資源資訊由後端提供。畫面中的任務與角色狀態也來自後端，資料缺漏時會呈現未知或未提供狀態。

## 前後端分工

```text
使用者 → Agent Teams Web（Nuxt）→ Agent Teams API（Nest）→ Agent Runner／模型服務
```

- **本專案**：資料呈現、表單互動、任務操作與 API 呼叫。
- **Agent Teams 後端**：任務編排、派工與執行狀態、審查與 QA 流程、人工介入、成果交付，以及模型與資源管理。

瀏覽器直接呼叫 Nest API，前端需要搭配後端服務使用。模型供應商憑證由後端管理。開發流程的自動交付以分支為成果，不包含合併主分支或部署。

## 技術與開發入口

使用 Nuxt 4、Vue、Vuetify 與 TypeScript，依共用基礎、領域資料、辦公室與模型設定拆為 `base`、`domain`、`office`、`model-settings` 四個 Nuxt layers。

本機前端預設為 `http://localhost:30679`，後端 API 預設為 `http://localhost:30678`。

- [Agent 進場與開發文件入口](AGENTS.md)：連結至 Obsidian 中的專案設定、開發規範與記憶。
- [前後端拆分需求與 API 邊界](docs/nuxt-frontend-split-spec.md)。
- [辦公室視覺驗收清單](docs/office-visual-acceptance.md)。
