<template>
  <div class="left-content">
    <div class="top-section">
      <div class="element">
        <NumberDisplay
          title="安全检查(次)"
          :subtitle="subtitle"
          :value="145"
          tsize="12px"
          vsize="28px"
          bcolor="#01B4F1"
        />
      </div>
      <div class="element">
        <NumberDisplay
          title="安全隐患(个)"
          :subtitle="subtitle"
          :value="331"
          tsize="12px"
          vsize="28px"
          bcolor="#01B4F1"
        />
      </div>
      <div class="element">
        <NumberDisplay
          title="安全运行天数"
          :subtitle="subtitle"
          :value="300"
          tsize="12px"
          vsize="28px"
          bcolor="#01B4F1"
        />
      </div>
      <div class="element">
        <NumberDisplay
          title="安全责任书签订率(%)"
          :subtitle="subtitle"
          :value="222"
          tsize="12px"
          vsize="28px"
          bcolor="#01B4F1"
        />
      </div>
      <div class="element">
        <NumberDisplay
          title="安全工器具(个)"
          :subtitle="subtitle"
          :value="22"
          tsize="12px"
          vsize="28px"
          bcolor="#01B4F1"
        />
      </div>
      <div class="element"></div>
      <div class="element"></div>
      <div class="element"></div>
    </div>
    <div class="bottom-section">
      <div class="title-content">
        <SubtitleBar :subtitle="`安全工器具`" style="margin: 0 0 0 10px">
          <DictSelectBox
            :type="DICT_TYPE.BPM_MODEL_CATEGORY"
            :width="100"
            style="margin-right: 30px"
          />
        </SubtitleBar>
        <IndicatorGroup
          class="indicator-group-layout"
          :data="securityData"
          style="width: 84%; margin: 10px 0 0 30px"
        />
        <div style="width: 135%; height: 380px;">
          <div style="transform: scale(0.85);transform-origin: 0 0;">
            <EchartLineBarChart
              :data="barchartData"
              :colors="barchartData.colors"
              :width="730"
              :height="478"
              :category="pchartData.mName"
              ybgcolor="#01B7D730"
              :name="bchartSeriesName"
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
      value: 100,
      label: '待检数(个)',
    },
    {
      value: 15,
      label: '超期未检数(个)',
    },
    {
      value: 82.25,
      label: '合格率(%)',
    },
  ];

  const barchartData = {
    barData: [
      [50.0, 34.9, 74.0, 44.2, 55.6, 76.7, 35.6, 62.2, 32.6, 20.0, 62.4, 32.3],
      [32.6, 53.9, 39.0, 56.4, 48.7, 50.7, 75.6, 31.2, 48.7, 39.8, 62.0, 52.3],
    ],
    lineData: [[32.0, 39.2, 13.3, 24.5, 32.3, 15.2, 20.3, 23.4, 23.0, 16.5, 12.0, 26.2]],
    colors: [
      ['#488FF6', '#60D1F3'],
      ['#078C5D', '#68E4B8'],
      ['#E59837', '#FAE895'],
      '#f39c12',
      '#f39c12',
    ],
  };
  const bchartSeriesName = [['待检数','超期未检数'],['合格率']];

  const pchartData = ref({
    lData: [25, 28, 39, 14, 22, 14, 33, 39, 14, 22, 14, 33],
    barData: [15, 22, 39, 14, 31, 15, 20, 39, 14, 31, 15, 20],
    sData: [13, 20, 10, 34, 15, 30, 11, 10, 34, 15, 30, 11],
    mName: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    units: ['单位', '单位', '单位'],
    colors: [['#078C5D', '#68E4B8'], '#60C0C0', '#60A0A0'],
  });

</script>

<style lang="less" scoped>
  .left-content {
    flex: 35;
    flex-shrink: 0;
    width: 35%;
    padding: 0;
    border-left: 0 solid #000;

    .top-section {
      display: flex;
      flex-wrap: wrap; /* 使数字自动换行 */
      align-items: top;
      justify-content: center;
      width: calc(100% - 15px);
      height: 40%;
      margin-top: 25px;
      margin-left: 15px;
      padding: 0;
      border: 0 solid #ccc;

      div.element {
        flex: 49.5%;
        padding: 0;
      }
    }

    .bottom-section {
      display: flex;
      flex-wrap: wrap; /* 使数字自动换行 */
      align-items: top;
      justify-content: center;
      width: calc(100% - 15px);
      height: 60%;
      margin-top: 0;
      margin-left: 15px;
      padding: 0;
      border: 0 solid #ccc;

      .title-content {
        width: 100%;
        height: 30%;
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
