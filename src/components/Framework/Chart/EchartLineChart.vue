<template>
  <div ref="chartRef" :style="{ height: `${props.height}px`, width: `${props.width}px` }"></div>
</template>
<script lang="ts" setup>
  import { onMounted, reactive, ref, Ref, watch, nextTick } from 'vue';
  import { useECharts } from '/@/hooks/web/useECharts';

  const props = defineProps({
    width: { type: Number, default: 600 },
    height: { type: Number, default: 300 },
    data: { type: Object, default: {} },
    smooth: { type: Boolean, default: false },
    rotate: { type: Number, default: 0 },
    disableDataZoom: { type: Boolean, default: true }, // 缩放
    customTooltipFormatter: { type: [Function, null], default: null }, // 自定义tooltip格式化
  });
  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions, echarts, getInstance } = useECharts(chartRef as Ref<HTMLDivElement>);

  const colorList = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'];
  const getSeriesList = () => {
    const seriesList = [];
    if (props.data?.lineData?.length) {
      let { lineData } = props.data;
      lineData.forEach((item, index) => {
        seriesList.push({
          name: props.data.seriesName[index],
          smooth: props.smooth,
          data: item,
          type: 'line',
          // areaStyle: {},
          // itemStyle: {
          //   color: '#5ab1ef',
          // },
          symbolSize: 8,
          lineStyle: {
            width: 2,
          },
          areaStyle: {
            opacity: 0.25,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorList[index % 5],
              },
              {
                offset: 1,
                color: `${colorList[index % 5]}00`,
              },
            ]),
          },
          itemStyle: {
            color: colorList[index % 5],
          },
        });
      });
    }
    return seriesList;
  };
  const chartOption = reactive({
    tooltip: {
      trigger: 'axis',
      // axisPointer: {
      //   lineStyle: {
      //     width: 1,
      //     color: '#019680',
      //   },
      // },
    },
    legend: {
      show: true,
    },
    xAxis: {
      type: 'category',
      data: props.data.categories,
      splitLine: {
        show: false,
      },
      boundaryGap: true,
      axisTick: {
        alignWithLabel: true,
        show: false,
      },
      axisLabel: {
        color: 'rgba(170, 221, 255, .8)', // 设置文本颜色
        fontSize: 14, // 设置字体大小
        fontFamily: 'Arial', // 设置字体样式
        rotate: props.rotate,
      },
    },
    yAxis: [
      {
        type: 'value',
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
        },
      },
    ],
    grid: { left: '2%', right: '2%', top: '10%', bottom: '2%', containLabel: true },
    tooltip: {
      trigger: 'axis',
      align: 'left',
      appendToBody: true,
      formatter: function (params) {
        if (props.customTooltipFormatter) {
          return props.customTooltipFormatter(params);
        } else {
          const units = props.data.units;
          const name = props.data.seriesName;
          // const first = params?.length > 0&&(params[0].value||params[0].value===0) ? `${name[0]}：${params[0].value} ${units[0]}` : '';
          // try {
          //   const second = params?.length > 2&&(params[2].value||params[2].value===0) ? `<br /> ${name[1]}：${params[2].value} ${units[1]}` : '';
          //   const third = params?.length > 3&&(params[3].value||params[3].value===0) ? `<br /> ${name[2]}：${params[3].value} ${units[2]}` : '';
          //   return first + second + third;
          // } catch (e) {
          //   return first;
          // }

          let content = '';
          if (params?.length) {
            params.forEach((item, index) => {
              content = content + `${name[index]}：${item.value} ${units[index]}`;
              if (index < params.length - 1) {
                content = content + `<br />`;
              }
            });
          }
          return content;
        }
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
      className: 'line-chart-tooltip'
    },
    series: getSeriesList(),
    dataZoom: [{ type: 'inside', disabled: props.disableDataZoom }], // 缩放
  });
  const setChartOptions = () => {
    chartOption.xAxis.data = props.data.categories;
    chartOption.series = getSeriesList();
    setOptions(chartOption);
  };
  watch(
    () => props.data,
    () => {
      setChartOptions(chartOption);
    },
    {
      deep: true,
    },
  );

  const emit = defineEmits(['clickItem']);

  onMounted(() => {
    setChartOptions(chartOption);
    nextTick(()=>{
      let myChart = getInstance();
      myChart.on('click', (params)=> {
        emit('clickItem', params);
      })
    })
  });
</script>
<style lang="less">
[data-theme='dark'] .line-chart-tooltip {
  background-color: rgba(5, 22, 41, 0.85) !important;
  color: rgba(255, 255, 255, 0.94) !important;
  border-color: rgba(255, 255, 255, 0.21) !important;
}
</style>

