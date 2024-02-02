<template>
  <div
    id="echarts-pie-container"
    class="echarts-pie-container"
    :style="`width: ${typeof props.width == 'number' ? props.width + 'px' : props.width}; height: ${
      typeof props.height == 'number' ? props.height + 'px' : props.height
    };`"
  ></div>
</template>
<script lang="ts" setup>
  import { nextTick, onMounted, watch } from 'vue';
  import * as echarts from 'echarts';

  // 定义属性
  const props = defineProps({
    data: { type: Array, default: [] as any[] },
    width: { type: [Number, String], default: 375 },
    height: { type: [Number, String], default: 375 },
    colors: { type: Array, default: ['#55D187', '#ED6F6F', '#0960bd', '#fc344a', '#47BDAF', '#0065cc', '#94f7f9'] as any[] },
    showLabel: { type: Boolean, default: false },
    unit: { type: [String], default: '' },
  });

  // 监听数据变化
  watch(
    () => props.data,
    () => {
      nextTick(() => {
        createChart();
      });
    },
    {
      deep: true,
    },
  );

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
          radius: [40, 85],
          top: top + '%',
          height: '55%',
          left: 'center',
          width: props.width,
          itemStyle: {
            color: function (params) {
              return props.colors[params.dataIndex % props.colors.length];
            },
            borderColor: 'transparent',
            borderWidth: 1,
          },
          label: {
            show: props.showLabel,
            alignTo: 'edge',
            formatter: `{name|{b}}\n{time|{c} ${props.unit}}`,
            minMargin: 5,
            edgeDistance: 10,
            lineHeight: 15,
            fontSize: 14,
            color: '#fefefe',
            rich: {
              time: {
                fontSize: 14,
                color: '#fefefe',
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
