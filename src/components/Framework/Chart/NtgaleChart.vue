<template>
  <div id="NtgaleChart" ref="chart" style="width:500px; height: 400px;"></div>
</template>

<script lang="ts" setup>
  import * as echarts from 'echarts';
  import { onMounted } from 'vue';

  onMounted(() => {
    const chartDom = document.getElementById('NtgaleChart');
    const myChart = echarts.init(chartDom);
    const option = {
      legend: {
        show: false,
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: false },
          dataView: { show: false, readOnly: false },
          restore: { show: false },
          saveAsImage: { show: false },
        },
      },
      series: [
        {
          name: 'Nightingale Chart',
          type: 'pie',
          radius: [30, 100],
          center: ['50%', '50%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 0,
          },
          data: [
            { value: 40, name: 'rose 1' },
            { value: 38, name: 'rose 2' },
            { value: 32, name: 'rose 3' },
            { value: 30, name: 'rose 4' },
            { value: 28, name: 'rose 5' },
            { value: 26, name: 'rose 6' },
            { value: 22, name: 'rose 7' },
            { value: 18, name: 'rose 8' },
          ],
        },
      ],
    };
    option && myChart.setOption(option);
  });
</script>
