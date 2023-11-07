<template>
  <div class="right-content" style="margin-right: 0px">
    <div class="layout">
      <div class="top-section">
        <SubtitleBar :subtitle="`运维统计`">
          <DictSelectBox
            :type="DICT_TYPE.BPM_MODEL_CATEGORY"
            :width="100"
            style="margin-right: 20px"
          />
        </SubtitleBar>
        <div style="width: 100%">
          <div style="margin: -30px 0 0 0; transform: scale(0.85) translate(-60px, 0px)">
            <EchartPillarChart :data="pchartData" :colors="pchartData.colors" :width="600" />
          </div>
        </div>
      </div>
      <div class="middle-section">
        <SubtitleBar :subtitle="`计划完成`">
          <DictSelectBox
            :type="DICT_TYPE.BPM_MODEL_CATEGORY"
            :width="100"
            style="margin-right: 20px"
          />
        </SubtitleBar>
        <IndicatorGroup
          class="indicator-group-layout"
          :data="securityData"
          style="width: 73%; margin-left: 30px"
        />
        <div style="width: 100%; height: 250px;">
          <div style="margin: -30px 0 0 -30px; transform: scale(0.85) translate(-60px, 0px)">
            <EchartLineBarChart
              :data="lbarChartData"
              :colors="chartColors"
              :width="620"
              :height="300"
              :category="pchartData.mName"
              ybgcolor="#01B7D730"
            />
          </div>
        </div>
      </div>
      <div class="bottom-section">
        <SubtitleBar :subtitle="`电站分布`" />
        <BubbleChart
          :data="chartData"
          :width="240"
          :height="240"
          :font-size="fontSize"
          :font-color="fontColor"
          :bubble-color="bubbleColor"
          style="margin-top: -20px"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import SubtitleBar from '/@/components/Framework/Chart/SubtitleBar.vue';
  import EchartPillarChart from '/@/components/Framework/Chart/EchartPillarChart.vue';
  import EchartLineBarChart from '/@/components/Framework/Chart/EchartLineBarChart.vue';
  import BubbleChart from '/@/components/Framework/Chart/BubbleChart.vue';
  import DictSelectBox from '@/components/Framework/Combox/DictSelectBox.vue';
  import IndicatorGroup from '/@/components/Framework/Chart/IndicatorGroup.vue';
  import { DICT_TYPE } from '@/utils/dict';

  const pchartData = ref({
    lData: [25, 28, 39, 14, 22, 14, 33, 39, 14, 22, 14, 33],
    barData: [15, 22, 39, 14, 31, 15, 20, 39, 14, 31, 15, 20],
    sData: [13, 20, 10, 34, 15, 30, 11, 10, 34, 15, 30, 11],
    mName: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    units: ['单位', '单位', '单位'],
    colors: [['#488FF6', '#60D1F3'], '#60C0C0', '#60A0A0'],
  });

  // 安全运行
  const securityData = [
    {
      value: 7233.23,
      label: '上网电量(万kwh)',
    },
    {
      value: 15332.23,
      label: '计划电量(万kwh)',
    },
    {
      value: 98.45,
      label: '完成率(%)',
    },
  ];

  const chartColors = ref([['#1C5C99', '#4CAFF9'], ['#105D3A', '#55CFD0'], '#f39c12', '#d81b60']);

  const chartData = [
    { name: '江苏', label: '江苏', value: 12, size: 18, color: 'red', unit: '座' },
    { name: '山东', label: '山东', value: 11, size: 15, color: 'green', unit: '座' },
    { name: '吉林', label: '吉林', value: 10, size: 14, color: 'yellow', unit: '座' },
    { name: '浙江', label: '浙江', value: 9, size: 14, color: 'blue', unit: '座' },
    { name: '湖北', label: '湖北', value: 8, size: 14, color: 'skyblue', unit: '座' },
    { name: '黑龙江', label: '黑龙江', value: 7, size: 13, color: 'purple', unit: '座' },
    { name: '湖南', label: '湖南', value: 7, size: 13, color: 'purple', unit: '座' },
    { name: '河北', label: '河北', value: 6, size: 12, color: 'skyblue', unit: '座' },
    { name: '陕西', label: '陕西', value: 5, size: 10, color: 'yellow', unit: '座' },
    { name: '山西', label: '山西', value: 3, size: 10, color: '#9023a0', unit: '座' },
  ];

  const lbarChartData = [
    [50.0, 34.9, 74.0, 44.2, 55.6, 76.7, 35.6, 62.2, 32.6, 20.0, 62.4, 32.3],
    [32.6, 53.9, 39.0, 56.4, 48.7, 50.7, 75.6, 31.2, 48.7, 39.8, 62.0, 52.3],
    [32.0, 39.2, 13.3, 24.5, 32.3, 15.2, 20.3, 23.4, 23.0, 16.5, 12.0, 26.2],
    [12.0, 29.2, 33.3, 29.5, 35.3, 10.2, 28.3, 33.4, 13.0, 15.5, 14.0, 26.2],
  ];

  const fontSize = ref('18px');
  const fontColor = 'white';
  const bubbleColor = 'red';
</script>
<style lang="less" scoped>
  .right-content {
    flex: 28;
    width: 28%;
    flex-shrink: 0;
    padding: 0;

    .layout {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      height: 100%; /* 100% 窗口高度，可以根据需要调整 */
      .top-section {
        flex: 10; /* 上部分高度占比，可以根据需要调整 */
        height: 33%;
      }

      .middle-section {
        flex: 10; /* 中间部分高度占比，可以根据需要调整 */
        height: 33%;
      }

      .bottom-section {
        flex: 10; /* 下部分高度占比，可以根据需要调整 */
        height: 33%;
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
  }
</style>
