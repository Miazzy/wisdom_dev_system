<template>
  <div
    id="echarts-stackbar-container"
    class="echarts-stackbar-container"
    :style="`width: ${props.width}px; height: ${props.height}px;`"
  ></div>
</template>
<script lang="ts" setup>
  import { onMounted } from 'vue';
  import * as echarts from 'echarts';

  // 定义属性
  const props = defineProps({
    data: Array,
    width: { type: Number, default: 600 },
    height: { type: Number, default: 300 },
    colors: Array,
    barWidth: { type: Number, default: 25 },
    lineColor: { type: String, default: '#fe039a' },
  });

  // 创建图表
  const createChart = () => {
    var chartDom = document.getElementById('echarts-stackbar-container');
    var myChart = echarts.init(chartDom);
    var option;
    const categories = props.data.categories;
    const data0 = props.data.barData[0].data;
    const data1 = props.data.barData[1].data;
    const data2 = props.data.barData[2].data;
    const lineData = props.data.lineData[0].data;
    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: categories,
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
        {
          type: 'value',
          name: 'Xemp',
          min: 0,
          max: 40,
          interval: 10,
          axisLabel: {
            formatter: '{value} °C',
          },
        },
      ],
      series: [
        {
          name: 'Email',
          type: 'bar',
          stack: 'Ad',
          emphasis: {
            focus: 'series',
          },
          data: data0,
          barWidth: props.barWidth, // 设置柱子的宽度，可以根据需要调整
        },
        {
          name: 'Union Ads',
          type: 'bar',
          stack: 'Ad',
          emphasis: {
            focus: 'series',
          },
          data: data1,
          barWidth: props.barWidth, // 设置柱子的宽度，可以根据需要调整
        },
        {
          name: 'Video Ads',
          type: 'bar',
          stack: 'Ad',
          emphasis: {
            focus: 'series',
          },
          data: data2,
          barWidth: props.barWidth, // 设置柱子的宽度，可以根据需要调整
        },
        {
          name: 'Xemp',
          type: 'line',
          yAxisIndex: 1,
          lineStyle: {
            width: 2, // 折线宽度
            color: props.lineColor as string,
          },
          data: lineData,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `${props.lineColor}30` },
              { offset: 1, color: `${props.lineColor}10` },
            ]),
          },
        },
      ],
    };
    option && myChart.setOption(option);
  };

  // 创建地图并绘制点位
  onMounted(() => {
    createChart();
  });
</script>
<style>
  .echarts-stackbar-container {
    width: 100%;
  }
</style>
