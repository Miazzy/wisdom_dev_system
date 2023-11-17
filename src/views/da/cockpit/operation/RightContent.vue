<template>
  <div class="right-content">
    <div class="content-top">
      <SubtitleBar :subtitle="`工单统计`">
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
        <div style="margin-top: -12px;transform: scale(0.85);transform-origin: 0 0;">
          <EchartPillarChart
            :data="pchartTopData"
            :colors="pchartTopData.colors"
            :width="660"
            :height="250"
            :name="pchartTopSeriesName"
          />
        </div>
      </div>
    </div>
    <div class="content-middle">
      <SubtitleBar :subtitle="`细则统计`">
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
          <EchartPillarChart
            :data="pchartMiddleData"
            :colors="pchartMiddleData.colors"
            :width="660"
            :height="250"
            :name="pchartMiddleSeriesName"
          />
        </div>
      </div>
    </div>
    <div class="content-bottom">
      <SubtitleBar :subtitle="`隐患统计`">
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
        <div style="margin-top: -12px;transform: scale(0.85);transform-origin: 0 0;">
          <EchartPillarChart
            :data="pchartBottomData"
            :colors="pchartBottomData.colors"
            :width="660"
            :height="250"
            :name="pchartBottomSeriesName"
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
  import { DICT_TYPE } from '@/utils/dict';

  const pchartTopData = ref({
    barData: [15, 22, 39, 14, 31, 15, 20, 39, 14, 31, 15, 20],
    lineData: [[13, 20, 10, 34, 15, 30, 11, 10, 34, 15, 30, 11]],
    categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    units: ['单位', '单位', '单位'],
    colors: [['#078C5D', '#68E4B8'], ['#E59837', '#FAE895'], ['#078C5D', '#68E4B8']],
  });
  const pchartTopSeriesName = ['未闭环', '闭环率'];

  const pchartMiddleData = ref({
    barData: [15, 22, 39, 14, 31, 15, 20, 39, 14, 31, 15, 20],
    categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    units: ['单位', '单位', '单位'],
    colors: [['#488FF6', '#60D1F3'], ['#E59837', '#FAE895'], ['#078C5D', '#68E4B8']],
  });
  const pchartMiddleSeriesName = ['考核分摊'];

  const pchartBottomData = ref({
    barData: [15, 22, 39, 14, 31, 15, 20, 39, 14, 31, 15, 20],
    lineData: [[13, 20, 10, 34, 15, 30, 11, 10, 34, 15, 30, 11]],
    categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    units: ['单位', '单位', '单位'],
    colors: [['#488FF6', '#60D1F3'], ['#E59837', '#FAE895'], ['#078C5D', '#68E4B8']],
  });
  const pchartBottomSeriesName = ['待处理', '处理率'];

  const workData = [
    {
      value: 72,
      label: '未闭环(笔)',
    },
    {
      value: 15.32,
      label: '闭环率(%)',
    },
  ];

  const securityData = [
    {
      value: 93.23,
      label: '考核分摊(万元)',
    },
    {
      value: 32.23,
      label: '补偿返还(万元)',
    },
    {
      value: 98.45,
      label: '分摊率(%)',
    },
  ];

  const lurkingData = [
    {
      value: 35,
      label: '待处理(项)',
    },
    {
      value: 59.23,
      label: '处理率(%)',
    },
  ];
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
