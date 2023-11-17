<template>
  <div class="right-content">
    <div class="top-section">
      <SubtitleBar :subtitle="`设备统计`">
        <DictSelectBox :type="DICT_TYPE.BPM_MODEL_CATEGORY" :width="100" />
        <DictSelectBox :type="DICT_TYPE.BPM_MODEL_CATEGORY" :width="100" style="margin-left: 10px;" />
      </SubtitleBar>
      <div class="chart-box">
        <DonutChart :data="donutData1" width="250" height="250" radius="100" />
        <div style="margin: -30px 0 0 60px; transform: scale(0.85);">
          <EchartLineBarChart :data="barchartData" :colors="barchartData.colors" :width="590" :height="332" :category="pchartData1.categories" ybgcolor="#01B7D730" :name="bChartName" />
        </div>
      </div>
    </div>
    <div class="bottom-section">
      <SubtitleBar :subtitle="`备品备件统计`">
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
  import EchartLineBarChart from '/@/components/Framework/Chart/EchartLineBarChart.vue';
  import { DICT_TYPE } from '@/utils/dict';

  // 设备统计
  const donutData1 = [
    { label: '设备类型1', value: 33 },
    { label: '设备类型2', value: 51 },
    { label: '设备类型3', value: 27 },
    { label: '设备类型4', value: 33 },
  ];
  const barchartData = {
    barData: [
      [50.0, 34.9, 74.0, 44.2, 55.6, 76.7, 35.6, 62.2, 32.6, 20.0, 62.4, 32.3],
      [32.6, 53.9, 39.0, 56.4, 48.7, 50.7, 75.6, 31.2, 48.7, 39.8, 62.0, 52.3],
    ],
    colors: [
      ['#488FF6', '#60D1F3'],
      ['#078C5D', '#68E4B8'],
      ['#E59837', '#FAE895'],
      '#f39c12',
      '#f39c12',
    ],
  };
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
    colors: [['#488FF6', '#60D1F3'], '#60C0C0', '#60A0A0'],
  });
  const bChartName = ref([['指标1', '指标2']]);

  // 备品备件统计
  const donutData2 = [
    { label: '组串式逆变器', value: 7 },
    { label: '集中式逆变器', value: 4 },
    { label: '集散式逆变器', value: 9 },
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
    colors: [['#488FF6', '#60D1F3'], ['#E59837', '#FAE895'], ['#078C5D', '#68E4B8']],
  });
  const pchartName2 = ref(['指标1']);
</script>

<style lang="less" scoped>
  .right-content {
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
