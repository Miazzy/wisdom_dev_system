<template>
  <div v-show="!noData" id="echarts-stackbar-container" class="echarts-stackbar-container"
    :style="`width: ${typeof props.width == 'number' ? props.width + 'px' : props.width}; height: ${typeof props.height == 'number' ? props.height + 'px' : props.height}; background-color: ${props.backgroundColor || 'transparent'};`">
  </div>
  <div v-if="noData" :style="`width: ${typeof props.width == 'number' ? props.width + 'px' : props.width}; height: ${typeof props.height == 'number' ? props.height + 'px' : props.height}; background-color: ${props.backgroundColor || 'transparent'};`">
    <NoData />
  </div>
  
</template>
<script lang="ts" setup>
  import { onMounted, watch, nextTick, computed } from 'vue';
  import * as echarts from 'echarts';
  import NoData from '/@/components/Framework/Chart/NoData.vue';

  // 定义属性
  const props = defineProps({
    data: Array,
    width: { type: [Number, String], default: 600 },
    height: { type: [Number, String], default: 300 },
    colors: Array,
    barWidth: { type: [Number, String], default: '' },
    backgroundColor: { type: String, default: 'transparent' },
    tipsBgColor: { type: String, default: '' },
    tipsTextColor: { type: String, default: '' },
    axisColor: { type: String, default: 'rgba(170, 221, 255, .8)' },
    axisWidth: { type: String, default: '0.2' },
    legendColor: { type: String, default: 'rgba(255, 255, 255, 0.6)' },
    rotate: { type: Number, default: 0 },
    xAxisLabelInterval: { type: [Number, Function, String], default: 0 }, // 坐标轴刻度标签的显示间隔，在类目轴中有效，默认0强制显示所有标签，auto采用标签不重叠的策略间隔显示标签
    dataZoomOptions: { type: Object, default: {} }, // 坐标轴滑动和缩放的配置
  });

  const noData = computed(() => {
    if (props.data?.barData?.length || props.data?.lineData?.length) {
      return false;
    } else {
      return true;
    }
  });

  // 创建图表
  const createChart = () => {
    var chartDom = document.getElementById('echarts-stackbar-container');
    let myChart = echarts.getInstanceByDom(chartDom);
    if (myChart == undefined) {
      myChart = echarts.init(chartDom);
    }
    var option;
    const categories = props.data.categories;
    const barNames = props.data.barNames?.length ? props.data.barNames : [];
    const data0 = props.data.barData && props.data.barData.length > 0 ? props.data.barData[0] : [];
    const data1 = props.data.barData && props.data.barData.length > 1 ? props.data.barData[1] : [];
    const data2 = props.data.barData && props.data.barData.length > 2 ? props.data.barData[2] : [];
    const data3 = props.data.barData && props.data.barData.length > 3 ? props.data.barData[3] : [];
    const lineData = props.data.lineData && props.data.lineData.length > 0 ? props.data.lineData : [];
    const lineNames = props.data.lineNames?.length ? props.data.lineNames : [];

    const defaultColors = [
      ['#488FF6', '#60D1F3', '#8FD0F4', '#68E4B8'],
      ['#E59837', '#FAE895'],
    ];
    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        backgroundColor: props.tipsBgColor ? props.tipsBgColor : 'rgb(50,175,255, 15%)',
        textStyle: {
          color: props.tipsTextColor ? props.tipsTextColor : '#fff', //设置文字颜色
        },
        borderColor: 'transparent',
      },
      grid: {
        left: '3%',
        right: '3%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: categories,
          nameTextStyle: {
            color: '#888888', //  字体颜色
            fontSize: 22, //  字体大小
            fontWeight: 'bolder',
            padding: [10, -800, 66, 0], //标题位置调整 上 右 下 左
          },
          splitLine: {
            show: false, //网格线
          },
          axisTick: {
            show: false, //是否展示刻度线
            inside: false, //刻度线朝内还是朝外
          },
          axisLabel: {
            color: 'rgba(170, 221, 255, .8)', // 设置文本颜色
            fontSize: 14, // 设置字体大小
            fontFamily: 'Arial', // 设置字体样式
            interval: props.xAxisLabelInterval,
            rotate: props.rotate,
          },
          axisLine: {
            show: ' ', //是否显示坐标轴轴线
            onZero: ' ', //X 轴或者 Y 轴的轴线是否在另一个轴的 0 刻度
            onZeroAxisIndex: '12', //当有双轴时，可以用这个属性手动指定，在哪个轴的 0 刻度上
            symbol: ['none', 'none'], //轴线两边的箭头
            symbolSize: [10, 10], //轴线两边的箭头的大小，第一个数字表示宽度（垂直坐标轴方向），第二个数字表示高度（平行坐标轴方向）
            lineStyle: {
              color: props.axisColor, //坐标轴线线的颜色
              width: props.axisWidth, //坐标轴线线宽
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: true, //网格线
            lineStyle: {
              color: props.axisColor, //坐标轴线线的颜色
              width: props.axisWidth, //坐标轴线线宽
            },
          },
          axisLine: {
            show: ' ', //是否显示坐标轴轴线
            onZero: ' ', //X 轴或者 Y 轴的轴线是否在另一个轴的 0 刻度
            onZeroAxisIndex: '12', //当有双轴时，可以用这个属性手动指定，在哪个轴的 0 刻度上
            symbol: ['none', 'none'], //轴线两边的箭头
            symbolSize: [10, 10], //轴线两边的箭头的大小，第一个数字表示宽度（垂直坐标轴方向），第二个数字表示高度（平行坐标轴方向）
            lineStyle: {
              color: props.axisColor, //坐标轴线线的颜色
              width: props.axisWidth, //坐标轴线线宽
            },
          },
        },
        {
          type: 'value',
          nameTextStyle: {
            color: 'transparent', //  字体颜色
            fontSize: 26, //  字体大小
            fontWeight: 'bolder',
            padding: [10, -800, 66, 0], //标题位置调整 上 右 下 左
          },
          splitLine: {
            show: false, //网格线
            lineStyle: {
              color: props.axisColor, //坐标轴线线的颜色
              width: props.axisWidth, //坐标轴线线宽
            },
          },
          axisTick: {
            show: false, //是否展示刻度线
            inside: false, //刻度线朝内还是朝外
          },
          axisLine: {
            lineStyle: {
              color: 'transparent',
            },
          },
          axisLabel: {
            color: props.axisColor, // 设置文本颜色
            fontSize: 14, // 设置字体大小
            fontFamily: 'Arial', // 设置字体样式
          },
        },
      ],
      series: [
        {
          name: barNames[0],
          type: 'bar',
          stack: 'Ad',
          color: props.colors?.[0]?.[0] ? props.colors[0][0] : defaultColors[0][0],
          emphasis: {
            focus: 'series',
          },
          data: data0,
          barWidth: props.barWidth, // 设置柱子的宽度，可以根据需要调整
          barMaxWidth: 20 // 柱子的最大宽度
        },
        {
          name: barNames[1],
          type: 'bar',
          stack: 'Ad',
          color: props.colors?.[0]?.[1] ? props.colors[0][1] : defaultColors[0][1],
          emphasis: {
            focus: 'series',
          },
          data: data1,
          barWidth: props.barWidth, // 设置柱子的宽度，可以根据需要调整
          barMaxWidth: 20 // 柱子的最大宽度
        },
        {
          name: barNames[2],
          type: 'bar',
          stack: 'Ad',
          color: props.colors?.[0]?.[2] ? props.colors[0][2] : defaultColors[0][2],
          emphasis: {
            focus: 'series',
          },
          data: data2,
          barWidth: props.barWidth, // 设置柱子的宽度，可以根据需要调整
          barMaxWidth: 20 // 柱子的最大宽度
        },
        {
          name: barNames[3],
          type: 'bar',
          stack: 'Ad',
          color: props.colors?.[0]?.[3] ? props.colors[0][3] : defaultColors[0][3],
          emphasis: {
            focus: 'series',
          },
          data: data3,
          barWidth: props.barWidth, // 设置柱子的宽度，可以根据需要调整
          barMaxWidth: 20 // 柱子的最大宽度
        },
        {
          name: lineNames[0],
          type: 'line',
          yAxisIndex: 1,
          color: new echarts.graphic.LinearGradient(
            0,
            1,
            0,
            0,
            [
              {
                offset: 0,
                color: props.colors?.[1]?.[0] ? props.colors[1][0] : defaultColors[1][0],
              },
              {
                offset: 1,
                color: props.colors?.[1]?.[1] ? props.colors[1][1] : defaultColors[1][1],
              },
            ],
            false,
          ),
          lineStyle: {
            width: 2, // 折线宽度
            color: new echarts.graphic.LinearGradient(
              0,
              1,
              0,
              0,
              [
                {
                  offset: 0,
                  color: props.colors?.[1]?.[0] ? props.colors[1][0] : defaultColors[1][0],
                },
                {
                  offset: 1,
                  color: props.colors?.[1]?.[1] ? props.colors[1][1] : defaultColors[1][1],
                },
              ],
              false,
            ),
          },
          data: lineData,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: `${props.colors?.[1]?.[0] ? props.colors[1][0] : defaultColors[1][0]}30`,
              },
              {
                offset: 1,
                color: `${props.colors?.[1]?.[1] ? props.colors[1][1] : defaultColors[1][1]}10`,
              },
            ]),
          },
        },
      ],
      legend: {
        show: true,
        x: 'right',
        y: '10%',
        textStyle: {
          color: props.legendColor,
        },
        itemWidth: 14,
        itemHeight: 10,
      },
    };

    if(Object.keys(props.dataZoomOptions)?.length) {
      option.dataZoom = [props.dataZoomOptions];
    }
    option && myChart.setOption(option);
  };

  // 监听数据变化
  watch(
    () => props.data,
    () => {
      createChart();
    },
    {
      deep: true,
    },
  );

  // 监听数据变化
  watch(
    () => props.colors,
    () => {
      createChart();
    },
    {
      deep: true,
    },
  );

  const emit = defineEmits(['clickItem']);

  watch(
    () => props.height,
    () => {
      setTimeout(() => {
        var chartDom = document.getElementById('echarts-stackbar-container');
        let myChart = echarts?.getInstanceByDom(chartDom);
        myChart?.resize();
      }, 100);
    },
  );

  // 创建地图并绘制点位
  onMounted(() => {
    createChart();
    nextTick(() => {
      var chartDom = document.getElementById('echarts-stackbar-container');
      let myChart = echarts.getInstanceByDom(chartDom);
      myChart.on('click', (params) => {
        emit('clickItem', params);
      });
    });
  });
</script>
<style>
  .echarts-stackbar-container {
    width: 100%;
  }
</style>
