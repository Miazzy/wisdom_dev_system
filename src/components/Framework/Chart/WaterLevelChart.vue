<template>
  <div
    id="water-level-chart"
    class="water-level-chart"
    :style="`width: ${props.width}px; height: ${props.height}px;`"
  ></div>
</template>

<script setup>
  import { onMounted } from 'vue';
  import * as echarts from 'echarts';
  import 'echarts-liquidfill';

  const props = defineProps({
    data: {
      type: Number,
      required: true,
      default: 0,
    },
    width: {
      type: String,
      default: '200',
    },
    height: {
      type: String,
      default: '200',
    },
  });

  const updateChart = () => {
    const chartDom = document.getElementById('water-level-chart');
    const chart = echarts.init(chartDom);
    chart.setOption(getChartOptions());
  };

  const getChartOptions = () => {
    return {
      series: [
        {
          type: 'liquidFill',
          radius: '70%',
          data: [props.data / 100],
          backgroundStyle: {
            borderWidth: 2,
            borderColor: 'rgba(0, 0, 0, 0.2)',
            color: 'transparent',
          },
          outline: {
            show: true,
            borderDistance: 0,
            itemStyle: {
              borderWidth: 2, // 设置边框宽度
              borderColor: {
                type: 'linear', // 使用线性渐变
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'white', // 起始颜色为白色
                  },
                  {
                    offset: 1,
                    color: 'white', // 结束颜色为透明
                  },
                ],
              },
            },
          },
          shape: 'circle',
          color: ['#87CEEB'], // 设置水位的颜色为天蓝色
          label: {
            show: true,
            position: ['50%', '50%'],
            fontSize: 18,
            color: '#fefefe',
          },
        },
      ],
    };
  };

  onMounted(() => {
    updateChart();
  });
</script>

<style scoped>
</style>
