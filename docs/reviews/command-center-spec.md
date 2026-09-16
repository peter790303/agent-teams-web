## Spec

**PASS.** I found no blockers in the pinned range `19be5ca..b1158bd` (8 commits, full `r5/change.diff`).

**The r3 blocker is fixed: statuses are no longer mapped twice**

- `useOffice.ts:41-45` keeps the raw `dispatch.status` from the API. Only `DispatchStatusEnum.DISPATCHED` counts as running, which matches how the base decided which status wins.
- Each status is turned into a label once only, at display time: map `PixelOfficeMap.vue:28`, roster `WorkstationRoster.vue:25`, dialog `index.vue:90`.
- A `dispatched` role now shows `●工作中` with the `is-running` style, and the roster's `is-active` border (`WorkstationRoster.vue:47`) switches on again.

**Status classes match the backend**

- The 8 values in `DispatchStatusEnum.ts` match the Nest enum exactly (`agent-teams/src/Domain/Scheduler/Enums/dispatch-status.enum.ts:3-12`).
- Every class used has a CSS rule (`main.css:848-867`).
- This is better than the base: the old regex never matched `dispatched` or `waiting_*`, so those roles showed the raw status text.

**Checked in source**

- **Unknown or missing status:** a missing value shows `資料未提供`. A value the frontend doesn't know is shown as-is with `is-unknown` (`dispatchStatus.ts:42-47`). The dialog still falls back the same way.
- **Role selection:** there is no `defineEmits` or `emit(` left in `layers/`. The typed `onRole` prop (`PixelOfficeMap.vue:16,36`, `WorkstationRoster.vue:16,34`) is wired to `openRole` at `index.vue:131,167`, which opens the dialog.
- **Shared task list:** styles are restored with Vuetify utilities (`index.vue:158-159`, `CommandCenter.vue:127-131,180-184`). `taskSurface`, `textMuted` and `border` are real theme keys (`vuetify.ts:24,26,42`). No leftover CSS still depends on the deleted rules.
- **Layout and data:**
  - The desktop `md=8` / `md=4` columns are unchanged (`index.vue:131-132`).
  - The Command Center script is untouched, so the API-backed stats, the loading and unknown labels (`CommandCenter.vue:51-56`) and all three empty states are kept.
  - The tabs, the `/settings/models` tab, `查看全部` / `返回總覽` and the `/office/tasks/:id` links all still work.
- **Task detail page:** it prints `dispatch.status` as plain text (`[id].vue:107`), so the narrower type doesn't change anything there.

**Optional improvements (not blocking)**

1. `CommandCenter.vue:108,112,116,120`: the stat numbers have no `font-weight-bold`, and `text-subtitle-2` sets them to weight 500. Adding it would keep them easy to scan.
2. `dispatchStatus.ts:33`: `cancelled` uses the same red `is-failed` style as `failed`. A neutral style would tell them apart.
3. `CommandCenter.vue:60,63,76…`: the `border-border` dividers use Vuetify's default border opacity, so their contrast needs a browser check.
4. `types/api.ts:19`: the API payload isn't checked at runtime, but the unknown fallback catches bad values.
5. The map legend (`PixelOfficeMap.vue:67-70`) shows only three states. That predates this range.

**Limits:** this was a read-only review of the source. Bash and git were denied, so there was no `git show`, lint, typecheck, tests or browser run. It is based on `r5/change.diff` plus the current source, which matches the diff. The r5 result files were empty when I read them. Rendering, the narrow layout and contrast still need the root browser check.

Fixed point: `19be5ca..b1158bd9db8325c99bda9b0b6b00938f64cdf57c`。本報告僅涵蓋此範圍；不代表完整 QA 或 master 整合通過。
