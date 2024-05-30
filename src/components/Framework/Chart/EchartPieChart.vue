<template>
  <div :class="{'flex-layout': legendPosition==='right'}">
    <div :id="props.id" ref="chart"
      :style="`width: ${typeof props.width == 'number' ? props.width + 'px' : props.width}; height: ${typeof props.height == 'number' ? props.height + 'px' : props.height};`"></div>
  </div>
</template>

<script lang="ts" setup>
  import * as echarts from 'echarts';
  import { onMounted, watch, PropType, nextTick, ref } from 'vue';

  const props = defineProps({
    width: { type: [Number, String], default: 600 },
    height: { type: [Number, String], default: 300 },
    data: Array,
    id: { type: String },
    showLabel: { type: Boolean, default: false }, // 是否显示饼图图形旁边的文字标签
    roseType: { type: [String, Boolean], default: 'radius' }, // 是否展示成南丁格尔图，通过半径区分数据大小 radius/area
    radius: { type: Array as PropType<Array<number | string>>, default: [30, 100] },
    labelFormatter: { type: [String, Function], default: '{b}: {c}' },
    showLegend: { type: Boolean, default: false }, // 是否显示图例
    legendOptions: { type: Object, default: {} }, // 图例配置
    pieCenter: { type: Array as PropType<Array<number | string>>, default: ['50%', '50%'] }, // 饼图中心位置
  });

  const emit = defineEmits(['clickItem']);

  const colors = ['#0380FF', '#8FD0F4', '#697898', '#4ADECA', '#F5CC6B'];

  const setupData = () => {
    const chartDom = document.getElementById(props.id);
    let myChart = echarts.getInstanceByDom(chartDom);
    if (myChart == undefined) {
      myChart = echarts.init(chartDom);
    }
    const option = {
      color: colors,
      legend: {
        show: props.showLegend,
        bottom: '6%',
        left: 'center',
        orient: 'horizontal',
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: {
          color: 'rgba(255,255,255,0.6)',
          fontSize: 10,
          height: 10,
          lineHeight: 10,
          rich: {},
          padding: [4,0,0,0]
        },
        ...props.legendOptions
      },
      tooltip: {
        show: true,
        textStyle: {
          color: '#fff',
        },
        backgroundColor: 'rgb(50,175,255, 15%)',
        borderColor: 'transparent',
        formatter: '{b}: {c}',
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
          name: '',
          type: 'pie',
          radius: props.radius,
          center: props.pieCenter,
          roseType: props.roseType,
          itemStyle: {
            borderRadius: 0,
          },
          data: props.data,
          label: {
            show: props.showLabel,
            formatter: props.labelFormatter,
            overflow: 'break',
            textBorderType: 'none',
            color: '#BAC3C4',
          },
        },
      ],
    };
    option && myChart.setOption(option);
  };

  watch(
    () => props.data,
    (newData) => {
      setupData();
    },
    {
      deep: true,
    },
  );

  watch(
    () => props.height,
    () => {
      setTimeout(() => {
        const chartDom = document.getElementById(props.id);
        let myChart = echarts?.getInstanceByDom(chartDom);
        myChart?.resize();
      }, 100);
    },
  );

  onMounted(() => {
    setupData();
    nextTick(() => {
      const chartDom = document.getElementById(props.id);
      let myChart = echarts.getInstanceByDom(chartDom);
      myChart.on('click', (params) => {
        emit('clickItem', params);
      });
    });
  });
</script>
<style lang="less" scoped>
  .flex-layout {
    display: flex;
    align-items: center;
    width: 100%;
    .right-legend-box {
      padding-left: 0.1rem;
      flex: 1;
      .legend-list {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 0;
        .legend-item {
          width: 50%;
          display: flex;
          .item-left {
            font-size: 0.12rem;
            .dot-icon {
              display: inline-block;
              width: 0.1rem;
              height: 0.1rem;
              border-radius: 50%;
              margin-right: 0.12rem;
            }
          }
          .item-right {
            .name {
              font-size: 0.12rem;
              color: rgba(255, 255, 255, 0.6);
            }
            .value {
              font-size: 0.14rem;
              color: #fff;
            }
          }
        }
      }
    }
  }
</style>