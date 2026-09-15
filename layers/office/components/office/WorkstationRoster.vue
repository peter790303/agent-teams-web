<script setup lang="ts">
  /*********************************************
   * 📂 Category: Imports
   * 🔧 Defines: 引入角色與 SVG 資產
   *********************************************/
  import { computed } from 'vue'
  import { useDisplay } from 'vuetify'

  import type { DispatchStatus } from '~/layers/domain/task/types/DispatchStatus'
  import { avatar, roles } from '~/layers/office/assets/originalOffice'
  import { getRoleStatusInfo } from '~/layers/office/utils/dispatchStatus'

  /*********************************************
   * 📂 Category: Props / Emits
   * 🔧 Defines: 定義元件接收的 props 或 emits 事件
   *********************************************/
  const props = defineProps<{ roleStatuses: Record<string, DispatchStatus>; onRole: (id: string) => void }>()

  /*********************************************
   * 📂 Category: Composables / Plugins
   * 🔧 Defines: 自定 composables、Pinia 狀態、i18n、plugin 等注入來源
   *********************************************/
  const { mdAndDown, xs } = useDisplay()

  /*********************************************
   * 📂 Category: Computed
   * 🔧 Defines: 定義計算屬性
   *********************************************/
  const displayClass = computed<Record<string, boolean>>(() => ({
    'is-medium': mdAndDown.value,
    'is-mobile': xs.value,
  }))
  const employees = computed(() =>
    roles.map((person) => ({
      ...person,
      ...getRoleStatusInfo(props.roleStatuses[person.id]),
      avatarSvg: avatar(person.color, person.id === 'pm' || person.id === 'qa' ? '#624633' : '#383630'),
    }))
  )

  /*********************************************
   * 📂 Category: Methods
   * 🔧 Defines: 定義函數與事件處理
   *********************************************/
  const selectRole = (id: string): void => props.onRole(id)
</script>
<template>
  <section class="roster" :class="displayClass" aria-label="團隊工作站">
    <div class="roster-title">
      <span>團隊工作站 <span class="text-medium-emphasis">／ TEAM STATIONS</span></span
      ><span>{{ roles.length }} 個工作站</span>
    </div>
    <div class="employees">
      <v-btn
        v-for="person in employees"
        :key="person.id"
        class="employee"
        :class="{ 'is-active': person.running }"
        type="button"
        variant="text"
        density="compact"
        @click="selectRole(person.id)"
      >
        <span class="employee-avatar" v-html="person.avatarSvg" /><span
          ><strong>{{ person.name }}</strong
          ><small>{{ person.en }}</small
          ><span class="state" :class="person.className"
            ><span aria-hidden="true">{{ person.icon }}</span
            >{{ person.text }}</span
          ></span
        >
      </v-btn>
    </div>
  </section>
</template>
