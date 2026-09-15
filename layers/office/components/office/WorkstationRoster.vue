<script setup lang="ts">
  /*********************************************
   * 📂 Category: Imports
   * 🔧 Defines: 引入角色與 SVG 資產
   *********************************************/
  import { computed } from 'vue'

  import { avatar, roles } from '~/layers/office/assets/originalOffice'

  /*********************************************
   * 📂 Category: Props
   * 🔧 Defines: 角色狀態輸入與選取回呼
   *********************************************/
  const props = defineProps<{ roleStatuses: Record<string, string>; onRole: (id: string) => void }>()
  const statusInfo = (value?: string): { text: string; icon: string; className: string; running: boolean } => {
    if (!value) return { text: '資料未提供', icon: '?', className: 'is-unknown', running: false }
    if (/running|執行中|active/i.test(value))
      return { text: '工作中', icon: '●', className: 'is-running', running: true }
    if (/pending|等待|queued/i.test(value))
      return { text: '等待中', icon: '◷', className: 'is-waiting', running: false }
    if (/completed|succeeded|完成/i.test(value))
      return { text: '已完成', icon: '✓', className: 'is-completed', running: false }
    if (/failed|失敗/i.test(value)) return { text: '失敗', icon: '!', className: 'is-failed', running: false }
    if (/blocked|阻塞/i.test(value)) return { text: '已阻塞', icon: '!', className: 'is-blocked', running: false }

    return { text: value, icon: '?', className: 'is-unknown', running: false }
  }
  const employees = computed(() =>
    roles.map((person) => ({
      ...person,
      ...statusInfo(props.roleStatuses[person.id]),
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
