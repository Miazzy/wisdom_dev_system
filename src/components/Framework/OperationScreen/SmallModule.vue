<template>
  <div class="small-module">
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
  });
</script>

<style lang="less" scoped>
  .small-module {
    width: 100%;
    height: 100%;
    background: url('../../../assets/images/da/section_bg_1.png') no-repeat center/100% 100%;
    .title-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 16.67%;
      .title-left {
        font-size: 0.16rem;
        color: #fefefe;
        padding-left: 0.16rem;
        font-weight: 600;
      }
    }
    .content-box {
      height: 83.33%;
    }
  }
</style>