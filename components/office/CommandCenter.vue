<template><aside class="command"><div class="tabs"><strong>COMMAND CENTER</strong><NuxtLink to="/settings/models">⚙ 設定</NuxtLink></div><h3>即時動態</h3><p v-for="item in events" :key="item">🟢 {{ item }}</p><h3>今日統計</h3><div class="stats"><b>14<small>完成任務</small></b><b>1<small>等待處理</small></b><b>0<small>錯誤</small></b></div><h3>系統資源</h3><div class="meter">CPU 使用率 <i style="width:32%"/></div><div class="meter">記憶體使用率 <i style="width:45%"/></div><div class="meter">Token 使用量 <i style="width:68%"/></div></aside></template>
<script setup lang="ts">
const events = ['自動化小林 完成任務審核', '後端阿明 完成 API 優化', '前端小王 開始新任務']
</script>
