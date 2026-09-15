<script setup lang="ts">
import { useOffice } from '~/layers/office/composables/useOffice'
const { tasks, error, load, create } = useOffice()
const purpose = ref('')
const projectId = ref('default')
onMounted(load)
const submit = async (): Promise<void> => { if (!purpose.value.trim()) return; await create(purpose.value.trim(), projectId.value); purpose.value = '' }
</script>
<template>
  <main class="shell"><header><h1>🏢 AI OFFICE <small>v0.1.0</small></h1><span>🟢 系統狀態：正常運行中</span></header><div class="workspace"><PixelOfficeMap /><CommandCenter /></div><section class="taskbar"><form @submit.prevent="submit"><input v-model="purpose" required placeholder="建立新任務，例如：整理登入流程" /><input v-model="projectId" required aria-label="Project ID" placeholder="project id" /><button>＋ 新增任務</button></form><p v-if="error" role="alert">{{ error }}</p><div class="task-list"><NuxtLink v-for="task in tasks" :key="task.id" :to="`/office/tasks/${task.id}`">{{ task.purpose }} <small>{{ task.stage }}</small></NuxtLink></div></section><WorkstationRoster /></main>
</template>
