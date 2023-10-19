<template>
  <div id="ChinaMap" ref="chart" style="width: 500px; height: 400px"></div>
</template>

<script lang="ts" setup>
  import * as echarts from 'echarts';
  // import 'echarts/map/js/china.js';
  import { ref, onMounted } from 'vue';

  const chart = ref(null);

  const renderChinaMap = () => {
    const myChart = echarts.init(chart.value);

    // 定义省份数据，以及各省份的颜色
    const provinceData = [
      { name: '北京', value: 100 },
      { name: '天津', value: 50 },
    ];

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          return `${params.name}: ${params.value}`;
        },
      },
      visualMap: {
        type: 'continuous',
        min: 0,
        max: 200, // 根据你的数据范围设置
        inRange: {
          color: ['lightblue', 'orangered'], // 自定义颜色范围
        },
      },
      series: [
        {
          type: 'map',
          map: 'china',
          zoom: 1.2, // 调整地图缩放
          label: {
            show: true,
          },
          data: provinceData,
        },
      ],
    };

    myChart.setOption(option);
  };

  onMounted(() => {
    renderChinaMap();
  });
</script>
