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
      <div class="element">
        <NumberDisplay title="今日发电量(万kWh)" :value="523.45" tsize="12px" vsize="28px" bcolor="#01B4F1" />
      </div>
    </div>
    <div class="bottom-section">
      <h2>下半部分</h2>
      <p>这里可以添加你的内容或组件</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import NumberDisplay from "/@/components/Framework/Chart/NumberDisplay.vue";
  import Indicator from "/@/components/Framework/Chart/Indicator.vue";
</script>

<style lang="less" scoped>

  .top-section {
    border: 0px solid #ccc;
    padding: 0px;
    width:100%;
    height: 50%;
  }

  .bottom-section {
    border: 0px solid #ccc;
    padding: 0px;
    width:100%;
    height: 50%;
  }

  .left-content {
    flex: 33;
    width: 33%;
    padding: 0px;
    flex-shrink: 0; 
    border-left: 0px solid #000;

    .top-section {
      border: 0px solid #ccc;
      padding: 0px;
      width:100%;
      height: 50%;
  
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap; /* 使数字自动换行 */
  
      div.element {
        flex: 50%;
        padding: 0px;
      }
    }
  
    .bottom-section {
      border: 0px solid #ccc;
      padding: 0px;
      width:100%;
      height: 50%;

      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap; /* 使数字自动换行 */

      div.element {
        flex: 18.5%;
        padding: 0px;
        height: 150px;
      }
    }
  }
</style>
