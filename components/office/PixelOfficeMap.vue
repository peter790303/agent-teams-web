<template><section class="map"><div v-for="desk in desks" :key="desk.name" class="desk" :style="{ left: desk.x + '%', top: desk.y + '%' }"><span>{{ desk.icon }}</span><b>{{ desk.name }}</b><small>{{ desk.status }}</small></div><div class="room room-ai">AI 主控</div><div class="room room-meet">會議室</div><div class="room room-rest">休息區</div></section></template>
<script setup lang="ts">
const desks = [{name:'前端小王',status:'工作中',icon:'👨🏻‍💻',x:22,y:53},{name:'後端阿明',status:'工作中',icon:'👨🏻‍💻',x:44,y:53},{name:'自動化小林',status:'等待審核',icon:'👨🏻‍💻',x:67,y:53},{name:'測試小美',status:'工作中',icon:'👩🏻‍💻',x:33,y:78},{name:'設計小花',status:'工作中',icon:'👩🏻‍💻',x:55,y:78},{name:'維運小陳',status:'閒置中',icon:'👨🏻‍💻',x:76,y:78}]
</script>
