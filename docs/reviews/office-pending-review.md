# Office 待驗收追蹤

所有程式修改已提交至 feature 分支 `codex/office-visual-rebuild`，本機 `master` 已 fast-forward 與該分支同步（無 remote，未 push）。以下 PASS 僅適用列明範圍，不代表整體 UI 或 Nuxt 移植正式驗收通過。

## 已有正式結果

- Model settings：`c4bd1d5387c43acd8d09478a0ab317dd081384e4` → `eaa2fd9d1c7b33680d411c705186e3e02c16cea0`，Standards / Spec 均 PASS。報告見同目錄 `model-settings-standards.md`、`model-settings-spec.md`。
- Office 版面及任務統計：base `9a58b1d` → fixed head `d5d489d25a853d7bf55f1361bdac45400dcc9e1d`，Sol Standards / Spec 均 PASS。報告見同目錄 `office-layout-standards.md`、`office-layout-spec.md`。
- 本包修正 Vuetify 欄位配置、computed 型別與 Category、空任務統計及載入狀態語意。

- Command Center、角色 callback 與 dispatch enum：`19be5ca..b1158bd`，Sol Standards / Claude Spec 均 PASS。Claude 最終 Standards 遇額度限制後由 Sol 接手；報告見 `command-center-standards.md`、`command-center-spec.md`。

- Review 🔴 修正（模型頁 template 組字串、Category 區塊、原生表單／對話框／自訂 `@media`）：`ab43e5d` → `244cd04`。依 FrontEnd/17，修正後只跑 Prettier、ESLint（0 errors，既有 `vue/no-v-html` warnings）、typecheck、diff check，未重跑 review。

## 已完成的檢查

- 變更檔案 Prettier、ESLint、Typecheck 及 diff check 通過。
- Docker 建置與啟動成功，`http://localhost:30679/` 可開啟。部署版本為 `8399edb`；最終 `d5d489d` 僅校正 Category 註解文字，無執行期差異。
- 實際桌面瀏覽器確認辦公室與 Command Center 同列，七張員工卡完整呈現且沒有溢出；空任務顯示零筆。
- AGENTS 入口、使用者提供的 ESLint / Prettier 設定、既有 assembler 與 Office 修改均已提交保存。

- 本輪 Prettier、定向 ESLint（0 errors，既有 v-html warnings）、typecheck、diff check 通過；Docker 已更新至 `939a0fc`，`b1158bd` 僅修正註解。瀏覽器已確認角色地圖與員工列可開啟正確對話框、缺少資料顯示「資料未提供」。已知狀態映射由雙 review 讀取程式確認，尚未做完整有資料端到端驗證。

### `244cd04` 整合部署與定向回歸檢查（2026-09-15，非完整 QA）

- 部署：root Docker 建置完成，log 為 `/tmp/office-integrated-build.log`，image `bb4d67a38e32`，容器於 21:36:40 重建並啟動。`/` 與 `/settings/models` 回應 200。
- 工具：`ego-browser`，以 `Emulation.setDeviceMetricsOverride` 切換尺寸，測完已清除 override。
- 範圍：只驗 Office 地圖／員工列／角色對話框在響應式改動後的呈現、角色點擊，以及模型頁載入。

