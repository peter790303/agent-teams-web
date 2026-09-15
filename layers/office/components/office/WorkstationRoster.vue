<script setup lang="ts">
interface Person { name: string; role: string; status: string; icon: string }
const people: Person[] = [
  { name: 'AI 主控', role: 'leader', status: '在線', icon: '👨🏻‍💼' },
  { name: 'PM', role: 'pm', status: '工作中', icon: '🧑🏻‍💼' },
  { name: 'RD Leader', role: 'rd_leader', status: '工作中', icon: '👨🏻‍💻' },
  { name: 'RD', role: 'rd', status: '工作中', icon: '👨🏻‍💻' },
  { name: 'QA', role: 'qa', status: '待命', icon: '👩🏻‍🔬' },
]
</script>
<template><footer class="roster"><div v-for="person in people" :key="person.role" class="person"><span>{{ person.icon }}</span><strong>{{ person.name }}</strong><small>{{ person.role }} · {{ person.status }}</small><i /></div></footer></template>
