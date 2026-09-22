# Nuxt 4 升級驗收與審查

日期：2026-09-22。需求：[Nuxt 4 升級需求](../nuxt4-upgrade-spec.md)。

## Fixed point

- 分支：`codex/nuxt4-upgrade`。
- 完整 baseline：`0f7cb3ed75ba791599cd4a4f77e8bf9a9a0d4ed6`。
- 首次 candidate tree：`83e78ec8c2248eb78bab190a9aadb296a411e003`。
- 最終程式 candidate tree：`1c7d259429f0708cdc31974303f682857b559b46`。
- 兩名獨立 general-purpose agents 分別審查 Standards、Spec；先審完整差異，再審最終 CSS／spec delta。本報告於審查後追加，不改變程式。
- 原有未提交 `AGENTS.md` 不納入本次提交。

## Standards

PASS，findings：0。未發現新增的規範違反或 baseline smell。

Nuxt 根目錄及 layer 的 app 目錄、根路徑 alias、Vuetify plugin 自動載入及 TypeScript references 符合專案規範；strict 仍啟用。HTTP、認證、錯誤及 domain 行為未改變。Vault 目錄索引與相關規範已同步。

最終 CSS 使用 `minmax(0, 1fr)`、`overflow-wrap: anywhere` 與手機單欄處理長內容，沒有複製 template、隱藏資料或覆寫 Vuetify 內部 DOM。

## Spec

PASS，findings：0。未發現需求缺漏、非必要範圍擴張或實作錯誤。

Nuxt 4、lockfile、app 目錄、import、TypeScript 與 ignore 規則符合需求。三個頁面、Vuetify、API／認證契約及 strict 設定保留。最終 CSS 修正符合驗收新增的長內容溢位需求，未裁切資料或修改人工介入操作。

## 驗證結果

| 項目             | 結果                                                                            |
| ---------------- | ------------------------------------------------------------------------------- |
| Nuxt             | 4.5.2；lockfile 已更新                                                          |
| Typecheck        | 通過                                                                            |
| ESLint           | 0 errors；3 個既有靜態 SVG `vue/no-v-html` warnings                             |
| Prettier         | 全專案 format:check 通過                                                        |
| Production build | 本機建置通過                                                                    |
| Docker           | Node 22.23.2 下 npm ci、production build、重建啟動通過；僅有正常 Listening 日誌 |
| npm audit        | 0 vulnerabilities                                                               |
| Git              | diff whitespace check 與 ignore 規則驗證通過                                    |

## 真實瀏覽器整合

使用 Ego Lite TaskSpace 23，前端 `http://localhost:30679`，直接連線真實 Nest `http://localhost:30678`，未使用 mock。

- 辦公室、模型設定、任務詳情在桌面 1280px 與手機 390px 均可載入；完成連結導覽及頁面重整。
- 各頁 console error、warning、未處理 rejection 與 hydration 警告均為 0。
- tasks、office task state、intervention、五個角色 model-policies、catalog、provider-health、roles/capacities 實際請求均為 HTTP 200。
- Vuetify 表單與既有模型值正常顯示；像素辦公室與任務狀態正常呈現。
- 驗收發現任務 QA 長字串導致桌面 scrollWidth 1373，修正後 1280px 視窗 scrollWidth 1265（扣除垂直捲軸），390px 視窗 scrollWidth 390，無橫向溢位。
- 詳情斷點檢查：701px 為三欄且 scrollWidth 701；700px 為單欄且 scrollWidth 700；手機重整後單欄仍正常。
- 已檢視桌面辦公室／模型設定／任務詳情及手機辦公室／詳情截圖。Ego 截圖最初因 taskspace 未顯示而逾時，顯示驗收 taskspace 後成功。

截圖暫存於本機 `/tmp/nuxt4-home-final.png`、`/tmp/nuxt4-settings-final.png`、`/tmp/nuxt4-task-final.png`、`/tmp/nuxt4-home-mobile.png`、`/tmp/nuxt4-task-mobile.png`，不納入 repository。

## 驗證邊界

專案未提供單元測試 script，因此未宣稱單元測試套件通過。本次驗證涵蓋升級、建置及真實後端讀取／導覽；沒有新增派工、儲存模型設定或執行人工介入等後端寫入操作。既有三個 lint warnings 不屬於本次新增。

結論：本次升級驗收及雙軸 review 通過，可提交並 fast-forward 整合本機 master，保留原分支既有提交；不 push。
