<template>
  <div class="left-content">
    <div class="top-section">
      <SubtitleBar :subtitle="`电站统计`">
        <DictSelectBox :type="DICT_TYPE.BPM_MODEL_CATEGORY" :width="100" />
      </SubtitleBar>
      <div class="chart-box">
        <DonutChart :data="donutData1" width="250" height="250" radius="100" />
        <div style="margin: -30px 0 0 60px; transform: scale(0.85);">
          <EchartPillarChart :data="pchartData1" :colors="pchartData1.colors" :name="pchartName1" :width="590" :height="332" />
        </div>
      </div>
    </div>
    <div class="bottom-section">
      <SubtitleBar :subtitle="`出入库统计`">
        <DictSelectBox :type="DICT_TYPE.BPM_MODEL_CATEGORY" :width="100" />
        <DictSelectBox :type="DICT_TYPE.BPM_MODEL_CATEGORY" :width="100" style="margin-left: 10px;" />
      </SubtitleBar>
      <div class="chart-box">
        <DonutChart :data="donutData2" width="250" height="250" radius="100" />
        <div style="margin: -30px 0 0 60px; transform: scale(0.85);">
          <EchartPillarChart :data="pchartData2" :colors="pchartData2.colors" :name="pchartName2" :width="590" :height="332" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import SubtitleBar from '/@/components/Framework/Chart/SubtitleBar.vue';
  import DictSelectBox from '@/components/Framework/Combox/DictSelectBox.vue';
  import DonutChart from '/@/components/Framework/Chart/DonutChart2.vue';
  import EchartPillarChart from '/@/components/Framework/Chart/EchartPillarChart.vue';
  import { DICT_TYPE } from '@/utils/dict';

  // 电站统计
  const donutData1 = [
    { label: '1MW以内', value: 33 },
    { label: '1-30MW', value: 51 },
    { label: '30-50MW', value: 27 },
    { label: '50-100MW', value: 33 },
    { label: '100-200MW', value: 55 },
    { label: '200MW以上', value: 22 },
  ];
  const pchartData1 = ref({
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
    units: ['单位'],
    colors: [['#488FF6', '#60D1F3'], ['#E59837', '#FAE895'], ['#078C5D', '#68E4B8']],
  });
  const pchartName1 = ref(['指标1']);

  // 出入库统计
  const donutData2 = [
    { label: '入库单(7)', value: 7 },
    { label: '出库单(4)', value: 4 },
    { label: '盘点单(9)', value: 9 },
  ];
  const pchartData2 = ref({
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
    units: ['单位'],
    colors: [['#078C5D', '#68E4B8'], ['#E59837', '#FAE895'], ['#078C5D', '#68E4B8']],
  });
  const pchartName2 = ref(['指标1']);
</script>

<style lang="less" scoped>
  .left-content {
    flex: 1;
    padding: 20px;

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

    .chart-box {
      display: flex;
      padding-left: 10px;
    }
  }
</style>
