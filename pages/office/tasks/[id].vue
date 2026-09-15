<template><main class="panel-page"><NuxtLink to="/">← 返回 AI Office</NuxtLink><div v-if="state"><h1>Office 工作詳情</h1><p class="purpose">{{ state.data.task.purpose }}</p><div class="badge">{{ state.data.stage }} · {{ state.data.activity }}</div><section class="detail-grid"><article><h2>角色與階段</h2><p v-for="role in roles" :key="role">🟢 {{ role }} <small>待命</small></p></article><article><h2>執行摘要</h2><p>Spec：{{ state.data.spec?'已載入':'尚未建立' }}</p><p>Plan：{{ state.data.plan?'已載入':'尚未建立' }}</p><p>Evidence：{{ state.data.executions.length }} 筆</p><p>Environment：{{ state.data.workspace?'已配置':'尚未配置' }}</p></article><article><h2>交付紀錄</h2><p>{{ state.data.delivery?.status || '尚未建立' }}</p></article></section></div><p v-else>載入中…</p></main></template>
<script setup lang="ts">
const route = useRoute()
const { getTaskState } = useOffice()
const state = ref<Awaited<ReturnType<typeof getTaskState>> | null>(null)
const roles = ['PM Spec', 'RD Leader', 'RD', 'Review', 'QA']
onMounted(async () => { state.value = await getTaskState(String(route.params.id)) })
</script>
