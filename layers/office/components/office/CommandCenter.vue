<script setup lang="ts">
  /*********************************************
   * 📂 Category: Imports
   * 🔧 Defines: 引入任務型別
   *********************************************/
  import { TaskStageEnum } from '~/layers/domain/task/enums/TaskStageEnum'
  import type { Task } from '~/layers/office/types'

  /*********************************************
   * 📂 Category: Interface
   * 🔧 Defines: 指揮中心統計資料型別
   *********************************************/
  type CommandStats = {
    completed: number
    waiting: number
    running: number
  }
  type ActivityItem = { text: string; updatedAt: string | null }
  type ResourceItem = { name: string; status?: string; owner?: string; percent?: number }
  type ActivityPresentation = { key: string; text: string; time: string }
  type ResourcePresentation = {
    name: string
    value: string
    trackValue: number
    ariaLabel: string
    ariaValueText: string
  }
  type TaskPresentation = {
    id: string
    purpose: string
    project: string
    stage: string
    href: string
  }
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
  const stageLabel = (stage: string): string => stageLabels[stage] ?? '未知'
  const formatTime = (value: string | null): string => {
    if (!value) return '未知'
    const date = new Date(value)

    return Number.isNaN(date.getTime())
      ? '未知'
      : date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
  }

  /*********************************************
   * 📂 Category: Props / Emits
   * 🔧 Defines: 指揮中心資料輸入
   *********************************************/
  const props = defineProps<{
    tasks: Task[]
    activities: ActivityItem[]
    resources: ResourceItem[]
    taskLoadStatus: 'idle' | 'loading' | 'success' | 'error'
  }>()

  /*********************************************
   * 📂 Category: Refs / Reactive State
   * 🔧 Defines: 目前指揮中心分頁
   *********************************************/
  const tab = ref<'overview' | 'tasks' | 'activity' | 'settings'>('overview')

  /*********************************************
   * 📂 Category: Computed
   * 🔧 Defines: 指揮中心的統計與動態資料
   *********************************************/
  const stats = computed<CommandStats>(() => ({
    completed: props.tasks.filter((task) => task.stage === TaskStageEnum.COMPLETED).length,
    waiting: props.tasks.filter((task) => task.stage === TaskStageEnum.PENDING_DISPATCH).length,
    running: props.tasks.filter(
      (task) =>
        ![TaskStageEnum.COMPLETED, TaskStageEnum.CANCELLED, TaskStageEnum.PENDING_DISPATCH].includes(
          task.stage as TaskStageEnum
        )
    ).length,
  }))
  const pendingTasks = computed<Task[]>(() =>
    props.tasks.filter((task) => task.stage === TaskStageEnum.PENDING_DISPATCH)
  )
  const feed = computed<ActivityPresentation[]>(() => {
    const source = props.activities.length
      ? props.activities
      : props.tasks.map((task) => ({
          text: `${task.purpose} · ${stageLabel(task.stage)}`,
          updatedAt: task.updatedAt ?? null,
        }))

    return [...source]
      .sort((left, right) => Date.parse(right.updatedAt ?? '') - Date.parse(left.updatedAt ?? ''))
      .slice(0, 5)
      .map((item, index) => ({
        key: `${item.text}-${index}`,
        text: item.text,
        time: formatTime(item.updatedAt),
      }))
  })
  const resourceRows = computed<ResourcePresentation[]>(() =>
    [{ name: 'CPU' }, { name: '記憶體' }, { name: 'Token' }, ...props.resources].map((resource) => {
      const hasValue = resource.percent !== undefined
      const value = hasValue ? `${resource.percent}%` : '未知'
      const trackValue = resource.percent === undefined ? 0 : resource.percent

      return {
        name: resource.name,
        value,
        trackValue,
        ariaLabel: `${resource.name} 資源狀態：${value}`,
        ariaValueText: value,
      }
    })
  )
  const pendingTaskLinks = computed<TaskPresentation[]>(() =>
    pendingTasks.value.map((task: Task) => ({
      id: task.id,
      purpose: task.purpose,
      project: '',
      stage: stageLabel(task.stage),
      href: `/office/tasks/${task.id}`,
    }))
  )
  const taskLinks = computed<TaskPresentation[]>(() =>
    props.tasks.map((task: Task) => ({
      id: task.id,
      purpose: task.purpose,
      project: task.projectId,
      stage: stageLabel(task.stage),
      href: `/office/tasks/${task.id}`,
    }))
  )
  const showEmptyFeed = computed<boolean>(() => feed.value.length === 0)
  const showEmptyPendingTasks = computed<boolean>(() => pendingTaskLinks.value.length === 0)
  const showEmptyTasks = computed<boolean>(() => taskLinks.value.length === 0)
  const statsLabel = computed<string | null>(() => {
    if (props.taskLoadStatus === 'success') return null
    if (props.taskLoadStatus === 'loading' || props.taskLoadStatus === 'idle') return '載入中…'

    return '資料未提供'
  })
