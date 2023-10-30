<template>
  <div
    :id="props.mapID"
    :style="`width: ${props.width}px; height: ${props.height}px;`"
    class="echarts-emap-china-container"
  ></div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import * as echarts from 'echarts';
  import 'echarts/extension/bmap/bmap';
  import { getChinaJsonData } from '@/api/echarts/map';

  // 定义属性，包括新的点位数据属性
  const props = defineProps({
    mapID: { type: String, default: 'echarts-emap-china-container' },
    data: { type: Array, default: [] as any },
    title: { type: String, default: '中国行政区域图' },
    width: { type: Number, default: 600 },
    height: { type: Number, default: 500 },
    zoom: { type: Number, default: 1.0 },
    offset: { type: Number, default: 100 },
    colors: {
      type: Array,
      default: ['#7DABCC', '#5280BD', '#2765AE', '#004B9F', '#00418A', '#003775'] as any[],
    },
  });

  const option = ref({});

  // 创建地图并绘制点位
  onMounted(() => {
    createChart();
  });

  //将data数据进入方法，取需要的参数； 用于气泡显示
  const convertData = function (data, geoCoordMap) {
    var res: any[] = [];
    data.forEach((item) => {
      // 获取当前省份的经纬度坐标
      let geoCoord = geoCoordMap[item.name];
      if (geoCoord) {
        const name = item.name;
        const value = geoCoord.concat(item.value);
        const element = { name, value };
        res.push(element as any);
      }
    });
    return res;
  };

  // 创建 ECharts 图表
  const createChart = async () => {
    const chartDom = document.getElementById(props.mapID);
    const myChart = echarts.init(chartDom);
    const geoCoordMap = {};
    const chinaJsonData = await getChinaJsonData();
    echarts.registerMap('china', chinaJsonData, {});

    const mapFeatures = chinaJsonData.features;
    // 遍历获取每个地区的经纬度
    mapFeatures.forEach(function (v, i) {
      // 获取当前地区名
      let name = v.properties.name;
      if (name) {
        // 获取当前地区的经纬度
        geoCoordMap[name] = v.properties.center;
      }
    });

    const sdData = convertData(props.data, geoCoordMap);
    option.value = {
      geo: {
        show: true,
        top: props.offset,
        map: 'china',
        label: {
          normal: {
            show: false,
          },
          emphasis: {
            show: false,
            color: '#fff',
          },
        },
        roam: true,
        itemStyle: {
          normal: {
            areaColor: 'blue',
            borderColor: '#fff',
          },
          emphasis: {
            areaColor: 'blue',
          },
        },
        zoom: props.zoom,
      },
      title: {
        text: props.title,
        left: 'right',
      },
      tooltip: {
        trigger: 'item',
        showDelay: 0,
        transitionDuration: 0.2,
        formatter: function (params) {
          const value = params?.data?.value?.length > 2 ? '数据：' + params.data.value[2] : '';
          return '行政区域：' + params.name + '<br />' + value;
        },
      },
      visualMap: {
        bottom: 50,
        right: 30,
        min: 0,
        max: 5000,
        inRange: {
          color: props.colors,
        },
        calculable: false,
        show: false,
      },
      series: [
        {
          name: 'china', // 自定义名称
          type: 'effectScatter', // scatter  effectScatter
          coordinateSystem: 'geo', // 设置坐标系类型
          data: sdData, // 设置散点位置和数据
          symbolSize: function (val) {
            let value = val[2];
            if (value == 0) {
              return 0;
            } else if (value < 500) {
              return 10;
            } else if (value < 1000) {
              return 12.5;
            } else if (value < 1500) {
              return 15;
            } else {
              return 20;
            }
          },
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke',
          },
          zoom: props.zoom,
          hoverAnimation: true, // 是否显示鼠标悬浮动画
          label: {
            // 静态显示时的样式
            normal: {
              show: true, // 显示地区名称
              formatter: function (data) {
                const value = data.value[2];
                if (value == 0) {
                  return '';
                } else {
                  return value;
                }
              },
              position: 'bottom', // 显示位置
            },
          },
          itemStyle: {
            normal: {
              color: function (res) {
                let value = res.value[2];
                if (value < 500) {
                  return '#ff3859';
                } else if (value < 1000) {
                  return '#4ed7fa';
                } else if (value < 1500) {
                  return '#fac531';
                } else {
                  return '#01ff5b';
                }
              },
              shadowBlur: 10,
            },
            // 鼠标悬浮上去的样式
            emphasis: {
              color: '#4ed7fa',
              formatter: function (data) {
                return data.value[2];
              },
            },
          },
          zlevel: 3,
        },
        {
          top: props.offset,
          name: '中国地图',
          type: 'map',
          mapType: 'china',
          roam: true,
          emphasis: {
            label: {
              show: true,
            },
          },
          zoom: props.zoom,
          data: props.data as any[],
        },
      ],
    };

    myChart.setOption(option.value);
  };
</script>

<style lang="less" scoped>
  .echarts-emap-china-container {
    background: transparent;
    :deep(.anchorBL) {
      display: none;
    }
  }
</style>
