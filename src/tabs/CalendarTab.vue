<script setup lang="ts">
import ScheduleCalendar from '@/components/ScheduleCalendar.vue';
</script>

<template>
  <p>パソコン部は、毎週月・木曜日に特別棟のAL室で活動をしております。</p>
  <p>体験入部をしてみたいという人は、ぜひ来てみてください。</p>
  <div class="info-box warn">
    <p>活動予定・活動日は変更される可能性があります。あらかじめご了承ください。</p>
  </div>
  <div class="info-box warn small-screen-warning">
    <p>画面が小さいと正しく表示されない可能性があります。</p>
  </div>

  <ScheduleCalendar data-path="./calendar.json" :display-week-count="4"></ScheduleCalendar>
</template>

<style scoped lang="css">
p {
  text-align: justify;
  text-align-last: left;
}

.small-screen-warning {
  display: none;
}

@media screen and (max-width: 750px) {
  .small-screen-warning {
    display: block;
  }
}
</style>
