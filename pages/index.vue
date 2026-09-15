<template><main class="shell"><header><h1>🏢 AI OFFICE <small>v0.1.0</small></h1><span>🟢 系統狀態：正常運行中</span></header><div class="workspace"><PixelOfficeMap/><CommandCenter/></div><section class="taskbar"><form @submit.prevent="submit"><input v-model="purpose" required placeholder="建立新任務，例如：整理登入流程"/><button>＋ 新增任務</button></form><div class="task-list"><NuxtLink v-for="task in tasks" :key="task.id" :to="`/office/tasks/${task.id}`">{{ task.purpose }} <small>{{ task.stage }}</small></NuxtLink></div></section><WorkstationRoster/></main></template>
<script setup lang="ts">
const { tasks, load, create } = useOffice()
const purpose = ref('')
onMounted(load)
const submit = async () => { await create(purpose.value); purpose.value = '' }
</script>
