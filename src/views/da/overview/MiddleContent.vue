<template>
  <div class="middle-content">
    <div class="layout">
      <div class="top-section"> 
        <!-- <DonutChart :data="donutData" width="300" height="200" radius="100" style="margin-top:40px;margin-left:-30px;"/> -->
      </div>
      <div class="middle-section"> </div>
      <div class="bottom-section">
        <DonutChart :data="donutData" width="300" height="200" radius="100" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import DonutChart from '/@/components/Framework/Chart/DonutChart.vue';
  import NtgaleChart from '/@/components/Framework/Chart/NtgaleChart.vue';

  const donutData = [
    { label: 'Category A', value: 30 },
    { label: 'Category B', value: 50 },
    { label: 'Category C', value: 20 },
  ];
</script>

<style lang="less" scoped>
  .middle-content {
    flex: 30;
    width: 30%;
    padding: 0px;
    flex-shrink: 0;

    .layout {
      display: flex;
      flex-direction: column;
      height: 100%; /* 100% 窗口高度，可以根据需要调整 */
      flex-shrink: 0; 

      .top-section {
        flex: 10; /* 上部分高度占比，可以根据需要调整 */
        height: 33%;
      }

      .middle-section {
        flex: 10; /* 中间部分高度占比，可以根据需要调整 */
        height: 33%;
      }

      .bottom-section {
        flex: 10; /* 下部分高度占比，可以根据需要调整 */
        height: 33%;
      }
    }
  }
</style>
