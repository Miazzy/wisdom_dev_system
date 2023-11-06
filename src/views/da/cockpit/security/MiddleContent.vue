<template>
  <div class="middle-content">
    <div class="content-top">
      <div class="element" style="margin-top: 22px;">
        <NumberDisplay
          title="安全培训(次)"
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
        <SubtitleBar :subtitle="`安全检查`" style="margin: 0px 0px 0px 10px">
          <DictSelectBox
            :type="DICT_TYPE.BPM_MODEL_CATEGORY"
            :width="100"
            style="margin-right: 10px"
          />
        </SubtitleBar>
        <IndicatorGroup
          class="indicator-group-layout"
          :data="securityData"
          style="width: 64%; margin: 30px 0 0 17%"
        />
        <div style="width: 135%; height: 200px; margin: -50px 0 0 -30px">
          <div style="margin: 0px 0 0 0; transform: scale(0.85) translate(-60px, 0px)">
            <EchartLineBarChart
              :data="lbarChartData"
              :colors="chartColors"
              :width="720"
              :height="300"
              :category="pchartData.mName"
              ybgcolor="#01B7D730"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="content-bottom">
      <SubtitleBar :subtitle="`安全责任书`">
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
      <div style="width: 100%; height: 185px; margin: -1px 0 0 0">
        <div style="margin: -40px 0 0 20px; transform: scale(0.85) translate(-60px, 0px)">
          <EchartPillarChart :data="pchartData" :width="680" :height="300"/>
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
    lData: [25, 28, 39, 14, 22, 14, 33, 39, 14, 22, 14, 33],
    mData: [15, 22, 39, 14, 31, 15, 20, 39, 14, 31, 15, 20],
    sData: [13, 20, 10, 34, 15, 30, 11, 10, 34, 15, 30, 11],
    mName: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    units: ['单位', '单位'],
  });

  const subtitle = ref({
    mtext: '同比',
    mvalue: '1.6%',
    stext: '环比',
    svalue: '-3.6%',
  });

  const securityData = [
    {
      value: 93,
      label: '检查次数(次)',
    },
    {
      value: 33,
      label: '发现隐患(项)',
    },
  ];

  const lurkingData = [
    {
      value: 35,
      label: '应签订(人)',
    },
    {
      value: 59.23,
      label: '未签订(人)',
    },
    {
      value: 59.23,
      label: '签订率(%)',
    },
  ];

  const lbarChartData = [
    [50.0, 34.9, 74.0, 44.2, 55.6, 76.7, 35.6, 62.2, 32.6, 20.0, 62.4, 32.3],
    [32.6, 53.9, 39.0, 56.4, 48.7, 50.7, 75.6, 31.2, 48.7, 39.8, 62.0, 52.3],
    [32.0, 39.2, 13.3, 24.5, 32.3, 15.2, 20.3, 23.4, 23.0, 16.5, 12.0, 26.2],
    [12.0, 29.2, 33.3, 29.5, 35.3, 10.2, 28.3, 33.4, 13.0, 15.5, 14.0, 26.2],
  ];

  const chartColors = ref([['#1C5C99', '#4CAFF9'], ['#105D3A', '#55CFD0'], '#f39c12', '#d81b60']);
</script>

<style lang="less" scoped>
  .middle-content {
    display: flex;
    flex: 34%;
    width: 34%;
    flex-direction: column;
    height: 100%;

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

    .content-top {
      display: flex;
      justify-content: center;
      align-items: top;
      flex-wrap: wrap; /* 使数字自动换行 */
      height: 25%;

      div.element {
        flex: 49.5%;
        padding: 0px;
      }
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
