<template>
  <div class="middle-content">
    <div class="layout">
      <div class="top-section"> 
        <!-- <DonutChart :data="donutData" width="300" height="200" radius="100" style="margin-top:40px;margin-left:-30px;"/> -->
        <!-- 运维统计 -->
        <IndicatorGroup class="indicator-group-layout" :data="omData" />
        <NtgaleChart id="omChart" :width="400" :height="200" :data="NtgaleData" showLabel />
      </div>
      <div class="middle-section">
        <!-- 安全运行 -->
        <IndicatorGroup class="indicator-group-layout" :data="securityData" />
        <NtgaleChart id="securityChart" :data="securityPieData" roseType="radius" />
      </div>
      <div class="bottom-section">
        <!-- <DonutChart :data="donutData" width="300" height="200" radius="100" /> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import DonutChart from '/@/components/Framework/Chart/DonutChart.vue';
  import NtgaleChart from '/@/components/Framework/Chart/NtgaleChart.vue';
  import IndicatorGroup from "/@/components/Framework/Chart/IndicatorGroup.vue";

  // 运维统计
  const omData = [
    {
      value: 219,
      label: '累计工单(笔)'
    },
    {
      value: 8,
      label: '未闭环工单(笔)'
    },
    {
      value: 96.34,
      label: '闭环率(%)'
    },
  ];
  const NtgaleData = [
    { value: 40, name: '抢修工单' },
    { value: 38, name: '预试工单' },
    { value: 32, name: '清洗工单' },
    { value: 30, name: '隐患工单' },
    { value: 28, name: '消缺工单' },
    { value: 26, name: '检修工单' },
    { value: 22, name: '其他工单' },
  ];

  // 安全运行
  const securityData = [
    {
      value: 736,
      label: '应签订(人)'
    },
    {
      value: 728,
      label: '已签订(人)'
    },
    {
      value: 98.45,
      label: '签订率(%)'
    },
  ];
  const securityPieData = [
    { value: 8, name: '未签订' },
    { value: 728, name: '已签订' },
  ];

  const donutData = [
    { label: 'Category A', value: 30 },
    { label: 'Category B', value: 50 },
    { label: 'Category C', value: 20 },
  ];
</script>

<style lang="less" scoped>
  .middle-content {
    flex: 30;
    flex-shrink: 0;
    width: 30%;
    padding: 0;

    .layout {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      height: 100%; /* 100% 窗口高度，可以根据需要调整 */ 

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

    .indicator-group-layout {
      width: 400px;
      margin-bottom: 30px;
      padding: 0 50px;
    }
  }
</style>
