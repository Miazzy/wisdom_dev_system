<template>
  <div :id="props.id" ref="chart" :style="`width: ${props.width}px; height: ${props.height}px;`"></div>
</template>

<script lang="ts" setup>
  import * as echarts from 'echarts';
  import { onMounted } from 'vue';

  const props = defineProps({
    width: { type: Number, default: 600 },
    height: { type: Number, default: 300 },
    data: Array,
    id: { type: String },
    showLabel: { type: Boolean, default: false }, // 是否显示饼图图形旁边的文字标签
    roseType: { type: [String, Boolean], default: 'area' }, // 是否展示成南丁格尔图，通过半径区分数据大小 radius/area
  })

  onMounted(() => {
    const chartDom = document.getElementById(props.id);
    const myChart = echarts.init(chartDom);
    const option = {
      legend: {
        show: false,
      },
      series: [
        {
          name: 'Nightingale Chart',
          type: 'pie',
          radius: [30, 100],
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
  });
</script>
