<script setup lang="ts">
  /*********************************************
   * 📂 Category: Imports
   * 🔧 Defines: 引入必要的模組和庫
   *********************************************/
  import { useDisplay } from 'vuetify'

  import { roles } from '~/layers/office/assets/originalOffice'
  import CommandCenter from '~/layers/office/components/office/CommandCenter.vue'
  import PixelOfficeMap from '~/layers/office/components/office/PixelOfficeMap.vue'
  import WorkstationRoster from '~/layers/office/components/office/WorkstationRoster.vue'
  import { useOffice } from '~/layers/office/composables/useOffice'

  /*********************************************
   * 📂 Category: Page Meta  (Nuxt only)
   * 🔧 Defines: 以 definePageMeta() 宣告的頁面層級設定
   *********************************************/
  useSeoMeta({ title: 'AI Office' })

  /*********************************************
   * 📂 Category: Composables / Plugins
   * 🔧 Defines: 自定 composables、Pinia 狀態、i18n、plugin 等注入來源
   *********************************************/
  const { tasks, taskStates, roleStatuses, error, load, create } = useOffice()
  const { mdAndDown } = useDisplay()

  /*********************************************
   * 📂 Category: Refs / Reactive State
   * 🔧 Defines: 元件中的 ref, reactive 等可變資料狀態
   *********************************************/
  const purpose = ref<string>('')
  const projectId = ref<string>('default')
  const selectedRoleId = ref<string | null>(null)
  const selectedRole = computed(() => roles.find((role) => role.id === selectedRoleId.value))
  const roleDescriptions: Record<string, string> = {
    leader: '協調需求與團隊分工。',
    pm: '整理需求並建立 Spec。',
    rd_leader: '建立開發 Plan，協調 RD 與審查。',
    rd: '依照 Plan 執行開發工作。',
    review: '核對規範與需求，檢查受審版本。',
    qa: '驗證成果並保存 QA 報告。',
    delivery: '呈現交付分支、驗收與環境清理狀態。',
  }

  /*********************************************
   * 📂 Category: Computed
   * 🔧 Defines: 定義計算屬性
   *********************************************/
  const systemStatus = computed(() => (error.value ? '連線失敗' : '正常運行中'))
  const systemStatusClass = computed(() => (error.value ? 'is-unknown' : ''))
  const taskLinks = computed(() => tasks.value.map((task) => ({ ...task, href: `/office/tasks/${task.id}` })))
  const activities = computed(() =>
    taskStates.value
      .map((state) => state.data.activity)
      .filter((item): item is string => Boolean(item?.trim()))
      .slice(0, 5)
  )
  const now = ref(new Date())
  const clockText = computed(() => now.value.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }))
  const dateText = computed(() =>
    now.value.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' })
  )

  /*********************************************
   * 📂 Category: Methods
   * 🔧 Defines: 定義函數與事件處理
   *********************************************/
  const submit = async (): Promise<void> => {
    if (!purpose.value.trim()) return
    try {
      await create(purpose.value.trim(), projectId.value)
      purpose.value = ''
    } catch {
      // useOffice stores the API error for the alert below.
    }
  }
  const openRole = (id: string): void => {
    selectedRoleId.value = id
  }
  const closeRole = (): void => {
    selectedRoleId.value = null
  }
  const dialogVisible = computed({
    get: () => Boolean(selectedRoleId.value),
    set: (visible: boolean) => {
      if (!visible) closeRole()
    },
  })
  const roleState = computed(() => roleStatuses.value[selectedRoleId.value ?? ''] ?? '待命')
  const roleTaskText = computed(() =>
    tasks.value.length
      ? `目前共有 ${tasks.value.length} 筆任務，角色狀態：${roleState.value}。`
      : '尚未選取任務，角色目前待命。'
  )

  /*********************************************
   * 📂 Category: Lifecycle Hooks
   * 🔧 Defines: Vue 生命週期 hook —— onMounted、onUnmounted 等
   *********************************************/
  let clockTimer: ReturnType<typeof setInterval> | undefined
  onMounted(() => {
    load()
    clockTimer = setInterval(() => {
      now.value = new Date()
    }, 60_000)
  })
  onUnmounted(() => {
    if (clockTimer) clearInterval(clockTimer)
  })
</script>
<template>
  <BasePageLayout>
    <main class="shell">
      <header class="office-header">
        <div class="brand">
          <span class="brand-mark">▦</span>
          <div>
            <h1>AI OFFICE <small>v0.1.0</small></h1>
            <p>智能協作指揮中心</p>
          </div>
        </div>
        <div class="header-meta">
          <span class="clock"
            >☀ {{ clockText }} <small>{{ dateText }}</small></span
          ><span class="health" :class="systemStatusClass"><i /> 系統狀態：{{ systemStatus }}</span
          ><span class="supervisor"><b>AI</b> 主控模式</span>
        </div>
      </header>
      <v-row class="workspace" :class="{ 'is-narrow': mdAndDown }">
        <v-col cols="12" md="8"><PixelOfficeMap :role-statuses="roleStatuses" @role="openRole" /></v-col>
        <v-col cols="12" md="4"><CommandCenter :tasks="tasks" :activities="activities" /></v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <section class="taskbar">
            <form @submit.prevent="submit">
              <v-text-field
                v-model="purpose"
                required
                hide-details
                density="compact"
                variant="outlined"
                placeholder="建立新任務，例如：整理登入流程"
              /><v-text-field
                v-model="projectId"
                required
                hide-details
                density="compact"
                variant="outlined"
                aria-label="Project ID"
                placeholder="project id"
              /><v-btn type="submit" color="primary">＋ 新增任務</v-btn>
            </form>
            <p v-if="error" role="alert">{{ error }}</p>
            <div class="task-list">
              <NuxtLink v-for="task in taskLinks" :key="task.id" :to="task.href"
                >{{ task.purpose }} <small>{{ task.stage }}</small></NuxtLink
              >
            </div>
          </section>
        </v-col>
      </v-row>
      <v-row
        ><v-col cols="12"><WorkstationRoster :role-statuses="roleStatuses" @role="openRole" /></v-col
      ></v-row>
    </main>
    <v-dialog v-model="dialogVisible" max-width="420">
      <v-card v-if="selectedRole" class="role-dialog-card">
        <v-card-title
          >{{ selectedRole.name }} <small>{{ selectedRole.en }}</small></v-card-title
        >
        <v-card-text
          ><p>{{ roleDescriptions[selectedRole.id] }}</p>
          <p class="role-status">{{ roleTaskText }}</p></v-card-text
        >
        <v-card-actions class="dialog-actions"
          ><v-btn variant="outlined" @click="closeRole">關閉</v-btn
          ><v-btn to="/settings/models" color="primary">設定角色模型</v-btn></v-card-actions
        >
      </v-card>
    </v-dialog>
  </BasePageLayout>
</template>
