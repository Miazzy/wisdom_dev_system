<template>
  <div
    class="echarts-container"
    :style="`width: ${props.width}px; height: ${props.height}px;`"
  ></div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch, toRefs, nextTick } from 'vue';
  import * as echarts from 'echarts';

  // 定义属性
  const props = defineProps({
    data: Array,
    width: Number,
    height: Number,
    colors: Array,
    legendData: Array,
    rotate: { type: Number, default: 0 },
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

  const emit = defineEmits(['clickItem']);

  // 创建柱状图和折线图
  onMounted(() => {
    createChart();
    nextTick(()=>{
      const chartDom = document.querySelector('.echarts-container');
      let myChart = echarts.getInstanceByDom(chartDom);
      myChart.on('click', (params)=> {
        emit('clickItem', params);
      })
    })
  });

  // 创建 ECharts 图表
  function createChart() {
    chart.value = echarts.init(document.querySelector('.echarts-container'));
    updateChart();
  }

  // 更新图表数据
  function updateChart() {
    if (!chart.value) {
      return;
    }
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
    }));
    // 构建折线图数据
    const lineSeries = data.value.lineData.map((series, i) => ({
      type: 'line',
      name: legendData.value[i],
      data: series.data,
    }));
    // 创建 ECharts 配置
    const options = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
      },
      xAxis: {
        type: 'category',
        data: data.value.categories,
        axisLabel: {
          color: 'rgba(170, 221, 255, .8)', // 设置文本颜色
          fontSize: 14, // 设置字体大小
          fontFamily: 'Arial', // 设置字体样式
          interval: 0,
          rotate: props.rotate,
        },
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
