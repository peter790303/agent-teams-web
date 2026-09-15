# AGENTS.md

本 repo 不保存開發規範正文。動任何程式碼前，請讀取 Obsidian vault 的共用前端規範與 Nuxt 指引。

```text
vault: ~/Documents/Worker
共用前端: <vault>/FrontEnd/
Nuxt參考: <vault>/Companys/TWHG/FrontEnd/Nuxt-Vuetify-Twhg/README.md
```

開發進場必讀 `FrontEnd/README.md`、`Frontend Coding Standards.md`、`04 - 程式表達慣例.md`、`05 - 檔案結構區塊.md`、`13 - ESLint 與格式化.md`、`14 - 動工前盤點.md`、Nuxt README，以及本專案 `docs/nuxt-frontend-split-spec.md`。依觸及範圍補讀 `06 - Component 規範.md`、`08 - Composable 規範.md`、`09 - Repository 規範.md`、`10 - Mapper 與 Domain Assembler.md`、`12 - 樣式與 Vuetify.md`；測試或交付讀 `15`，分支與 review 讀 `17`。正文均在 Obsidian vault，本檔只提供入口。

Review 必讀 `Frontend Coding Standards.md`、`04`、`05`、`13` 與本次變更涉及層級的對應文件，再逐條比對 diff；需要測試、交付或 review 流程時補讀 `15`、`17`。不可用通用最佳實踐取代 vault 規範。

本專案以各 Nuxt layer 的 `repositories/` 統一 API 存取，頁面只組合 components/composables；瀏覽器使用 public runtime `apiBase` 直連 Nest，Nest 以精確 CORS allowlist 保護來源；Provider secrets 不得進入瀏覽器。
