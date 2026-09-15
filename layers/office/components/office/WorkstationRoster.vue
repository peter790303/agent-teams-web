<script setup lang="ts">
  import { computed } from 'vue'

  import { avatar, roles } from '~/layers/office/assets/originalOffice'

  const props = defineProps<{ roleStatuses: Record<string, string> }>()
  const emit = defineEmits<{ role: [id: string] }>()
  const status = (value?: string): string =>
    !value
      ? '● 待命'
      : /running|執行中|active/i.test(value)
        ? '● 工作中'
        : /pending|等待|queued/i.test(value)
          ? '● 等待中'
          : `● ${value}`
  const running = (value?: string): boolean => Boolean(value && /running|執行中|active/i.test(value))
  const employees = computed(() =>
    roles.map((person) => ({
      ...person,
      active: running(props.roleStatuses[person.id]),
      avatarSvg: avatar(person.color, person.id === 'pm' || person.id === 'qa' ? '#624633' : '#383630'),
      statusText: status(props.roleStatuses[person.id]),
    }))
  )
  const selectRole = (id: string): void => emit('role', id)
</script>
<template>
  <section class="roster" aria-label="團隊工作站">
    <div class="roster-title">
      <span>團隊工作站 <span style="color: #61745c">／ TEAM STATIONS</span></span
      ><span>{{ roles.length }} 個工作站</span>
    </div>
    <div class="employees">
      <button
        v-for="person in employees"
        :key="person.id"
        class="employee"
        :class="{ 'is-active': person.active }"
        type="button"
        @click="selectRole(person.id)"
      >
        <span class="employee-avatar" v-html="person.avatarSvg" /><span
          ><strong>{{ person.name }}</strong
          ><small>{{ person.en }}</small
          ><span class="state">{{ person.statusText }}</span></span
        >
      </button>
    </div>
  </section>
</template>
