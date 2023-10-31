<template>
  <div
    id="echarts-pie-container"
    class="echarts-pie-container"
    :style="`width: ${props.width}px; height: ${props.height}px;`"
  ></div>
</template>
<script lang="ts" setup>
  import { onMounted } from 'vue';
  import * as echarts from 'echarts';

  // 定义属性
  const props = defineProps({
    data: { type: Array, default: [] as any[] },
    width: { type: Number, default: 600 },
    height: { type: Number, default: 300 },
    colors: { type: Array, default: [] as any[] },
    showLabel: { type: Boolean, default: false },
  });

  // 创建图表
  const createChart = () => {
    var chartDom = document.getElementById('echarts-pie-container');
    var myChart = echarts.init(chartDom);
    var option;
    var datas = [props.data];

    option = {
      series: datas.map(function (data, idx) {
        var top = idx * 33.3;
        return {
          type: 'pie',
          radius: [35, 60],
          top: top + '%',
          height: '33.33%',
          left: 'center',
          width: props.width,
          itemStyle: {
            color: function (params) {
              return props.colors[params.dataIndex % props.colors.length];
            },
            borderColor: '#fff',
            borderWidth: 1,
          },
          label: {
            show: props.showLabel,
            alignTo: 'edge',
            formatter: '{name|{b}}\n{time|{c} 小时}',
            minMargin: 5,
            edgeDistance: 10,
            lineHeight: 15,
            rich: {
              time: {
                fontSize: 10,
                color: '#999',
              },
            },
          },
          labelLine: {
            length: 10,
            length2: 0,
            maxSurfaceAngle: 80,
          },
          labelLayout: function (params) {
            const isLeft = params.labelRect.x < myChart.getWidth() / 2;
            const points = params.labelLinePoints;
            if (typeof points == 'undefined' || points == null) {
              return { labelLinePoints: points };
            } else {
              points[2][0] = isLeft
                ? params.labelRect.x
                : params.labelRect.x + params.labelRect.width;
              return { labelLinePoints: points };
            }
          },
          data: data,
        };
      }),
    };

    option && myChart.setOption(option);
  };

  // 创建地图并绘制点位
  onMounted(() => {
    createChart();
  });
</script>
<style>
  .echarts-pie-container {
    width: 100%;
    height: 100%;
  }
</style>
