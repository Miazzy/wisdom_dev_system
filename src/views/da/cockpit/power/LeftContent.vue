<template>
  <div class="left-content">
    <div class="top-section">
      <div class="element">
        <NumberDisplay
          title="实发电量(万kWh)"
          :subtitle="subtitle"
          :value="1945.9933"
          tsize="12px"
          vsize="28px"
          bcolor="#01B4F1"
        />
      </div>
      <div class="element">
        <NumberDisplay
          title="上网电量(万kWh)"
          :subtitle="subtitle"
          :value="1525.4139"
          tsize="12px"
          vsize="28px"
          bcolor="#01B4F1"
        />
      </div>
      <div class="element">
        <NumberDisplay
          title="结算电量(万kWh)"
          :subtitle="subtitle"
          :value="305.2288"
          tsize="12px"
          vsize="28px"
          bcolor="#01B4F1"
        />
      </div>
      <div class="element">
        <NumberDisplay
          title="电量损失(万kWh)"
          :subtitle="subtitle"
          :value="22.2633"
          tsize="12px"
          vsize="28px"
          bcolor="#01B4F1"
        />
      </div>
      <div class="element process" style="height: 140px"> </div>
    </div>
    <div class="middel-section">
      <div class="title-content">
        <SubtitleBar :subtitle="`电站能效排行`" style="margin: 0px 0px 0px 10px">
          <DictSelectBox
            :type="DICT_TYPE.BPM_MODEL_CATEGORY"
            :width="100"
            style="margin-right: 30px"
          />
        </SubtitleBar>
        <div style="width: 135%; height: auto; margin: -75px 0 0 0px">
          <div style="margin: 0px 0 0 0; transform: scale(0.85) translate(-60px, 0px)">
            <EchartPillarChart
              :data="pchartData"
              :colors="pchartData.colors"
              :width="760"
              :height="330"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-section" style="margin-top: -10px">
      <div class="title-content">
        <SubtitleBar :subtitle="`电站电量排行`" style="margin: 0px 0px 0px 10px">
          <DictSelectBox
            :type="DICT_TYPE.BPM_MODEL_CATEGORY"
            :width="100"
            style="margin-right: 30px"
          />
        </SubtitleBar>
        <div style="width: 135%; height: auto; margin: -75px 0 0 0px">
          <div style="margin: -47.5px 0 0 0; transform: scale(0.85) translate(-60px, 0px)">
            <EchartPillarChart
              :data="spchartData"
              :colors="spchartData.colors"
              :width="760"
              :height="330"
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
  import EchartPillarChart from '/@/components/Framework/Chart/EchartPillarChart.vue';
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

  const pchartData = ref({
    barData: [15, 22, 39, 14, 31, 15, 20, 39, 14, 31, 15, 20],
    lineData: [
      [25, 28, 39, 14, 22, 14, 33, 39, 14, 22, 14, 33],
      [13, 20, 10, 34, 15, 30, 11, 10, 34, 15, 30, 11],
    ],
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

  const spchartData = ref({
    barData: [15, 22, 39, 14, 31, 15, 20, 39, 14, 31, 15, 20],
    lineData: [
      [25, 28, 39, 14, 22, 14, 33, 39, 14, 22, 14, 33],
      [13, 20, 10, 34, 15, 30, 11, 10, 34, 15, 30, 11],
    ],
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
    colors: [['#078C5D', '#68E4B8'], '#60C0C0', '#60A0A0'],
  });
</script>

<style lang="less" scoped>
  .left-content {
    flex: 40;
    width: 40%;
    padding: 0px;
    flex-shrink: 0;
    border-left: 0px solid #000;

    .top-section {
      border: 0px solid #ccc;
      padding: 0px;
      width: calc(100% - 15px);
      margin-top: 25px;
      margin-left: 15px;
      height: calc(22% + 140px);

      display: flex;
      justify-content: center;
      align-items: top;
      flex-wrap: wrap; /* 使数字自动换行 */

      div.element {
        flex: 49.5%;
        padding: 0px;
      }
    }

    .middel-section,
    .bottom-section {
      border: 0px solid #ccc;
      padding: 0px;
      width: calc(100% - 15px);
      margin-left: 15px;
      margin-top: 0px;
      height: calc(39% - 75px);

      display: flex;
      justify-content: center;
      align-items: top;
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
