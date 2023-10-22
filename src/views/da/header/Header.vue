<template>
  <div class="header">
    <div class="title">大屏标题</div>
    <div class="info">
      <span class="time">12:00</span>
      <span class="weather">晴天</span>
      <button class="settings">设置</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue';

</script>

<style lang="less" scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #333;
    color: white;

    .title {
      font-size: 24px;
    }

    .info {
      display: flex;
      align-items: center;

      .time,
      .weather,
      .settings {
        margin-left: 20px;
      }
    }
  }
</style>
