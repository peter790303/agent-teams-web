# Nuxt 4 升級需求

依使用者要求：將 Nuxt 3 升級成 Nuxt 4，確認是否有異常；全部正常後 commit 並整合回本機 master。

- 使用 Nuxt 4 穩定版本，同步 lockfile、Nuxt 4 app 目錄、匯入路徑與 TypeScript 設定。
- 保留辦公室 `/`、模型設定 `/settings/models`、任務 `/office/tasks/:id` 的既有功能、Vuetify 樣式與直接呼叫 Nest 的 API／認證契約。
- 不夾帶既有未提交檔案，不進行無關 DDD 重構；保留目前分支已提交的功能。
- 執行 typecheck、lint、format:check、production build，確認 Docker Node 22 可建置。
- 使用真實後端驗證頁面載入、導覽、重整、桌面／手機、SSR hydration 與 console／network；不以 mock 代替整合結果。未具備的測試條件需明確記錄。
- 依 code-review skill 取得獨立 Standards 與 Spec 雙 agent review 並處理 findings；驗收正常後才提交及整合 master。
- 同步 vault 專案目錄索引，驗收證據保留於 repository docs。
- 依使用者追加要求整理 `.gitignore`，排除本機 agent 狀態、暫存與資料庫；同步 Docker context 排除規則。
- 修正驗收發現的任務詳情長路徑／QA 內容橫向溢位，手機版詳情採單欄，保留全部資料。

官方遷移依據：[Nuxt 4 Upgrade Guide](https://nuxt.com/docs/4.x/getting-started/upgrade)。
