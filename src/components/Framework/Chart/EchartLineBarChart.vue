<template>
  <div :id="`echarts-linebar-container${random}`" class="echarts-linebar-container" :style="`width: ${typeof props.width == 'number' ? props.width + 'px' : props.width}; height: ${
      typeof props.height == 'number' ? props.height + 'px' : props.height
    };`"></div>
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
    name: { type: Array },
    category: { type: Array },
    ybgcolor: { type: String, default: '#01B7D7' },
    rotate: { type: Number, default: 0 },
    txtColor: { type: String, default: 'rgba(170, 221, 255, 0.8)' },
    tipsBgColor: { type: String, default: '' },
    tipsTextColor: { type: String, default: '' },
    xAxisLabelInterval: { type: [Number, Function, String], default: 0 }, // 坐标轴刻度标签的显示间隔，在类目轴中有效，默认0强制显示所有标签，auto采用标签不重叠的策略间隔显示标签
    barWidth: { type: [Number, String], default: '' },
    dataZoomOptions: { type: Object, default: {} }, // 坐标轴滑动和缩放的配置
  });

  const random = parseInt(Math.random() * 10000000);

  // 解构 props
  const { data, colors, category, ybgcolor, name } = toRefs(props);
  const emit = defineEmits(['clickItem', 'click']);

  // 监听数据变化
  watch(
    () => props.data,
    () => {
      setTimeout(() => {
        createChart();
      }, 100);
    },
    {
      deep: true,
    },
  );

  // 创建图表
  const createChart = () => {
    var chartDom = document.getElementById('echarts-linebar-container' + random);
    let myChart = echarts.getInstanceByDom(chartDom);
    if (myChart == undefined) {
      myChart = echarts.init(chartDom);
    }
    var option;
    const barData0 = data.value.barData && data.value.barData.length > 0 ? data.value.barData[0] : [];
    const barData1 = data.value.barData && data.value.barData.length > 1 ? data.value.barData[1] : [];
    const barData2 = data.value.barData && data.value.barData.length > 2 ? data.value.barData[2] : [];
    const lineData0 =
      data.value.lineData && data.value.lineData.length > 0 ? data.value.lineData[0] : [];
    const lineData1 =
      data.value.lineData && data.value.lineData.length > 1 ? data.value.lineData[1] : [];
    const barName0 = name.value?.length > 0 && name.value[0][0] ? name.value[0][0] : '';
    const barName1 = name.value?.length > 0 && name.value[0][1] ? name.value[0][1] : '';
    const barName2 = name.value?.length > 0 && name.value[0][2] ? name.value[0][2] : '';
    const lineName0 = name.value?.length > 1 && name.value[1][0] ? name.value[1][0] : '';
    const lineName1 = name.value?.length > 1 && name.value[1][1] ? name.value[1][1] : '';

    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
        backgroundColor: props.tipsBgColor ? props.tipsBgColor : 'rgb(50,175,255, 15%)',
        textStyle: {
          color: props.tipsTextColor ? props.tipsTextColor : '#fff', //设置文字颜色
        },
        borderColor: 'transparent',
      },
      xAxis: [
        {
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
            color: props.txtColor, // 设置文本颜色
            fontSize: 14, // 设置字体大小
            fontFamily: 'Arial', // 设置字体样式
            interval: props.xAxisLabelInterval,
            rotate: props.rotate,
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: props.ybgcolor, // 设置Y轴刻度线颜色
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
              color: props.txtColor, //坐标轴线线的颜色
              width: '0.1', //坐标轴线线宽
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          show: data.value.barData && data.value.barData.length > 0,
          name: '',
          axisLabel: {
            color: props.txtColor, // 设置文本颜色
            fontSize: 14, // 设置字体大小
            fontFamily: 'Arial', // 设置字体样式
          },
          splitLine: {
            show: true, // 控制网格线显示与隐藏
            lineStyle: {
              color: props.ybgcolor, // 设置Y轴刻度线颜色
            },
          },
          axisLine: {
            show: ' ', //是否显示坐标轴轴线
            onZero: ' ', //X 轴或者 Y 轴的轴线是否在另一个轴的 0 刻度
            onZeroAxisIndex: '12', //当有双轴时，可以用这个属性手动指定，在哪个轴的 0 刻度上
            symbol: ['none', 'none'], //轴线两边的箭头
            symbolSize: [10, 10], //轴线两边的箭头的大小，第一个数字表示宽度（垂直坐标轴方向），第二个数字表示高度（平行坐标轴方向）
            lineStyle: {
              color: props.txtColor, //坐标轴线线的颜色
              width: '0.2', //坐标轴线线宽
            },
          },
        },
        {
          type: 'value',
          splitLine: {
            show: false,
          },
          axisLabel: {
            color: props.txtColor, // 设置文本颜色
            fontSize: 14, // 设置字体大小
            fontFamily: 'Arial', // 设置字体样式
          },
          axisLine: {
            show: !(data.value.barData && data.value.barData.length > 0),
            lineStyle: {
              color: props.txtColor, //坐标轴线线的颜色
              width: '0.2', //坐标轴线线宽
            },
          },
          position: data.value.barData && data.value.barData.length > 0 ? 'right' : 'left',
        },
      ],
      series: [
        {
          name: barName0,
          type: 'bar',
          tooltip: {
            valueFormatter: function (value) {
              return value;
            },
          },
          data: barData0, // 使用传入的数据
          shading: 'lambert',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colors.value[0][1] },
              { offset: 1, color: `${colors.value[0][0]}` },
            ]),
          },
          barMaxWidth: 20,
          barWidth: props.barWidth, // 设置柱子的宽度，可以根据需要调整
        },
        {
          name: barName1,
          type: 'bar',
          tooltip: {
            valueFormatter: function (value) {
              return value;
            },
          },
          data: barData1, // 使用传入的数据
          shading: 'lambert',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colors.value[1][1] },
              { offset: 1, color: `${colors.value[1][0]}` },
            ]),
          },
          barMaxWidth: 20,
          barWidth: props.barWidth, // 设置柱子的宽度，可以根据需要调整
        },
        {
          name: barName2,
          type: 'bar',
          tooltip: {
            valueFormatter: function (value) {
              return value;
            },
          },
          data: barData2, // 使用传入的数据
          shading: 'lambert',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colors.value[2][1] },
              { offset: 1, color: `${colors.value[2][0]}` },
            ]),
          },
          barMaxWidth: 20,
          barWidth: props.barWidth, // 设置柱子的宽度，可以根据需要调整
        },
        {
          name: lineName0,
          type: 'line',
          yAxisIndex: 1,
          color: colors.value[3],
          tooltip: {
            valueFormatter: function (value) {
              return value;
            },
          },
          lineStyle: {
            width: 2,
            color: colors.value[3],
          },
          data: lineData0, // 使用传入的数据
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `${colors.value[3]}30` },
              { offset: 1, color: `${colors.value[3]}10` },
            ]),
          },
        },
        {
          name: lineName1,
          type: 'line',
          yAxisIndex: 1,
          color: colors.value[4],
          tooltip: {
            valueFormatter: function (value) {
              return value;
            },
          },
          lineStyle: {
            width: 2,
            color: colors.value[4],
          },
          data: lineData1, // 使用传入的数据
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `${colors.value[4]}30` },
              { offset: 1, color: `${colors.value[4]}10` },
            ]),
          },
        },
      ],
      grid: {
        containLabel: true,
        top: '30%',
        left: '1%',
        right: '1%',
        bottom: '6%',
      },
      legend: {
        show: true,
        x: 'right',
        y: '10%',
        textStyle: {
          color: props.txtColor,
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

  // 创建地图并绘制点位
  onMounted(() => {
    createChart();
    nextTick(() => {
      const chartDom = document.getElementById('echarts-linebar-container' + random);
      const myChart = echarts?.getInstanceByDom(chartDom);
      myChart?.getZr().on('click', (params) => {
        const pointInPixel = [params.offsetX, params.offsetY];
        const pointInGrid = myChart.convertFromPixel({ seriesIndex: 0 }, pointInPixel);
        const index = pointInGrid[0];
        const data = props.data.barData[0][index];
        emit('clickItem', { data, index });
        emit('click', { data, index });
      });
    });
  });

  watch(
    () => props.height,
    () => {
      setTimeout(() => {
        const chartDom = document.getElementById('echarts-linebar-container' + random);
        const myChart = echarts?.getInstanceByDom(chartDom);
        myChart?.resize();
      }, 100);
    },
  );
</script>
<style>
  .echarts-linebar-container {
    width: 100%;
  }
</style>
