# Office 待驗收追蹤

所有程式修改已提交至 feature 分支；尚未整合進 master。以下 PASS 僅適用列明範圍，不代表整體 UI 或 Nuxt 移植正式驗收通過。

## 已有正式結果

- Model settings：`c4bd1d5387c43acd8d09478a0ab317dd081384e4` → `eaa2fd9d1c7b33680d411c705186e3e02c16cea0`，Standards / Spec 均 PASS。報告見同目錄 `model-settings-standards.md`、`model-settings-spec.md`。
- Office 版面及任務統計：base `9a58b1d` → fixed head `d5d489d25a853d7bf55f1361bdac45400dcc9e1d`，Sol Standards / Spec 均 PASS。報告見同目錄 `office-layout-standards.md`、`office-layout-spec.md`。
- 本包修正 Vuetify 欄位配置、computed 型別與 Category、空任務統計及載入狀態語意。

## 已完成的檢查

- 變更檔案 Prettier、ESLint、Typecheck 及 diff check 通過。
- Docker 建置與啟動成功，`http://localhost:30679/` 可開啟。部署版本為 `8399edb`；最終 `d5d489d` 僅校正 Category 註解文字，無執行期差異。
- 實際桌面瀏覽器確認辦公室與 Command Center 同列，七張員工卡完整呈現且沒有溢出；空任務顯示零筆。
- AGENTS 入口、使用者提供的 ESLint / Prettier 設定、既有 assembler 與 Office 修改均已提交保存。

## 尚須完成

- 對照原 Nest 版本及需求圖片，驗收整體視覺與人物、狀態呈現；本包不代表完整視覺一致。
- 實際窄版／行動版檢查。
- API 失敗情境的執行期驗證；本包已完成程式層面的載入、空資料與錯誤狀態檢查。
- 其他頁面與整體 Category、Vuetify、樣式、template 規範的完整複核。
- 完整核心操作流程與 QA，依使用者指示保留待後續額度恢復驗收。

`.scratch/` 為本機暫存，不納入提交；正式報告已保存至本目錄。
