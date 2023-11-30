<template>
  <div class="device-status-info">
    <div class="left">
      <div class="icon-bg">
        <i class="device-icon iconfont" :class="`icon-${props.icon}`"></i>
      </div>
    </div>
    <div class="middle">
      <div class="title-ch">{{props.deviceNameCh}}</div>
      <div class="title-en">{{props.deviceNameEn}}</div>
    </div>
    <div class="right">
      <div class="info-item">
        <div>
          <div class="info-label">总数</div>
          <div class="info-value">{{props.total}}</div>
        </div>
      </div>
      <div class="info-item online">
        <span class="cicle"></span>
        <div>
          <div class="info-label">在线</div>
          <div class="info-value">{{props.online}}</div>
        </div>
      </div>
      <div class="info-item fault">
        <span class="cicle"></span>
        <div>
          <div class="info-label">故障</div>
          <div class="info-value">{{props.fault}}</div>
        </div>
      </div>
      <div class="info-item offline">
        <span class="cicle"></span>
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
    deviceNameCh: { type: String, default: '' }, // 设备名中文
    deviceNameEn: { type: String, default: '' }, // 设备名英文
    total: { type: Number, default: 0 }, // 总数
    online: { type: Number, default: 0 }, // 在线数
    fault: { type: Number, default: 0 }, // 故障树
    offline: { type: Number, default: 0 }, // 离线数
  });
</script>

<style lang="less" scoped>
  .device-status-info {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 12px 10px 9px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    &:last-child {
      border-bottom: none;
    }

    .left {
      flex: 1;
      .icon-bg {
        width: 42px;
        height: 42px;
        line-height: 42px;
        background: url('../../../assets/images/operationScreen/device-icon-bg.png') no-repeat
          center/100% 100%;
        text-align: center;
      }
      .device-icon {
        color: #fff;
        font-size: 18px;
      }
    }

    .middle {
      flex: 2.3;
      line-height: 1;
      .title-ch {
        color: #fff;
        font-size: 14px;
        margin-bottom: 8px;
      }
      .title-en {
        color: #fff;
        font-size: 12px;
        opacity: 0.6;
      }
    }

    .right {
      flex: 4.2;
      color: #fff;
      display: flex;
      justify-content: space-between;
      .info-item {
        display: flex;
        line-height: 1;
        .cicle {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin: 2px 4px 0 0 ;
        }
        .info-label {
          margin-bottom: 6px;
          text-align: center;
          font-size: 12px;
          color: #fff;
        }
        .info-value {
          text-align: center;
          font-weight: 500;
          font-size: 14px;
          color: #fff;
        }
        &.online {
          .cicle {
            background-color: #00BA24;
          }
          .info-label {
            color: #00BA24;
          }
        }
        &.fault {
          .cicle {
            background-color: #FF4F38;
          }
          .info-label {
            color: #FF4F38;
          }
        }
        &.offline {
          .cicle {
            background-color: #AAAAAA;
          }
          .info-label {
            color: #AAAAAA;
          }
        }
      }
    }
  }
</style>