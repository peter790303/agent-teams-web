<script setup lang="ts">
/*********************************************
 * 📂 Category: Interface
 * 🔧 Defines: 定義元件內使用的自訂 TypeScript 型別
 *********************************************/
interface Desk { name: string; role: string; x: number; y: number }

/*********************************************
 * 📂 Category: Props / Emits
 * 🔧 Defines: 定義元件接收的 props 或 emits 事件
 *********************************************/
const props = defineProps<{ roleStatuses: Record<string, string> }>()

/*********************************************
 * 📂 Category: Static Data
 * 🔧 Defines: 不會改變的靜態資料，例如選單、enum 對應等
 *********************************************/
const desks: Desk[] = [
  { name: '前端小王', role: 'pm', x: 18, y: 59 }, { name: '後端阿明', role: 'rd_leader', x: 41, y: 59 },
  { name: '自動化小林', role: 'rd', x: 64, y: 59 }, { name: '測試小美', role: 'qa', x: 27, y: 82 }, { name: '設計小花', role: 'leader', x: 51, y: 82 },
]

/*********************************************
 * 📂 Category: Computed
 * 🔧 Defines: 定義計算屬性
 *********************************************/
const desksWithStatus = computed(() => desks.map((desk) => ({ ...desk, status: props.roleStatuses[desk.role] ?? '尚無資料', active: props.roleStatuses[desk.role] !== undefined, style: { left: `${desk.x}%`, top: `${desk.y}%` } })))
</script>
<template><section class="pixel-map" aria-label="AI Office 辦公室"><div class="floor-grid" /><div class="room room-control"><span>AI 主控</span><div class="control-desk"><i /><i /><i /></div></div><div class="room room-meeting"><span>會議室</span><div class="meeting-table"><i /><i /><i /><i /></div></div><div class="room room-break"><span>休息區</span><div class="break-table" /><div class="sofa" /></div><div class="room room-manager"><span>你的辦公室</span><div class="manager-desk" /></div><div class="desk-row"><div v-for="desk in desksWithStatus" :key="desk.role" class="pixel-desk" :class="{ 'is-active': desk.active }" :style="desk.style"><div class="avatar"><span class="avatar-hair" /><span class="avatar-face" /></div><div class="desk-surface"><i class="monitor" /><i class="keyboard" /></div><strong>{{ desk.name }}</strong><small>{{ desk.status }}</small></div></div><span class="plant plant-one">♣</span><span class="plant plant-two">♣</span><span class="plant plant-three">♣</span><span class="water-cooler">▥</span><span class="bookshelf">▤</span></section></template>
