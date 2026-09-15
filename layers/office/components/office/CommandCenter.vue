<script setup lang="ts">
/*********************************************
 * 📂 Category: Static Data
 * 🔧 Defines: 不會改變的靜態資料，例如選單、enum 對應等
 *********************************************/
const sections: Array<{ label: string; icon: string; path: string | null }> = [
  { label: '總覽', icon: '⌂', path: '/' },
  { label: '任務', icon: '✓', path: null },
  { label: '訊息', icon: '▣', path: null },
  { label: '日誌', icon: '▤', path: null },
  { label: '設定', icon: '⚙', path: '/settings/models' },
]
const props = defineProps<{ tasks: Array<{ id: string; purpose: string; stage: string }>; activities: string[] }>()
const activity = computed(() => props.activities.length > 0 ? props.activities : ['目前沒有可顯示的活動'])
const stats = computed(() => ({
  completed: props.tasks.filter((task) => /completed|succeeded|完成/i.test(task.stage)).length,
  running: props.tasks.filter((task) => /running|active|執行中/i.test(task.stage)).length,
  pending: props.tasks.filter((task) => /pending|等待|queued/i.test(task.stage)).length,
}))
const resources = [{ label: 'CPU 使用率', value: '資料未提供', width: '0%', tone: 'green' }, { label: '記憶體使用率', value: '資料未提供', width: '0%', tone: 'blue' }, { label: 'Token 使用量', value: '資料未提供', width: '0%', tone: 'purple' }]
</script>
<template><aside class="command-center"><nav class="command-tabs"><template v-for="section in sections" :key="section.label"><NuxtLink v-if="section.path" :to="section.path" :class="{ selected: section.label === '總覽' }"><b>{{ section.icon }}</b><span>{{ section.label }}</span></NuxtLink><span v-else class="command-tab-disabled" aria-disabled="true" :title="`${section.label}功能尚未提供`"><b>{{ section.icon }}</b><span>{{ section.label }}</span></span></template></nav><section class="command-section"><div class="section-title"><h2>即時動態</h2><a href="#activity">查看全部 →</a></div><ul id="activity"><li v-for="item in activity" :key="item"><time>—</time><span>{{ item }}</span></li></ul></section><section class="command-section"><h2>今日統計</h2><div class="stat-grid"><div><strong>{{ stats.completed || '—' }}</strong><small>完成任務</small></div><div><strong>{{ stats.pending || '—' }}</strong><small>等待處理</small></div><div><strong>—</strong><small>錯誤</small></div><div><strong>{{ stats.running || '—' }}</strong><small>運行中</small></div></div></section><section class="command-section"><h2>系統資源</h2><div v-for="resource in resources" :key="resource.label" class="resource"><div><span>{{ resource.label }}</span><b>{{ resource.value }}</b></div><div class="resource-track"><i :class="resource.tone" :style="{ width: resource.width }" /></div></div></section><section class="command-section pending"><div class="section-title"><h2>需要你處理</h2><a href="#pending">查看全部 →</a></div><div id="pending" class="pending-card"><div class="mini-avatar" /><div><strong>尚無待處理資料</strong><small>API 未提供審核項目</small></div></div></section></aside></template>
