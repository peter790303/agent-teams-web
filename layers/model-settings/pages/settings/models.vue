<script setup lang="ts">
  /*********************************************
   * 📂 Category: Imports
   * 🔧 Defines: 引入必要的模組和庫
   *********************************************/
  import { useModelSettings } from '~/layers/model-settings/composables/useModelSettings'
  import type { Capacity, HealthEntry, ModelCatalog, PolicyEditor, Role } from '~/layers/model-settings/types'

  /*********************************************
   * 📂 Category: Page Meta  (Nuxt only)
   * 🔧 Defines: 以 definePageMeta() 宣告的頁面層級設定
   *********************************************/

  useSeoMeta({ title: '模型設定與監控' })

  /*********************************************
   * 📂 Category: Interface
   * 🔧 Defines: 定義元件內使用的自訂 TypeScript 型別
   *********************************************/
  interface CapacityRow extends Capacity {
    capacityText: string
  }
  interface HealthRow extends HealthEntry {
    affectedModelsText: string
    quotaText: string
    estimatedReasonText: string | null
    observedAtText: string
  }
  interface CatalogSelectItem {
    type?: 'subheader'
    title: string
    value?: string
    props?: {
      color?: string
    }
  }
  interface PolicyEditorCard {
    editor: PolicyEditor
    roleLabel: string
    canSave: boolean
    selectDisabled: boolean
  }

  /*********************************************
   * 📂 Category: Static Data
   * 🔧 Defines: 角色顯示名稱
   *********************************************/
  const ROLE_LABELS: Record<Role, string> = {
    leader: 'Leader',
    pm: 'PM',
    rd_leader: 'RD Leader',
    rd: 'RD',
    qa: 'QA',
  }
  const PROVIDER_LABELS: Record<string, string> = {
    anthropic: 'Anthropic',
    openai: 'OpenAI',
    agy: 'agy',
    xai: 'xAI',
  }

  /*********************************************
   * 📂 Category: Composables / Plugins
   * 🔧 Defines: 自定 composables、Pinia 狀態、i18n、plugin 等注入來源
   *********************************************/

  const { editors, capacities, health, catalog, catalogState, catalogError, message, error, load, save, catalogId } =
    useModelSettings()

  /*********************************************
   * 📂 Category: Computed
   * 🔧 Defines: 定義計算屬性
   *********************************************/
  const isCatalogLoading = computed(() => catalogState.value === 'pending')
  const isCatalogReady = computed(() => catalogState.value === 'loaded' && catalog.value.length > 0)
  const showEmptyCatalog = computed(() => catalogState.value === 'loaded' && catalog.value.length === 0)
  const catalogSelectItems = computed<CatalogSelectItem[]>(() => {
    const providerIds = [...new Set(catalog.value.map((entry: ModelCatalog) => entry.providerId))]

    return providerIds.flatMap((providerId) => [
      {
        type: 'subheader',
        title: PROVIDER_LABELS[providerId] ?? providerId,
        props: { color: 'accent' },
      },
      ...catalog.value
        .filter((entry: ModelCatalog) => entry.providerId === providerId)
        .map((entry: ModelCatalog) => ({
          title: entry.modelId,
          value: catalogId(entry),
        })),
    ])
  })
  const editorCards = computed<PolicyEditorCard[]>(() =>
    editors.value.map((editor) => ({
      editor,
      roleLabel: ROLE_LABELS[editor.role],
      canSave: (editor.loadState === 'loaded' || editor.loadState === 'missing') && isCatalogReady.value,
      selectDisabled: !isCatalogReady.value || editor.loadState === 'failed' || editor.loadState === 'pending',
    }))
  )
  const capacityRows = computed<CapacityRow[]>(() =>
    capacities.value.map((capacity: Capacity) => ({
      ...capacity,
      capacityText: `${capacity.currentCapacity}/${capacity.maxCapacity}`,
    }))
  )
  const healthRows = computed<HealthRow[]>(() =>
    health.value.map((entry: HealthEntry) => ({
      ...entry,
      affectedModelsText: entry.affectedModels.join(', ') || '—',
      quotaText: `${entry.quota.status} ${entry.quota.amount ?? '—'} ${entry.quota.unit ?? ''}`.trim(),
      estimatedReasonText: entry.quota.isEstimated ? entry.quota.estimatedReason : '',
      observedAtText: `${entry.isStale ? '過期' : '新鮮'} · ${entry.observedAt}`,
    }))
  )

  /*********************************************
   * 📂 Category: Lifecycle Hooks
   * 🔧 Defines: Vue 生命週期 hook —— onMounted、onUnmounted 等
   *********************************************/
  onMounted(load)
</script>
<template>
  <BasePageLayout>
    <main class="panel-page">
      <NuxtLink to="/">← 返回 AI Office</NuxtLink>
      <h1>模型設定與監控</h1>
      <p>為每個角色複選可用模型。能力、品質、成本與延遲由系統設定，不需填寫。</p>
      <p v-if="message" role="status">{{ message }}</p>
      <p v-if="error" role="alert">{{ error }}</p>
      <p v-if="catalogError" role="alert">{{ catalogError }}</p>
      <p v-else-if="showEmptyCatalog">目前沒有可選模型</p>
      <v-row>
        <v-col v-for="card in editorCards" :key="card.editor.role" cols="12" md="6">
          <section class="policy">
            <h2>{{ card.roleLabel }}</h2>
            <p v-if="card.editor.loadError">{{ card.editor.loadError }}</p>
            <p v-if="card.editor.validationError" role="alert">{{ card.editor.validationError }}</p>
            <v-select
              v-model="card.editor.selectedIds"
              :items="catalogSelectItems"
              item-title="title"
              item-value="value"
              label="可用模型"
              hint="只需選擇此角色能使用的模型"
              prepend-inner-icon="mdi-chip"
              persistent-hint
              multiple
              chips
              closable-chips
              :loading="isCatalogLoading"
              :disabled="card.selectDisabled"
            />
            <v-btn class="mt-3" prepend-icon="mdi-content-save" :disabled="!card.canSave" @click="save(card.editor)"
              >儲存</v-btn
            >
          </section>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <section>
            <h2>角色容量</h2>
            <v-table>
              <tbody>
                <tr v-for="capacity in capacityRows" :key="capacity.role">
                  <td>{{ capacity.role }}</td>
                  <td>{{ capacity.capacityText }}</td>
                  <td>{{ capacity.availableCapacity }}</td>
                </tr>
              </tbody>
            </v-table>
          </section>
        </v-col>
        <v-col cols="12">
          <section class="health">
            <h2>Provider 健康</h2>
            <v-table>
              <tbody>
                <tr v-for="entry in healthRows" :key="entry.providerId">
                  <td>{{ entry.providerId }}</td>
                  <td>{{ entry.sourceGranularity }}</td>
                  <td>{{ entry.authStatus }}</td>
                  <td>{{ entry.callHealth }}</td>
                  <td>{{ entry.affectedModelsText }}</td>
                  <td>{{ entry.quotaText }}</td>
                  <td>{{ entry.estimatedReasonText }}</td>
                  <td>{{ entry.observedAtText }}</td>
                </tr>
              </tbody>
            </v-table>
          </section>
        </v-col>
      </v-row>
    </main>
  </BasePageLayout>
</template>
