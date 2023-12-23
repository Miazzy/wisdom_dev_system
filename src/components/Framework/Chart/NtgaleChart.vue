<template>
  <div :id="props.id" ref="chart" :style="`width: ${props.width}px; height: ${props.height}px;`"></div>
</template>

<script lang="ts" setup>
  import * as echarts from 'echarts';
  import { onMounted, watch, PropType } from 'vue';

  const props = defineProps({
    width: { type: Number, default: 600 },
    height: { type: Number, default: 300 },
    data: Array,
    id: { type: String },
    showLabel: { type: Boolean, default: false }, // 是否显示饼图图形旁边的文字标签
    roseType: { type: [String, Boolean], default: 'area' }, // 是否展示成南丁格尔图，通过半径区分数据大小 radius/area
    radius: {type: Array as PropType<number[]>, default: [30, 100] }
  });

  const setupData = () => {
    const chartDom = document.getElementById(props.id);
    let myChart = echarts.getInstanceByDom(chartDom);
    if (myChart == undefined) {
      myChart = echarts.init(chartDom);
    }
    const option = {
      legend: {
        show: false,
      },
      series: [
        {
          name: 'Nightingale Chart',
          type: 'pie',
          radius: props.radius,
          center: ['50%', '50%'],
          roseType: props.roseType,
          itemStyle: {
            borderRadius: 0,
          },
          data: props.data,
          label: {
            show: props.showLabel,
            formatter: '{b}: {c}%',
            overflow: 'break',
            textBorderType: 'none',
            color: '#BAC3C4'
          },
        },
      ],
    };
    option && myChart.setOption(option);
  }

  watch(
    () => props.data,
    () => {
      setupData();
    },
    {
      deep: true,
    },
  );

  onMounted(() => {
    setupData();
  });
</script>
