<template><footer class="roster"><div v-for="person in people" :key="person.name" class="person"><span>{{ person.icon }}</span><strong>{{ person.name }}</strong><small>{{ person.role }} · {{ person.status }}</small><i/></div></footer></template>
<script setup lang="ts">
const people = [
  { name: 'AI 主控', role: 'Michael', status: '在線', icon: '👨🏻‍💼' },
  { name: '前端小王', role: 'Frontend', status: '工作中', icon: '👨🏻‍💻' },
  { name: '後端阿明', role: 'Backend', status: '工作中', icon: '👨🏻‍💻' },
  { name: '自動化小林', role: 'Automation', status: '等待審核', icon: '👨🏻‍💻' },
  { name: '測試小美', role: 'Testing', status: '工作中', icon: '👩🏻‍💻' },
  { name: '設計小花', role: 'Design', status: '工作中', icon: '👩🏻‍💻' },
  { name: 'QA', role: 'qa', status: '待命', icon: '👩🏻‍🔬' },
]
</script>
