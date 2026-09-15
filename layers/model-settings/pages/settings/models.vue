<script setup lang="ts">
// 📂 Category: model-settings page composition
import { useModelSettings } from '~/layers/model-settings/composables/useModelSettings'
const { editors, capacities, health, message, error, load, addCandidate, toggle, save, id } = useModelSettings()
useSeoMeta({ title: '模型設定與監控' })
onMounted(load)
</script>
<template>
  <BasePageLayout>
    <main class="panel-page"><NuxtLink to="/">← 返回 AI Office</NuxtLink><h1>模型設定與監控</h1><p>管理角色白名單、候選模型能力、評分、容量與 Provider 健康狀態。</p>
      <v-row>
        <v-col v-for="editor in editors" :key="editor.role" cols="12" md="6">
    <p v-if="message" role="status">{{ message }}</p><p v-if="error" role="alert">{{ error }}</p>
    <section class="policy"><h2>{{ editor.role }}</h2><p v-if="editor.loadError">{{ editor.loadError }}</p><p v-if="editor.validationError" role="alert">{{ editor.validationError }}</p>
      <label>最低品質分數 <input v-model="editor.minQualityScore" type="number" min="0" /></label>
      <ul><li v-for="candidate in editor.candidates" :key="id(candidate)"><label><input :checked="editor.selectedIds.includes(id(candidate))" type="checkbox" @change="toggle(editor, candidate)" /> {{ candidate.providerId }}/{{ candidate.modelId }}</label>
        <label>能力 <input v-model="editor.candidateDrafts[id(candidate)].capabilities" :aria-label="`${candidate.modelId} capabilities`" /></label><label>品質 <input v-model="editor.candidateDrafts[id(candidate)].qualityScore" type="number" /></label><label>成本 <input v-model="editor.candidateDrafts[id(candidate)].costScore" type="number" /></label><label>延遲 <input v-model="editor.candidateDrafts[id(candidate)].latencyScore" type="number" /></label>
      </li></ul>
      <form @submit.prevent="addCandidate(editor)"><input v-model="editor.draft.providerId" aria-label="Provider" placeholder="Provider" /><input v-model="editor.draft.modelId" aria-label="Model" placeholder="Model" /><input v-model="editor.draft.capabilities" aria-label="Capabilities" placeholder="Capabilities（逗號分隔）" /><input v-model="editor.draft.qualityScore" aria-label="Quality score" type="number" placeholder="品質分數" /><input v-model="editor.draft.costScore" aria-label="Cost score" type="number" placeholder="成本分數" /><input v-model="editor.draft.latencyScore" aria-label="Latency score" type="number" placeholder="延遲分數" /><button type="submit">新增候選</button></form><button @click="save(editor)">儲存</button></section>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6"><section><h2>角色容量</h2><table><tbody><tr v-for="capacity in capacities" :key="capacity.role"><td>{{ capacity.role }}</td><td>{{ capacity.currentCapacity }}/{{ capacity.maxCapacity }}</td><td>{{ capacity.availableCapacity }}</td></tr></tbody></table></section></v-col>
        <v-col cols="12"><section class="health"><h2>Provider 健康</h2><table><tbody><tr v-for="entry in health" :key="entry.providerId"><td>{{ entry.providerId }}</td><td>{{ entry.sourceGranularity }}</td><td>{{ entry.authStatus }}</td><td>{{ entry.callHealth }}</td><td>{{ entry.affectedModels.join(', ') || '—' }}</td><td>{{ entry.quota.status }} {{ entry.quota.amount ?? '—' }} {{ entry.quota.unit ?? '' }}</td><td>{{ entry.quota.isEstimated ? entry.quota.estimatedReason : '' }}</td><td>{{ entry.isStale ? '過期' : '新鮮' }} · {{ entry.observedAt }}</td></tr></tbody></table></section></v-col>
      </v-row>
    </main>
  </BasePageLayout>
</template>
