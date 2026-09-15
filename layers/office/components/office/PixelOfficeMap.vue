<script setup lang="ts">
interface Desk { name: string; role: string; status: string; icon: string; x: number; y: number }
const desks: Desk[] = [
  { name: 'PM', role: 'pm', status: '工作中', icon: '🧑🏻‍💼', x: 18, y: 53 },
  { name: 'RD Leader', role: 'rd_leader', status: '工作中', icon: '👨🏻‍💻', x: 35, y: 53 },
  { name: 'RD', role: 'rd', status: '工作中', icon: '👨🏻‍💻', x: 52, y: 53 },
  { name: 'QA', role: 'qa', status: '待命', icon: '👩🏻‍🔬', x: 69, y: 53 },
  { name: 'Leader', role: 'leader', status: '在線', icon: '👨🏻‍💼', x: 27, y: 78 },
]
</script>
<template><section class="map"><div v-for="desk in desks" :key="desk.role" class="desk" :style="{ left: desk.x + '%', top: desk.y + '%' }"><span>{{ desk.icon }}</span><b>{{ desk.name }}</b><small>{{ desk.status }}</small></div><div class="room room-ai">AI 主控</div><div class="room room-meet">會議室</div><div class="room room-rest">休息區</div></section></template>
