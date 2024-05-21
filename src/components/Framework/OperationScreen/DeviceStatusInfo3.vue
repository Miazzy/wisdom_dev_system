<template>
  <div class="device-status-info">
    <div class="total-box">
      <div class="icon-bg">
        <i class="device-icon iconfont" :class="`icon-${icon}`"></i>
      </div>
      <div class="data-box"> {{ label }} {{ total }} </div>
    </div>
    <div class="status-box">
      <div class="status-item online"> 在线 {{ online }} </div>
      <div v-if="showLeave" class="status-item leave"> 离开 {{ leave }} </div>
      <div class="status-item offline"> 离线 {{ offline }} </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  defineProps({
    icon: { type: String, default: '' }, // 设备图标
    label: { type: String, default: '' }, // 标题
    total: { type: Number, default: 0 }, // 总数
    online: { type: Number, default: 0 }, // 在线数
    leave: { type: Number, default: 0 }, // 离开数
    offline: { type: Number, default: 0 }, // 离线数
    showLeave: { type: Boolean, default: false }, // 显示离开数
  });
</script>

<style lang="less" scoped>
  .device-status-info {
    width: 100%;

    .total-box {
      display: flex;
      align-items: center;

      .data-box {
        color: #fff;
        font-size: 0.14rem;
      }
    }

    .icon-bg {
      width: 0.42rem;
      height: 0.42rem;
      margin-right: 0.11rem;
      background: url('../../../assets/images/operationScreen/device-icon-bg.png') no-repeat
        center/0.42rem;
      line-height: 0.42rem;
      text-align: center;

      .device-icon {
        color: #fff;
        font-size: 0.16rem;
      }
    }

    .status-box {
      display: flex;
      align-items: center;
      padding: 0.15rem 0 0 0.05rem;

      .status-item {
        font-size: 0.13rem;
        line-height: 1;

        &.online {
          color: #52c41a;
        }

        &.leave {
          color: #efbd47;
        }

        &.offline {
          color: #ff4d4f;
        }

        & + .status-item {
          margin-left: 0.23rem;
        }
      }
    }
  }
</style>
