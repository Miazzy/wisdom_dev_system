<template>
  <div class="middle-content">
    <div class="content-top">
      <div class="element" style="margin-top: 22px">
        <NumberDisplay
          title="损失电量(万kWh)"
          :subtitle="subtitle"
          :value="145.3911"
          tsize="12px"
          vsize="28px"
          bcolor="#01B4F1"
        />
      </div>
      <div class="element"></div>
    </div>
    <div class="content-middle">
      <div class="title-content">
        <SubtitleBar :subtitle="`损失分布`" style="margin: 0px 0px 0px 0px" />
        <div style="width: 135%; height: 200px; margin: -15px 0 0 -45px">
          <div style="margin: 0px 0 0 0; transform: scale(0.70) translate(-60px, 0px)">
            <NtgaleChart id="omChart" :width="600" :height="205" :data="NtgaleData" showLabel />
          </div>
        </div>
      </div>
    </div>
    <div class="content-smiddle" style="margin-top: -20px;">
      <div class="title-content">
        <SubtitleBar :subtitle="`损失排行`" style="margin: 0px 0px 0px 10px" />
        <div style="width: 135%; height: 200px; margin: -50px 0 0 -30px">
          <div style="margin: 0px 0 0 0; transform: scale(0.85) translate(-60px, 0px)">
            <EchartStackBarChart
              :data="stackData"
              :colors="stackData.colors"
              ybgcolor="#01B7D730"
              :width="620"
              :height="275"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="content-bottom">
      <SubtitleBar :subtitle="`电量趋势（近12个月）`">
        <DictSelectBox
          :type="DICT_TYPE.BPM_MODEL_CATEGORY"
          :width="100"
          style="margin-right: 10px"
        />
      </SubtitleBar>
      <div style="width: 100%; height: 185px; margin: -1px 0 0 0">
        <div style="margin: -60px 0 0 -45.5px; transform: scale(0.85) translate(-60px, 0px)">
          <EchartLineBarChart
            :data="barchartData"
            :colors="barchartData.colors"
            :width="660"
            :height="310"
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
  import NumberDisplay from '/@/components/Framework/Chart/NumberDisplay.vue';
  import SubtitleBar from '/@/components/Framework/Chart/SubtitleBar.vue';
  import NtgaleChart from '/@/components/Framework/Chart/NtgaleChart.vue';
  import EchartStackBarChart from '/@/components/Framework/Chart/EchartStackBarChart.vue';
  import DictSelectBox from '@/components/Framework/Combox/DictSelectBox.vue';
  import EchartLineBarChart from '/@/components/Framework/Chart/EchartLineBarChart.vue';
  import IndicatorGroup from '/@/components/Framework/Chart/IndicatorGroup.vue';
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
    colors: [['#488FF6', '#60D1F3'], '#60C0C0', '#60A0A0'],
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

  const barchartData = {
    lineData: [[50.0, 34.9, 74.0, 44.2, 55.6, 76.7, 35.6, 62.2, 32.6, 20.0, 62.4, 32.3]],
    colors: [
      ['#488FF6', '#60D1F3'],
      ['#E59837', '#FAE895'],
      ['#E59837', '#68E4B8'],
      '#f39c12',
      '#f39c12',
    ],
  };

  const stackData = ref({
    categories: pchartData.value.categories,
    barData: [
      [25, 28, 39, 14, 22, 14, 33, 39, 14, 22, 14, 33],
      [15, 22, 39, 14, 31, 15, 20, 31, 11, 31, 15, 20],
      [13, 20, 10, 34, 15, 30, 11, 10, 34, 15, 30, 11],
      [33, 26, 13, 34, 14, 31, 19, 15, 33, 15, 31, 14],
    ],
    colors: [['#1C5C99', '#4CAFF9'], ['#105D3A', '#55CFD0'], '#f39c12', '#d81b60'],
    lineData: [[33, 26, 13, 34, 14, 31, 19, 15, 33, 15, 31, 14]], // 不设置或者设置为空数组即不显示
    barNames: ['chartOne', 'chartTwo', 'chartThree', 'chartFour'],
    lineNames: ['lineChart'],
  });

  const NtgaleData = [
    { value: 40, name: '抢修工单' },
    { value: 38, name: '预试工单' },
    { value: 32, name: '清洗工单' },
    { value: 30, name: '隐患工单' },
    { value: 28, name: '消缺工单' },
    { value: 26, name: '检修工单' },
    { value: 22, name: '其他工单' },
  ];
</script>

<style lang="less" scoped>
  .middle-content {
    display: flex;
    flex: 30%;
    width: 30%;
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
      height: 18%;

      div.element {
        flex: 49.5%;
        padding: 0px;
      }
    }

    .content-smiddle {
      height: 28%;
    }
    .content-middle {
      height: 28%;
    }
    .content-bottom {
      height: 28%;
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
