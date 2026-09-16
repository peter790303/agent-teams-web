<script setup lang="ts">
  /*********************************************
   * 📂 Category: Imports
   * 🔧 Defines: 引入必要的模組和庫
   *********************************************/
  import { useOffice } from '~/layers/office/composables/useOffice'
  import type { TaskState } from '~/layers/office/types'

  /*********************************************
   * 📂 Category: Page Meta  (Nuxt only)
   * 🔧 Defines: 以 definePageMeta() 宣告的頁面層級設定
   *********************************************/
  useSeoMeta({ title: 'Office 工作詳情' })

  /*********************************************
   * 📂 Category: Interface
   * 🔧 Defines: 定義元件內使用的自訂 TypeScript 型別
   *********************************************/
  type DispatchView = TaskState['data']['dispatches'][number]
  interface InterventionView {
    status?: string
    editable?: boolean
    role?: string
    round?: number
    branch?: string
    worktree?: string
    commit?: string
    evidence?: unknown
    diagnostics?: unknown
    failedReviewRounds?: number
    extraReviewRoundAllowance?: string
    processId?: string
    preview?: string
    automaticWriting?: string
  }

  /*********************************************
   * 📂 Category: Props / Emits
   * 🔧 Defines: 定義元件接收的 props 或 emits 事件
   *********************************************/

  /*********************************************
   * 📂 Category: Composables / Plugins
   * 🔧 Defines: 自定 composables、Pinia 狀態、i18n、plugin 等注入來源
   *********************************************/
  const route = useRoute()
  const { getState, getIntervention, resumeTask, submitTask } = useOffice()

  /*********************************************
   * 📂 Category: Static Data
   * 🔧 Defines: 不會改變的靜態資料，例如選單、enum 對應等
   *********************************************/
  const gateOptions = ['review', 'developmentQA', 'independentQA']
  const stageLabels: Record<string, string> = {
    pending_dispatch: '等待派工',
    spec: '規格整理',
    plan: '開發計畫',
    implementation: '實作中',
    review: '審查中',
    qa: '品質驗證',
    delivery_cleanup: '交付清理',
    completed: '已完成',
    cancelled: '已取消',
    unknown: '未知',
  }

  /*********************************************
   * 📂 Category: Refs / Reactive State
   * 🔧 Defines: 元件中的 ref, reactive 等可變資料狀態
   *********************************************/
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
  const submitting = ref<boolean>(false)
  const submitKey = ref<string>('')
  const submitOperationSignature = ref<string | null>(null)
  const taskId = String(route.params.id)

  /*********************************************
   * 📂 Category: Methods
   * 🔧 Defines: 顯示 API 未知值
   *********************************************/
  const readableValue = (value: unknown): string =>
    typeof value === 'string'
      ? value
      : typeof value === 'number' || typeof value === 'boolean'
        ? String(value)
        : value === null || value === undefined
          ? '未知'
          : JSON.stringify(value, null, 2)

  /*********************************************
   * 📂 Category: Provide / Inject
   * 🔧 Defines: 提供給下層或自上層注入的值
   *********************************************/

  /*********************************************
   * 📂 Category: Computed
   * 🔧 Defines: 定義計算屬性
   *********************************************/
  const interventionData = computed<InterventionView | null>(() =>
    intervention.value?.data === null || intervention.value?.data === undefined ? null : intervention.value.data
  )
  const interventionEditable = computed<boolean>(() => interventionData.value?.editable === true)
  const qaRows = computed<Array<{ label: string; value: string }>>(() =>
    state.value?.data.qaReport === null || state.value?.data.qaReport === undefined
      ? []
      : Object.entries(state.value.data.qaReport).map(([label, value]) => ({ label, value: readableValue(value) }))
  )
  const hasQaRows = computed<boolean>(() => qaRows.value.length > 0)
  const submitDisabled = computed<boolean>(() => !interventionEditable.value || gate.value === '')
  const interventionStatus = computed<string>(() => interventionData.value?.status ?? '尚未請求人工接手')
  const interventionRole = computed<string>(() => interventionData.value?.role ?? '未知')
  const interventionRound = computed<string>(() => String(interventionData.value?.round ?? '未知'))
  const interventionBranch = computed<string>(() => interventionData.value?.branch ?? '未知')
  const interventionPreview = computed<string>(() => interventionData.value?.preview ?? '未知')
  const interventionProcess = computed<string>(() => interventionData.value?.processId ?? '未知')
  const interventionWriting = computed<string>(() => interventionData.value?.automaticWriting ?? '未知')
  const reviewRoundWarning = computed<boolean>(() => (interventionData.value?.round ?? 0) >= 3)
  const deliveryStatus = computed<string>(() => (state.value?.data.delivery?.status as string) ?? '未知')
  const deliveryBranch = computed<string>(() => (state.value?.data.delivery?.branch as string) ?? '未知')
  const deliveryCommit = computed<string>(() => (state.value?.data.delivery?.commit as string) ?? '未知')
  const deliveryIde = computed<string>(() => (state.value?.data.delivery?.ide as string) ?? '未知')
  const deliveryCleanup = computed<string>(() => (state.value?.data.delivery?.cleanup as string) ?? '未知')

  const diagnostics = computed<unknown>(
    () => interventionData.value?.diagnostics ?? interventionData.value?.evidence ?? null
  )
  const displayWorktree = computed<string>(() => interventionData.value?.worktree ?? (worktree.value || '未知'))
  const diagnosticsText = computed(() => readableValue(diagnostics.value))
  const dispatchLines = computed<string[]>(
    () => state.value?.data.dispatches.map((dispatch: DispatchView) => `${dispatch.role} · ${dispatch.status}`) ?? []
  )
  const blockers = computed<string[]>(
    () => state.value?.data.dispatches.flatMap((dispatch: DispatchView) => dispatch.blockedReasons) ?? []
  )
  const summary = computed<string[]>(() =>
    state.value === null
      ? []
      : [
          `Spec：${state.value.data.spec ? '已載入' : '尚未建立'}`,
          `Plan：${state.value.data.plan ? '已載入' : '尚未建立'}`,
          `Evidence：${state.value.data.executions.length} 筆`,
          `Environment：${state.value.data.workspace ? '已配置' : '尚未配置'}`,
        ]
  )

  /*********************************************
   * 📂 Category: Watch
   * 🔧 Defines: 監聽特定資料變化並執行對應邏輯
   *********************************************/

  /*********************************************
   * 📂 Category: Methods
   * 🔧 Defines: 定義函數與事件處理
   *********************************************/
  const errorMessage = (reason: unknown, fallback: string): string =>
    reason instanceof Error ? reason.message : fallback
  const getSubmitKey = (): string => {
    const signature = [taskId, worktree.value, commit.value, gate.value].join('|')
    if (submitOperationSignature.value !== signature) {
      submitOperationSignature.value = signature
      submitKey.value = crypto.randomUUID()
    }

    return submitKey.value
  }
  const rotateSubmitKey = (): void => {
    submitOperationSignature.value = null
    submitKey.value = ''
  }
  const resume = async (): Promise<void> => {
    if (submitting.value) return
    submitting.value = true
    try {
      await resumeTask({
        id: taskId,
        instruction: instruction.value,
        worktree: worktree.value,
        failedReviewRounds: failedReviewRounds.value,
        extraReviewRoundAllowance: extraReviewRoundAllowance.value,
      })
      status.value = '已送出接手指令'
      state.value = await getState(taskId)
      intervention.value = await getIntervention(taskId)
      rotateSubmitKey()
    } catch (reason) {
      error.value = errorMessage(reason, '接手指令送出失敗')
    } finally {
      submitting.value = false
    }
  }
  const submit = async (): Promise<void> => {
    if (submitting.value) return
    submitting.value = true
    try {
      await submitTask({
        id: taskId,
        worktree: worktree.value,
        commit: commit.value,
        gate: gate.value,
        idempotencyKey: getSubmitKey(),
      })
      status.value = '已送出交付驗收'
      rotateSubmitKey()
      state.value = await getState(taskId)
      intervention.value = await getIntervention(taskId)
    } catch (reason) {
      error.value = errorMessage(reason, '交付驗收送出失敗')
    } finally {
      submitting.value = false
    }
  }

  /*********************************************
   * 📂 Category: Lifecycle Hooks
   * 🔧 Defines: Vue 生命週期 hook —— onMounted、onUnmounted 等
   *********************************************/
  onMounted(async (): Promise<void> => {
    try {
      state.value = await getState(taskId)
    } catch (reason) {
      error.value = errorMessage(reason, '任務狀態載入失敗')
    }
    try {
      intervention.value = await getIntervention(taskId)
      const data = intervention.value?.data
      worktree.value = data?.worktree ?? ''
      commit.value = data?.commit ?? ''
      failedReviewRounds.value = data?.round ?? 0
      extraReviewRoundAllowance.value = data?.extraReviewRoundAllowance ?? ''
    } catch (reason) {
      error.value = errorMessage(reason, '人工接手狀態載入失敗')
    }
  })
