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
      <div class="element process" style="height: 140px;padding-right: 30px;">
        <IndicatorCard :data="indicatorCardData1" />
        <IndicatorCard :data="indicatorCardData2" />
        <IndicatorCard :data="indicatorCardData3" />
      </div>
    </div>
    <div class="middel-section">
      <div class="title-content">
        <SubtitleBar :subtitle="`电站能效排行`" style="margin: 0 0 0 10px">
          <DictSelectBox
            :type="DICT_TYPE.BPM_MODEL_CATEGORY"
            :width="100"
            style="margin-right: 30px"
          />
        </SubtitleBar>
        <div style="width: 100%; height: auto; margin: -44px 0 0">
          <div style="margin: 0; transform: scale(0.85) translate(-60px, 0)">
            <EchartPillarChart
              :data="pchartData"
              :colors="pchartData.colors"
              :width="760"
              :height="220"
              :name="pchartName"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-section">
      <div class="title-content">
        <SubtitleBar :subtitle="`电站电量排行`" style="margin: 0 0 0 10px">
          <DictSelectBox
            :type="DICT_TYPE.BPM_MODEL_CATEGORY"
            :width="100"
            style="margin-right: 30px"
          />
        </SubtitleBar>
        <div style="width: 100%; height: auto; margin: -44px 0 0">
          <div style="margin: 0; transform: scale(0.85) translate(-60px, 0)">
            <EchartPillarChart
              :data="spchartData"
              :colors="spchartData.colors"
              :width="760"
              :height="220"
              :name="spchartName"
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
  import IndicatorCard from '/@/components/Framework/Chart/IndicatorCard.vue';
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

  const indicatorCardData1 = ref({
    label: '综合厂用电率(%)',
    value: 1.36,
    lPercent: '1.6',
    rPercent: -1.6,
    iconName: 'factoryIcon'
  });
  const indicatorCardData2 = ref({
    label: '系统效率(%)',
    value: 80.45,
    lPercent: '1.6',
    rPercent: -1.6,
    iconName: 'efficiencyIcon'
  });
  const indicatorCardData3 = ref({
    label: '计划完成(%)',
    value: 95.56,
    lPercent: '1.6',
    rPercent: -1.6,
    iconName: 'planIcon'
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

  // 电站能效排行
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
    colors: [['#488FF6', '#60D1F3'], ['#E59837', '#FAE895'], ['#078C5D', '#68E4B8']],
  });
  const pchartName = ['等效小时数', '同比', '环比'];

  // 电站电量排行
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
    colors: [['#078C5D', '#68E4B8'], ['#E59837', '#FAE895'], ['#078C5D', '#68E4B8']],
  });  
  const spchartName = ['上网电量', '同比', '环比'];
</script>

<style lang="less" scoped>
  .left-content {
    flex: 40;
    flex-shrink: 0;
    width: 40%;
    padding: 0;
    border-left: 0 solid #000;

    .top-section {
      display: flex;
      flex-wrap: wrap; /* 使数字自动换行 */
      align-items: top;
      justify-content: center;
      width: calc(100% - 15px);
      height: calc(22% + 140px);
      margin-top: 25px;
      margin-left: 15px;
      padding: 0;
      border: 0 solid #ccc;

      div.element {
        flex: 49.5%;
        padding: 0;
      }

      .process {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 9px;
      }
    }

    .middel-section,
    .bottom-section {
      display: flex;
      flex-wrap: wrap; /* 使数字自动换行 */
      align-items: top;
      justify-content: center;
      width: calc(100% - 15px);
      height: calc(39% - 75px);
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
