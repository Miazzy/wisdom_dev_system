<template>
  <div
    class="echarts-container"
    :style="`width: ${props.width}px; height: ${props.height}px;`"
  ></div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch, toRefs } from 'vue';
  import * as echarts from 'echarts';
  import 'echarts-gl'; // 引入 ECharts 的 3D 图表库

  // 定义属性
  const props = defineProps({
    data: Array,
    width: Number,
    height: Number,
    colors: Array,
    legendData: Array,
  });

  // 将 props 解构
  const { data, colors, legendData } = toRefs(props);

  // 创建一个 ref 来存储图表实例
  const chart = ref(null);

  // 监听数据变化
  watch(data, () => {
    if (chart.value) {
      updateChart();
    }
  });

  // 创建柱状图和折线图
  onMounted(() => {
    createChart();
  });

  // 创建 ECharts 图表
  function createChart() {
    chart.value = echarts.init(document.querySelector('.echarts-container'));
    // chart.value.setOption({
    //   grid3D: {
    //     boxWidth: 20, // 设置 3D 坐标系宽度
    //     boxDepth: 10, // 设置 3D 坐标系深度
    //     viewControl: {
    //       autoRotate: false, // 自动旋转视角
    //     },
    //   },
    //   xAxis3D: {}, // 3D x 轴配置
    //   yAxis3D: {}, // 3D y 轴配置
    //   zAxis3D: {},
    // });
    updateChart();
  }

  // 更新图表数据
  function updateChart() {
    if (!chart.value) {
      return;
    }

    // 构建柱状图数据
    // const barSeries = data.value.barData.map((series, i) => ({
    //   type: 'bar',
    //   name: legendData.value[i],
    //   data: series.data,
    //   itemStyle: {
    //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    //       { offset: 0, color: colors.value[i] },
    //       { offset: 1, color: `${colors.value[i]}50` },
    //     ]),
    //   },
    // }));

    const barSeries = data.value.barData.map((series, i) => ({
      type: 'bar', // 使用 3D 柱状图
      name: legendData.value[i],
      data: series.data,
      shading: 'lambert', // 设置阴影类型
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: colors.value[i] },
          { offset: 1, color: `${colors.value[i]}50` },
        ]),
      },
      // },
      // type: 'pictorialBar',
      // symbol: 'rect', // 图元的形状，可根据需要调整
      // symbolSize: [30, 10], // 图元的大小，[宽度, 高度]
      // symbolOffset: [0, 0], // 图元的偏移，可根据需要调整
      // data: series.data,
      // name: legendData.value[i],
      // itemStyle: {
      //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      //     { offset: 0, color: colors.value[i] },
      //     { offset: 1, color: `${colors.value[i]}50` },
      //   ]),
      // },
    }));

    // 构建折线图数据
    const lineSeries = data.value.lineData.map((series, i) => ({
      type: 'line',
      name: legendData.value[i],
      data: series.data,
    }));

    // 创建 ECharts 配置
    const options = {
      legend: {
        data: legendData.value,
      },
      tooltip: {
        trigger: 'axis',
        align: 'left',
        textStyle: {
          color: 'white', //设置文字颜色
        },
        extraCssText: '100px;',
        backgroundColor: 'rgba(2, 175, 252, 0.5)',
        borderColor: 'transparent',
        appendToBody: true,
        formatter: function (params) {
          return '<br/>' + params[0].value + '<br/>';
        },
        position: function (point, params, dom, rect, size) {
          var x = 0; // x坐标位置
          var y = 0; // y坐标位置
          var pointX = point[0];
          var pointY = point[1];
          var boxWidth = size.contentSize[0];
          var boxHeight = size.contentSize[1];
          if (boxWidth > pointX) {
            x = pointX + 10;
          } else {
            x = pointX - boxWidth - 10;
          }
          if (boxHeight > pointY) {
            y = 5;
          } else {
            y = pointY - boxHeight;
          }
          return [x, y];
        },
      },
      xAxis: {
        type: 'category',
        data: data.value.categories,
      },
      yAxis: {
        type: 'value',
      },
      series: [...barSeries, ...lineSeries],
    };

    // 设置图表配置
    chart.value.setOption(options);
  }
</script>

<style>
  .echarts-container {
    width: 100%;
    height: 400px;
  }
</style>
