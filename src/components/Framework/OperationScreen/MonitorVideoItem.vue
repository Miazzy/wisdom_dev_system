<template>
  <div class="monitor-video-item" :style="`width: ${props.width}px; height: ${props.height}px`">
    <div class="video-box">
      视频
    </div>
    <div class="title-box">{{props.title}}</div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    width: { type: Number, default: 340 },
    height: { type: Number, default: 208 },
    title: { type: String, default: '' }
  });
</script>

<style lang="less" scoped>
  .monitor-video-item {
    position: relative;
    background-color: rgba(8, 95, 148, 0.3);
    .video-box {
      width: 100%;
      height: 100%;
    }
    .title-box {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 32px;
      background-color: rgba(0, 0, 0, 0.5);
      line-height: 32px;
      padding: 0 14px;
      font-size: 14px;
      color: #fff;
    }
  }
</style>