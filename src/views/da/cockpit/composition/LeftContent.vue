<template>
  <div class="left-content">
    <div class="top-section">
      <div class="element">
        <NumberDisplay
          title="任务统计(项)"
          :subtitle="subtitle"
          :value="145"
          tsize="12px"
          vsize="28px"
          bcolor="#01B4F1"
        />
      </div>
      <div class="element">
        <NumberDisplay
          title="调度持证率(%)"
          :subtitle="subtitle"
          :value="33.15"
          tsize="12px"
          vsize="28px"
          bcolor="#01B4F1"
        />
      </div>
      <div class="element">
        <NumberDisplay
          title="考核评价(分)"
          :subtitle="subtitle"
          :value="82.33"
          tsize="12px"
          vsize="28px"
          bcolor="#01B4F1"
        />
      </div>
      <div class="element">
        <NumberDisplay
          title="合同统计(份)"
          :subtitle="subtitle"
          :value="22"
          tsize="12px"
          vsize="28px"
          bcolor="#01B4F1"
        />
      </div>
      <div class="element">
        <NumberDisplay
          title="车辆统计(项)"
          :subtitle="subtitle"
          :value="62"
          tsize="12px"
          vsize="28px"
          bcolor="#01B4F1"
        />
      </div>
      <div class="element"></div>
      <div class="element"></div>
      <div class="element"></div>
    </div>
    <div class="bottom-section">
      <div class="title-content">
        <SubtitleBar :subtitle="`持证率统计`" style="margin: 0 0 0 10px">
          <DictSelectBox
            :type="DICT_TYPE.BPM_MODEL_CATEGORY"
            :width="100"
            style="margin-right: 30px"
          />
        </SubtitleBar>
        <IndicatorGroup
          class="indicator-group-layout"
          :data="securityData"
          style="width: 84%; margin: 10px 0 0 30px"
        />
        <div style="width: 135%; height: 380px;">
          <div style="transform: scale(0.85);transform-origin: 0 0;">
            <EchartLineBarChart
              :data="lbarChartData"
              :colors="lbarChartData.colors"
              :width="730"
              :height="478"
              :category="lbarChartCategory"
              ybgcolor="#01B7D730"
              :name="lbChartSeriesName"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import NumberDisplay from '/@/components/Framework/Chart/NumberDisplay.vue';
  import SubtitleBar from '/@/components/Framework/Chart/SubtitleBar.vue';
  import IndicatorGroup from '/@/components/Framework/Chart/IndicatorGroup.vue';
  import DictSelectBox from '@/components/Framework/Combox/DictSelectBox.vue';
  import EchartLineBarChart from '/@/components/Framework/Chart/EchartLineBarChart.vue';
  import { DICT_TYPE } from '@/utils/dict';

  const subtitle = ref({
    mtext: '同比',
    mvalue: '1.6%',
    stext: '环比',
    svalue: '-3.6%',
  });

  // 安全运行
  const securityData = [
    {
      value: 90.32,
      label: '调度证(%)',
    },
    {
      value: 77.22,
      label: '高压电工证(%)',
    },
    {
      value: 91.32,
      label: '安全员证(%)',
    },
  ];

  const lbarChartData = {
    barData: [
      [50.0, 34.9, 74.0, 44.2, 55.6, 76.7, 35.6, 62.2, 32.6, 20.0, 62.4, 32.3],
      [32.6, 53.9, 39.0, 56.4, 48.7, 50.7, 75.6, 31.2, 48.7, 39.8, 62.0, 52.3],
      [32.0, 39.2, 13.3, 24.5, 32.3, 15.2, 20.3, 23.4, 23.0, 16.5, 12.0, 26.2],
    ],
    // lineData: [
    //   [12.0, 29.2, 33.3, 29.5, 35.3, 10.2, 28.3, 33.4, 13.0, 15.5, 14.0, 26.2],
    //   [32.6, 53.9, 39.0, 56.4, 48.7, 50.7, 75.6, 31.2, 48.7, 39.8, 62.0, 52.3],
    // ],
    colors: [
      ['#488FF6', '#60D1F3'],
      ['#078C5D', '#68E4B8'],
      ['#E59837', '#FAE895'],
      '#9cf312',
      '#f39c12',
    ],
  };
  const lbChartSeriesName = [['调度证','高压电工证', '安全员证']];
  const lbarChartCategory = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
</script>

<style lang="less" scoped>
  .left-content {
    flex: 35;
    flex-shrink: 0;
    width: 35%;
    padding: 0;
    border-left: 0 solid #000;

    .top-section {
      display: flex;
      flex-wrap: wrap; /* 使数字自动换行 */
      align-items: top;
      justify-content: center;
      width: calc(100% - 15px);
      height: 40%;
      margin-top: 25px;
      margin-left: 15px;
      padding: 0;
      border: 0 solid #ccc;

      div.element {
        flex: 49.5%;
        padding: 0;
      }
    }

    .bottom-section {
      display: flex;
      flex-wrap: wrap; /* 使数字自动换行 */
      align-items: top;
      justify-content: center;
      width: calc(100% - 15px);
      height: 60%;
      margin-top: 0;
      margin-left: 15px;
      padding: 0;
      border: 0 solid #ccc;

      .title-content {
        width: 100%;
        height: 30%;
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
