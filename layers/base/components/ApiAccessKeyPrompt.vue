<script setup lang="ts">
  /*********************************************
   * 📂 Category: Composables / Plugins
   * 🔧 Defines: Nest API key 輸入與驗證提示
   *********************************************/
  const { authError, accessKey, setAccessKey } = useApiAuth()

  /*********************************************
   * 📂 Category: Refs / Reactive State
   * 🔧 Defines: 表單輸入狀態
   *********************************************/
  const enteredAccessKey = ref<string>(accessKey.value ?? '')

  /*********************************************
   * 📂 Category: Computed
   * 🔧 Defines: 表單狀態與提示文字
   *********************************************/
  const requiresAccessKey = computed<boolean>(() => !accessKey.value || authError.value !== null)
  const promptText = computed<string>(() => authError.value ?? '請輸入 Nest API access key 以連線。')
  const isSaveDisabled = computed<boolean>(() => enteredAccessKey.value.trim().length === 0)

  /*********************************************
   * 📂 Category: Methods
   * 🔧 Defines: API key 儲存與頁面重新載入
   *********************************************/
  const reloadPage = (): void => {
    if (import.meta.client) window.location.reload()
  }
  const saveAccessKey = (): void => {
    setAccessKey(enteredAccessKey.value)
    reloadPage()
  }
</script>

<template>
  <v-card v-if="requiresAccessKey" variant="outlined" color="primary">
    <v-card-text>
      <p class="mb-3" role="alert">{{ promptText }}</p>
      <v-form @submit.prevent="saveAccessKey">
        <v-text-field
          v-model="enteredAccessKey"
          label="Nest API access key"
          type="password"
          autocomplete="off"
          hide-details="auto"
          required
        />
        <div class="d-flex ga-2 mt-3">
          <v-btn type="submit" color="primary" :disabled="isSaveDisabled">儲存並使用</v-btn>
          <v-btn v-if="authError" type="button" variant="text" @click="reloadPage">重新載入資料</v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>
