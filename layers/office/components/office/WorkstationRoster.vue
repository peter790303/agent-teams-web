<script setup lang="ts">
import { avatar, roles } from '~/layers/office/assets/originalOffice'
const props = defineProps<{ roleStatuses: Record<string, string> }>()
const status = (value?: string): string => !value ? '● 待命' : /running|執行中|active/i.test(value) ? '● 工作中' : /pending|等待|queued/i.test(value) ? '● 等待中' : `● ${value}`
const running = (value?: string): boolean => Boolean(value && /running|執行中|active/i.test(value))
</script>
<template>
  <section class="roster" aria-label="團隊工作站"><div class="roster-title"><span>團隊工作站 <span style="color:#61745c">／ TEAM STATIONS</span></span><span>{{ roles.length }} 個工作站</span></div><div class="employees">
    <button v-for="person in roles" :key="person.id" class="employee" :class="{ 'is-active': running(props.roleStatuses[person.id]) }" type="button">
      <span class="employee-avatar" v-html="avatar(person.color, person.id === 'pm' || person.id === 'qa' ? '#624633' : '#383630')" /><span><strong>{{ person.name }}</strong><small>{{ person.en }}</small><span class="state">{{ status(props.roleStatuses[person.id]) }}</span></span>
    </button>
  </div></section>
</template>
