<template>
  <div :id="`echarts-crossbar-container${random}`" class="echarts-crossbar-container" :style="`width: ${typeof props.width == 'number' ? props.width + 'px' : props.width}; height: ${typeof props.height == 'number' ? props.height + 'px' : props.height};`"></div>
</template>
<script lang="ts" setup>
  import { onMounted, toRefs, watch, nextTick } from 'vue';
  import * as echarts from 'echarts';

  // 定义属性
  const props = defineProps({
    data: { type: Array },
    width: { type: [Number, String], default: 600 },
    height: { type: [Number, String], default: 300 },
    yAxis: { type: Object, default: { min: 0, max: 100, interval: 20 } as Object },
    colors: { type: Array },
    names: { type: Array },
    category: { type: Array },
    ybgcolor: { type: String },
    rotate: { type: Number, default: 0 },
    tipsBgColor: { type: String, default: '' },
    tipsTextColor: { type: String, default: '' },
    barWidth: { type: [Number, String], default: '' },
  });

  const random = parseInt(Math.random() * 10000000);

  // 解构 props
  const { data, colors, names, category, ybgcolor } = toRefs(props);

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

  // 创建图表
  const createChart = () => {
    var chartDom = document.getElementById('echarts-crossbar-container' + random);
    let myChart = echarts.getInstanceByDom(chartDom);
    if (myChart == undefined) {
      myChart = echarts.init(chartDom);
    }

    const barData0 = data.value.barData && data.value.barData.length > 0 ? data.value.barData[0] : [];
    const barData1 = data.value.barData && data.value.barData.length > 1 ? data.value.barData[1] : [];

    const names0 = names.value && names.value.length > 0 ? names.value[0] : [];
    const names1 = names.value && names.value.length > 1 ? names.value[1] : [];
    var option;
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
      legend: {
        x: 'right',
        y: '10%',
        textStyle: {
          color: 'rgba(255, 255, 255, 0.6)',
        },
        itemWidth: 14,
        itemHeight: 10,
      },
      grid: {
        left: '1%',
        right: '6%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        name: '',
        axisLabel: {
          // 设置 y 轴刻度文本样式
          color: 'rgba(170, 221, 255, .8)', // 设置文本颜色
          fontSize: 14, // 设置字体大小
          fontFamily: 'Arial', // 设置字体样式
          interval: 0,
          rotate: 0,
        },
        splitLine: {
          show: true, // 控制网格线显示与隐藏
          lineStyle: {
            color: ybgcolor.value, // 设置Y轴刻度线颜色
          },
        },
        axisLine: {
          show: ' ', //是否显示坐标轴轴线
          onZero: ' ', //X 轴或者 Y 轴的轴线是否在另一个轴的 0 刻度
          onZeroAxisIndex: '12', //当有双轴时，可以用这个属性手动指定，在哪个轴的 0 刻度上
          symbol: ['none', 'none'], //轴线两边的箭头
          symbolSize: [10, 10], //轴线两边的箭头的大小，第一个数字表示宽度（垂直坐标轴方向），第二个数字表示高度（平行坐标轴方向）
          lineStyle: {
            color: 'rgba(170, 221, 255, .8)', //坐标轴线线的颜色
            width: '0.2', //坐标轴线线宽
          },
        },
      },
      yAxis: {
        type: 'category',
        data: category.value,
        axisPointer: {
          type: 'shadow',
        },
        nameTextStyle: {
          color: '#888888', //  字体颜色
          fontSize: 26, //  字体大小
          fontWeight: 'bolder',
          padding: [10, -800, 66, 0], //标题位置调整 上 右 下 左
        },
        axisLabel: {
          // 设置 x 轴刻度文本样式
          color: 'rgba(170, 221, 255, .8)', // 设置文本颜色
          fontSize: 14, // 设置字体大小
          fontFamily: 'Arial', // 设置字体样式
          interval: 0,
          rotate: props.rotate,
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: ybgcolor.value, // 设置Y轴刻度线颜色
          },
        },
        axisTick: {
          show: false, //是否展示刻度线
          inside: false, //刻度线朝内还是朝外
        },
        axisLine: {
          show: ' ', //是否显示坐标轴轴线
          onZero: ' ', //X 轴或者 Y 轴的轴线是否在另一个轴的 0 刻度
          onZeroAxisIndex: '12', //当有双轴时，可以用这个属性手动指定，在哪个轴的 0 刻度上
          symbol: ['none', 'none'], //轴线两边的箭头
          symbolSize: [10, 10], //轴线两边的箭头的大小，第一个数字表示宽度（垂直坐标轴方向），第二个数字表示高度（平行坐标轴方向）
          lineStyle: {
            color: 'rgba(170, 221, 255, .8)', //坐标轴线线的颜色
            width: '0.1', //坐标轴线线宽
          },
        },
      },
      series: [
        {
          name: names0,
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series',
          },
          data: barData0,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colors.value[0] },
              { offset: 1, color: `${colors.value[0]}` },
            ]),
          },
          barWidth: props.barWidth, // 设置柱子的宽度，可以根据需要调整
          barMaxWidth: 20 // 柱子的最大宽度
        },
        {
          name: names1,
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series',
          },
          data: barData1,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colors.value[1] },
              { offset: 1, color: `${colors.value[1]}` },
            ]),
          },
          barWidth: props.barWidth, // 设置柱子的宽度，可以根据需要调整
          barMaxWidth: 20 // 柱子的最大宽度
        },
      ],
    };

    option && myChart.setOption(option);
  };

  const emit = defineEmits(['clickItem']);

  // 创建地图并绘制点位
  onMounted(() => {
    createChart();
    nextTick(()=>{
      var chartDom = document.getElementById('echarts-crossbar-container' + random);
      let myChart = echarts.getInstanceByDom(chartDom);
      myChart.on('click', (params)=> {
        emit('clickItem', params);
      })
    })
  });

  watch(
    () => props.height,
    () => {
      setTimeout(() => {
        var chartDom = document.getElementById('echarts-crossbar-container' + random);
        let myChart = echarts?.getInstanceByDom(chartDom);
        myChart?.resize();
      }, 100);
    },
  );
</script>
<style>
  .echarts-crossbar-container {
    width: 100%;
  }
</style>
