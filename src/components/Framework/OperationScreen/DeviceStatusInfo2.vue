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
    height: 60px;
    padding-left: 30px;
    background: url('../../../assets/images/operationScreen/device-status-bg.png') no-repeat left/auto 60px;
    .icon-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      .device-icon {
        color: #fff;
        font-size: 26px;
      }
    }

    .data-box {
      width: 100%;
      height: 60px;
      padding: 0 30px;
      border-radius: 2px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .info-item {
        flex: 1;
        position: relative;
        line-height: 1;
        .info-label {
          margin-bottom: 10px;
          text-align: center;
          font-size: 12px;
        }
        .info-value {
          text-align: center;
          font-weight: 500;
          font-size: 18px;
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
          top: 5px;
          right: 0;
          width: 0;
          height: 32px;
          border-right: 1px dashed #fff;
          opacity: 0.6;
        }
      }
    }
  }
</style>