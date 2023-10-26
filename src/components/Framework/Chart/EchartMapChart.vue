<template>
  <div
    :id="props.mapID"
    :style="`width: ${props.width}px; height: ${props.height}px;`"
    class="echarts-emap-container"
  ></div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch } from 'vue';
  import * as echarts from 'echarts';
  import 'echarts/extension/bmap/bmap';
  import { GeoCoordData } from '@/utils/constants';

  // 定义属性
  const props = defineProps({
    mapID: { type: String, default: 'echarts-emap-container' },
    data: { type: Array, default: [] as any },
    geo: { type: Object, default: GeoCoordData as Object },
    width: { type: Number, default: 1000 },
    height: { type: Number, default: 800 },
  });

  // 创建柱状图和折线图
  onMounted(() => {
    createChart();
  });

  // 创建 ECharts 图表
  function createChart() {
    updateChart();
    removeElement(`.echarts-emap-container .anchorBL`);
  }

  // 删除指定类名的元素
  function removeElement(className: string, timestamp: number = 300) {
    setTimeout(() => {
      const elements = document.querySelectorAll(className); // 获取所有包含指定类名的元素
      elements.forEach((element) => {
        element.remove(); // 从 DOM 中删除每个匹配的元素
      });
    }, timestamp);
  }

  // 更新图表数据
  function updateChart() {
    const chartDom = document.getElementById(props.mapID);
    var myChart = echarts.init(chartDom, null, {
      useDirtyRect: true,
    });
    var option;
    var data = props.data;
    var geoCoordMap = props.geo;
    var convertData = function (data) {
      var res = [];
      for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].value),
          });
        }
      }
      return res;
    };
    option = {
      title: {
        text: '全国主要城市空气质量',
        subtext: 'data from PM25.in',
        sublink: 'http://www.pm25.in',
        left: 'center',
        textStyle: {
          color: '#fff',
        },
      },
      bmap: {
        center: [104.114129, 37.550339],
        zoom: 10,
        roam: true,
        mapStyle: {
          styleJson: [
            {
              featureType: 'water',
              elementType: 'all',
              stylers: {
                color: '#044161',
              },
            },
            {
              featureType: 'land',
              elementType: 'all',
              stylers: {
                color: '#004981',
              },
            },
            {
              featureType: 'boundary',
              elementType: 'geometry',
              stylers: {
                color: '#064f85',
              },
            },
            {
              featureType: 'railway',
              elementType: 'all',
              stylers: {
                visibility: 'off',
              },
            },
            {
              featureType: 'highway',
              elementType: 'geometry',
              stylers: {
                color: '#004981',
              },
            },
            {
              featureType: 'highway',
              elementType: 'geometry.fill',
              stylers: {
                color: '#005b96',
                lightness: 1,
              },
            },
            {
              featureType: 'highway',
              elementType: 'labels',
              stylers: {
                visibility: 'off',
              },
            },
            {
              featureType: 'arterial',
              elementType: 'geometry',
              stylers: {
                color: '#004981',
              },
            },
            {
              featureType: 'arterial',
              elementType: 'geometry.fill',
              stylers: {
                color: '#00508b',
              },
            },
            {
              featureType: 'poi',
              elementType: 'all',
              stylers: {
                visibility: 'off',
              },
            },
            {
              featureType: 'green',
              elementType: 'all',
              stylers: {
                color: '#056197',
                visibility: 'off',
              },
            },
            {
              featureType: 'subway',
              elementType: 'all',
              stylers: {
                visibility: 'off',
              },
            },
            {
              featureType: 'manmade',
              elementType: 'all',
              stylers: {
                visibility: 'off',
              },
            },
            {
              featureType: 'local',
              elementType: 'all',
              stylers: {
                visibility: 'off',
              },
            },
            {
              featureType: 'arterial',
              elementType: 'labels',
              stylers: {
                visibility: 'off',
              },
            },
            {
              featureType: 'boundary',
              elementType: 'geometry.fill',
              stylers: {
                color: '#029fd4',
              },
            },
            {
              featureType: 'building',
              elementType: 'all',
              stylers: {
                color: '#1a5787',
              },
            },
            {
              featureType: 'label',
              elementType: 'all',
              stylers: {
                visibility: 'off',
              },
            },
          ],
        },
      },
      series: [
        {
          name: 'pm2.5',
          type: 'scatter',
          coordinateSystem: 'bmap',
          data: convertData(data),
          encode: {
            value: 2,
          },
          symbolSize: function (val) {
            return val[2] / 10;
          },
          label: {
            formatter: '{b}',
            position: 'right',
          },
          itemStyle: {
            color: '#ddb926',
          },
          emphasis: {
            label: {
              show: true,
            },
          },
        },
        {
          name: 'Top 5',
          type: 'effectScatter',
          coordinateSystem: 'bmap',
          data: convertData(
            data
              .sort(function (a, b) {
                return b.value - a.value;
              })
              .slice(0, 6),
          ),
          encode: {
            value: 2,
          },
          symbolSize: function (val) {
            return val[2] / 10;
          },
          showEffectOn: 'emphasis',
          rippleEffect: {
            brushType: 'stroke',
          },
          hoverAnimation: true,
          label: {
            formatter: '{b}',
            position: 'right',
            show: true,
          },
          itemStyle: {
            color: '#f4e925',
            shadowBlur: 10,
            shadowColor: '#333',
          },
          zlevel: 1,
        },
      ],
    };

    option && myChart.setOption(option);
  }
</script>

<style lang="less" scoped>
  .echarts-emap-container {
    :deep(.anchorBL) {
      display: none;
    }
  }
</style>
