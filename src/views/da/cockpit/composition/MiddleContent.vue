<template>
  <div class="middle-content">
    <div class="content-top">
      <div class="element" style="margin-top: 22px">
        <NumberDisplay
          title="培训统计(次)"
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
        <SubtitleBar :subtitle="`车辆统计`" style="margin: 0px 0px 0px 10px">
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
        <div style="width: 135%; height: 240px; margin: -70px 0 0 -30px">
          <div style="margin: 0px 0 0 30px; transform: scale(0.85) translate(-60px, 0px)">
            <EchartPillarChart :data="pchartData" :width="680" :height="330" />
          </div>
        </div>
      </div>
    </div>
    <div class="content-bottom" style="margin-top:5px;">
      <SubtitleBar :subtitle="`考核评价`">
        <DictSelectBox
          :type="DICT_TYPE.BPM_MODEL_CATEGORY"
          :width="100"
          style="margin-right: 10px"
        />
      </SubtitleBar>
      <IndicatorGroup
        class="indicator-group-layout"
        :data="lurkingData"
        style="width: 80%; margin: 15px 7.5% 0 10%"
      />
      <div style="width: 135%; height: 185px; margin: -1px 0 0 0">
        <div style="margin: -30px 0 0 -20px; transform: scale(0.85) translate(-60px, 0px)">
          <EchartStackBarChart
            :data="stackData"
            :colors="chartColors"
            ybgcolor="#01B7D730"
            :width="695"
            :height="285"
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
  import EchartStackBarChart from '/@/components/Framework/Chart/EchartStackBarChart.vue';
  import IndicatorGroup from '/@/components/Framework/Chart/IndicatorGroup.vue';
  import { DICT_TYPE } from '@/utils/dict';

  const pchartData = ref({
    mData: [15, 22, 39, 14, 31, 15, 20, 39, 14, 31, 15, 20],
    mName: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    units: ['单位', '单位'],
  });

  const stackData = ref({
    categories: pchartData.value.mName,
    barData: [
      [25, 28, 39, 14, 22, 14, 33, 39, 14, 22, 14, 33],
      [15, 22, 39, 14, 31, 15, 20, 31, 11, 31, 15, 20],
      [13, 20, 10, 34, 15, 30, 11, 10, 34, 15, 30, 11],
    ],
    lineData: [[33, 26, 13, 34, 14, 31, 19, 15, 33, 15, 31, 14]],
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
      label: '保险即将到期(辆)',
    },
    {
      value: 33,
      label: '即将年检(辆)',
    },
    {
      value: 98.45,
      label: '安全检测(次)',
    },
  ];

  const lurkingData = [
    {
      value: 95,
      label: '电量(分)',
    },
    {
      value: 75.23,
      label: '安全(分)',
    },
    {
      value: 72.23,
      label: '运维(分)',
    },
    {
      value: 68.23,
      label: '综合(分)',
    },
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
      height: 20.5%;

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
