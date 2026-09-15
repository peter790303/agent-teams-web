<script setup lang="ts">
// 📂 Category: shared page layout
withDefaults(
  defineProps<{
    maxWidth?: string | number
  }>(),
  { maxWidth: 1380 },
)
</script>

<template>
  <v-app>
    <v-main class="bg-app-background">
      <v-container class="pa-4 pa-md-6 mx-auto w-100" :max-width="maxWidth">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>
