<template>
  <div v-show="!noData" :id="props.id" ref="chart"
    :style="`width: ${typeof props.width == 'number' ? props.width + 'px' : props.width}; height: ${typeof props.height == 'number' ? props.height + 'px' : props.height};`"></div>
  <div v-if="noData" :style="`width: ${typeof props.width == 'number' ? props.width + 'px' : props.width}; height: ${typeof props.height == 'number' ? props.height + 'px' : props.height};`">
    <NoData />
  </div>
</template>

<script lang="ts" setup>
  import * as echarts from 'echarts';
  import { onMounted, watch, PropType, nextTick, computed } from 'vue';
  import NoData from '/@/components/Framework/Chart/NoData.vue';

  const props = defineProps({
    width: { type: [Number, String], default: 600 },
    height: { type: [Number, String], default: 300 },
    data: Array,
    id: { type: String },
    showLabel: { type: Boolean, default: false }, // 是否显示饼图图形旁边的文字标签
    roseType: { type: [String, Boolean], default: 'radius' }, // 是否展示成南丁格尔图，通过半径区分数据大小 radius/area
    radius: { type: Array as PropType<Array<number | string>>, default: [30, 100] },
    labelFormatter: { type: [String, Function], default: '{b}: {c}' },
    colors: { type: Array, default: ['#0380FF', '#8FD0F4', '#697898', '#4ADECA', '#F5CC6B'] }, // 饼图颜色
  });

  const emit = defineEmits(['clickItem']);

  const noData = computed(() => {
    if (props.data?.length) {
      return false;
    } else {
      return true;
    }
  })

  const setupData = () => {
    const chartDom = document.getElementById(props.id);
    let myChart = echarts.getInstanceByDom(chartDom);
    if (myChart == undefined) {
      myChart = echarts.init(chartDom);
    }
    const option = {
      color: props.colors,
      legend: {
        show: false,
      },
      series: [
        {
          name: 'Nightingale Chart',
          type: 'pie',
          radius: props.radius,
          center: ['50%', '50%'],
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
    () => {
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
