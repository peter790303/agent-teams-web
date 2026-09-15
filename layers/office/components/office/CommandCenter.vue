<script setup lang="ts">
  /*********************************************
   * 📂 Category: Imports
   * 🔧 Defines: 引入任務型別
   *********************************************/
  import type { Task } from '~/layers/office/types'

  /*********************************************
   * 📂 Category: Interface
   * 🔧 Defines: 指揮中心統計資料型別
   *********************************************/
  type CommandStats = {
    completed: number
    waiting: number
    failed: number
    running: number
  }

  /*********************************************
   * 📂 Category: Props / Emits
   * 🔧 Defines: 指揮中心資料輸入
   *********************************************/
  const props = defineProps<{
    tasks: Task[]
    activities: string[]
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
    completed: props.tasks.filter((task) => /completed|succeeded|完成/i.test(task.stage)).length,
    waiting: props.tasks.filter((task) => /pending|等待|queued/i.test(task.stage)).length,
    failed: props.tasks.filter((task) => /failed|失敗|error/i.test(task.stage)).length,
    running: props.tasks.filter((task) => /running|active|執行中/i.test(task.stage)).length,
  }))
  const pendingTasks = computed<Task[]>(() => props.tasks.filter((task) => /pending|等待|queued/i.test(task.stage)))
  const feed = computed<string[]>(() =>
    props.activities.length
      ? props.activities
      : props.tasks.slice(0, 5).map((task) => `${task.purpose} · ${task.stage}`)
  )
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
          <div
            v-for="(item, index) in feed"
            :key="`${item}-${index}`"
            class="event d-flex align-baseline ga-2 py-1 text-caption"
          >
            <time class="flex-shrink-0 text-caption text-textMuted">資料未提供</time>
            <p class="ma-0 text-caption text-textMuted">{{ item }}</p>
          </div>
          <div v-if="!feed.length" class="empty d-flex flex-column ga-1 py-1 text-caption text-textMuted">
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
            <strong class="d-block text-subtitle-2 text-warning">{{ stats.failed }}</strong
            ><small class="text-caption text-textMuted">錯誤</small>
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
            v-for="task in pendingTasks"
            :key="task.id"
            class="task-item d-flex flex-column pa-2 bg-taskSurface text-caption"
            :to="`/office/tasks/${task.id}`"
          >
            <strong>{{ task.purpose }}</strong
            ><small>{{ task.stage }}</small>
          </NuxtLink>
          <p v-if="!pendingTasks.length" class="empty ma-0 py-1 text-caption text-textMuted">目前沒有待處理任務</p>
        </div>
      </section>
      <section class="command-section px-3 py-2 border-b border-border">
        <h2 class="ma-0 text-body-2 font-weight-bold">系統資源</h2>
        <p class="notice ma-0 mt-1 text-caption text-textMuted">資料未提供</p>
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
        <div
          v-for="(item, index) in feed"
          :key="`${item}-${index}`"
          class="event d-flex align-baseline ga-2 py-1 text-caption"
        >
          <time class="flex-shrink-0 text-caption text-textMuted">資料未提供</time>
          <p class="ma-0 text-caption text-textMuted">{{ item }}</p>
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
          v-for="task in props.tasks"
          :key="task.id"
          class="task-item d-flex flex-column pa-2 bg-taskSurface text-caption"
          :to="`/office/tasks/${task.id}`"
          ><strong>{{ task.purpose }}</strong
          ><small>{{ task.projectId }} · {{ task.stage }}</small></NuxtLink
        >
        <div v-if="!props.tasks.length" class="empty py-1 text-caption text-textMuted">目前沒有任務</div>
      </div>
    </section>
  </aside>
</template>
