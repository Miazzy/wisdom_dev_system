<template>
  <a-card title="数据看板" :bordered="false">
    <template #extra>
      <Icon icon="ion:settings-outline" :size="17" />
    </template>
    <div class="card-content">
      <div class="data-board-item" v-for="i in 6" :key="i">
        <div class="label-text">今日发电量(kW.h)</div>
        <div class="value-text">715,400.00</div>
        <div class="percentage-box">
          <div class="pLabel-text">同比昨日</div>
          <div class="pValue-text up">1.6%</div>
        </div>
      </div>
      <div class="data-board-item" v-for="i in 6" :key="i">
        <div class="label-text">今日发电量(kW.h)</div>
        <div class="value-text">715,400.00</div>
        <div class="percentage-box">
          <div class="pLabel-text">同比昨日</div>
          <div class="pValue-text down">1.6%</div>
        </div>
      </div>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
  import Icon from '@/components/Icon/Icon.vue';
</script>

<style lang="less" scoped>
  .card-content {
    height: 278px;
    padding-top: 16px;
    margin-right: -13px;
    .data-board-item {
      float: left;
      width: 170px;
      height: 100px;
      border-radius: 2px;
      margin: 0 13px 16px 0;
      padding-left: 20px;
      padding-top: 14px;
      line-height: 1;
      .label-text {
        font-size: 13px;
        margin-bottom: 8px;
      }
      .value-text {
        font-size: 24px;
        font-weight: 500;
        margin-bottom: 12px;
      }
      .percentage-box {
        display: flex;
        align-items: center;
        font-size: 12px;
      }
      .pLabel-text {
        margin-right: 11px;
      }
      .pValue-text {
        &.up {
          color: #FF4D4F;
        }
        &.up::before {
          content: '▲';
          display: inline-block;
          transform: scale(0.6);
          color: #FF4D4F;
        }
        &.down {
          color: #52C41A;
        }
        &.down::before {
          content: '▼';
          display: inline-block;
          transform: scale(0.6);
          color: #52C41A;
        }
      }
    }
  }
</style>