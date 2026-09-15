# Office 待驗收追蹤

本次將既有工作目錄修改提交保存，不代表整體 UI 正式驗收通過，亦未整合進 master。

## 已有正式結果

- model-settings：`c4bd1d5387c43acd8d09478a0ab317dd081384e4` → `eaa2fd9d1c7b33680d411c705186e3e02c16cea0`，兩檔收斂的 Standards / Spec 均 PASS，報告見同目錄。
- 上述 PASS 不涵蓋 Office、其他頁面或整體 Nuxt 移植。

## 本次保存的修改

- 補齊 AGENTS.md 規範入口、使用者提供的 ESLint / Prettier 設定。
- assembler Category 區塊與 useOffice 陣列轉換整理。
- 修正空任務清單統計、人物標籤字級及員工卡片溢出樣式。
- 變更檔案 Prettier、ESLint、Nuxt typecheck 及 git diff --check 通過。

## 尚須完成

- 對照原 Nest 辦公室畫面，確認人物名稱、狀態辨識及員工列在桌面／窄版的呈現。
- 複核任務 API 失敗與成功回傳空陣列是否能明確區分，失敗不得被當成零任務。
- 整體 Category、Vuetify 優先使用、樣式及 template 表達式規範複核。
- 對以上未完整驗收的修改執行固定 commit 的獨立 Standards / Spec review。
- 完成後更新 Docker 執行版本並驗證核心操作流程。

`.scratch` 為本機工作暫存；正式 model-settings 報告已複製至本目錄保存。
