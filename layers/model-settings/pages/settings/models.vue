<script setup lang="ts">
import { getCapacities, getHealth, getPolicy, savePolicy } from '~/layers/model-settings/repositories'
import type { Capacity, HealthEntry, ModelCandidate, PolicyData, Role } from '~/layers/model-settings/types'

const roles: Role[] = ['leader', 'pm', 'rd_leader', 'rd', 'qa']
const policies = ref<PolicyData[]>([])
const capacities = ref<Capacity[]>([])
const health = ref<HealthEntry[]>([])
const selected = ref<Record<Role, ModelCandidate[]>>({ leader: [], pm: [], rd_leader: [], rd: [], qa: [] })
const additions = reactive<Record<Role, ModelCandidate>>({ leader: blank(), pm: blank(), rd_leader: blank(), rd: blank(), qa: blank() })
const message = ref('')
const error = ref('')
function blank(): ModelCandidate { return { providerId: '', modelId: '', capabilities: ['code'], qualityScore: 0, costScore: 0, latencyScore: 0 } }
onMounted(async (): Promise<void> => {
  const results = await Promise.allSettled(roles.map((role) => getPolicy(role)))
  policies.value = results.flatMap((result) => result.status === 'fulfilled' ? [result.value.data] : [])
  policies.value.forEach((policy: PolicyData) => { selected.value[policy.role] = [...policy.whitelist] })
  try { capacities.value = (await getCapacities()).data } catch { error.value = '容量資料暫時無法載入' }
  try { health.value = (await getHealth()).data } catch { error.value = 'Provider 健康資料暫時無法載入' }
  if (policies.value.length === 0) error.value = '尚未建立任何模型政策'
})
function addCandidate(role: Role): void {
  const candidate = additions[role]
  if (!candidate.providerId.trim() || !candidate.modelId.trim()) return
  selected.value[role].push({ ...candidate, providerId: candidate.providerId.trim(), modelId: candidate.modelId.trim(), capabilities: [...candidate.capabilities] })
  additions[role] = blank()
}
async function save(policy: PolicyData): Promise<void> {
  try { await savePolicy(policy.role, selected.value[policy.role], policy.minQualityScore ?? 0); message.value = `${policy.role} 已儲存`; error.value = '' }
  catch (reason) { error.value = reason instanceof Error ? reason.message : '模型政策儲存失敗' }
}
</script>

<template>
  <main class="panel-page"><NuxtLink to="/">← 返回 AI Office</NuxtLink><h1>模型設定與監控</h1><p>管理角色白名單、能力、評分、容量與 Provider 健康狀態。</p>
    <p v-if="message" role="status">{{ message }}</p><p v-if="error" role="alert">{{ error }}</p>
    <section v-for="policy in policies" :key="policy.role" class="policy"><h2>{{ policy.role }}</h2><p>最低品質分數：{{ policy.minQualityScore ?? 0 }} · 版本 {{ policy.version }}</p>
      <ul><li v-for="model in selected[policy.role]" :key="`${model.providerId}:${model.modelId}`"><label><input v-model="selected[policy.role]" type="checkbox" :value="model" /> {{ model.providerId }}/{{ model.modelId }}</label><small>能力 {{ model.capabilities.join(', ') }} · Q{{ model.qualityScore }} · C{{ model.costScore }} · L{{ model.latencyScore }}</small></li></ul>
      <form @submit.prevent="addCandidate(policy.role)"><input v-model="additions[policy.role].providerId" aria-label="Provider" placeholder="Provider" /><input v-model="additions[policy.role].modelId" aria-label="Model" placeholder="Model" /><button type="submit">新增候選</button></form><button @click="save(policy)">儲存</button>
    </section>
    <section><h2>角色容量</h2><table><tbody><tr v-for="capacity in capacities" :key="capacity.role"><td>{{ capacity.role }}</td><td>{{ capacity.currentCapacity }}/{{ capacity.maxCapacity }}</td><td>{{ capacity.availableCapacity }}</td></tr></tbody></table></section>
    <section class="health"><h2>Provider 健康</h2><table><tbody><tr v-for="entry in health" :key="entry.providerId"><td>{{ entry.providerId }}</td><td>{{ entry.authStatus }}</td><td>{{ entry.callHealth }}</td><td>{{ entry.quota.status }}</td><td>{{ entry.isStale ? '過期' : '新鮮' }} · {{ entry.observedAt }}</td></tr></tbody></table></section>
  </main>
</template>
