<template>
  <div
    :id="props.mapID"
    :style="`width: ${props.width}px; height: ${props.height}px;`"
    class="echarts-emap-china-container"
  ></div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch } from 'vue';
  import * as echarts from 'echarts';
  import 'echarts/extension/bmap/bmap';
  import { getChinaJsonData } from '@/api/echarts/map';

  // 定义属性
  const props = defineProps({
    mapID: { type: String, default: 'echarts-emap-china-container' },
    data: { type: Array, default: [] as any },
    title: { type: String, default: '中国行政区域图' },
    width: { type: Number, default: 600 },
    height: { type: Number, default: 500 },
  });

  // 创建柱状图和折线图
  onMounted(() => {
    createChart();
  });

  // 创建 ECharts 图表
  const createChart = async () => {
    const chartDom = document.getElementById(props.mapID);
    const myChart = echarts.init(chartDom);
    let option;
    const chinaJsonData = await getChinaJsonData();
    echarts.registerMap('china', chinaJsonData, {});
    option = {
      title: {
        text: props.title,
        left: 'right',
      },
      tooltip: {
        trigger: 'item',
        showDelay: 0,
        transitionDuration: 0.2,
      },
      visualMap: {
        bottom: 50,
        right: 30,
        min: 0,
        max: 1000000,
        inRange: {
          color: ['#4575b4', '#74add1', '#abd9e9'],
        },
        calculable: false,
        show: false,
      },
      series: [
        {
          name: '中国地图',
          type: 'map',
          mapType: 'china',
          roam: true,
          emphasis: {
            label: {
              show: true,
            },
          },
          data: props.data as any[],
        },
      ],
    };
    myChart.setOption(option);
    option && myChart.setOption(option);
  };
</script>

<style lang="less" scoped>
  .echarts-emap-china-container {
    background: transparent;
    border: 1px solid #f0f0f0;
    :deep(.anchorBL) {
      display: none;
    }
  }
</style>