</script>
<template>
  <aside class="panel command-center" aria-label="Command Center">
    <h2 class="panel-title ma-0 px-3 py-2 text-subtitle-2 font-weight-bold border-b border-border">COMMAND CENTER</h2>
    <v-tabs
      v-model="tab"
      class="command-tabs border-b border-border"
      aria-label="指揮中心分頁"
      color="warning"
      bg-color="transparent"
      grow
      density="compact"
    >
      <v-tab value="overview" class="px-1 text-caption">◈ 總覽</v-tab>
      <v-tab value="tasks" class="px-1 text-caption">✓ 任務</v-tab>
      <v-tab value="activity" class="px-1 text-caption">▣ 動態</v-tab>
      <v-tab value="settings" to="/settings/models" class="px-1 text-caption">⚙ 設定</v-tab>
    </v-tabs>
    <template v-if="tab === 'overview'">
      <section class="command-section px-3 py-2 border-b border-border">
        <div class="heading-row d-flex align-center justify-space-between">
          <h2 class="ma-0 text-body-2 font-weight-bold">即時動態</h2>
          <v-btn
            class="soft-link px-1 text-caption"
            variant="text"
            size="small"
            density="compact"
            @click="tab = 'activity'"
            >查看全部 →</v-btn
          >
        </div>
        <div class="feed mt-1">
          <div v-for="item in feed" :key="item.key" class="event d-flex align-baseline ga-2 py-1 text-caption">
            <time class="flex-shrink-0 text-caption text-textMuted">{{ item.time }}</time>
            <p class="ma-0 text-caption text-textMuted">{{ item.text }}</p>
          </div>
          <div v-if="showEmptyFeed" class="empty d-flex flex-column ga-1 py-1 text-caption text-textMuted">
            <strong class="text-caption text-high-emphasis">今天，從一個想法開始</strong
            ><span>團隊已就位，等待你的第一項工作。</span>
          </div>
        </div>
      </section>
      <section class="command-section px-3 py-2 border-b border-border">
        <h2 class="ma-0 text-body-2 font-weight-bold">最新任務統計</h2>
        <div v-if="statsLabel" class="notice mt-1 text-caption text-textMuted">{{ statsLabel }}</div>
        <div v-else class="stat-grid mt-2">
          <div class="pa-1 text-center border border-border">
            <strong class="d-block text-subtitle-2 text-warning">{{ stats.completed }}</strong
            ><small class="text-caption text-textMuted">完成任務</small>
          </div>
          <div class="pa-1 text-center border border-border">
            <strong class="d-block text-subtitle-2 text-warning">{{ stats.waiting }}</strong
            ><small class="text-caption text-textMuted">等待處理</small>
          </div>
          <div class="pa-1 text-center border border-border">
            <strong class="d-block text-subtitle-2 text-warning">{{ stats.running }}</strong
            ><small class="text-caption text-textMuted">運行中</small>
          </div>
        </div>
      </section>
      <section class="command-section px-3 py-2 border-b border-border">
        <h2 class="ma-0 text-body-2 font-weight-bold">待處理</h2>
        <div class="task-list d-flex flex-column ga-1 mt-1">
          <NuxtLink
            v-for="task in pendingTaskLinks"
            :key="task.id"
            class="task-item d-flex flex-column pa-2 bg-taskSurface text-caption"
            :to="task.href"
          >
            <strong>{{ task.purpose }}</strong
            ><small>{{ task.stage }}</small>
          </NuxtLink>
          <p v-if="showEmptyPendingTasks" class="empty ma-0 py-1 text-caption text-textMuted">目前沒有待處理任務</p>
        </div>
      </section>
      <section class="command-section px-3 py-2 border-b border-border">
        <h2 class="ma-0 text-body-2 font-weight-bold">系統資源</h2>
        <div class="resource-list mt-1">
          <div v-for="resource in resourceRows" :key="resource.name" class="resource-row text-caption">
            <span>{{ resource.name }}</span
            ><span>{{ resource.value }}</span>
            <v-progress-linear
              :model-value="resource.trackValue"
              color="warning"
              height="4"
              :aria-label="resource.ariaLabel"
              :aria-valuetext="resource.ariaValueText"
            />
          </div>
        </div>
      </section>
    </template>
    <section v-else-if="tab === 'activity'" class="command-section px-3 py-2 border-b border-border">
      <div class="heading-row d-flex align-center justify-space-between">
        <h2 class="ma-0 text-body-2 font-weight-bold">全部動態</h2>
        <v-btn
          class="soft-link px-1 text-caption"
          variant="text"
          size="small"
          density="compact"
          @click="tab = 'overview'"
          >返回總覽</v-btn
        >
      </div>
      <div class="feed mt-1">
        <div v-for="item in feed" :key="item.key" class="event d-flex align-baseline ga-2 py-1 text-caption">
          <time class="flex-shrink-0 text-caption text-textMuted">{{ item.time }}</time>
          <p class="ma-0 text-caption text-textMuted">{{ item.text }}</p>
        </div>
      </div>
    </section>
    <section v-else class="command-section px-3 py-2 border-b border-border">
      <div class="heading-row d-flex align-center justify-space-between">
        <h2 class="ma-0 text-body-2 font-weight-bold">任務清單</h2>
        <v-btn
          class="soft-link px-1 text-caption"
          variant="text"
          size="small"
          density="compact"
          @click="tab = 'overview'"
          >返回總覽</v-btn
        >
      </div>
      <div class="task-list d-flex flex-column ga-1 mt-1">
        <NuxtLink
          v-for="task in taskLinks"
          :key="task.id"
          class="task-item d-flex flex-column pa-2 bg-taskSurface text-caption"
          :to="task.href"
          ><strong>{{ task.purpose }}</strong
          ><small>{{ task.project }} · {{ task.stage }}</small></NuxtLink
        >
        <div v-if="showEmptyTasks" class="empty py-1 text-caption text-textMuted">目前沒有任務</div>
      </div>
    </section>
  </aside>
</template>
