<template>
  <div class="right-content">
    <div class="content-top">
      <SubtitleBar :subtitle="`安全隐患`">
        <DictSelectBox
          :type="DICT_TYPE.BPM_MODEL_CATEGORY"
          :width="100"
          style="margin-right: 10px"
        />
      </SubtitleBar>
      <IndicatorGroup
        class="indicator-group-layout"
        :data="workData"
        style="width: 60%; margin: 0 15% 0 20%"
      />
      <div style="width: 100%; height: 185px">
        <div style="margin: -40px 0 0 20px; transform: scale(0.85) translate(-60px, 0px)">
          <EchartPillarChart
            :data="pchartData"
            :colors="pchartData.colors"
            :width="620"
            :height="260"
          />
        </div>
      </div>
    </div>
    <div class="content-middle">
      <SubtitleBar :subtitle="`安全培训`">
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
        <div style="margin: -40px 0 0 -20px; transform: scale(0.85) translate(-60px, 0px)">
          <EchartLineBarChart
            :data="lbarChartData"
            :colors="secondColors"
            :width="680"
            :height="280"
            :category="pchartData.categories"
            ybgcolor="#01B7D730"
          />
        </div>
      </div>
    </div>
    <div class="content-bottom">
      <SubtitleBar :subtitle="`安全标准化`">
        <DictSelectBox
          :type="DICT_TYPE.BPM_MODEL_CATEGORY"
          :width="100"
          style="margin-right: 10px"
        />
      </SubtitleBar>
      <IndicatorGroup
        class="indicator-group-layout"
        :data="lurkingData"
        style="width: 60%; margin: 0 15% 0 20%"
      />
      <div style="width: 100%; height: 185px">
        <div style="margin: -35px 0 0 -20px; transform: scale(0.85) translate(-60px, 0px)">
          <EchartLineBarChart
            :data="lbarChartData"
            :colors="secondColors"
            :width="680"
            :height="288"
            :category="pchartData.categories"
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
  import EchartPillarChart from '/@/components/Framework/Chart/EchartPillarChart.vue';
  import DictSelectBox from '@/components/Framework/Combox/DictSelectBox.vue';
  import IndicatorGroup from '/@/components/Framework/Chart/IndicatorGroup.vue';
  import EchartLineBarChart from '/@/components/Framework/Chart/EchartLineBarChart.vue';
  import { DICT_TYPE } from '@/utils/dict';

  const pchartData = ref({
    barData: [15, 22, 39, 14, 31, 15, 20, 39, 14, 31, 15, 20],
    lineData: [[25, 28, 39, 14, 22, 14, 33, 39, 14, 22, 14, 33]],
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
    colors: [['#488FF6', '#60D1F3'], '#4080E0', '#60A0A0'],
  });

  const workData = [
    {
      value: 72,
      label: '待处理(个)',
    },
    {
      value: 15.32,
      label: '处理率(%)',
    },
  ];

  const securityData = [
    {
      value: 93,
      label: '培训次数(次)',
    },
    {
      value: 32,
      label: '参与人数(人)',
    },
  ];

  const lurkingData = [
    {
      value: 35,
      label: '应急预案(个)',
    },
    {
      value: 20,
      label: '应急演练(次)',
    },
  ];

  const lbarChartData = [
    [50.0, 34.9, 74.0, 44.2, 55.6, 76.7, 35.6, 62.2, 32.6, 20.0, 62.4, 32.3],
    [32.6, 53.9, 39.0, 56.4, 48.7, 50.7, 75.6, 31.2, 48.7, 39.8, 62.0, 52.3],
  ];

  const secondColors = ref([['#488FF6', '#60D1F3'], ['#078C5D', '#68E4B8'], '#f39c12', '#d81b60']);
</script>

<style lang="less" scoped>
  .right-content {
    display: flex;
    flex: 31%;
    width: 31%;
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
