<template>
  <div class="data-indicator">
    <div class="number-text" :style="`color: ${props.color}`">{{props.value}}</div>
    <div class="label-text">{{props.label}}</div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    label: { type: String, default: '' }, // 指标项
    value: { type: Number, default: 0 }, // 指标值
    color: { type: String, default: '#00F6FF' }, // 数值颜色
  });
</script>

<style lang="less" scoped>
  .data-indicator {
    text-align: center;
    line-height: 1;
    .number-text {
      margin-bottom: 0.08rem;
      font-size: 0.22rem;
    }
    .label-text {
      font-size: 0.12rem;
      color: #fff;
      opacity: 0.8;
    }
  }
</style>