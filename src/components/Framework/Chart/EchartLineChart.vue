<template>
  <div ref="chartRef" :style="{ height: `${props.height}px`, width: `${props.width}px` }"></div>
</template>
<script lang="ts" setup>
  import { onMounted, reactive, ref, Ref, watch } from 'vue';
  import { useECharts } from '/@/hooks/web/useECharts';

  const props = defineProps({
    width: { type: Number, default: 600 },
    height: { type: Number, default: 300 },
    data: { type: Object, default: {} },
    smooth: { type: Boolean, default: false },
  });
  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions, echarts } = useECharts(chartRef as Ref<HTMLDivElement>);
  const seriesList = [];
  const colorList = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de']
  const getSeriesList = () => {
    if (props.data.lineData?.length) {
      let { lineData } = props.data;
      lineData.forEach((item, index) => {
        seriesList.push({
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
                color: colorList[index],
              },
              {
                offset: 1,
                color: 'rgba(255,255,255,0)',
              },
            ]),
          },
        });
      });
      return seriesList
    } else {
      return []
    }
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
    xAxis: {
      type: 'category',
      data: props.data.categories,
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
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
    grid: { left: '2%', right: '2%', top: '2%', bottom: '2%', containLabel: true },
    tooltip: {
      trigger: 'axis',
      align: 'left',
      appendToBody: true,
      // formatter: function (params) {
      //   const units = props.data.units;
      //   const name = props.name;
      //   const first = params?.length > 0&&(params[0].value||params[0].value===0) ? `${name[0]}：${params[0].value} ${units[0]}` : '';
      //   try {
      //     const second = params?.length > 2&&(params[2].value||params[2].value===0) ? `<br /> ${name[1]}：${params[2].value} ${units[1]}` : '';
      //     const third = params?.length > 3&&(params[3].value||params[3].value===0) ? `<br /> ${name[2]}：${params[3].value} ${units[2]}` : '';
      //     return first + second + third;
      //   } catch (e) {
      //     return first;
      //   }
      // },
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
    },
    series: getSeriesList(),
  });
  watch(()=>props.data, ()=>{
    setOptions(chartOption);
  }, {
    deep: true
  })
  onMounted(() => {
    setOptions(chartOption);
  });
</script>
