<script setup lang="ts">
  /*********************************************
   * 📂 Category: Imports
   * 🔧 Defines: 引入角色與 SVG 資產
   *********************************************/
  import { computed } from 'vue'

  import { avatar, roles } from '~/layers/office/assets/originalOffice'
  import { getRoleStatusInfo } from '~/layers/office/utils/dispatchStatus'

  /*********************************************
   * 📂 Category: Props / Emits
   * 🔧 Defines: 定義元件接收的 props 或 emits 事件
   *********************************************/
  const props = defineProps<{ roleStatuses: Record<string, string>; onRole: (id: string) => void }>()
  const employees = computed(() =>
    roles.map((person) => ({
      ...person,
      ...getRoleStatusInfo(props.roleStatuses[person.id]),
      avatarSvg: avatar(person.color, person.id === 'pm' || person.id === 'qa' ? '#624633' : '#383630'),
    }))
  )
  const selectRole = (id: string): void => props.onRole(id)
</script>
<template>
  <section class="roster" aria-label="團隊工作站">
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
