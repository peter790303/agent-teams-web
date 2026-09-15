<script setup lang="ts">
  import type { Task } from '~/layers/office/types'
  const props = defineProps<{ tasks: Task[]; activities: string[] }>()
  const tab = ref<'overview' | 'tasks' | 'activity'>('overview')
  const stats = computed(() => ({
    completed: props.tasks.filter((task) => /completed|succeeded|完成/i.test(task.stage)).length,
    waiting: props.tasks.filter((task) => /pending|等待|queued/i.test(task.stage)).length,
    running: props.tasks.filter((task) => /running|active|執行中/i.test(task.stage)).length,
  }))
  const feed = computed(() =>
    props.activities.length
      ? props.activities
      : props.tasks.slice(0, 5).map((task) => `${task.purpose} · ${task.stage}`)
  )
</script>
<template>
  <aside class="panel command-center" aria-label="Command Center">
    <h2 class="panel-title">COMMAND CENTER</h2>
    <nav class="tabs command-tabs" aria-label="指揮中心分頁">
      <v-btn variant="text" :aria-selected="tab === 'overview'" @click="tab = 'overview'"><b>◈</b>總覽</v-btn>
      <v-btn variant="text" :aria-selected="tab === 'tasks'" @click="tab = 'tasks'"><b>✓</b>任務</v-btn>
      <v-btn variant="text" :aria-selected="tab === 'activity'" @click="tab = 'activity'"><b>▣</b>動態</v-btn>
      <NuxtLink to="/settings/models"><b>⚙</b>設定</NuxtLink>
    </nav>
    <template v-if="tab === 'overview'">
      <section class="command-section">
        <div class="heading-row">
          <h2>即時動態</h2>
          <v-btn class="soft-link" variant="text" size="small" @click="tab = 'activity'">查看全部 →</v-btn>
        </div>
        <div class="feed">
          <div v-for="(item, index) in feed" :key="`${item}-${index}`" class="event">
            <time>—</time>
            <p>{{ item }}</p>
          </div>
          <div v-if="!feed.length" class="empty">
            <strong>今天，從一個想法開始</strong><span>團隊已就位，等待你的第一項工作。</span>
          </div>
        </div>
      </section>
      <section class="command-section">
        <h2>今日統計</h2>
        <div class="stat-grid">
          <div>
            <strong>{{ stats.completed }}</strong
            ><small>完成任務</small>
          </div>
          <div>
            <strong>{{ stats.waiting }}</strong
            ><small>等待處理</small>
          </div>
          <div><strong>—</strong><small>錯誤</small></div>
          <div>
            <strong>{{ stats.running }}</strong
            ><small>運行中</small>
          </div>
        </div>
      </section>
      <section class="command-section">
        <h2>系統資源</h2>
        <p class="notice">目前 API 未提供即時資源數值</p>
      </section>
    </template>
    <section v-else-if="tab === 'activity'" class="command-section">
      <div class="heading-row">
        <h2>全部動態</h2>
        <v-btn class="soft-link" variant="text" size="small" @click="tab = 'overview'">返回總覽</v-btn>
      </div>
      <div class="feed">
        <div v-for="(item, index) in feed" :key="`${item}-${index}`" class="event">
          <time>—</time>
          <p>{{ item }}</p>
        </div>
      </div>
    </section>
    <section v-else class="command-section">
      <div class="heading-row">
        <h2>任務清單</h2>
        <v-btn class="soft-link" variant="text" size="small" @click="tab = 'overview'">返回總覽</v-btn>
      </div>
      <div class="task-list">
        <NuxtLink v-for="task in props.tasks" :key="task.id" class="task-item" :to="`/office/tasks/${task.id}`"
          ><strong>{{ task.purpose }}</strong
          ><small>{{ task.projectId }} · {{ task.stage }}</small></NuxtLink
        >
        <div v-if="!props.tasks.length" class="empty">目前沒有任務</div>
      </div>
    </section>
  </aside>
</template>
