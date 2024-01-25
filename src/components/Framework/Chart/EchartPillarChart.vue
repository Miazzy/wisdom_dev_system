<!--
 * @Description: 发电统计柱状图
 * @Date: 2023-02-08
 * @FilePath: \web\src\components\common\powerPillarChart.vue
-->
<template>
  <div :style="`width:${typeof props.width == 'number' ? props.width + 'px' : props.width}; height:${typeof props.height == 'number' ? props.height + 'px' : props.height};`">
    <div
      :id="`chart-pillar-container${random}`"
      :style="`width:${typeof props.width == 'number' ? props.width + 'px' : props.width}; height:${typeof props.height == 'number' ? props.height + 'px' : props.height};`"
    ></div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted, onUnmounted, watch } from 'vue';
  import * as echarts from 'echarts';

  const random = parseInt(Math.random() * 10000000);
  // 定义属性
  const props = defineProps({
    data: { type: Array },
    width: { type: [Number, String], default: 600 },
    height: { type: [Number, String], default: 300 },
    colors: {
      type: Array,
      default: [
        ['#488FF6', '#60D1F3'],
        ['#E59837', '#FAE895'],
        ['#078C5D', '#68E4B8'],
      ] as any[],
    },
    name: { type: Array, default: [] },
    legendData: { type: Array },
  });

  // 设置柱和折线的颜色
  const barColor = props.colors?.[0]?.length === 2 ? props.colors[0] : ['#488FF6', '#60D1F3'];
  const lineColor1 = props.colors?.[1]?.length === 2 ? props.colors[1] : ['#E59837', '#FAE895'];
  const lineColor2 = props.colors?.[2]?.length === 2 ? props.colors[2] : ['#078C5D', '#68E4B8'];

  const barData = ref([]);
  const categories = ref([]);
  const lineData = ref([]);
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
      backgroundColor: `${barColor[0]}32`,
      borderColor: 'transparent',
      appendToBody: true,
      formatter: function (params) {
        const units = props.data.units;
        const name = props.name;
        const first = params?.length > 0&&(params[0].value||params[0].value===0) ? `${name[0]}：${params[0].value} ${units[0]}` : '';
        try {
          const second = params?.length > 2&&(params[2].value||params[2].value===0) ? `<br /> ${name[1]}：${params[2].value} ${units[1]}` : '';
          const third = params?.length > 3&&(params[3].value||params[3].value===0) ? `<br /> ${name[2]}：${params[3].value} ${units[2]}` : '';
          return first + second + third;
        } catch (e) {
          return first;
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
    },
    series: [
      {
        data: [],
        type: 'custom',
        showBackground: true,
        name: props.name.length ? props.name[0] : null,
        color: new echarts.graphic.LinearGradient(
          0,
          1,
          0,
          0,
          [
            { offset: 0, color: barColor[0] },
            { offset: 1, color: barColor[1] },
          ],
          false,
        ),
        backgroundStyle: {
          width: '100%',
          color: `${barColor[0]}15`,
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
                  color: `${barColor[0]}15`,
                },
                style: {
                  fill: `${barColor[0]}95`,
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
                  fill: `${barColor[0]}40`,
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
                  fill: `${barColor[0]}70`,
                },
              },
            ],
          };
        },
        itemStyle: {
          // 每根柱子颜色设置
          color: function (params) {
            const colorList = [
              new echarts.graphic.LinearGradient(
                0,
                1,
                0,
                0,
                [
                  { offset: 0, color: barColor[1] },
                  { offset: 1, color: barColor[0] },
                ],
                false,
              ),
            ];
            return colorList[0];
          },
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: barColor[1],
            },
            {
              offset: 1,
              color: barColor[0],
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
          color: `${barColor[0]}10`,
        },
        itemStyle: {
          // 每根柱子颜色设置
          color: function (params) {
            const colorList = [
              new echarts.graphic.LinearGradient(
                0,
                1,
                0,
                0,
                [
                  { offset: 0, color: barColor[0] },
                  { offset: 1, color: barColor[1] },
                ],
                false,
              ),
            ];
            return colorList[0];
          },
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: barColor[0],
            },
            {
              offset: 1,
              color: barColor[1],
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
      {
        // 新增的折线图配置
        data: [],
        type: 'line',
        name: props.name.length ? props.name[1] : null,
        color: new echarts.graphic.LinearGradient(
          0,
          1,
          0,
          0,
          [
            { offset: 0, color: lineColor1[0] },
            { offset: 1, color: lineColor1[1] },
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
              { offset: 0, color: lineColor1[0] },
              { offset: 1, color: lineColor1[1] },
            ],
            false,
          ),
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: `${lineColor1[0]}30` },
            { offset: 1, color: `${lineColor1[1]}10` },
          ]),
        },
      },
      {
        // 新增的折线图配置
        data: [],
        type: 'line',
        name: props.name.length ? props.name[2] : null,
        color: new echarts.graphic.LinearGradient(
          0,
          1,
          0,
          0,
          [
            { offset: 0, color: lineColor2[0] },
            { offset: 1, color: lineColor2[1] },
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
              { offset: 0, color: lineColor2[0] },
              { offset: 1, color: lineColor2[1] },
            ],
            false,
          ),
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: `${lineColor2[0]}30` },
            { offset: 1, color: `${lineColor2[1]}10` },
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
        color: 'rgba(255, 255, 255, 0.6)',
      },
      itemWidth: 14,
      itemHeight: 10,
      // icon: 'rect'
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
    const chartDom = document.getElementById('chart-pillar-container' + random);
    let myChart = echarts.getInstanceByDom(chartDom);
    if (myChart == undefined) {
      myChart = echarts.init(chartDom);
    }

    // 获取统计数据
    barData.value = props.data.barData;
    categories.value = props.data.categories;
    lineData.value = props.data.lineData;

    // 设置统计数据
    try {
      pillarOption.value.xAxis.data = categories.value;
      pillarOption.value.series[0].data = barData.value;
      pillarOption.value.series[1].data = barData.value;
      pillarOption.value.series[2].data = lineData.value?.length > 0 ? lineData.value[0] : [];
      pillarOption.value.series[3].data = lineData.value?.length > 1 ? lineData.value[1] : [];
      myChart.setOption(pillarOption.value, true);
    } catch (error) {
      console.error(error);
    }
  };

  watch(
    () => props.data,
    () => {
      setupData();
    },
    {
      deep: true,
    },
  );

  onMounted(() => {
    setupBarShape();
    setupData();
  });
  onUnmounted(() => {});
</script>
<style lang="less" scoped>
  #chart-pillar-container {
    z-index: 10000;
    transform: scaleX(0.85);
    transform-origin: left;
    background: rgb(30 30 30 / 2%);
    text-align: center;
  }
</style>
