<template>
  <a-card title="数据看板" :bordered="false">
    <template #extra>
      <Icon icon="ion:settings-outline" :size="17" />
    </template>
    <div class="card-content">
      <div class="data-board-item">
        <div class="label-text">并网容量(MWp)</div>
        <div class="value-text">563.33161</div>
        <!-- <div class="percentage-box">
          <div class="pLabel-text">同比昨日</div>
          <div class="pValue-text up">1.6%</div>
        </div> -->
      </div>
      <div class="data-board-item">
        <div class="label-text">日发电量(kWh)</div>
        <div class="value-text">140349.07</div>
      </div>
      <div class="data-board-item">
        <div class="label-text">实时功率(kW)</div>
        <div class="value-text">162588.25</div>
      </div>
      <div class="data-board-item">
        <div class="label-text">月上网电量(万kWh)</div>
        <div class="value-text">2932.732</div>
      </div>
      <div class="data-board-item">
        <div class="label-text">年上网电量(万kWh)</div>
        <div class="value-text">44179.5866</div>
      </div>

      <div class="data-board-item">
        <div class="label-text">月计划完成率(%)</div>
        <div class="value-text">81.46</div>
      </div>
      <div class="data-board-item">
        <div class="label-text">年计划完成率(%)</div>
        <div class="value-text">71.32</div>
      </div>
      <div class="data-board-item">
        <div class="label-text">月损失电量(万kWh)</div>
        <div class="value-text">289.1381</div>
      </div>
      <div class="data-board-item">
        <div class="label-text">待闭环工单(笔)</div>
        <div class="value-text">0</div>
      </div>
      <div class="data-board-item">
        <div class="label-text">故障告警(台)</div>
        <div class="value-text">6</div>
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
      margin: 0 12px 16px 0;
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
          color: #ff4d4f;
        }
        &.up::before {
          content: '▲';
          display: inline-block;
          transform: scale(0.6);
          color: #ff4d4f;
        }
        &.down {
          color: #52c41a;
        }
        &.down::before {
          content: '▼';
          display: inline-block;
          transform: scale(0.6);
          color: #52c41a;
        }
      }
    }
  }
</style>
