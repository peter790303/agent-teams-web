<script setup lang="ts">
/*********************************************
 * 📂 Category: Static Data
 * 🔧 Defines: 不會改變的靜態資料，例如選單、enum 對應等
 *********************************************/
const sections = [{ label: '總覽', path: '/' }, { label: '模型設定', path: '/settings/models' }]
</script>
<template>
  <aside class="command"><div class="tabs"><strong>COMMAND CENTER</strong></div><nav><NuxtLink v-for="section in sections" :key="section.path" :to="section.path">{{ section.label }}</NuxtLink></nav><h3>操作說明</h3><p>從總覽建立任務，於任務詳情查看實際階段、阻塞、QA 與交付資料。</p><h3>系統資料</h3><p>模型設定頁顯示 Nest API 回傳的候選模型、容量與 Provider 健康狀態。</p></aside>
</template>
