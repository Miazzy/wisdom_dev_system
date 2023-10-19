<!--
 * @Description: 发电统计柱状图
 * @Date: 2023-02-08
 * @FilePath: \web\src\components\common\powerPillarChart.vue
-->
<template>
  <div :style="`width:${width}px; height:${height}px;`">
    <div
      id="chart-pillar-container"
      :style="`width:${props.width}px; height:${props.height}px;`"
    ></div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted, watch, toRefs, onUnmounted } from 'vue';
  import * as echarts from 'echarts';
  import 'echarts-gl'; // 引入 ECharts 的 3D 图表库

  // 定义属性
  const props = defineProps({
    data: { type: Array },
    width: { type: Number, default: 400 },
    height: { type: Number, default: 240 },
    colors: { type: Array },
    name: { type: Array },
    legendData: { type: Array },
  });

  const mData = ref([]);
  const mName = ref([]);
  const pillarOption = ref({
    backgroundColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      {
        offset: 0,
        color: 'rgba(255,255,255,0.01)',
      },
      {
        offset: 0.4,
        color: 'rgba(255,255,255,0.01)',
      },
      {
        offset: 0.6,
        color: 'rgba(255,255,255,0.01)',
      },
      {
        offset: 1,
        color: 'rgba(255,255,255,0.01)',
      },
    ]),
    xAxis: {
      type: 'category',
      nameTextStyle: {
        color: '#888888', //  字体颜色
        fontSize: 26, //  字体大小
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
      axisLine: {
        //坐标轴轴线相关设置
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
      data: [],
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: true, //网格线
        lineStyle: {
          color: 'rgba(170, 221, 255, .8)', //坐标轴线线的颜色
          width: '0.1', //坐标轴线线宽
        },
      },
      axisLine: {
        //坐标轴轴线相关设置
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
    tooltip: {
      trigger: 'axis',
      align: 'left',
      textStyle: {
        color: 'white', //设置文字颜色
      },
      extraCssText: '100px;',
      backgroundColor: 'rgba(2, 175, 252, 0.5)',
      borderColor: 'transparent',
      appendToBody: true,
      formatter: function (params) {
        return params[0].value + '单位';
      },
      position: function (point, params, dom, rect, size) {
        var x = 0; // x坐标位置
        var y = 0; // y坐标位置
        // 当前鼠标位置
        var pointX = point[0];
        var pointY = point[1];
        // 提示框大小
        var boxWidth = size.contentSize[0];
        var boxHeight = size.contentSize[1];
        // boxWidth > pointX 说明鼠标左边放不下提示框
        if (boxWidth > pointX) {
          x = pointX + 10;
        } else {
          // 左边放的下
          x = pointX - boxWidth - 10;
        }
        // boxHeight > pointY 说明鼠标上边放不下提示框
        if (boxHeight > pointY) {
          y = 5;
        } else {
          // 上边放得下
          y = pointY - boxHeight;
        }
        return [x, y];
      },
    },
    series: [
      {
        data: [],
        type: 'custom',
        showBackground: true,
        backgroundStyle: {
          width: '100%',
          color: 'rgba(2, 175, 252, 0.14)',
        },
        renderItem: function (params, api) {
          const location = api.coord([api.value(0), api.value(1)]);
          return {
            type: 'group',
            children: [
              {
                type: 'positiveShape',
                shape: {
                  api,
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0]),
                },
                backgroundStyle: {
                  width: '100%',
                  color: 'rgba(2, 175, 252, 0.14)',
                },
                style: {
                  fill: 'rgba(2, 175, 252, 0.95)',
                },
              },
              {
                type: 'rightShape',
                shape: {
                  api,
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0]),
                },
                style: {
                  fill: 'rgba(1, 188, 224, .4)',
                },
              },
              {
                // 顶部
                type: 'topShape',
                shape: {
                  api,
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0]),
                },
                style: {
                  fill: 'rgba(1, 181, 216, .7)',
                },
              },
            ],
          };
        },
        itemStyle: {
          normal: {
            // 每根柱子颜色设置
            color: function (params) {
              const colorList = [
                new echarts.graphic.LinearGradient(
                  0,
                  1,
                  0,
                  0,
                  [
                    { offset: 0, color: '#00F8FE' },
                    { offset: 1, color: '#008BFC' },
                  ],
                  false,
                ),
              ];
              return colorList[0];
            },
          },
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#00F8FE',
            },
            {
              offset: 1,
              color: '#008BFC',
            },
          ]),
        },
      },
      {
        data: [],
        type: 'bar',
        showBackground: true,
        barWidth: 19.15,
        backgroundStyle: {
          width: '100%',
          color: 'rgba(2, 175, 252, 0.08)',
        },
        itemStyle: {
          normal: {
            // 每根柱子颜色设置
            color: function (params) {
              const colorList = [
                new echarts.graphic.LinearGradient(
                  0,
                  1,
                  0,
                  0,
                  [
                    { offset: 0, color: '#008BFC' },
                    { offset: 1, color: '#00F8FE' },
                  ],
                  false,
                ),
              ];
              return colorList[0];
            },
          },
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#008BFC',
            },
            {
              offset: 1,
              color: '#00F8FE',
            },
          ]),
        },
        label: {
          show: true,
          position: 'top',
          formatter: (value) => {
            value.value = value.value;
            value.data = value.data;
            return value.value == '0.00' ? '' : `${value.value}`;
          },
          color: '#FFD200',
        },
      },
    ],
    grid: {
      containLabel: true,
      top: '30%',
      left: '1%',
      right: '7%',
      bottom: '6%',
    },
  });

  // 查询初始化信息函数
  const setupBarShape = async () => {
    // 绘制正侧面
    const positiveShape = echarts.graphic.extendShape({
      shape: {
        x: 0,
        y: 0,
      },
      buildPath: function (ctx, shape) {
        const xAxisPoint = shape.xAxisPoint;
        ctx.moveTo(shape.x + 10.7, shape.y); //右上
        ctx.lineTo(shape.x - 10.7, shape.y); //左上
        ctx.lineTo(xAxisPoint[0] - 10.7, xAxisPoint[1]); //左下
        ctx.lineTo(xAxisPoint[0] + 10.7, xAxisPoint[1]); //右下
        ctx.closePath();
      },
    });

    // 绘制右侧面
    const rightShape = echarts.graphic.extendShape({
      shape: {
        x: 0,
        y: 0,
      },
      buildPath: function (ctx, shape) {
        const xAxisPoint = shape.xAxisPoint;
        ctx.moveTo(shape.x + 12.55, shape.y - 7.7); // 右上
        ctx.lineTo(shape.x + 10.7, shape.y);
        ctx.lineTo(xAxisPoint[0] + 10.7, xAxisPoint[1]);
        ctx.lineTo(xAxisPoint[0] + 12.55, xAxisPoint[1] - 7.7); //右下
        ctx.closePath();
      },
    });

    // 绘制顶部
    const topShape = echarts.graphic.extendShape({
      shape: {
        x: 0,
        y: 0,
      },
      buildPath: function (ctx, shape) {
        ctx.moveTo(shape.x + 10.7, shape.y); //右下
        ctx.lineTo(shape.x + 13.05, shape.y - 7.9); //右上
        ctx.lineTo(shape.x - 8.9, shape.y - 7.9); //左上
        ctx.lineTo(shape.x - 10.7, shape.y); //左下
        ctx.closePath();
      },
    });

    // 注册三个面图形
    echarts.graphic.registerShape('positiveShape', positiveShape);
    echarts.graphic.registerShape('rightShape', rightShape);
    echarts.graphic.registerShape('topShape', topShape);
  };

  // 获取发电统计数据
  const setupData = async () => {
    const chartDom = document.getElementById('chart-pillar-container');
    const myChart = echarts.init(chartDom);

    // 获取统计数据
    mData.value = props.data.mData;
    mName.value = props.data.mName;

    // 设置统计数据
    try {
      pillarOption.value.xAxis.data = mName.value;
      pillarOption.value.series[0].data = mData.value;
      pillarOption.value.series[1].data = mData.value;
      myChart.setOption(pillarOption.value, true);
    } catch (error) {
      console.error(error);
    }
  };

  onMounted(() => {
    setupBarShape();
    setupData();
  });
  onUnmounted(() => {});
</script>
<style lang="less" scoped>
  #chart-pillar-container {
    transform: scaleX(0.85);
    transform-origin: left;
    z-index: 10000;
    background: rgba(30, 30, 30, 0.15);
    text-align: center;
  }
</style>
