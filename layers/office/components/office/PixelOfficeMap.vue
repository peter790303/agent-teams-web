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
  { name: 'PM', role: 'pm', x: 18, y: 59 }, { name: 'RD Leader', role: 'rd_leader', x: 41, y: 59 },
  { name: 'RD', role: 'rd', x: 64, y: 59 }, { name: 'QA', role: 'qa', x: 27, y: 82 }, { name: 'AI 主控', role: 'leader', x: 51, y: 82 },
]

/*********************************************
 * 📂 Category: Computed
 * 🔧 Defines: 定義計算屬性
 *********************************************/
const desksWithStatus = computed(() => desks.map((desk) => ({ ...desk, status: props.roleStatuses[desk.role] ?? '尚無資料', active: /running|執行中|active/i.test(props.roleStatuses[desk.role] ?? ''), style: { left: `${desk.x}%`, top: `${desk.y}%` } })))
</script>
<template><section class="pixel-map" aria-label="AI Office 辦公室"><div class="floor-grid" /><div class="window window-one" /><div class="window window-two" /><div class="room room-control"><span>AI 主控</span><div class="control-desk"><i /><i /><i /></div></div><div class="room room-meeting"><span>會議室</span><div class="meeting-table"><i /><i /><i /><i /></div></div><div class="room room-break"><span>休息區</span><div class="break-table" /><div class="sofa" /></div><div class="room room-manager"><span>你的辦公室</span><div class="manager-desk" /><div class="door" /></div><div class="desk-row"><div v-for="desk in desksWithStatus" :key="desk.role" class="pixel-desk" :class="{ 'is-active': desk.active }" :style="desk.style"><div class="avatar"><span class="avatar-hair" /><span class="avatar-face" /></div><div class="desk-surface"><i class="monitor" /><i class="keyboard" /><i class="chair" /></div><strong>{{ desk.name }}</strong><small>{{ desk.status }}</small></div></div><div class="plant plant-one"><i /><b /></div><div class="plant plant-two"><i /><b /></div><div class="plant plant-three"><i /><b /></div><div class="water-cooler"><i /><b /></div><div class="bookshelf"><i /><i /><i /></div></section></template>
