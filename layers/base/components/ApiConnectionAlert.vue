<script setup lang="ts">
  /*********************************************
   * 📂 Category: Composables / Plugins
   * 🔧 Defines: 自定 composables、Pinia 狀態、i18n、plugin 等注入來源
   *********************************************/
  const { authError, accessKey } = useApiAuth()

  /*********************************************
   * 📂 Category: Computed
   * 🔧 Defines: 定義計算屬性
   *********************************************/
  const hasConnectionError = computed<boolean>(() => !accessKey.value || authError.value !== null)
  const connectionMessage = computed<string>(
    () => authError.value ?? '尚未設定 Nest client key，請更新前端環境設定並重新啟動服務。'
  )
</script>

<template>
  <v-alert v-if="hasConnectionError" type="error" variant="tonal" role="alert">
    {{ connectionMessage }}
  </v-alert>
</template>
