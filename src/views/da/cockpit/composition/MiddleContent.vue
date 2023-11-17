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
        <SubtitleBar :subtitle="`车辆统计`" style="margin: 0 0 0 10px">
          <DictSelectBox
            :type="DICT_TYPE.BPM_MODEL_CATEGORY"
            :width="100"
            style="margin-right: 10px"
          />
        </SubtitleBar>
        <IndicatorGroup
          class="indicator-group-layout"
          :data="securityData"
          style="width: 64%; margin: 8px 0 0 17%"
        />
        <div style="width: 135%; height: 200px;">
          <div style="margin-top: -20px;transform: scale(0.85);transform-origin: 0 0;">
            <EchartPillarChart
              :data="pchartData"
              :colors="pchartData.colors"
              :width="720"
              :height="328"
              :name="pChartName"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="content-bottom">
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
        style="width: 80%; margin: 0 7.5% 0 10%"
      />
      <div style="width: 100%; height: 185px;">
        <div style="margin-top: -20px; transform: scale(0.85);transform-origin: 0 0;">
          <EchartStackBarChart
            :data="stackData"
            :colors="chartColors"
            ybgcolor="#01B7D730"
            :width="720"
            :height="320"
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

  const chartColors = ref([['#1C5C99', '#4CAFF9'], ['#105D3A', '#55CFD0'], '#f39c12', '#d81b60']);

  const pchartData = ref({
    barData: [15, 22, 39, 14, 31, 15, 20, 39, 14, 31, 15, 20],
    // lineData: [
    //   [25, 28, 39, 14, 22, 14, 33, 39, 14, 22, 14, 33],
    //   [13, 20, 10, 34, 15, 30, 11, 10, 34, 15, 30, 11],
    // ],
    categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    units: ['单位', '单位', '单位'],
    colors: [['#078C5D', '#68E4B8'], '#60C0C0', '#60A0A0'],
  });
  const pChartName = ['安全检查'];

  const stackData = ref({
    categories: pchartData.value.categories,
    barData: [
      [25, 28, 39, 14, 22, 14, 33, 39, 14, 22, 14, 33],
      [15, 22, 39, 14, 31, 15, 20, 31, 11, 31, 15, 20],
      [13, 20, 10, 34, 15, 30, 11, 10, 34, 15, 30, 11],
      [33, 26, 13, 34, 14, 31, 19, 15, 33, 15, 31, 14],
    ],
    colors: [['#488FF6', '#60D1F3', '#8FD0F4', '#68E4B8'],
      ['#E59837', '#FAE895']],
    // lineData: [[33, 26, 13, 34, 14, 31, 19, 15, 33, 15, 31, 14]], // 不设置或者设置为空数组即不显示
    barNames: ['电量', '安全', '运维', '综合']
    // lineNames: ['lineChart'],
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