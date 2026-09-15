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
const taskId = String(route.params.id)
onMounted(async (): Promise<void> => { state.value = await getState(taskId); intervention.value = await getIntervention(taskId) })
const resume = async (): Promise<void> => { await resumeTask(taskId, instruction.value, worktree.value); status.value = '已送出接手指令' }
const submit = async (): Promise<void> => { await submitTask(taskId, worktree.value, commit.value, gate.value, crypto.randomUUID()); status.value = '已送出交付驗收' }
</script>

<template>
  <main class="panel-page"><NuxtLink to="/">← 返回 AI Office</NuxtLink><template v-if="state"><h1>Office 工作詳情</h1><p class="purpose">{{ state.data.task.purpose }}</p><div class="badge">{{ state.data.stage }} · {{ state.data.activity }}</div><section class="detail-grid"><article><h2>角色與階段</h2><p v-for="role in ['leader', 'pm', 'rd_leader', 'rd', 'qa']" :key="role">🟢 {{ role }}</p></article><article><h2>執行摘要</h2><p>Spec：{{ state.data.spec ? '已載入' : '尚未建立' }}</p><p>Plan：{{ state.data.plan ? '已載入' : '尚未建立' }}</p><p>Evidence：{{ state.data.executions.length }} 筆</p><p>Environment：{{ state.data.workspace ? '已配置' : '尚未配置' }}</p></article><article><h2>阻塞與 QA</h2><p v-for="blocker in state.data.blockers || []" :key="blocker">⚠️ {{ blocker }}</p><p>QA：{{ state.data.qaReport ? '已產生' : '尚未產生' }}</p><p>交付：{{ state.data.delivery?.status || '尚未建立' }}</p></article></section><section><h2>人工接手</h2><p>{{ intervention?.data.status || '載入中' }}</p><input v-model="instruction" placeholder="接手指令" /><input v-model="worktree" placeholder="worktree" /><button @click="resume">Resume</button><input v-model="commit" placeholder="commit" /><input v-model="gate" placeholder="gate" /><button @click="submit">Submit</button><p v-if="status" role="status">{{ status }}</p></section></template><p v-else>載入中…</p></main>
</template>
