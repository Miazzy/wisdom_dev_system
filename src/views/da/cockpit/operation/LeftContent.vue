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
    <div class="bottom-section">
      <h2>下半部分</h2>
      <p>这里可以添加你的内容或组件</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import NumberDisplay from '/@/components/Framework/Chart/NumberDisplay.vue';
  import Indicator from '/@/components/Framework/Chart/Indicator.vue';

  const subtitle = ref({});
  subtitle.value.mtext = '同比';
  subtitle.value.mvalue = '1.6%';
  subtitle.value.stext = '环比';
  subtitle.value.svalue = '-3.6%';
</script>

<style lang="less" scoped>
  .top-section {
    border: 0px solid #ccc;
    padding: 0px;
    width: 100%;
    height: 50%;
  }

  .bottom-section {
    border: 0px solid #ccc;
    padding: 0px;
    width: 100%;
    height: 50%;
  }

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
