<script setup lang="ts">
  import { computed } from 'vue'

  import { avatar, roles, room } from '~/layers/office/assets/originalOffice'

  const props = defineProps<{ roleStatuses: Record<string, string> }>()
  const emit = defineEmits<{ role: [id: string] }>()
  const statusLabel = (value?: string): string => {
    if (!value) return '● 待命'
    if (/running|執行中|active/i.test(value)) return '● 工作中'
    if (/pending|等待|queued/i.test(value)) return '● 等待中'
    if (/failed|失敗|blocked|阻塞/i.test(value)) return '● 需處理'

    return `● ${value}`
  }
  const isRunning = (value?: string): boolean => Boolean(value && /running|執行中|active/i.test(value))
  const people = computed(() =>
    roles.map((person) => ({
      ...person,
      style: { left: `${person.x}%`, top: `${person.y}%` },
      ariaLabel: `查看${person.name}`,
      hairColor: person.id === 'pm' || person.id === 'qa' ? '#624633' : '#383630',
      running: isRunning(props.roleStatuses[person.id]),
      status: statusLabel(props.roleStatuses[person.id]),
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
            >{{ person.name }}<small :class="{ 'is-running': person.running }">{{ person.status }}</small></span
          >
        </v-btn>
      </div>
    </div>
    <div class="map-footer">
      <span>點選角色查看工作狀態與任務</span>
      <div class="legend">
        <span><i class="dot running" />工作中</span><span><i class="dot waiting" />等待中</span
        ><span><i class="dot" />待命</span>
      </div>
    </div>
  </section>
</template>
