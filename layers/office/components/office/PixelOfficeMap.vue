<script setup lang="ts">
  /*********************************************
   * 📂 Category: Imports
   * 🔧 Defines: 引入角色與辦公室 SVG 資產
   *********************************************/
  import { computed } from 'vue'

  import { avatar, roles, room } from '~/layers/office/assets/originalOffice'

  /*********************************************
   * 📂 Category: Props / Emits
   * 🔧 Defines: 角色狀態輸入與選取事件
   *********************************************/
  const props = defineProps<{ roleStatuses: Record<string, string> }>()
  const emit = defineEmits<{ role: [id: string] }>()
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
  const people = computed(() =>
    roles.map((person) => ({
      ...person,
      style: { left: `${person.x}%`, top: `${person.y}%` },
      ariaLabel: `查看${person.name}`,
      hairColor: person.id === 'pm' || person.id === 'qa' ? '#624633' : '#383630',
      ...statusInfo(props.roleStatuses[person.id]),
    }))
  )
  const selectRole = (id: string): void => emit('role', id)
</script>
<template>
  <section class="office-card" aria-label="虛擬辦公室">
    <div class="section-bar"><span>▦ &nbsp; 辦公室總覽</span><small>MAIN OFFICE &nbsp; · &nbsp; 01</small></div>
    <div class="map-wrap">
      <div class="map">
        <div v-html="room()" />
        <v-btn
          v-for="person in people"
          :key="person.id"
          class="person"
          :style="person.style"
          :aria-label="person.ariaLabel"
          variant="text"
          density="compact"
          @click="selectRole(person.id)"
        >
          <span class="person-avatar" v-html="avatar(person.color, person.hairColor)" />
          <span class="person-label"
            >{{ person.name
            }}<small :class="person.className"
              ><span aria-hidden="true">{{ person.icon }}</span
              >{{ person.text }}</small
            ></span
          >
        </v-btn>
      </div>
    </div>
    <div class="map-footer">
      <span>點選角色查看工作狀態與任務</span>
      <div class="legend">
        <span><i class="dot running" />工作中</span><span><i class="dot waiting" />等待中</span
        ><span><i class="dot unknown" />資料未提供</span>
      </div>
    </div>
  </section>
</template>
