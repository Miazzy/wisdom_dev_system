<template>
  <div class="monitor-video-item" :style="`width: ${typeof props.width == 'number' ? props.width + 'px' : props.width}; height: ${typeof props.height == 'number' ? props.height + 'px' : props.height}`">
    <div class="video-box">
      视频
    </div>
    <div class="title-box">
      <span>{{props.title}}</span>
      <Icon icon="fluent-mdl2:scale-volume" style="font-size: 0.14rem;" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Icon from '@/components/Icon/Icon.vue';
  const props = defineProps({
    width: { type: [Number, String], default: 340 },
    height: { type: [Number, String], default: 208 },
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
      height: 0.32rem;
      background-color: rgba(0, 0, 0, 0.5);
      line-height: 0.32rem;
      padding: 0 0.14rem;
      font-size: 0.14rem;
      color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>