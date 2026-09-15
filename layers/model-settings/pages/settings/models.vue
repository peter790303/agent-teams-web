<script setup lang="ts">
  /*********************************************
   * 📂 Category: Imports
   * 🔧 Defines: 引入必要的模組和庫
   *********************************************/
  import { useModelSettings } from '~/layers/model-settings/composables/useModelSettings'

  /*********************************************
   * 📂 Category: Page Meta  (Nuxt only)
   * 🔧 Defines: 以 definePageMeta() 宣告的頁面層級設定
   *********************************************/

  useSeoMeta({ title: '模型設定與監控' })

  /*********************************************
   * 📂 Category: Composables / Plugins
   * 🔧 Defines: 自定 composables、Pinia 狀態、i18n、plugin 等注入來源
   *********************************************/

  const {
    editors,
    capacities,
    health,
    catalog,
    catalogState,
    catalogError,
    message,
    error,
    load,
    addCandidate,
    selectCatalogModel,
    toggle,
    save,
    id,
  } = useModelSettings()

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
      Ｆ
      <p>管理角色白名單、候選模型能力、評分、容量與 Provider 健康狀態。</p>
      <v-row>
        <v-col v-for="editor in editors" :key="editor.role" cols="12" md="6">
          <p v-if="message" role="status">{{ message }}</p>
          <p v-if="error" role="alert">{{ error }}</p>
          <section class="policy">
            <h2>{{ editor.role }}</h2>
            <p v-if="editor.loadError">{{ editor.loadError }}</p>
            <p v-if="editor.validationError" role="alert">{{ editor.validationError }}</p>
            <v-text-field
              v-model="editor.minQualityScore"
              label="最低品質分數"
              type="number"
              min="0"
              :disabled="editor.loadState === 'failed' || editor.loadState === 'pending'"
            />
            <ul>
              <li v-for="candidate in editor.candidates" :key="id(candidate)">
                <v-checkbox
                  :model-value="editor.selectedIds.includes(id(candidate))"
                  :label="`${candidate.providerId}/${candidate.modelId}`"
                  @update:model-value="toggle(editor, candidate)"
                />
                <v-text-field v-model="editor.candidateDrafts[id(candidate)].capabilities" label="能力" />
                <v-text-field v-model="editor.candidateDrafts[id(candidate)].qualityScore" label="品質" type="number" />
                <v-text-field v-model="editor.candidateDrafts[id(candidate)].costScore" label="成本" type="number" />
                <v-text-field v-model="editor.candidateDrafts[id(candidate)].latencyScore" label="延遲" type="number" />
              </li>
            </ul>
            <form @submit.prevent="addCandidate(editor)">
              <v-select
                v-model="editor.draft.modelId"
                label="Provider 支援模型"
                :items="catalog"
                item-title="modelId"
                item-value="modelId"
                :loading="catalogState === 'pending'"
                :disabled="catalogState !== 'loaded' || catalog.length === 0"
                @update:model-value="selectCatalogModel(editor, $event)"
              />
              <v-text-field v-model="editor.draft.providerId" label="Provider" readonly />
              <v-text-field v-model="editor.draft.capabilities" label="能力（逗號分隔）" />
              <v-text-field v-model="editor.draft.qualityScore" label="品質分數" type="number" />
              <v-text-field v-model="editor.draft.costScore" label="成本分數" type="number" />
              <v-text-field v-model="editor.draft.latencyScore" label="延遲分數" type="number" />
              <v-btn
                type="submit"
                :disabled="editor.loadState === 'failed' || editor.loadState === 'pending' || catalogState !== 'loaded'"
                >新增候選</v-btn
              >
            </form>
            <p v-if="catalogError" role="alert">{{ catalogError }}</p>
            <p v-else-if="catalogState === 'loaded' && catalog.length === 0">Provider 尚未回傳可用模型</p>
            <v-btn :disabled="editor.loadState !== 'loaded' && editor.loadState !== 'missing'" @click="save(editor)"
              >儲存</v-btn
            >
          </section>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6"
          ><section>
            <h2>角色容量</h2>
            <table>
              <tbody>
                <tr v-for="capacity in capacities" :key="capacity.role">
                  <td>{{ capacity.role }}</td>
                  <td>{{ capacity.currentCapacity }}/{{ capacity.maxCapacity }}</td>
                  <td>{{ capacity.availableCapacity }}</td>
                </tr>
              </tbody>
            </table>
          </section></v-col
        >
        <v-col cols="12"
          ><section class="health">
            <h2>Provider 健康</h2>
            <table>
              <tbody>
                <tr v-for="entry in health" :key="entry.providerId">
                  <td>{{ entry.providerId }}</td>
                  <td>{{ entry.sourceGranularity }}</td>
                  <td>{{ entry.authStatus }}</td>
                  <td>{{ entry.callHealth }}</td>
                  <td>{{ entry.affectedModels.join(', ') || '—' }}</td>
                  <td>{{ entry.quota.status }} {{ entry.quota.amount ?? '—' }} {{ entry.quota.unit ?? '' }}</td>
                  <td>{{ entry.quota.isEstimated ? entry.quota.estimatedReason : '' }}</td>
                  <td>{{ entry.isStale ? '過期' : '新鮮' }} · {{ entry.observedAt }}</td>
                </tr>
              </tbody>
            </table>
          </section></v-col
        >
      </v-row>
    </main>
  </BasePageLayout>
</template>
