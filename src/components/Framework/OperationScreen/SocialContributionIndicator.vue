<template>
  <div class="indicator-item">
    <div class="left">
      <img v-if="props.icon==='co2'" class="indicator-icon" :src="co2">
      <img v-if="props.icon==='so2'" class="indicator-icon" :src="so2">
      <img v-if="props.icon==='standardCoal'" class="indicator-icon" :src="standardCoal">
      <img v-if="props.icon==='treePlanting'" class="indicator-icon" :src="treePlanting">
    </div>
    <div class="right">
      <div class="value-text">{{props.value}}</div>
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
  });
</script>

<style lang="less" scoped>
  .indicator-item {
    display: flex;
    width: 210px;

    .left {
      width: 82px;
      height: 70px;
      margin-right: 6px;
      .indicator-icon {
        display: inline-block;
        width: 100%;
      }
    }

    .right {
      line-height: 1;
      .value-text {
        font-size: 22px;
        color: #00f6ff;
        font-weight: 500;
        margin-bottom: 10px;
      }
      .label-text {
        font-size: 14px;
        color: #fff;
        opacity: 0.78;
      }
    }
  }
</style>