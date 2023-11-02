<template>
  <div class="right-content">
    <div class="layout">
      <div class="top-section">
        <SubtitleBar :subtitle="`运维统计`">
          <DictSelectBox
            :type="DICT_TYPE.BPM_MODEL_CATEGORY"
            :width="100"
            style="margin-right: 65px"
          />
        </SubtitleBar>
        <div style="width:100%;"> 
          <div style="margin:-30px 0 0 0; transform:scale(0.85) translate(-60px, 0px);"> 
            <EchartPillarChart :data="pchartData" :width="680" />
          </div>
        </div>
      </div>
      <div class="middle-section">
        <SubtitleBar :subtitle="`计划完成`">
          <DictSelectBox
            :type="DICT_TYPE.BPM_MODEL_CATEGORY"
            :width="100"
            style="margin-right: 65px"
          />
        </SubtitleBar>
        <IndicatorGroup class="indicator-group-layout" :data="securityData" style="width:73%; margin-left: 30px;" />
        <EchartLineBarChart :colors="chartColors" :width="400" :height="200" />
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
    mData: [15, 22, 39, 14, 31, 15, 20, 39, 14, 31, 15, 20],
    sData: [13, 20, 10, 34, 15, 30, 11, 10, 34, 15, 30, 11],
    mName: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    units: ['单位', '单位'],
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

  const chartColors = ref(['#3c8dbc', '#00a65a', '#f39c12', '#d81b60']);

  const chartData = [
    { name: '江苏', label: '江苏', value: 12, size: 18, color: 'red' },
    { name: '山东', label: '山东', value: 11, size: 15, color: 'green' },
    { name: '吉林', label: '吉林', value: 10, size: 14, color: 'yellow' },
    { name: '浙江', label: '浙江', value: 9, size: 14, color: 'blue' },
    { name: '湖北', label: '湖北', value: 8, size: 14, color: 'skyblue' },
    { name: '黑龙江', label: '黑龙江', value: 7, size: 13, color: 'purple' },
    { name: '湖南', label: '湖南', value: 7, size: 13, color: 'purple' },
    { name: '河北', label: '河北', value: 6, size: 12, color: 'skyblue' },
    { name: '陕西', label: '陕西', value: 5, size: 10, color: 'yellow' },
    { name: '山西', label: '山西', value: 3, size: 10, color: '#9023a0' },
  ];

  const fontSize = ref('18px');
  const fontColor = 'white';
  const bubbleColor = 'red';
</script>
<style lang="less" scoped>
  .right-content {
    flex: 30;
    width: 30%;
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
