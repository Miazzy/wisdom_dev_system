<template>
  <div
    id="echarts-linebar-container"
    class="echarts-linebar-container"
    :style="`width: ${props.width}px; height: ${props.height}px;`"
  ></div>
</template>
<script lang="ts" setup>
  import { onMounted, toRefs } from 'vue';
  import * as echarts from 'echarts';

  // 定义属性
  const props = defineProps({
    data: { type: Array },
    width: { type: Number, default: 600 },
    height: { type: Number, default: 300 },
    colors: { type: Array },
    name: { type: Array },
    category: { type: Array },
    ybgcolor: { type: String },
  });

  // 解构 props
  const { data, colors, category, ybgcolor } = toRefs(props);

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
          data: category.value,
          axisPointer: {
            type: 'shadow',
          },
          nameTextStyle: {
            color: '#888888', //  字体颜色
            fontSize: 26, //  字体大小
            fontWeight: 'bolder',
            padding: [10, -800, 66, 0], //标题位置调整 上 右 下 左
          },
          axisLabel: { // 设置 x 轴刻度文本样式
            color: 'rgba(170, 221, 255, .8)', // 设置文本颜色
            fontSize: 14, // 设置字体大小
            fontFamily: 'Arial', // 设置字体样式
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: ybgcolor.value, // 设置Y轴刻度线颜色
            },
          },
          axisTick: {
            show: false, //是否展示刻度线
            inside: false, //刻度线朝内还是朝外
          },
          axisLine: {
            show: ' ', //是否显示坐标轴轴线
            onZero: ' ', //X 轴或者 Y 轴的轴线是否在另一个轴的 0 刻度
            onZeroAxisIndex: '12', //当有双轴时，可以用这个属性手动指定，在哪个轴的 0 刻度上
            symbol: ['none', 'none'], //轴线两边的箭头
            symbolSize: [10, 10], //轴线两边的箭头的大小，第一个数字表示宽度（垂直坐标轴方向），第二个数字表示高度（平行坐标轴方向）
            lineStyle: {
              color: 'rgba(170, 221, 255, .8)', //坐标轴线线的颜色
              width: '0.1', //坐标轴线线宽
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '',
          min: 10,
          max: 80,
          interval: 10,
          axisLabel: {  // 设置 y 轴刻度文本样式
            color: 'rgba(170, 221, 255, .8)', // 设置文本颜色
            fontSize: 14, // 设置字体大小
            fontFamily: 'Arial', // 设置字体样式
          },
          splitLine: {
            show: true, // 控制网格线显示与隐藏
            lineStyle: {
              color: ybgcolor.value, // 设置Y轴刻度线颜色
            },
          },
          axisLine: {
            show: ' ', //是否显示坐标轴轴线
            onZero: ' ', //X 轴或者 Y 轴的轴线是否在另一个轴的 0 刻度
            onZeroAxisIndex: '12', //当有双轴时，可以用这个属性手动指定，在哪个轴的 0 刻度上
            symbol: ['none', 'none'], //轴线两边的箭头
            symbolSize: [10, 10], //轴线两边的箭头的大小，第一个数字表示宽度（垂直坐标轴方向），第二个数字表示高度（平行坐标轴方向）
            lineStyle: {
              color: 'rgba(170, 221, 255, .8)', //坐标轴线线的颜色
              width: '0.2', //坐标轴线线宽
            },
          },
        },
        {
          type: 'value',
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: 'transparent',
            },
          },
        },
      ],
      series: [
        {
          name: 'Evaporation',
          type: 'bar',
          tooltip: {
            valueFormatter: function (value) {
              return value;
            },
          },
          data: data.value[0], // 使用传入的数据
          shading: 'lambert',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colors.value[0][1] },
              { offset: 1, color: `${colors.value[0][0]}` },
            ]),
          },
        },
        {
          name: 'Precipitation',
          type: 'bar',
          tooltip: {
            valueFormatter: function (value) {
              return value;
            },
          },
          data: data.value[1], // 使用传入的数据
          shading: 'lambert',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colors.value[1][1] },
              { offset: 1, color: `${colors.value[1][0]}` },
            ]),
          },
        },
        {
          name: 'Temperature',
          type: 'line',
          yAxisIndex: 1,
          tooltip: {
            valueFormatter: function (value) {
              return value;
            },
          },
          lineStyle: {
            width: 2,
            color: colors.value[2],
          },
          data: data.value[2], // 使用传入的数据
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `${colors.value[2]}30` },
              { offset: 1, color: `${colors.value[2]}10` },
            ]),
          },
        },
        {
          name: 'Xemp',
          type: 'line',
          yAxisIndex: 1,
          tooltip: {
            valueFormatter: function (value) {
              return value;
            },
          },
          lineStyle: {
            width: 2,
            color: colors.value[3],
          },
          data: data.value[3], // 使用传入的数据
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `${colors.value[3]}30` },
              { offset: 1, color: `${colors.value[3]}10` },
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
  }
</style>
