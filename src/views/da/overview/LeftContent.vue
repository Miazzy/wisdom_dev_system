<template>
  <div class="left-content">
    <div class="top-section">
      <!-- 第一排数字 -->
      <div class="element">
        <NumberDisplay title="今日发电量(万kWh)" :value="523.45" tsize="12px" vsize="28px" bcolor="#01B4F1" />
      </div>
      <div class="element">
        <NumberDisplay title="今日发电量(万kWh)" :value="523.45" tsize="12px" vsize="28px" bcolor="#01B4F1" />
      </div>
      <div class="element">
        <NumberDisplay title="今日发电量(万kWh)" :value="523.45" tsize="12px" vsize="28px" bcolor="#01B4F1" />
      </div>
      <div class="element">
        <NumberDisplay title="今日发电量(万kWh)" :value="523.45" tsize="12px" vsize="28px" bcolor="#01B4F1" />
      </div>
    </div>

    <div class="middel-section">
      <!-- EchartChinaMap 组件 -->
      <EchartChinaMap
        :title="``"
        :data="chinaRegionData"
        :width="800"
        :height="600"
        :zoom="1.35"
        :offset="150"
      />
    </div>

    <!-- 一排数据 -->
    <div class="bottom-data">
      <span class="data-label">数据1:</span>
      <span class="data-value">9876</span>
      <span class="data-label">数据2:</span>
      <span class="data-value">5432</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import EchartChinaMap from '/@/components/Framework/Chart/EchartChinaMap.vue';
  import NumberDisplay from "/@/components/Framework/Chart/NumberDisplay.vue";

  // 定义你的数据和属性
  const chinaRegionData = ref([]);
  chinaRegionData.value = [
    { name: '四川省', value: 102 },
    { name: '云南省', value: 522 },
    { name: '河南省', value: 1023 },
    { name: '河北省', value: 3023 },
    { name: '山西省', value: 2023 },
    { name: '黑龙江省', value: 1523 },
    { name: '吉林省', value: 2932 },
    { name: '辽宁省', value: 0 },
    { name: '江苏省', value: 0 },
    { name: '浙江省', value: 0 },
    { name: '安徽省', value: 0 },
    { name: '福建省', value: 0 },
    { name: '江西省', value: 0 },
    { name: '山东省', value: 0 },
    { name: '湖北省', value: 0 },
    { name: '湖南省', value: 0 },
    { name: '广东省', value: 0 },
    { name: '海南省', value: 0 },
    { name: '贵州省', value: 0 },
    { name: '陕西省', value: 0 },
    { name: '甘肃省', value: 0 },
    { name: '青海省', value: 0 },
    { name: '台湾省', value: 0 },
    { name: '内蒙古自治区', value: 0 },
    { name: '广西壮族自治区', value: 0 },
    { name: '西藏自治区', value: 0 },
    { name: '宁夏回族自治区', value: 0 },
    { name: '新疆维吾尔自治区', value: 0 },
    { name: '北京市', value: 0 },
    { name: '天津市', value: 0 },
    { name: '上海市', value: 0 },
    { name: '重庆市', value: 0 },
    { name: '香港特别行政区', value: 0 },
    { name: '澳门特别行政区', value: 0 },
  ];
</script>

<style lang="less" scoped>
  .left-content {
    flex: 40;
    width: 45%;
    background-color: #eee;
    padding: 0px;
    flex-shrink: 0; 
  }

  .top-section {
    margin-bottom: 20px;
    height: 150px;
    border-bottom: 0px solid #fefefe;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap; /* 使数字自动换行 */

    div.element {
      flex: 50%;
      background-color: #eee;
      padding: 0px;
    }
  }

  .middel-section {
    margin-top: -80px;
    margin-left: -80px;
  }

  .number {
    display: inline-block;
    margin-right: 20px;
  }

  .number .label {
    font-weight: bold;
  }

  .data-label {
    font-weight: bold;
    margin-right: 10px;
  }
</style>
