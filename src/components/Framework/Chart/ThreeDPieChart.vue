<template>
  <div :style="chartStyle" ref="chart"></div>
</template>

<script setup>
  import { ref, onMounted, defineProps } from 'vue';
  import * as echarts from 'echarts';

  const props = defineProps({
    data: Array,
    width: Number,
    height: Number,
  });

  const chart = ref(null);

  const chartStyle = {
    width: `${props.width}px`,
    height: `${props.height}px`,
  };

  onMounted(() => {
    create3DPieChart(chart.value, props.data);
  });

  function create3DPieChart(container, data) {
    // 初始化 ECharts 实例
    const myChart = echarts.init(container);

    // 数据处理
    const chartData = data.map((item) => ({
      name: item.label,
      value: item.value,
      itemStyle: {
        color: item.color,
      },
      label: {
        rich: {
          a: {
            color: item.color,
            lineHeight: 10,
          },
        },
      },
    }));

    // 创建环形饼状图
    myChart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {d}%',
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'], // 控制环形的宽度
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center', // 标签位置
            color: '#000',
            fontSize: 18,
            fontWeight: 'bold',
            formatter: '{d}%', // 显示百分比
          },
          labelLine: {
            show: false,
          },
          data: chartData,
        },
      ],
      graphic: [
        {
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: '总人数 18 人',
            fontSize: 18,
          },
        },
      ],
    });
  }
</script>
