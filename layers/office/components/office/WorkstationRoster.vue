<script setup lang="ts">
/*********************************************
 * 📂 Category: Interface
 * 🔧 Defines: 定義元件內使用的自訂 TypeScript 型別
 *********************************************/
interface Person { name: string; role: string }

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
  { name: 'AI 主控', role: 'leader' }, { name: 'PM', role: 'pm' },
  { name: 'RD Leader', role: 'rd_leader' }, { name: 'RD', role: 'rd' }, { name: 'QA', role: 'qa' },
]

/*********************************************
 * 📂 Category: Computed
 * 🔧 Defines: 定義計算屬性
 *********************************************/
const peopleWithStatus = computed(() => people.map((person) => ({ ...person, status: props.roleStatuses[person.role] ?? '尚無資料', active: /running|執行中|active/i.test(props.roleStatuses[person.role] ?? '') })))
</script>
<template><footer class="roster"><div v-for="person in peopleWithStatus" :key="person.role" class="employee-card" :class="{ 'is-active': person.active }"><div class="employee-avatar"><span class="avatar-hair" /><span class="avatar-face" /></div><div><strong>{{ person.name }}</strong><small>{{ person.role }}</small><em>{{ person.status }}</em><i v-if="person.active" /></div></div><button class="add-employee" type="button" aria-label="新增員工" title="新增員工功能尚未提供" disabled>＋</button></footer></template>
