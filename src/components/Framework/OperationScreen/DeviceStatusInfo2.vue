<template>
  <div class="device-status-info">
    <div class="icon-bg">
      <i class="device-icon iconfont" :class="`icon-${props.icon}`"></i>
    </div>
    <div class="data-box">
      <div class="info-item total">
        <div>
          <div class="info-label">总数</div>
          <div class="info-value">{{props.total}}</div>
        </div>
      </div>
      <div class="info-item online has-divider">
        <div>
          <div class="info-label">在线</div>
          <div class="info-value">{{props.online}}</div>
        </div>
      </div>
      <div class="info-item fault has-divider">
        <div>
          <div class="info-label">故障</div>
          <div class="info-value">{{props.fault}}</div>
        </div>
      </div>
      <div class="info-item offline">
        <div>
          <div class="info-label">离线</div>
          <div class="info-value">{{props.offline}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    icon: { type: String, default: '' }, // 设备图标
    total: { type: Number, default: 0 }, // 总数
    online: { type: Number, default: 0 }, // 在线数
    fault: { type: Number, default: 0 }, // 故障树
    offline: { type: Number, default: 0 }, // 离线数
  });
</script>

<style lang="less" scoped>
  .device-status-info {
    position: relative;
    width: 100%;
    height: 0.6rem;
    padding-left: 0.3rem;
    background: url('../../../assets/images/operationScreen/device-status-bg.png') no-repeat left/auto 0.6rem;
    .icon-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 0.6rem;
      height: 0.6rem;
      line-height: 0.6rem;
      text-align: center;
      .device-icon {
        color: #fff;
        font-size: 0.26rem;
      }
    }

    .data-box {
      width: 100%;
      height: 0.6rem;
      padding: 0 0.3rem;
      border-radius: 0.02rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .info-item {
        flex: 1;
        position: relative;
        line-height: 1;
        .info-label {
          margin-bottom: 0.1rem;
          text-align: center;
          font-size: 0.12rem;
        }
        .info-value {
          text-align: center;
          font-weight: 500;
          font-size: 0.18rem;
        }
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
        &.has-divider::before {
          content: '';
          position: absolute;
          top: 0.05rem;
          right: 0;
          width: 0;
          height: 0.32rem;
          border-right: 0.01rem dashed #fff;
          opacity: 0.6;
        }
      }
    }
  }
</style>