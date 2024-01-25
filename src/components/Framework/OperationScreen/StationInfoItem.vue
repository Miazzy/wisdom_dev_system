<template>
  <div class="station-info-item">
    <div class="station-name">
      {{props.stationName}}
    </div>
    <div class="data-box">
      <div class="info-item">
        <div class="info-text total">总数 ({{props.total}})</div>
      </div>
      <div class="info-item">
        <div class="info-text online">在线 ({{props.online}})</div>
      </div>
      <div class="info-item">
        <div class="info-text fault">故障 ({{props.fault}})</div>
      </div>
      <div class="info-item">
        <div class="info-text offline">离线({{props.offline}})</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    stationName: { type: String, default: '' }, // 电站名
    total: { type: Number, default: 0 }, // 总数
    online: { type: Number, default: 0 }, // 在线数
    fault: { type: Number, default: 0 }, // 故障树
    offline: { type: Number, default: 0 }, // 离线数
  });
</script>

<style lang="less" scoped>
  .station-info-item {
    height: 0.64rem;
    padding: 0.14rem 0.2rem;
    line-height: 1;
    border-bottom: 0.01rem solid rgba(255, 255, 255, 0.1);
    &:last-child {
      border-bottom: none;
    }
    &:hover {
      background-color: rgba(255, 255, 255, 0.06);
    }

    .station-name {
      color: #fff;
      font-size: 0.14rem;
      margin-bottom: 0.09rem;
    }

    .data-box {
      display: flex;
      justify-content: flex-start;
      padding-right: 1rem;
      opacity: 0.8;
      .info-item {
        flex: 1;
        .info-text {
          font-size: 0.12rem;
          &.total {
            color: #fff;
          }
          &.online {
            color: #00ba24;
          }
          &.fault {
            color: #ff4f38;
          }
          &.offline {
            color: #aaaaaa;
          }
        }
      }
    }
  }
</style>