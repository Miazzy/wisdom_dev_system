<template>
  <div class="indicator">
    <div class="title">{{ title }}</div>
    <div class="value">{{ value }}</div>
    <div class="info">
      <span class="subtitle">{{ subtitle }}</span>
      <span v-if="subtitle==='同比'&&props.percent!=0" class="trend" :class="props.percent>0?'red':'green'"></span>
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
    // const prefix = typeof props.percent == 'number' ? (props.percent >= 0 ? '+' : '-') : ''; // 如果上升，添加"+"前缀
    if (typeof props.percent == 'number') {
      return `${props.percent.toFixed(2)}%`;
    } else {
      return `${props.percent as string}`;
    }
  });
</script>

<style scoped>
  .indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2px 4px;
    background-color: transparent;
    color: white;
    font-family: Arial, sans-serif;
    text-align: center;
  }

  .title {
    color: #07A5FD;
    font-size: 14px;
  }

  .value {
    margin: 2px 0;
    color: rgb(255 255 255 / 99%);
    font-size: 22px;
  }

  .info {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .subtitle {
    margin-right: 10px;
    color: rgb(255 255 255 / 60%);
    font-size: 12px;
    line-height: 1;
  }

  .text-red {
    margin-left: 3px;
    color: #FF4F38;
    font-size: 14px;
  }

  .text-green {
    margin-left: 3px;
    color: #00BA24;
    font-size: 14px;
  }

  .trend {
    width: 10px;
    border: 5px solid transparent;

    &.red {
      border-top: none;
      border-bottom: 6px solid #FF4F38;
    }

    &.green {
      border-top: 6px solid #00BA24;
      border-bottom: none;
    }
  }
</style>
