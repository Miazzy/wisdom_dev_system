<template>
  <div class="left-content">
    <div class="top-section">
      <div class="content" style="">
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
    <div class="bottom-section">
      <div class="element"> 
        <Indicator class="indicator-margin" :title="`电站规模(座)`" :value="30.2" :subtitle="`同比`" :percent="12.3" />
      </div>
      <div class="element">
        <Indicator class="indicator-margin" :title="`并网容量(MW)`" :value="30332.2423" :subtitle="`同比`" :percent="33.3" />
      </div>
      <div class="element">
        <div class="security-box">
          <div class="value-text">2652</div>
          <div class="title-text">安全运行(天)</div>
        </div>
      </div>
      <div class="element">
        <Indicator class="indicator-margin" :title="`待处理隐患(项)`" :value="152" :subtitle="`处理率`" :percent="42.3" color="green" />
      </div>
      <div class="element">
        <Indicator class="indicator-margin" :title="`故障告警(台)`" :value="153" :subtitle="`处理时长`" :percent="`12.2h`" color="green" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import EchartChinaMap from '/@/components/Framework/Chart/EchartChinaMap.vue';
  import NumberDisplay from "/@/components/Framework/Chart/NumberDisplay.vue";
  import Indicator from "/@/components/Framework/Chart/Indicator.vue";

  // 定义你的数据和属性
  const chinaRegionData = ref([]);
  chinaRegionData.value = [
    { name: '四川省', value: 102, color: '#F7C824' },
    { name: '云南省', value: 522, color: '#2BEBC8' },
    { name: '河南省', value: 1023, color: '#035B85' },
    { name: '河北省', value: 3023, color: '#8FD0F4' },
    { name: '山西省', value: 2023, color: '#2BEBC8' },
    { name: '黑龙江省', value: 1523, color: '#2BEBC8' },
    { name: '吉林省', value: 2932, color: '#2BEBC8' },
    { name: '辽宁省', value: 0, color: '#fefefe' },
    { name: '江苏省', value: 0, color: '#fefefe' },
    { name: '浙江省', value: 0, color: '#fefefe' },
    { name: '安徽省', value: 0, color: '#fefefe' },
    { name: '福建省', value: 0, color: '#fefefe' },
    { name: '江西省', value: 0, color: '#fefefe' },
    { name: '山东省', value: 0, color: '#fefefe' },
    { name: '湖北省', value: 0, color: '#fefefe' },
    { name: '湖南省', value: 0, color: '#fefefe' },
    { name: '广东省', value: 0, color: '#fefefe' },
    { name: '海南省', value: 0, color: '#fefefe' },
    { name: '贵州省', value: 0, color: '#fefefe' },
    { name: '陕西省', value: 0, color: '#fefefe' },
    { name: '甘肃省', value: 0, color: '#fefefe' },
    { name: '青海省', value: 0, color: '#fefefe' },
    { name: '台湾省', value: 0, color: '#fefefe' },
    { name: '内蒙古自治区', value: 0, color: '#fefefe' },
    { name: '广西壮族自治区', value: 0, color: '#fefefe' },
    { name: '西藏自治区', value: 0, color: '#fefefe' },
    { name: '宁夏回族自治区', value: 0, color: '#fefefe' },
    { name: '新疆维吾尔自治区', value: 0, color: '#fefefe' },
    { name: '北京市', value: 0, color: '#fefefe' },
    { name: '天津市', value: 0, color: '#fefefe' },
    { name: '上海市', value: 0, color: '#fefefe' },
    { name: '重庆市', value: 0, color: '#fefefe' },
    { name: '香港特别行政区', value: 0, color: '#fefefe' },
    { name: '澳门特别行政区', value: 0, color: '#fefefe' },
    { name: '南海诸岛', value: 0, color: '#fefefe' },
  ];
</script>

<style lang="less" scoped>
  .left-content {
    flex: 40;
    flex-shrink: 0;
    width: 45%;
    padding: 0; 
    border-left: 0 solid #000;

    .top-section {
      height: 150px;
      margin-bottom: 20px;
      .content {
        display: flex;
        flex-wrap: wrap; /* 使数字自动换行 */
        align-items: center;
        justify-content: center;
        margin: 0px 20px;

        div.element {
          flex: 45%;
          padding: 0;
        }
      }
    }

    .middel-section {
      margin-top: -80px;
      margin-left: -80px;
    }
  
    .bottom-section {
      display: flex;
      flex-wrap: wrap; /* 使数字自动换行 */
      align-items: center;
      justify-content: center;
      margin: 0 15px;

      div.element {
        flex: 18.5%;
        height: 150px;
        padding: 0;
      }

      .indicator-margin {
        margin-top: 60px;
      }
    }

    .security-box {
      width: 138px;
      height: 146px;
      padding-top: 35px;
      background: url('../../../../assets/images/security.png') no-repeat center/contain;
      line-height: 1;
      text-align: center;

      .value-text {
        margin-bottom: 6px;
        color: #fff;
        font-size: 26px;
        font-weight: 600;
      }

      .title-text {
        color: #07A5FD;
        font-size: 14px;
      }
    }
  }
</style>
