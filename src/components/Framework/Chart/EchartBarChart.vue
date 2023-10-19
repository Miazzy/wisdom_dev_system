<template>
  <div
    class="echarts-container"
    :style="`width: ${props.width}px; height: ${props.height}px;`"
  ></div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch, toRefs } from 'vue';
  import * as echarts from 'echarts';
  import 'echarts-gl'; // 引入 ECharts 的 3D 图表库

  // 定义属性
  const props = defineProps({
    data: Array,
    width: Number,
    height: Number,
    colors: Array,
    legendData: Array,
  });

  // 将 props 解构
  const { data, colors, legendData } = toRefs(props);

  // 创建一个 ref 来存储图表实例
  const chart = ref(null);

  // 监听数据变化
  watch(data, () => {
    if (chart.value) {
      updateChart();
    }
  });

  // 创建柱状图和折线图
  onMounted(() => {
    createChart();
    setupBarShape();
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

  // 创建 ECharts 图表
  function createChart() {
    chart.value = echarts.init(document.querySelector('.echarts-container'));
    updateChart();
  }

  // 更新图表数据
  function updateChart() {
    if (!chart.value) {
      return;
    }
    const barSeries = data.value.barData.map((series, i) => ({
      type: 'bar', // 使用 3D 柱状图
      name: legendData.value[i],
      data: series.data,
      shading: 'lambert', // 设置阴影类型
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: colors.value[i] },
          { offset: 1, color: `${colors.value[i]}50` },
        ]),
      },
    }));
    // 构建折线图数据
    const lineSeries = data.value.lineData.map((series, i) => ({
      type: 'line',
      name: legendData.value[i],
      data: series.data,
    }));
    // 创建 ECharts 配置
    const options = {
      legend: {
        data: legendData.value,
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
          return '<br/>' + params[0].value + '<br/>';
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
      xAxis: {
        type: 'category',
        data: data.value.categories,
      },
      yAxis: {
        type: 'value',
      },
      series: [...barSeries, ...lineSeries],
    };

    // 设置图表配置
    chart.value.setOption(options);
  }
</script>

<style>
  .echarts-container {
    width: 100%;
    height: 400px;
  }
</style>
