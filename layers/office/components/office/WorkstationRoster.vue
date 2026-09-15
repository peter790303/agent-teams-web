<script setup lang="ts">
// Category: workstation roster view model
interface Person { name: string; role: string; icon: string }
const props = defineProps<{ roleStatuses: Record<string, string> }>()
const people: Person[] = [
  { name: 'AI 主控', role: 'leader', icon: '👨🏻‍💼' },
  { name: 'PM', role: 'pm', icon: '🧑🏻‍💼' },
  { name: 'RD Leader', role: 'rd_leader', icon: '👨🏻‍💻' },
  { name: 'RD', role: 'rd', icon: '👨🏻‍💻' },
  { name: 'QA', role: 'qa', icon: '👩🏻‍🔬' },
]
const peopleWithStatus = computed(() => people.map((person) => ({ ...person, status: props.roleStatuses[person.role] ?? '未知' })))
</script>
<template><footer class="roster"><div v-for="person in peopleWithStatus" :key="person.role" class="person"><span>{{ person.icon }}</span><strong>{{ person.name }}</strong><small>{{ person.role }} · {{ person.status }}</small><i /></div></footer></template>
