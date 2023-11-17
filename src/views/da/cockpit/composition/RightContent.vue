<template>
  <div class="right-content">
    <div class="content-top">
      <SubtitleBar :subtitle="`合同统计`" />
      <div class="donut-chart-layout" style="">
        <DonutChart class="chart" :data="donutData" width="300" height="200" radius="100" />
      </div>
    </div>
    <div class="content-middle">
      <SubtitleBar :subtitle="`任务统计`">
        <DictSelectBox
          :type="DICT_TYPE.BPM_MODEL_CATEGORY"
          :width="100"
          style="margin-right: 10px"
        />
      </SubtitleBar>
      <IndicatorGroup
        class="indicator-group-layout"
        :data="securityData"
        style="width: 80%; margin-left: 10%"
      />
      <div style="width: 100%; height: 185px">
        <div style="margin-top: -12px;transform: scale(0.85);transform-origin: 0 0;">
          <EchartLineBarChart
            :data="barchartData"
            :colors="barchartData.colors"
            :width="660"
            :height="250"
            :category="pchartData.categories"
            ybgcolor="#01B7D730"
            :name="bchartSeriesName"
          />
        </div>
      </div>
    </div>
    <div class="content-bottom">
      <SubtitleBar :subtitle="`培训统计`">
        <DictSelectBox
          :type="DICT_TYPE.BPM_MODEL_CATEGORY"
          :width="100"
          style="margin-right: 10px"
        />
      </SubtitleBar>
      <IndicatorGroup
        class="indicator-group-layout"
        :data="lurkingData"
        style="width: 40%;margin: 0 auto;"
      />
      <div style="width: 100%; height: 185px">
        <div style="margin-top: -12px;transform: scale(0.85);transform-origin: 0 0;">
          <EchartPillarChart
            :data="pchartData"
            :colors="pchartData.colors"
            :width="660"
            :height="250"
            :name="pchartSeriesName"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import DonutChart from '/@/components/Framework/Chart/DonutChart.vue';
  import SubtitleBar from '/@/components/Framework/Chart/SubtitleBar.vue';
  import EchartPillarChart from '/@/components/Framework/Chart/EchartPillarChart.vue';
  import DictSelectBox from '@/components/Framework/Combox/DictSelectBox.vue';
  import IndicatorGroup from '/@/components/Framework/Chart/IndicatorGroup.vue';
  import EchartLineBarChart from '/@/components/Framework/Chart/EchartLineBarChart.vue';
  import { DICT_TYPE } from '@/utils/dict';

  const pchartData = ref({
    barData: [15, 22, 39, 14, 31, 15, 20, 39, 14, 31, 15, 20],
    categories: [
      '1月',
      '2月',
      '3月',
      '4月',
      '5月',
      '6月',
      '7月',
      '8月',
      '9月',
      '10月',
      '11月',
      '12月',
    ],
    units: ['单位', '单位', '单位'],
    colors: [['#488FF6', '#60D1F3'],
        ['#E59837', '#FAE895'],
        ['#078C5D', '#68E4B8']],
  });
  const pchartSeriesName = ['培训次数'];

  const securityData = [
    {
      value: 93,
      label: '超期完成(项)',
    },
    {
      value: 32,
      label: '未完成(项)',
    },
    {
      value: 98.45,
      label: '完成率(%)',
    },
  ];

  const lurkingData = [
    {
      value: 35,
      label: '培训次数(次)',
    },
    {
      value: 599,
      label: '参与人数(人)',
    },
  ];

  const donutData = [
    { label: '20岁以下', value: 33 },
    { label: '20岁至30岁', value: 51 },
    { label: '30岁至40岁', value: 27 },
    { label: '40岁至50岁', value: 33 },
    { label: '50岁至60岁', value: 55 },
    { label: '60岁至100岁', value: 15 },
  ];

  const barchartData = {
    barData: [
      [50.0, 34.9, 74.0, 44.2, 55.6, 76.7, 35.6, 62.2, 32.6, 20.0, 62.4, 32.3],
      [32.6, 53.9, 39.0, 56.4, 48.7, 50.7, 75.6, 31.2, 48.7, 39.8, 62.0, 52.3],
    ],
    lineData: [[32.0, 39.2, 13.3, 24.5, 32.3, 15.2, 20.3, 23.4, 23.0, 16.5, 12.0, 26.2]],
    colors: [
      ['#488FF6', '#60D1F3'],
      ['#078C5D', '#68E4B8'],
      ['#078C5D', '#68E4B8'],
      '#f39c12',
      '#f39c12',
    ],
  };
  const bchartSeriesName = [['超期完成', '未完成'], ['等效小时数']];
</script>

<style lang="less" scoped>
  .right-content {
    display: flex;
    flex: 31%;
    flex-direction: column;
    width: 31%;
    height: 100%;

    .content-top,
    .content-middle,
    .content-bottom {
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: top;
      justify-content: top;
      padding: 0 10px;
      border: 0 solid #ccc;
      text-align: top;
    }

    .donut-chart-layout {
      position: relative;
      width: 100%;
      margin: 0 0 0 25px;

      .chart {
        position: absolute;
        top: 15px;
        left: 10px;
        transform: scale(1.05);
      }
    }

    :deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
      height: 26px !important;
      border: 1px solid #07a6ff70;
      border-radius: 0;
      background-color: transparent;
    }

    :deep(.ant-select-single .ant-select-selector .ant-select-selection-placeholder) {
      height: 26px;
      line-height: 26px;
    }

    :deep(.ant-select-arrow) {
      color: rgb(255 255 255 / 50%);
    }
  }
</style>
