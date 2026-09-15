<script setup lang="ts">
import { useOffice } from '~/layers/office/composables/useOffice'
import CommandCenter from '~/layers/office/components/office/CommandCenter.vue'
import PixelOfficeMap from '~/layers/office/components/office/PixelOfficeMap.vue'
import WorkstationRoster from '~/layers/office/components/office/WorkstationRoster.vue'

// 📂 Category: page view model
const { tasks, roleStatuses, error, load, create } = useOffice()
const purpose = ref<string>('')
const projectId = ref<string>('default')
useSeoMeta({ title: 'AI Office' })
onMounted(load)
const submit = async (): Promise<void> => {
  if (!purpose.value.trim()) return
  try {
    await create(purpose.value.trim(), projectId.value)
    purpose.value = ''
  } catch {
    // useOffice stores the API error for the alert below.
  }
}
const systemStatus = computed(() => Object.keys(roleStatuses.value).length > 0 ? 'API 已連線' : '未知')
const taskLinks = computed(() => tasks.value.map((task) => ({ ...task, href: `/office/tasks/${task.id}` })))
</script>
<template>
  <BasePageLayout>
    <main class="shell">
      <header><h1>🏢 AI OFFICE <small>v0.1.0</small></h1><span>系統狀態：{{ systemStatus }}</span></header>
      <v-row class="workspace">
        <v-col cols="12" md="8"><PixelOfficeMap :role-statuses="roleStatuses" /></v-col>
        <v-col cols="12" md="4"><CommandCenter /></v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <section class="taskbar">
            <form @submit.prevent="submit"><input v-model="purpose" required placeholder="建立新任務，例如：整理登入流程" ><input v-model="projectId" required aria-label="Project ID" placeholder="project id" ><button>＋ 新增任務</button></form>
            <p v-if="error" role="alert">{{ error }}</p>
            <div class="task-list"><NuxtLink v-for="task in taskLinks" :key="task.id" :to="task.href">{{ task.purpose }} <small>{{ task.stage }}</small></NuxtLink></div>
          </section>
        </v-col>
      </v-row>
      <v-row><v-col cols="12"><WorkstationRoster :role-statuses="roleStatuses" /></v-col></v-row>
    </main>
  </BasePageLayout>
</template>
