<script setup lang="ts">
  /*********************************************
   * 📂 Category: Imports
   * 🔧 Defines: 引入角色與辦公室 SVG 資產
   *********************************************/
  import { computed } from 'vue'
  import { useDisplay } from 'vuetify'

  import type { DispatchStatus } from '~/layers/domain/task/types/DispatchStatus'
  import { avatar, roles, room } from '~/layers/office/assets/originalOffice'
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
  const { smAndDown, xs } = useDisplay()

  /*********************************************
   * 📂 Category: Computed
   * 🔧 Defines: 定義計算屬性
   *********************************************/
  const displayClass = computed<Record<string, boolean>>(() => ({
    'is-compact': smAndDown.value,
    'is-mobile': xs.value,
  }))
  const people = computed(() =>
    roles.map((person) => ({
      ...person,
      style: { left: `${person.x}%`, top: `${person.y}%` },
      ariaLabel: `查看${person.name}`,
      hairColor: person.id === 'pm' || person.id === 'qa' ? '#624633' : '#383630',
      ...getRoleStatusInfo(props.roleStatuses[person.id]),
    }))
  )

  /*********************************************
   * 📂 Category: Methods
   * 🔧 Defines: 定義函數與事件處理
   *********************************************/
  const selectRole = (id: string): void => props.onRole(id)
</script>
<template>
  <section class="office-card" :class="displayClass" aria-label="虛擬辦公室">
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
      <div class="legend d-none d-sm-flex ga-3">
        <span><i class="dot running" />工作中</span><span><i class="dot waiting" />等待中</span
        ><span><i class="dot unknown" />資料未提供</span>
      </div>
    </div>
  </section>
</template>
