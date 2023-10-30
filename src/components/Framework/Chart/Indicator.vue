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
    percent: { type: [Number, String], default: 0 }, // 正数表示上升，负数表示下降
    color: { type: String, default: '' },
  });

  const changeClass = computed(() => {
    if (props.color == '') {
      const value = typeof props.percent == 'number' ? props.percent : parseFloat(props.percent);
      return {
        'text-red': value >= 0, // 如果上升，使用红色
        'text-green': value < 0, // 如果下降，使用绿色
      };
    } else {
      return {
        'text-red': props.color == 'red',
        'text-green': props.color == 'green',
      };
    }
  });

  const change = computed(() => {
    const prefix = typeof props.percent == 'number' ? (props.percent >= 0 ? '+' : '-') : ''; // 如果上升，添加"+"前缀
    if (typeof props.percent == 'number') {
      return `${prefix}${props.percent.toFixed(2)}%`;
    } else {
      return `${prefix}${props.percent as string}`;
    }
  });
</script>

<style scoped>
  .indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    font-family: Arial, sans-serif;
    background-color: transparent;
    padding: 2px 4px;
    color: white;
  }

  .title {
    color: blue;
    font-size: 14px;
  }

  .value {
    font-size: 22px;
    margin: 2px 0;
  }

  .info {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .subtitle {
    flex: 60;
    width: 65%;
    margin: 0px 5px 0px 0px;
    font-size: 12px;
    color: #e0e0e0;
  }

  .text-red {
    flex: 40;
    width: 40%;
    color: red;
    font-size: 14px;
    margin: 0px 10px 0px 5px;
  }

  .text-green {
    flex: 40;
    width: 40%;
    color: green;
    font-size: 14px;
    margin: 0px 10px 0px 5px;
  }
</style>
