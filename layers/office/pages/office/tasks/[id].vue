<script setup lang="ts">
import { useOffice } from '~/layers/office/composables/useOffice'

// Category: page state and API view model
const route = useRoute()
const { getState, getIntervention, resumeTask, submitTask } = useOffice()
const state = ref<Awaited<ReturnType<typeof getState>> | null>(null)
const intervention = ref<Awaited<ReturnType<typeof getIntervention>> | null>(null)
const instruction = ref<string>('')
const worktree = ref<string>('')
const commit = ref<string>('')
const gate = ref<string>('')
const failedReviewRounds = ref<number>(0)
const extraReviewRoundAllowance = ref<string>('')
const status = ref<string>('')
const error = ref<string>('')
const taskId = String(route.params.id)
type DispatchView = Awaited<ReturnType<typeof getState>>['data']['dispatches'][number]
interface InterventionView { status?: string; editable?: boolean; role?: string; round?: number; branch?: string; worktree?: string; commit?: string; evidence?: unknown; diagnostics?: unknown; failedReviewRounds?: number; extraReviewRoundAllowance?: string }
const interventionData = computed<InterventionView | null>(() => intervention.value?.data === null || intervention.value?.data === undefined ? null : intervention.value.data as InterventionView)
const interventionEditable = computed<boolean>(() => interventionData.value?.editable === true)
const gateOptions = ['review', 'developmentQA', 'independentQA']
const readableValue = (value: unknown): string => typeof value === 'string' ? value : typeof value === 'number' || typeof value === 'boolean' ? String(value) : value === null || value === undefined ? '未知' : JSON.stringify(value, null, 2)
const qaRows = computed(() => state.value?.data.qaReport === null || state.value?.data.qaReport === undefined ? [] : Object.entries(state.value.data.qaReport).map(([label, value]) => ({ label, value: readableValue(value) })))
const diagnostics = computed<unknown>(() => interventionData.value?.diagnostics ?? interventionData.value?.evidence ?? null)
const displayWorktree = computed<string>(() => interventionData.value?.worktree ?? (worktree.value || '未知'))
const diagnosticsText = computed(() => readableValue(diagnostics.value))
const dispatchLines = computed(() => state.value?.data.dispatches.map((dispatch: DispatchView) => `${dispatch.role} · ${dispatch.status}`) ?? [])
const blockers = computed(() => state.value?.data.dispatches.flatMap((dispatch: DispatchView) => dispatch.blockedReasons) ?? [])
const summary = computed(() => state.value === null ? [] : [
  `Spec：${state.value.data.spec ? '已載入' : '尚未建立'}`,
  `Plan：${state.value.data.plan ? '已載入' : '尚未建立'}`,
  `Evidence：${state.value.data.executions.length} 筆`,
  `Environment：${state.value.data.workspace ? '已配置' : '尚未配置'}`,
])
useSeoMeta({ title: 'Office 工作詳情' })
onMounted(async (): Promise<void> => {
  try { state.value = await getState(taskId) } catch { error.value = '任務狀態載入失敗' }
  try {
    intervention.value = await getIntervention(taskId)
    const data = intervention.value?.data as InterventionView | null | undefined
    worktree.value = data?.worktree ?? ''
    commit.value = data?.commit ?? ''
    failedReviewRounds.value = data?.failedReviewRounds ?? 0
    extraReviewRoundAllowance.value = data?.extraReviewRoundAllowance ?? ''
  } catch { error.value = '人工接手狀態載入失敗' }
})
const resume = async (): Promise<void> => { try { await resumeTask(taskId, instruction.value, worktree.value, failedReviewRounds.value, extraReviewRoundAllowance.value); status.value = '已送出接手指令' } catch { error.value = '接手指令送出失敗' } }
const submit = async (): Promise<void> => { try { await submitTask(taskId, worktree.value, commit.value, gate.value, crypto.randomUUID()); status.value = '已送出交付驗收' } catch { error.value = '交付驗收送出失敗' } }
</script>

<template>
  <main class="panel-page"><NuxtLink to="/">← 返回 AI Office</NuxtLink><p v-if="error" role="alert">{{ error }}</p><template v-if="state"><h1>Office 工作詳情</h1><p class="purpose">{{ state.data.task.purpose }}</p><div class="badge">{{ state.data.stage }} · {{ state.data.activity }}</div><section class="detail-grid"><article><h2>角色與階段</h2><p v-for="line in dispatchLines" :key="line">{{ line }}</p></article><article><h2>執行摘要</h2><p v-for="line in summary" :key="line">{{ line }}</p></article><article><h2>阻塞與 QA</h2><p v-for="blocker in blockers" :key="blocker">⚠️ {{ blocker }}</p><div><strong>QA 報告</strong><p v-if="qaRows.length === 0">尚未產生</p><dl v-else><template v-for="row in qaRows" :key="row.label"><dt>{{ row.label }}</dt><dd>{{ row.value }}</dd></template></dl></div><p>交付：{{ state.data.delivery?.status ?? '尚未建立' }}</p></article></section><section><h2>人工接手</h2><p>狀態：{{ interventionData?.status ?? '尚未請求人工接手' }}</p><p>角色：{{ interventionData?.role ?? '未知' }} · 回合：{{ interventionData?.round ?? '未知' }}</p><p>Branch：{{ interventionData?.branch ?? '未知' }} · Worktree：{{ displayWorktree }}</p><p>Diagnostics：{{ diagnosticsText }}</p><fieldset><label>接手指令 <input v-model="instruction" :disabled="!interventionEditable" placeholder="接手指令" /></label><label>Worktree <input v-model="worktree" :disabled="!interventionEditable" placeholder="worktree" /></label><label>失敗 review 回合 <input v-model.number="failedReviewRounds" :disabled="!interventionEditable" min="0" type="number" /></label><label>額外 review allowance <input v-model="extraReviewRoundAllowance" :disabled="!interventionEditable" placeholder="需要時填寫授權" /></label><button :disabled="!interventionEditable" @click="resume">Resume</button><label>Commit <input v-model="commit" :disabled="!interventionEditable" placeholder="commit" /></label><label>Gate <select v-model="gate" :disabled="!interventionEditable"><option disabled value="">選擇 gate</option><option v-for="gateOption in gateOptions" :key="gateOption" :value="gateOption">{{ gateOption }}</option></select></label><button :disabled="!interventionEditable || gate === ''" @click="submit">Submit</button></fieldset><p v-if="!interventionEditable">目前 intervention 不可編輯，操作已停用。</p><p v-if="status" role="status">{{ status }}</p></section></template><p v-else>載入中…</p></main>
</template>
