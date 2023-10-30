<template>
  <div class="right-content">
    <div class="layout">
      <div class="top-section">
        <EchartPillarChart :data="pchartData" :width="400" />
      </div>
      <div class="middle-section">
        <EchartLineBarChart :colors="chartColors" :width="400" :height="280" />
      </div>
      <div class="bottom-section">
        <BubbleChart
          :data="chartData"
          :width="300"
          :height="250"
          :font-size="fontSize"
          :font-color="fontColor"
          :bubble-color="bubbleColor"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import EchartPillarChart from '/@/components/Framework/Chart/EchartPillarChart.vue';
  import EchartLineBarChart from '/@/components/Framework/Chart/EchartLineBarChart.vue';
  import BubbleChart from '/@/components/Framework/Chart/BubbleChart.vue';

  const pchartData = ref({
    lData: [25, 28, 39, 14, 22, 14, 33],
    mData: [15, 22, 39, 14, 31, 15, 20],
    sData: [13, 20, 10, 34, 15, 30, 11],
    mName: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    units: ['单位', '单位'],
  });

  const chartColors = ref(['#3c8dbc', '#00a65a', '#f39c12', '#d81b60']);

  const chartData = [
    { name: '江苏', label: '江苏', value: 12, color: 'red' },
    { name: '山东', label: '山东', value: 11, color: 'green' },
    { name: '吉林', label: '吉林', value: 10, color: 'yellow' },
    { name: '浙江', label: '浙江', value: 9, color: 'blue' },
    { name: '湖北', label: '湖北', value: 8, color: 'skyblue' },
    { name: '黑龙江', label: '黑龙江', value: 7, color: 'purple' },
    { name: '天津', label: '天津', value: 7, color: 'purple' },
  ];

  const fontSize = ref('18px');
  const fontColor = 'white';
  const bubbleColor = 'red';
</script>
<style lang="less" scoped>
  .right-content {
    flex: 30;
    width: 30%;
    flex-shrink: 0;
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
  }
</style>
