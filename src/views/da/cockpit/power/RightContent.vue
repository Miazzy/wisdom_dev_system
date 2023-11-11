<template>
  <div class="right-content">
    <div class="content-top">
      <SubtitleBar :subtitle="`计划完成`">
        <DictSelectBox
          :type="DICT_TYPE.BPM_MODEL_CATEGORY"
          :width="100"
          style="margin-right: 10px"
        />
      </SubtitleBar>
      <IndicatorGroup
        class="indicator-group-layout"
        :data="workData"
        style="width: 80%; margin: 0 7.5% 0 10%"
      />
      <div style="width: 100%; height: 185px">
        <div style="margin: -40px 0 0 -20px; transform: scale(0.85) translate(-60px, 0px)">
          <EchartLineBarChart
            :data="fbarchartData"
            :colors="fbarchartData.colors"
            :width="680"
            :height="288"
            :category="fbarchartData.categories"
            ybgcolor="#01B7D730"
          />
        </div>
      </div>
    </div>
    <div class="content-middle">
      <SubtitleBar :subtitle="`厂用电`">
        <DictSelectBox
          :type="DICT_TYPE.BPM_MODEL_CATEGORY"
          :width="100"
          style="margin-right: 10px"
        />
      </SubtitleBar>
      <IndicatorGroup
        class="indicator-group-layout"
        :data="securityData"
        style="width: 62%; margin-left: 20%"
      />
      <div style="width: 100%; height: 185px">
        <div style="margin: -40px 0 0 -20px; transform: scale(0.85) translate(-60px, 0px)">
          <EchartCrossBarChart
            :data="barchartData"
            :colors="barchartData.colors"
            :names="barchartData.names"
            :width="680"
            :height="280"
            :category="barchartData.categories"
            ybgcolor="#01B7D730"
          />
        </div>
      </div>
    </div>
    <div class="content-bottom">
      <SubtitleBar :subtitle="`储能电量`">
        <DictSelectBox
          :type="DICT_TYPE.BPM_MODEL_CATEGORY"
          :width="100"
          style="margin-right: 10px"
        />
      </SubtitleBar>
      <IndicatorGroup
        class="indicator-group-layout"
        :data="lurkingData"
        style="width: 62%; margin: 0 15% 0 20%"
      />
      <div style="width: 100%; height: 185px">
        <div style="margin: -35px 0 0 -20px; transform: scale(0.85) translate(-60px, 0px)">
          <EchartLineBarChart
            :data="sbarchartData"
            :colors="sbarchartData.colors"
            :width="680"
            :height="288"
            :category="fbarchartData.categories"
            ybgcolor="#01B7D730"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import SubtitleBar from '/@/components/Framework/Chart/SubtitleBar.vue';
  import EchartCrossBarChart from '/@/components/Framework/Chart/EchartCrossBarChart.vue';
  import DictSelectBox from '@/components/Framework/Combox/DictSelectBox.vue';
  import IndicatorGroup from '/@/components/Framework/Chart/IndicatorGroup.vue';
  import EchartLineBarChart from '/@/components/Framework/Chart/EchartLineBarChart.vue';
  import { DICT_TYPE } from '@/utils/dict';

  const workData = [
    {
      value: 7221,
      label: '上网电量（万kWh）',
    },
    {
      value: 1533.32,
      label: '计划电量(万kWh)',
    },
    {
      value: 72.33,
      label: '完成率(%)',
    },
  ];

  const securityData = [
    {
      value: 933.2,
      label: '下网电量(万kWh)',
    },
    {
      value: 32.39,
      label: '勾网电量(万kWh)',
    },
  ];

  const lurkingData = [
    {
      value: 353.22,
      label: '充电电量(万kWh)',
    },
    {
      value: 205.22,
      label: '放电电量(万kWh)',
    },
  ];

  const barchartData = {
    barData: [
      [50.0, 34.9, 74.0, 44.2, 55.6, 76.7, 35.6, 62.2, 33.2, 20.0],
      [32.3, 11.2, 30.1, 30.3, 39.0, 33.0, 32.0, 56.4, 41.2, 20.2],
    ],
    colors: ['#488FF6', '#68E4B8'],
    names: ['下网电量', '购网电量'],
    categories: ['电站1', '电站2', '电站3', '电站4', '电站5', '电站6', '电站7', '电站8', '电站9', '电站10'],
  };

  const fbarchartData = {
    barData: [
      [50.0, 34.9, 74.0, 44.2, 55.6, 76.7, 35.6, 62.2, 32.6, 20.0, 62.4, 32.3],
      [32.6, 53.9, 39.0, 56.4, 48.7, 50.7, 75.6, 31.2, 48.7, 39.8, 62.0, 52.3],
      [50.0, 34.9, 74.0, 44.2, 55.6, 76.7, 35.6, 62.2, 32.6, 20.0, 62.4, 32.3],
    ],
    lineData: [[32.0, 39.2, 13.3, 24.5, 32.3, 15.2, 20.3, 23.4, 23.0, 16.5, 12.0, 26.2]],
    colors: [
      ['#488FF6', '#60D1F3'],
      ['#078C5D', '#68E4B8'],
      ['#E59837', '#FAE895'],
      '#f39c12',
      '#f39c12',
    ],
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
  };

  const sbarchartData = {
    barData: [
      [50.0, 34.9, 74.0, 44.2, 55.6, 76.7, 35.6, 62.2, 32.6, 20.0, 62.4, 32.3],
      [32.6, 53.9, 39.0, 56.4, 48.7, 50.7, 75.6, 31.2, 48.7, 39.8, 62.0, 52.3],
    ],
    lineData: [[32.0, 39.2, 13.3, 24.5, 32.3, 15.2, 20.3, 23.4, 23.0, 16.5, 12.0, 26.2]],
    colors: [
      ['#488FF6', '#60D1F3'],
      ['#078C5D', '#68E4B8'],
      ['#E59837', '#FAE895'],
      '#f39c12',
      '#f39c12',
    ],
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
  };
</script>

<style lang="less" scoped>
  .right-content {
    display: flex;
    flex: 30%;
    width: 30%;
    flex-direction: column;
    height: 100%;

    .content-top,
    .content-middle,
    .content-bottom {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: top;
      align-items: top;
      text-align: top;
      border: 0px solid #ccc;
      padding: 10px;
    }

    :deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
      background-color: transparent;
      border: 1px solid #07a6ff70;
      border-radius: 0px;
      height: 26px !important;
    }
    :deep(.ant-select-single .ant-select-selector .ant-select-selection-placeholder) {
      height: 26px;
      line-height: 26px;
    }
    :deep(.ant-select-arrow) {
      color: rgba(255, 255, 255, 0.5);
    }
  }
</style>
