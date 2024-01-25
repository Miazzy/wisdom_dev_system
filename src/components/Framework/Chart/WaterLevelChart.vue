<template>
  <div class="chart-container" style="position: relative">
    <div
      id="water-level-chart"
      class="water-level-chart"
      :style="`width: ${typeof props.width == 'number' ? props.width + 'px' : props.width}; height: ${typeof props.height == 'number' ? props.height + 'px' : props.height};`"
    >
    </div>
    <div
      class="circle-layout"
      :style="`top: ${typeof props.circle.top == 'number' ? props.circle.top + 'px' : props.circle.top}; left:  ${typeof props.circle.left == 'number' ? props.circle.left + 'px' : props.circle.left};`"
    >
      <div
        class="circle-1"
        :style="`width: ${typeof props.circle.width == 'number' ? props.circle.width + 'px' : props.circle.width}; height: ${typeof props.circle.height == 'number' ? props.circle.height + 'px' : props.circle.height};`"
      ></div>
      <div
        class="circle-0"
        :style="`width: ${typeof props.circle.width == 'number' ? props.circle.width + 'px' : props.circle.width}; height: ${typeof props.circle.height == 'number' ? props.circle.height + 'px' : props.circle.height};`"
      ></div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, watch } from 'vue';
  import * as echarts from 'echarts';
  import 'echarts-liquidfill';

  const props = defineProps({
    data: {
      type: Number,
      required: true,
      default: 0,
    },
    width: {
      type: [Number, String],
      default: 200,
    },
    height: {
      type: [Number, String],
      default: 200,
    },
    circle: { type: Object },
  });

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

  const updateChart = () => {
    const chartDom = document.getElementById('water-level-chart');
    let chart = echarts.getInstanceByDom(chartDom);
    if (chart == undefined) {
      chart = echarts.init(chartDom);
    }
    chart.setOption(getChartOptions());
  };

  watch(
    () => props.data,
    () => {
      updateChart();
    },
    {
      deep: true,
    },
  );

  onMounted(() => {
    updateChart();
  });
</script>

<style lang="less" scoped>
  .chart-container {
    .circle-layout {
      position: absolute;
      .circle-0 {
        position: absolute;
        width: 1.02rem;
        height: 1.02rem;
        border-radius: 50%;
        background: linear-gradient(90deg, #ffffff25 0%, transparent 50%, #ffffff25 100%);
      }
      .circle-1 {
        position: absolute;
        width: 1.02rem;
        height: 1.02rem;
        border-radius: 50%;
        background: linear-gradient(0deg, #ffffff25 0%, transparent 50%, #ffffff25 100%);
      }
    }
  }
</style>
