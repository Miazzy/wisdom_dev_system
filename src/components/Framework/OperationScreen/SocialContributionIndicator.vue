<template>
  <div class="indicator-item">
    <div class="left">
      <img v-if="props.icon==='co2'" class="indicator-icon" :src="co2">
      <img v-if="props.icon==='so2'" class="indicator-icon" :src="so2">
      <img v-if="props.icon==='standardCoal'" class="indicator-icon" :src="standardCoal">
      <img v-if="props.icon==='treePlanting'" class="indicator-icon" :src="treePlanting">
    </div>
    <div class="right">
      <div class="value-text" :style="{color: vColor}">{{props.value}}</div>
      <div class="label-text">{{props.label}}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import co2 from '/@/assets/images/operationScreen/co2.png';
  import so2 from '/@/assets/images/operationScreen/so2.png';
  import standardCoal from '/@/assets/images/operationScreen/standard-coal.png';
  import treePlanting from '/@/assets/images/operationScreen/tree-planting.png';

  const props = defineProps({
    icon: { type: String, default: '' }, // 图标
    label: { type: String, default: '' }, // 指标项
    value: { type: Number, default: 0 }, // 指标值
    vColor: { type: String, default: '' }, // 指标值颜色
  });
</script>

<style lang="less" scoped>
  .indicator-item {
    display: flex;
    width: 2.10rem;

    .left {
      width: 0.82rem;
      height: 0.7rem;
      margin-right: 0.06rem;
      .indicator-icon {
        display: inline-block;
        width: 100%;
      }
    }

    .right {
      line-height: 1;
      .value-text {
        font-size: 0.22rem;
        font-weight: 500;
        margin-bottom: 0.1rem;
      }
      .label-text {
        font-size: 0.14rem;
        color: #fff;
        opacity: 0.78;
      }
    }
  }
</style>