</script>

<template>
  <BasePageLayout>
    <main class="panel-page">
      <NuxtLink to="/">← 返回 AI Office</NuxtLink>
      <p v-if="error" role="alert">{{ error }}</p>
      <template v-if="state"
        ><h1>Office 工作詳情</h1>
        <p class="purpose">{{ state.data.task.purpose }}</p>
        <div class="badge">{{ stageLabels[state.data.stage] ?? '未知' }} · {{ state.data.activity }}</div>
        <v-row
          ><v-col cols="12"
            ><section class="detail-grid">
              <article>
                <h2>角色與階段</h2>
                <p v-for="line in dispatchLines" :key="line">{{ line }}</p>
              </article>
              <article>
                <h2>執行摘要</h2>
                <p v-for="line in summary" :key="line">{{ line }}</p>
              </article>
              <article>
                <h2>阻塞與 QA</h2>
                <p v-for="blocker in blockers" :key="blocker">⚠️ {{ blocker }}</p>
                <div>
                  <strong>QA 報告</strong>
                  <p v-if="!hasQaRows">尚未產生</p>
                  <dl v-else>
                    <template v-for="row in qaRows" :key="row.label"
                      ><dt>{{ row.label }}</dt>
                      <dd>{{ row.value }}</dd></template
                    >
                  </dl>
                </div>
                <p>交付：{{ deliveryStatus }}</p>
                <p>Branch：{{ deliveryBranch }} · Commit：{{ deliveryCommit }}</p>
                <p>IDE：{{ deliveryIde }} · Cleanup：{{ deliveryCleanup }}</p>
              </article>
            </section></v-col
          ></v-row
        >
        <v-row
          ><v-col cols="12"
            ><section>
              <h2>人工接手</h2>
              <p>狀態：{{ interventionStatus }}</p>
              <p>角色：{{ interventionRole }} · 回合：{{ interventionRound }}</p>
              <p>Branch：{{ interventionBranch }} · Worktree：{{ displayWorktree }}</p>
              <p>Diagnostics：{{ diagnosticsText }}</p>
              <p>Preview：{{ interventionPreview }} · Process：{{ interventionProcess }}</p>
              <p>自動寫入：{{ interventionWriting }}</p>
              <v-alert v-if="reviewRoundWarning" type="warning" variant="tonal"
                >已達 3 回合 review，請人工確認。</v-alert
              >
              <div class="intervention-form">
                <v-text-field v-model="instruction" :disabled="!interventionEditable" label="接手指令" /><v-text-field
                  v-model="worktree"
                  :disabled="!interventionEditable"
                  label="Worktree"
                /><v-text-field
                  v-model.number="failedReviewRounds"
                  :disabled="!interventionEditable"
                  label="失敗 review 回合"
                  min="0"
                  type="number"
                /><v-text-field
                  v-model="extraReviewRoundAllowance"
                  :disabled="!interventionEditable"
                  label="額外 review allowance"
                /><v-btn :disabled="!interventionEditable" @click="resume">Resume</v-btn
                ><v-text-field v-model="commit" :disabled="!interventionEditable" label="Commit" /><v-select
                  v-model="gate"
                  :disabled="!interventionEditable"
                  :items="gateOptions"
                  label="Gate"
                  clearable
                /><v-btn :disabled="submitDisabled" @click="submit">Submit</v-btn>
              </div>
              <p v-if="!interventionEditable">目前 intervention 不可編輯，操作已停用。</p>
              <p v-if="status" role="status">{{ status }}</p>
            </section></v-col
          ></v-row
        >
      </template>
      <p v-else>載入中…</p>
    </main>
  </BasePageLayout>
</template>
