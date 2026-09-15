## Spec

**Fixed range:** `c4bd1d5387c43acd8d09478a0ab317dd081384e4...eaa2fd9d1c7b33680d411c705186e3e02c16cea0`  
**局部結論：PASS**

本輪只複驗 `10ec585...eaa2fd9` 的 helper 回移；結論限於 model-settings 收斂，不代表整體 UI 或 Nuxt 拆分完成。

### Missing / partial requirements

無。

規格要求保留「model policies, candidate scores/capabilities」（`docs/nuxt-frontend-split-spec.md:20`）。`useModelSettings.ts:33-52` 每次 composable 呼叫仍建立完整且獨立的 editor、集合及空草稿，未加入虛構 catalog 預設；`:84-106` 仍拒絕空白／非有限分數、空 provider/model 及空 capabilities。API catalog、既存 whitelist、載入狀態及儲存流程未在本 delta 改動。

### Scope creep

無。`eaa2fd9` 僅刪除 utility 並把同一組 private helpers 放回 composable Methods；沒有新增 API、狀態或產品行為。

### Implemented incorrectly

無。

`useModelSettings.ts:25` 的 `roles` 是唯讀 module Static，沒有可變共享狀態；`:33-52` 在 composable 內直接建立新的 `ref` 與逐角色新物件。private helpers（`:66-107`）也在每次 composable 呼叫重新建立，轉換內容與前輪 PASS 相同。`:74-75` 維持 `providerId:modelId` 複合 key。初始化、驗證、catalog 候選與既存選擇分離，以及例外傳遞均未因結構回移退化。
