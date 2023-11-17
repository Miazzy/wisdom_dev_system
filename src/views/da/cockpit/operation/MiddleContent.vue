<template>
  <div class="middle-content">
    <div class="content-top">
      <div class="element" style="margin-top: 22px">
        <NumberDisplay
          title="巡检统计(次)"
          :subtitle="subtitle"
          :value="145"
          tsize="12px"
          vsize="28px"
          bcolor="#01B4F1"
        />
      </div>
      <div class="element"></div>
    </div>
    <div class="content-middle">
      <div class="title-content">
        <SubtitleBar :subtitle="`巡检统计`" style="margin: 0 0 0 10px">
          <DictSelectBox
            :type="DICT_TYPE.BPM_MODEL_CATEGORY"
            :width="100"
            style="margin-right: 10px;"
          />
        </SubtitleBar>
        <IndicatorGroup
          class="indicator-group-layout"
          :data="securityData"
          style="width: 64%; margin: 8px 0 0 17%;"
        />
        <div style="width: 135%; height: 200px;">
          <div style="margin-top: -20px;transform: scale(0.85);transform-origin: 0 0;">
            <EchartLineBarChart
              :data="barchartData"
              :colors="barchartData.colors"
              :width="720"
              :height="328"
              :category="pchartData.mName"
              ybgcolor="#01B7D730"
              :name="barChartSeriesName"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="content-bottom">
      <SubtitleBar :subtitle="`缺陷统计`">
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
      <div style="width: 100%; height: 185px;">
        <div style="margin-top: -20px; transform: scale(0.85);transform-origin: 0 0;">
          <EchartPillarChart
            :data="pchartData"
            :colors="pchartData.colors"
            :width="720"
            :height="328"
            :name="pChartSeriesName"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import NumberDisplay from '/@/components/Framework/Chart/NumberDisplay.vue';
  import SubtitleBar from '/@/components/Framework/Chart/SubtitleBar.vue';
  import EchartPillarChart from '/@/components/Framework/Chart/EchartPillarChart.vue';
  import DictSelectBox from '@/components/Framework/Combox/DictSelectBox.vue';
  import EchartLineBarChart from '/@/components/Framework/Chart/EchartLineBarChart.vue';
  import IndicatorGroup from '/@/components/Framework/Chart/IndicatorGroup.vue';
  import { DICT_TYPE } from '@/utils/dict';

  const pchartData = ref({
    barData: [15, 22, 39, 14, 31, 15, 20, 39, 14, 31, 15, 20],
    lineData: [
      [25, 28, 39, 14, 22, 14, 33, 39, 14, 22, 14, 33]
    ],
    categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    units: ['单位', '单位', '单位'],
    colors: [['#078C5D', '#68E4B8'], ['#E59837', '#FAE895'], ['#078C5D', '#68E4B8']],
  });
  const pChartSeriesName = ['未消缺', '消缺率'];

  const subtitle = ref({
    mtext: '同比',
    mvalue: '1.6%',
    stext: '环比',
    svalue: '-3.6%',
  });


  const securityData = [
    {
      value: 93,
      label: '未巡检(次)',
    },
    {
      value: 33,
      label: '异常(项)',
    },
    {
      value: 98.45,
      label: '巡检率(%)',
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

  const barchartData = {
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
  };
  const barChartSeriesName = [['未巡检', '异常'], ['巡检率']];
</script>

<style lang="less" scoped>
  .middle-content {
    display: flex;
    flex: 34%;
    flex-direction: column;
    width: 34%;
    height: 100%;

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

    .content-top {
      display: flex;
      flex-wrap: wrap; /* 使数字自动换行 */
      align-items: top;
      justify-content: center;
      height: 20.5%;

      div.element {
        flex: 49.5%;
        padding: 0;
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
