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
    ybgcolor: { type: String },
  });

  // 创建图表
  const createChart = () => {
    var chartDom = document.getElementById('echarts-stackbar-container');
    var myChart = echarts.init(chartDom);
    var option;
    const categories = props.data.categories;
    const barNames = props.data.barNames;
    const data0 = props.data.barData[0];
    const data1 = props.data.barData[1];
    const data2 = props.data.barData[2];
    const data3 = props.data.barData[3];
    const lineData = props.data.lineData[0];
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
          nameTextStyle: {
            color: '#888888', //  字体颜色
            fontSize: 22, //  字体大小
            fontWeight: 'bolder',
            padding: [10, -800, 66, 0], //标题位置调整 上 右 下 左
          },
          splitLine: {
            show: false, //网格线
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
              width: '0.2', //坐标轴线线宽
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: true, //网格线
            lineStyle: {
              color: 'rgba(170, 221, 255, .8)', //坐标轴线线的颜色
              width: '0.1', //坐标轴线线宽
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
          nameTextStyle: {
            color: 'transparent', //  字体颜色
            fontSize: 26, //  字体大小
            fontWeight: 'bolder',
            padding: [10, -800, 66, 0], //标题位置调整 上 右 下 左
          },
          splitLine: {
            show: false, //网格线
            lineStyle: {
              color: 'rgba(170, 221, 255, .8)', //坐标轴线线的颜色
              width: '0.1', //坐标轴线线宽
            },
          },
          axisTick: {
            show: false, //是否展示刻度线
            inside: false, //刻度线朝内还是朝外
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
          name: barNames[0],
          type: 'bar',
          stack: 'Ad',
          emphasis: {
            focus: 'series',
          },
          data: data0,
          barWidth: props.barWidth, // 设置柱子的宽度，可以根据需要调整
        },
        {
          name: barNames[1],
          type: 'bar',
          stack: 'Ad',
          emphasis: {
            focus: 'series',
          },
          data: data1,
          barWidth: props.barWidth, // 设置柱子的宽度，可以根据需要调整
        },
        {
          name: barNames[2],
          type: 'bar',
          stack: 'Ad',
          emphasis: {
            focus: 'series',
          },
          data: data2,
          barWidth: props.barWidth, // 设置柱子的宽度，可以根据需要调整
        },
        {
          name: barNames[3],
          type: 'bar',
          stack: 'Ad',
          emphasis: {
            focus: 'series',
          },
          data: data3,
          barWidth: props.barWidth, // 设置柱子的宽度，可以根据需要调整
        },
        {
          name: props.data.lineNames[0],
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
