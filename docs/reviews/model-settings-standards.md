## Standards

**PASS — fixed head `eaa2fd9d1c7b33680d411c705186e3e02c16cea0` (model-settings package only).**

No blocking documented-standard breach remains in the fixed `c4bd1d5...eaa2fd9` two-file diff.

- `layers/model-settings/composables/useModelSettings.ts:20-107` now follows FrontEnd/05’s required category ownership and order: module-level `roles` is under Static Data, reactive editor initialization is under Refs / Reactive State, and the composable-local creation/conversion/formatting functions are under Methods. The exported composable and callback/helper return types are explicit, and functions use arrow syntax, satisfying FrontEnd/04 and FrontEnd/13.
- `layers/model-settings/composables/useModelSettings.ts:66-107` keeps the unshared draft creation, validation, conversion, and key-formatting helpers inside the composable that owns their flow. This closes the FrontEnd/08 scope violation introduced by the removed `modelSettingsHelpers.ts`; the fixed tree confirms that file no longer exists.
- `layers/model-settings/utils/modelSettingsMappers.ts:7-28` contains only the public API-payload conversion mapper, exposes an explicit `ModelSettingsMappers` interface, and uses the public `toPolicyPayload` name. This matches FrontEnd/10’s mapper responsibility/factory/public naming rules and FrontEnd/09’s repository payload boundary.

Nonblocking judgement call: the initial draft literal at `useModelSettings.ts:42-49` repeats the shape returned by `createBlankDraft` at lines 66-73. This is a small Fowler Duplicated Code smell, but extracting it before Refs would violate the repository’s category/scope rules; it is not a documented-rule breach.

Formatter, lint, and typecheck findings were excluded as instructed. This package PASS does not supersede the outstanding overall UI review result.
