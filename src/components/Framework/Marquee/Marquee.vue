<template>
  <div class="scrollingStyle" :style="props.style">
    <span class="marquee">
      <slot></slot>
    </span>
    <span class="marquee">
      <slot name="backup"></slot>
    </span>
  </div>
</template>

<script lang="ts" setup>
  import { defineProps } from 'vue';

  const props = defineProps({
    style: { type: String, default: '' },
  });
</script>

<style lang="less" scoped>
  .scrollingStyle {
    min-width: 400px;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
  }

  .marquee {
    width: 100%;
    display: inline-block;
    animation: marquee 10s linear infinite;
  }

  @keyframes marquee {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-35%);
    }
  }
</style>
