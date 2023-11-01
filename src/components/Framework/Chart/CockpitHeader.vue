<template>
  <div class="header">
    <div class="title"> {{ props.title }} </div>
    <div class="info">
      <span class="time">
        <DigitalClock />
      </span>
      <span class="weather">晴天</span>
      <button class="settings">设置</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, defineProps, watch } from 'vue';
  import DigitalClock from '/@/components/Framework/Chart/DigitalClock.vue';

  const props = defineProps({
    title: { type: String, default: '' }, // 列定义
    date: { type: String, default: '' }, // 表格数据
  });
</script>
<style>
  @font-face {
    font-family: 'Digital';
    src: url('../../../assets/fonts/DSDIGI.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }
</style>
<style lang="less" scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    color: white;
    height: 80px;
    border-bottom: 2px solid #01D8FF12;

    .title {
      font-size: 24px;
      font-family: 'Microsoft YaHei', '微软雅黑';
      font-weight: 400;
      color: #ffffff;
      line-height: 16px;
      margin-left: 20px;
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
