<template>
  <div class="indicator">
    <div class="title">{{ title }}</div>
    <div class="value">{{ value }}</div>
    <div class="info">
      <span class="subtitle">{{ subtitle }}</span>
      <span :class="changeClass">{{ change }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';

  const props = defineProps({
    title: { type: String, default: '' },
    value: { type: Number, default: 0 },
    subtitle: { type: String, default: '' },
    percentChange: { type: Number, default: 0 }, // 正数表示上升，负数表示下降
  });

  const changeClass = computed(() => ({
    'text-red': props.percentChange > 0, // 如果上升，使用红色
    'text-green': props.percentChange < 0, // 如果下降，使用绿色
  }));

  const change = computed(() => {
    const prefix = props.percentChange > 0 ? '+' : '-'; // 如果上升，添加"+"前缀
    return `${prefix}${props.percentChange.toFixed(2)}%`;
  });
</script>

<style scoped>
  .indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    font-family: Arial, sans-serif;
    background-color: #333;
    padding: 2px 4px;
    color: white;
  }

  .title {
    color: blue;
    font-size: 18px;
  }

  .value {
    font-size: 26px;
    margin: 2px 0;
  }

  .info {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .subtitle {
    font-size: 14px;
  }

  .text-red {
    color: red;
  }

  .text-green {
    color: green;
  }
</style>
