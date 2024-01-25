<template>
  <div class="small-module" :class="`${props.position}-bg`">
    <div class="title-box">
      <div class="title-left">{{props.title}}</div>
      <div class="title-right">
        <slot name="titleRight"></slot>
      </div>
    </div>
    <div class="content-box">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const props = defineProps({
    title: { type: String, default: '' }, // 标题
    position: { type: String, default: '' }, // 位置在左边或右边
  });
</script>

<style lang="less" scoped>
  .small-module {
    width: 100%;
    height: 3.15rem;
    &.left-bg {
      background: url('../../../assets/images/operationScreen/small-module-bg.png') no-repeat
        center/100% auto;
    }
    &.right-bg {
      background: url('../../../assets/images/operationScreen/small-module-bg-right.png') no-repeat
        center/100% auto;
    }
    .title-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title-left {
        font-size: 0.16rem;
        color: #fefefe;
        padding: 0.2rem 0 0 0.16rem;
        font-weight: 600;
      }
    }
  }
</style>