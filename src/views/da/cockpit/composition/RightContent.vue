<template>
  <div class="right-content">
    <div class="content-top">
      <SubtitleBar :subtitle="`合同统计`">
        <DictSelectBox
          :type="DICT_TYPE.BPM_MODEL_CATEGORY"
          :width="100"
          style="margin-right: 10px"
        />
      </SubtitleBar>
      <IndicatorGroup
        class="indicator-group-layout"
        :data="workData"
        style="width: 60%; margin: 0 15% 0 20%"
      />
      <div style="width: 100%; height: 185px;">
        <div style="margin: -40px 0 0 20px; transform: scale(0.85) translate(-60px, 0px)">
          <EchartPillarChart :data="pchartData" :width="620" :height="260"/>
        </div>
      </div>
    </div>
    <div class="content-middle">
      <SubtitleBar :subtitle="`任务统计`">
        <DictSelectBox
          :type="DICT_TYPE.BPM_MODEL_CATEGORY"
          :width="100"
          style="margin-right: 10px"
        />
      </SubtitleBar>
      <IndicatorGroup
        class="indicator-group-layout"
        :data="securityData"
        style="width: 80%; margin-left: 10%"
      />
      <div style="width: 100%; height: 185px;">
        <div style="margin: -40px 0 0 20px; transform: scale(0.85) translate(-60px, 0px)">
          <EchartPillarChart :data="pchartData" :width="620" :height="260"/>
        </div>
      </div>
    </div>
    <div class="content-bottom">
      <SubtitleBar :subtitle="`培训统计`">
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
        <div style="margin: -40px 0 0 20px; transform: scale(0.85) translate(-60px, 0px)">
          <EchartPillarChart :data="pchartData" :width="620" :height="260"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import SubtitleBar from '/@/components/Framework/Chart/SubtitleBar.vue';
  import EchartPillarChart from '/@/components/Framework/Chart/EchartPillarChart.vue';
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

  const workData = [
    {
      value: 72,
      label: '未闭环(笔)',
    },
    {
      value: 15.32,
      label: '闭环率(%)',
    },
  ];

  const securityData = [
    {
      value: 93.23,
      label: '考核分摊(万元)',
    },
    {
      value: 32.23,
      label: '补偿返还(万元)',
    },
    {
      value: 98.45,
      label: '分摊率(%)',
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
</script>

<style lang="less" scoped>
  .right-content {
    display: flex;
    flex: 31%;
    width: 31%;
    flex-direction: column;
    height: 100%;

    .content-top,
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
