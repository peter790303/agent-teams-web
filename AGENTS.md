# AGENTS.md

本 repo 不保存開發規範正文。動任何程式碼前，請讀取 Obsidian vault 的共用前端規範與 Nuxt 指引。

```text
vault: ~/Documents/Worker
共用前端: <vault>/FrontEnd/
Nuxt參考: <vault>/Companys/TWHG/FrontEnd/Nuxt-Vuetify-Twhg/README.md
```

必要入口包括 `FrontEnd/README.md`、`Frontend Coding Standards.md`、`06 - Component 規範.md`、`09 - Repository 規範.md`、`12 - 樣式與 Vuetify.md`、`14 - 動工前盤點.md`，以及本專案 `docs/nuxt-frontend-split-spec.md`。本專案以各 Nuxt layer 的 `repositories/` 統一 API 存取，頁面只組合 components/composables；瀏覽器使用 public runtime `apiBase` 直連 Nest，Nest 以精確 CORS allowlist 保護來源；Provider secrets 不得進入瀏覽器。