| 項目                 | Desktop 1280×800                                                              | Mobile 390×844                                                                              |
| -------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 地圖角色             | 七位角色都在地圖範圍內                                                        | 七位角色都在地圖範圍內；圖例隱藏                                                            |
| 員工列               | 七張卡、無文字截斷，但只有 2 欄（見下方回歸）                                 | 2 欄、無文字截斷                                                                            |
| Command Center       | 與地圖同列（`md=8` / `md=4`）                                                 | 堆疊在地圖下方                                                                              |
| 頁面水平溢出         | 無（scrollWidth 1280）                                                        | 頁面無溢出（scrollWidth 390）；`v-slide-group__content` 內的 `v-tab` 超出右緣，未再深入檢查 |
| 地圖角色點擊         | 開啟「AI 主管 Coordinator」對話框，完整在 viewport 內，「關閉」可關閉         | 同左（寬 342px）                                                                            |
| 員工列點擊           | 開啟「交付管理 Delivery」對話框，Esc 可關閉                                   | 同左                                                                                        |
| 模型頁               | 可載入標題、5 張角色政策卡、角色容量與 Provider 健康表格；無 console error    | 同左；無水平溢出                                                                            |
| Console（Office 頁） | 1 則 error：`Hydration completed but contains mismatches.`                    | 同左                                                                                        |
| 截圖                 | 未取得：`Page.captureScreenshot` 逾時（含 raw CDP、有／無 override，共 6 次） | 同左                                                                                        |

- 模型頁目前資料狀態：`/model-policies/catalog` 回 400，各卡顯示「目前無法取得 Provider 支援模型，請稍後重試」；pm、rd_leader、rd、qa 政策回 404，顯示「尚未建立政策」。這些是後端資料狀態，未判定為前端回歸。
- 角色狀態目前皆為「資料未提供」（無任務資料），無法用本次畫面驗收「狀態清楚」。

### 發現的回歸（待修正，本任務未改碼）

- 🔴 **Desktop 套用到行動版樣式**（`244cd04` 將 `@media` 改為 `useDisplay()` 切 class 後出現）：
  - `layers/base/plugins/vuetify.ts` 的 `createVuetify` 未設定 `ssr`。實測 1280×800 時，SSR HTML 輸出 `office-card is-compact is-mobile`、`roster is-medium is-mobile`；client 端 Vuetify display 為 `lg`（`xs`、`smAndDown`、`mdAndDown` 皆 false，`ssr` false），但 hydration 後 DOM 仍保留 SSR 的 class。
  - 影響（1280×800 computed style）：員工列 `grid-template-columns` 為 2 欄（585px ×2；基礎樣式為 7 欄，先前驗收為七張卡同列）；角色名牌 7px／狀態 6px、`.map-wrap` padding 5px，均為行動版數值。
  - 寬度實際改變後才部分修正：1279 → 1280 後 roster 與 workspace class 正確，`office-card` 仍為 `is-compact is-mobile`。
  - `index.vue` 的 `is-narrow`（`mdAndDown`）在 `244cd04` 前就有相同 SSR 落差，但對應的 `.pixel-map` 元素不存在，未觀察到可見影響。
  - 修正方向：讓 display 相依 class 在 client 端依實際寬度更新（例如 `createVuetify` 的 `ssr` 設定，或 mount 後才套用 class），修正後需實機確認 1280×800、960–1279 與 390×844，並確認 FrontEnd/12 提到的首次渲染閃動。
- 🟡 **Console hydration mismatch**：已觀察到 class 不一致，以及 header 時鐘 SSR 文字（伺服端時區 `下午01:42`）與 client（`下午09:42`）不同；時鐘在 `244cd04` 前已存在。確切觸發來源未逐一定位，也未重建舊版確認是否早於本次。FrontEnd/15 要求為 0。

### 上述 🔴／🟡 的修正與複驗（2026-09-16，非完整 QA）

**根因**

- `createVuetify` 未設 `ssr`。Vuetify 的 `getClientWidth(ssr)` 在瀏覽器端且未設 `ssr` 時直接取 `window.innerWidth`，導致 client 首次渲染的 display 值（1280 → `lg`）與 SSR（取不到 viewport，寬度 0 → `xs`）不同，hydration 因此 mismatch，且 class 停在 SSR 的行動版值。
- 時鐘以 `new Date()` 當 ref 初始值，SSR 在容器時區算出字串、client 以瀏覽器時區算出另一個字串，是第二處 mismatch。

**改檔（2 檔）**

