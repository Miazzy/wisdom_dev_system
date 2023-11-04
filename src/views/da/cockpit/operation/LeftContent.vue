<template>
  <div class="left-content">
    <div class="top-section">
      <!-- 第一排数字 -->
      <div class="element">
        <NumberDisplay
          title="巡检统计(次)"
          :subtitle="subtitle"
          :value="145"
          tsize="12px"
          vsize="28px"
          bcolor="#01B4F1"
        />
      </div>
      <div class="element">
        <NumberDisplay
          title="工单统计(笔)"
          :subtitle="subtitle"
          :value="331"
          tsize="12px"
          vsize="28px"
          bcolor="#01B4F1"
        />
      </div>
      <div class="element">
        <NumberDisplay
          title="缺陷统计(个)"
          :subtitle="subtitle"
          :value="300"
          tsize="12px"
          vsize="28px"
          bcolor="#01B4F1"
        />
      </div>
      <div class="element">
        <NumberDisplay
          title="两票统计(张)"
          :subtitle="subtitle"
          :value="222"
          tsize="12px"
          vsize="28px"
          bcolor="#01B4F1"
        />
      </div>
      <div class="element">
        <NumberDisplay
          title="隐患统计(项)"
          :subtitle="subtitle"
          :value="22"
          tsize="12px"
          vsize="28px"
          bcolor="#01B4F1"
        />
      </div>
      <div class="element"></div>
    </div>
    <div class="bottom-section" style="margin-top: -150px;">
      <div class="title-content">
        <SubtitleBar :subtitle="`运维统计`" style="margin: 0px 0px 0px 10px">
          <DictSelectBox
            :type="DICT_TYPE.BPM_MODEL_CATEGORY"
            :width="100"
            style="margin-right: 90px"
          />
        </SubtitleBar>
        <IndicatorGroup
          class="indicator-group-layout"
          :data="securityData"
          style="width: 73%; margin-left: 30px"
        />
        <div style="width: 100%; height: 350px">
          <div style="margin: -30px 0 0 0; transform: scale(0.85) translate(-60px, 0px)">
            <EchartLineBarChart
              :data="lbarChartData"
              :colors="chartColors"
              :width="620"
              :height="400"
              :category="pchartData.mName"
              ybgcolor="#01B7D730"
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

  const lbarChartData = [
    [50.0, 34.9, 74.0, 44.2, 55.6, 76.7, 35.6, 62.2, 32.6, 20.0, 62.4, 32.3],
    [32.6, 53.9, 39.0, 56.4, 48.7, 50.7, 75.6, 31.2, 48.7, 39.8, 62.0, 52.3],
    [32.0, 39.2, 13.3, 24.5, 32.3, 15.2, 20.3, 23.4, 23.0, 16.5, 12.0, 26.2],
    [12.0, 29.2, 33.3, 29.5, 35.3, 10.2, 28.3, 33.4, 13.0, 15.5, 14.0, 26.2],
  ];

  const chartColors = ref([['#1C5C99', '#4CAFF9'], ['#105D3A', '#55CFD0'], '#f39c12', '#d81b60']);

  const pchartData = ref({
    lData: [25, 28, 39, 14, 22, 14, 33, 39, 14, 22, 14, 33],
    mData: [15, 22, 39, 14, 31, 15, 20, 39, 14, 31, 15, 20],
    sData: [13, 20, 10, 34, 15, 30, 11, 10, 34, 15, 30, 11],
    mName: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    units: ['单位', '单位'],
  });

</script>

<style lang="less" scoped>
  .left-content {
    flex: 35;
    width: 35%;
    padding: 0px;
    flex-shrink: 0;
    border-left: 0px solid #000;

    .top-section {
      border: 0px solid #ccc;
      padding: 0px;
      width: calc(100% - 15px);
      margin-left: 15px;
      height: 35%;

      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap; /* 使数字自动换行 */

      div.element {
        flex: 49.5%;
        padding: 0px;
      }
    }

    .bottom-section {
      border: 0px solid #ccc;
      padding: 0px;
      width: 100%;
      height: 65%;

      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap; /* 使数字自动换行 */

      .title-content {
        width: 100%;
        height: 30%;
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
