<script setup lang="ts">
// Category: office map view model
interface Desk { name: string; role: string; icon: string; x: number; y: number }
const props = defineProps<{ roleStatuses: Record<string, string> }>()
const desks: Desk[] = [
  { name: 'PM', role: 'pm', icon: '🧑🏻‍💼', x: 18, y: 53 },
  { name: 'RD Leader', role: 'rd_leader', icon: '👨🏻‍💻', x: 35, y: 53 },
  { name: 'RD', role: 'rd', icon: '👨🏻‍💻', x: 52, y: 53 },
  { name: 'QA', role: 'qa', icon: '👩🏻‍🔬', x: 69, y: 53 },
  { name: 'Leader', role: 'leader', icon: '👨🏻‍💼', x: 27, y: 78 },
]
const desksWithStatus = computed(() => desks.map((desk) => ({ ...desk, status: props.roleStatuses[desk.role] ?? '未知', style: { left: `${desk.x}%`, top: `${desk.y}%` } })))
</script>
<template><section class="map"><div v-for="desk in desksWithStatus" :key="desk.role" class="desk" :style="desk.style"><span>{{ desk.icon }}</span><b>{{ desk.name }}</b><small>{{ desk.status }}</small></div><div class="room room-ai">AI 主控</div><div class="room room-meet">會議室</div><div class="room room-rest">休息區</div></section></template>
