<template>
  <div
    id="echarts-linebar-container"
    class="echarts-linebar-container"
    :style="`width: ${props.width}px; height: ${props.height}px;`"
  ></div>
</template>
<script lang="ts" setup>
  import { ref, onMounted, watch, toRefs } from 'vue';
  import * as echarts from 'echarts';

  // 定义属性
  const props = defineProps({
    data: Array,
    width: Number,
    height: Number,
    colors: Array,
  });

  // 创建图表
  const createChart = () => {
    var chartDom = document.getElementById('echarts-linebar-container');
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisPointer: {
            type: 'shadow',
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '',
          min: 20,
          max: 80,
          interval: 10,
        },
        {
          type: 'value',
          name: '',
          min: 10,
          max: 40,
          interval: 5,
        },
      ],
      series: [
        {
          name: 'Evaporation',
          type: 'bar',
          tooltip: {
            valueFormatter: function (value) {
              return value + ' ml';
            },
          },
          data: [50.0, 34.9, 74.0, 44.2, 55.6, 76.7, 35.6, 62.2, 32.6, 20.0, 62.4, 32.3],
          shading: 'lambert', // 设置阴影类型
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: props?.colors[0] },
              { offset: 1, color: `${props?.colors[0]}50` },
            ]),
          },
        },
        {
          name: 'Precipitation',
          type: 'bar',
          tooltip: {
            valueFormatter: function (value) {
              return value + ' ml';
            },
          },
          data: [32.6, 53.9, 39.0, 56.4, 48.7, 50.7, 75.6, 31.2, 48.7, 39.8, 62.0, 52.3],
          shading: 'lambert', // 设置阴影类型
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: props?.colors[1] },
              { offset: 1, color: `${props?.colors[1]}50` },
            ]),
          },
        },
        {
          name: 'Temperature',
          type: 'line',
          yAxisIndex: 1,
          tooltip: {
            valueFormatter: function (value) {
              return value + ' °C';
            },
          },
          lineStyle: {
            width: 2, // 折线宽度
            color: props?.colors[2],
          },
          data: [32.0, 39.2, 13.3, 24.5, 32.3, 15.2, 20.3, 23.4, 23.0, 16.5, 12.0, 26.2],
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `${props?.colors[2]}30` },
              { offset: 1, color: `${props?.colors[2]}10` },
            ]),
          },
        },
        {
          name: 'Xemp',
          type: 'line',
          yAxisIndex: 1,
          tooltip: {
            valueFormatter: function (value) {
              return value + ' °C';
            },
          },
          lineStyle: {
            width: 2, // 折线宽度
            color: props?.colors[3],
          },
          data: [12.0, 29.2, 33.3, 29.5, 35.3, 10.2, 28.3, 33.4, 13.0, 15.5, 14.0, 26.2],
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `${props?.colors[3]}30` },
              { offset: 1, color: `${props?.colors[3]}10` },
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
  .echarts-linebar-container {
    width: 100%;
    height: 400px;
  }
</style>
