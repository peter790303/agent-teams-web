<script setup lang="ts">
import { useOffice } from '~/layers/office/composables/useOffice'
const route = useRoute()
const { getState, getIntervention, resumeTask, submitTask } = useOffice()
const state = ref<Awaited<ReturnType<typeof getState>> | null>(null)
const intervention = ref<Awaited<ReturnType<typeof getIntervention>> | null>(null)
const instruction = ref('')
const worktree = ref('')
const commit = ref('')
const gate = ref('')
const status = ref('')
const error = ref('')
const taskId = String(route.params.id)
onMounted(async (): Promise<void> => { try { state.value = await getState(taskId) } catch { error.value = '任務狀態載入失敗' }; try { intervention.value = await getIntervention(taskId) } catch { error.value = '人工接手狀態載入失敗' } })
const resume = async (): Promise<void> => { try { await resumeTask(taskId, instruction.value, worktree.value); status.value = '已送出接手指令' } catch { error.value = '接手指令送出失敗' } }
const submit = async (): Promise<void> => { try { await submitTask(taskId, worktree.value, commit.value, gate.value, crypto.randomUUID()); status.value = '已送出交付驗收' } catch { error.value = '交付驗收送出失敗' } }
</script>

<template>
  <main class="panel-page"><NuxtLink to="/">← 返回 AI Office</NuxtLink><p v-if="error" role="alert">{{ error }}</p><template v-if="state"><h1>Office 工作詳情</h1><p class="purpose">{{ state.data.task.purpose }}</p><div class="badge">{{ state.data.stage }} · {{ state.data.activity }}</div><section class="detail-grid"><article><h2>角色與階段</h2><p v-for="dispatch in state.data.dispatches" :key="dispatch.id">{{ dispatch.role }} · {{ dispatch.status }}</p></article><article><h2>執行摘要</h2><p>Spec：{{ state.data.spec ? '已載入' : '尚未建立' }}</p><p>Plan：{{ state.data.plan ? '已載入' : '尚未建立' }}</p><p>Evidence：{{ state.data.executions.length }} 筆</p><p>Environment：{{ state.data.workspace ? '已配置' : '尚未配置' }}</p></article><article><h2>阻塞與 QA</h2><template v-for="dispatch in state.data.dispatches" :key="`${dispatch.id}-blocks`"><p v-for="blocker in dispatch.blockedReasons" :key="blocker">⚠️ {{ blocker }}</p></template><p>QA：{{ state.data.qaReport ? JSON.stringify(state.data.qaReport) : '尚未產生' }}</p><p>交付：{{ state.data.delivery?.status || '尚未建立' }}</p></article></section><section><h2>人工接手</h2><p>{{ intervention?.data?.status || '尚未請求人工接手' }}</p><input v-model="instruction" placeholder="接手指令" /><input v-model="worktree" placeholder="worktree" /><button @click="resume">Resume</button><input v-model="commit" placeholder="commit" /><input v-model="gate" placeholder="gate" /><button @click="submit">Submit</button><p v-if="status" role="status">{{ status }}</p></section></template><p v-else>載入中…</p></main>
</template>
