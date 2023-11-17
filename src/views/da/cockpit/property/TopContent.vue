<template>
  <div class="top-content">
    <div class="number-display-item">
      <NumberDisplay title="电站规模(座)" :value="36" tsize="12px" vsize="28px" :subtitle="numberDisplaysubtitle1" />
    </div>
    <div class="number-display-item">
      <NumberDisplay title="并网容量(MW)" :value="2476.765" tsize="12px" vsize="28px" :subtitle="numberDisplaysubtitle2" />
    </div>
    <div class="number-display-item">
      <NumberDisplay title="全容量并网电站(座)" :value="26" tsize="12px" vsize="28px" :subtitle="numberDisplaysubtitle3" />
    </div>
    <div class="number-display-item">
      <NumberDisplay title="设备统计" :value="362" tsize="12px" vsize="28px" />
    </div>
    <div class="number-display-item">
      <NumberDisplay title="备品备件" :value="362" tsize="12px" vsize="28px" />
    </div>
    <div class="number-display-item">
      <NumberDisplay title="出入库单(张)" :value="362" tsize="12px" vsize="28px" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import NumberDisplay from '/@/components/Framework/Chart/NumberDisplay.vue';

  const numberDisplaysubtitle1 = reactive({
    mtext: '同比',
    mvalue: '5'
  });

  const numberDisplaysubtitle2 = reactive({
    mtext: '同比',
    mvalue: '100'
  });

  const numberDisplaysubtitle3 = reactive({
    mtext: '同比',
    mvalue: '100'
  });

</script>

<style lang="less" scoped>
  .top-content {
    display: flex;
    height: 160px;
    padding: 20px;

    .number-display-item {
      flex: 1;
    }
  }
</style>
