<template><main class="panel-page"><NuxtLink to="/">← 返回 AI Office</NuxtLink><h1>模型設定與監控</h1><p>管理角色白名單與 Provider 健康狀態。</p><section v-for="policy in policies" :key="policy.role" class="policy"><h2>{{ policy.role }}</h2><label v-for="model in policy.whitelist" :key="model.modelId"><input v-model="selected[policy.role]" type="checkbox" :value="model.modelId"/> {{ model.modelId }}</label><button @click="save(policy.role)">儲存並派工</button></section><section class="health"><h2>Provider 健康</h2><table><tr><th>Provider</th><th>Auth</th><th>Call</th><th>Quota</th></tr><tr v-for="entry in health" :key="entry.providerId"><td>{{ entry.providerId }}</td><td>{{ entry.authStatus }}</td><td>{{ entry.callHealth }}</td><td>{{ entry.quota.status }}</td></tr></table></section></main></template>
<script setup lang="ts">
import { getHealth, getPolicy, savePolicy, selectModel } from '~/repositories/models'
const roles = ['pm', 'rd-leader', 'rd', 'review', 'qa']
const policies = ref<any[]>([])
const health = ref<any[]>([])
const selected = ref<Record<string, string[]>>({})
onMounted(async () => {
  policies.value = await Promise.all(roles.map(async role => (await getPolicy(role)).data))
  policies.value.forEach((policy: any) => { selected.value[policy.role] = policy.whitelist.map((model: any) => model.modelId) })
  health.value = (await getHealth()).data
})
const save = async (role: string) => { await savePolicy(role, (selected.value[role] || []).map((modelId: string) => ({ modelId }))); await selectModel(role) }
</script>
