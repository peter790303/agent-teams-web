<script setup lang="ts">
import { getCapacities, getHealth, getPolicy, savePolicy, selectModel } from '~/layers/model-settings/repositories'
import type { Capacity, HealthEntry, ModelCandidate, PolicyData, Role } from '~/layers/office/types'

const roles: Role[] = ['leader', 'pm', 'rd_leader', 'rd', 'qa']
const policies = ref<PolicyData[]>([])
const capacities = ref<Capacity[]>([])
const health = ref<HealthEntry[]>([])
const selected = ref<Record<Role, ModelCandidate[]>>({ leader: [], pm: [], rd_leader: [], rd: [], qa: [] })
const message = ref('')
onMounted(async (): Promise<void> => {
  const loaded = await Promise.all(roles.map((role) => getPolicy(role)))
  policies.value = loaded.map((result) => result.data)
  policies.value.forEach((policy: PolicyData) => { selected.value[policy.role] = [...policy.whitelist] })
  capacities.value = (await getCapacities()).data
  health.value = (await getHealth()).data
})
const save = async (policy: PolicyData): Promise<void> => {
  await savePolicy(policy.role, selected.value[policy.role], policy.minQualityScore)
  await selectModel(policy.role)
  message.value = `${policy.role} 已儲存並完成選模`
}
</script>

<template>
  <main class="panel-page">
    <NuxtLink to="/">← 返回 AI Office</NuxtLink><h1>模型設定與監控</h1><p>管理角色白名單、能力、評分、容量與 Provider 健康狀態。</p><p v-if="message" role="status">{{ message }}</p>
    <section v-for="policy in policies" :key="policy.role" class="policy"><h2>{{ policy.role }}</h2><p>最低品質分數：{{ policy.minQualityScore }} · 版本 {{ policy.version }}</p><ul><li v-for="model in policy.whitelist" :key="`${model.providerId}:${model.modelId}`"><label><input v-model="selected[policy.role]" type="checkbox" :value="model" /> {{ model.providerId }}/{{ model.modelId }}</label><small>能力 {{ model.capabilities.join(', ') }} · Q{{ model.qualityScore }} · C{{ model.costScore }} · L{{ model.latencyScore }}</small></li></ul><button @click="save(policy)">儲存並派工</button></section>
    <section><h2>角色容量</h2><table><thead><tr><th>角色</th><th>目前</th><th>上限</th><th>可用</th></tr></thead><tbody><tr v-for="capacity in capacities" :key="capacity.role"><td>{{ capacity.role }}</td><td>{{ capacity.currentCapacity }}</td><td>{{ capacity.maxCapacity }}</td><td>{{ capacity.availableCapacity }}</td></tr></tbody></table></section>
    <section class="health"><h2>Provider 健康</h2><table><thead><tr><th>Provider</th><th>Auth</th><th>Call</th><th>Quota</th><th>受影響模型</th></tr></thead><tbody><tr v-for="entry in health" :key="entry.providerId"><td>{{ entry.providerId }}</td><td>{{ entry.authStatus }}</td><td>{{ entry.callHealth }}</td><td>{{ entry.quota.status }}</td><td>{{ entry.affectedModels.join(', ') || '—' }}</td></tr></tbody></table></section>
  </main>
</template>