- `layers/base/plugins/vuetify.ts`：`createVuetify` 加 `ssr: true`。SSR 與 client 首次渲染同樣取寬度 0，hydration 先一致；Vuetify 在 `app:suspense:resolve` 呼叫 `display.update()` 取實際寬度，class 隨即修正。未自寫 `@media`，維持 FrontEnd/12「斷點走 `useDisplay()`」。
- `layers/office/pages/index.vue`：`now` 改為 `ref<Date | null>(null)`，`onMounted` 才賦值；SSR 與 client 首次渲染同為 `--:--`，時間只在 client 計算。

**檢查**

- Prettier `--check`、ESLint（0 error）、`nuxt typecheck`（exit 0）、`git diff --check` 均通過。
- Docker `compose up -d --build` 重建成功並重啟容器，`/` 與 `/settings/models` 皆 200。

**執行期結果（`ego-browser`，各尺寸皆重新載入後量測）**

| 項目                | 1280×800              | 1100×800                    | 390×844                            |
| ------------------- | --------------------- | --------------------------- | ---------------------------------- |
| `office-card` class | `office-card`         | `office-card`               | `office-card is-compact is-mobile` |
| `roster` class      | `roster`              | `roster is-medium`          | `roster is-medium is-mobile`       |
| `workspace` class   | `v-row workspace`     | `v-row workspace is-narrow` | `v-row workspace is-narrow`        |
| 員工列欄數          | 7                     | 4                           | 2                                  |
| `.map-wrap` padding | 13px                  | 13px                        | 5px                                |
| 名牌字級            | 7.337px（基礎 clamp） | 7px（clamp 下限）           | 7px（`is-mobile`）                 |
| 水平溢出            | 無（1265）            | 無（1085）                  | 無（390）                          |
| Console             | 0                     | 0                           | 0                                  |

- 角色對話框：地圖角色（1280）與員工列（390）皆可開啟「AI 主管 Coordinator」並以「關閉」關閉。僅基本開關，未做完整互動 QA。
- 時鐘：SSR HTML 為 `☀ --:-- <small></small>`，client 顯示 `☀ 上午09:30 2026/09/16（週三）`，不再有兩邊文字不一致。
- **首次渲染閃動確實存在且已量到**：員工列欄數在 1280 為 2 → 7（t=16ms → 43ms）、1100 為 2 → 4（t=15ms → 31ms），約一至兩個 frame；390 因 SSR 值已等於實際值而無變化。這是 FrontEnd/12 對 `useDisplay()` SSR 所提醒的行為，目前以「hydration 一致 + mount 後修正」換取 console 0，尚未針對閃動本身做視覺驗收。

**限制**

- 截圖仍失敗：`Page.captureScreenshot` 再次 CDP timeout；依指示只嘗試一次，未重試。**以上全部為 DOM／computed style 量測，不是截圖視覺比對**，不代表視覺與參考一致。

## 尚須完成

- 首次渲染閃動（桌機與中間寬度會先以行動版樣式繪製約一至兩個 frame）的視覺驗收與是否需進一步處理。
- 截圖留存：`Page.captureScreenshot` 持續 timeout，視覺比對尚未有圖面證據。
- 對照原 Nest 版本及需求圖片（像素辦公室地圖、精簡名牌與清楚狀態、右側 Command Center），驗收整體視覺與人物、狀態呈現；本包不代表完整視覺一致。
- 窄版／行動版：390×844 已做上述定向檢查；960–1279 等中間寬度、有資料狀態下的名牌與狀態呈現、截圖留存仍待完成。
- API 失敗情境的執行期驗證；本包已完成程式層面的載入、空資料與錯誤狀態檢查。
- 其他頁面與整體 Category、Vuetify、樣式、template 規範的完整複核。
- 完整核心操作流程與 QA，依使用者指示保留待後續額度恢復驗收。

`.scratch/` 為本機暫存，不納入提交；正式報告已保存至本目錄。
