<script setup lang="ts">
/*********************************************
 * 📂 Category: Interface
 * 🔧 Defines: 定義元件內使用的自訂 TypeScript 型別
 *********************************************/
interface Person { name: string; role: string; icon: string }

/*********************************************
 * 📂 Category: Props / Emits
 * 🔧 Defines: 定義元件接收的 props 或 emits 事件
 *********************************************/
const props = defineProps<{ roleStatuses: Record<string, string> }>()

/*********************************************
 * 📂 Category: Static Data
 * 🔧 Defines: 不會改變的靜態資料，例如選單、enum 對應等
 *********************************************/
const people: Person[] = [
  { name: 'AI 主控', role: 'leader', icon: '👨🏻‍💼' },
  { name: 'PM', role: 'pm', icon: '🧑🏻‍💼' },
  { name: 'RD Leader', role: 'rd_leader', icon: '👨🏻‍💻' },
  { name: 'RD', role: 'rd', icon: '👨🏻‍💻' },
  { name: 'QA', role: 'qa', icon: '👩🏻‍🔬' },
]

/*********************************************
 * 📂 Category: Computed
 * 🔧 Defines: 定義計算屬性
 *********************************************/
const peopleWithStatus = computed(() => people.map((person) => ({ ...person, status: props.roleStatuses[person.role] ?? '未知' })))
</script>
<template><footer class="roster"><div v-for="person in peopleWithStatus" :key="person.role" class="person"><span>{{ person.icon }}</span><strong>{{ person.name }}</strong><small>{{ person.role }} · {{ person.status }}</small><i /></div></footer></template>
