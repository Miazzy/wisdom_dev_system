<template>
  <div class="header">
    <div class="title"> {{ props.title }} </div>
    <div class="info">
      <span class="time"> {{ props.date }} </span>
      <span class="weather">晴天</span>
      <button class="settings">设置</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, defineProps, watch } from 'vue';

  const props = defineProps({
    title: { type: String, default: '' }, // 列定义
    date: { type: String, default: '2023-10-01 10:00' }, // 表格数据
  });

</script>

<style lang="less" scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    color: white;
    height: 80px;

    .title {
      font-size: 24px;
      font-family: 'Microsoft YaHei', '微软雅黑';
      font-weight: 400;
      color: #FFFFFF;
      line-height: 16px;
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
