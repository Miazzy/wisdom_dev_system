<template>
  <div class="device-number-statistics">
    <div class="device-icon-box">
      <i class="device-icon iconfont" :class="`icon-${props.icon}`"></i>
    </div>
    <div class="data-box">
      <div class="device-name-text">{{props.deviceName}}</div>
      <div class="device-num-box">
        <span class="value-text">{{props.value}}</span>
        <span class="unit-text">{{props.unit}}</span>
      </div>
      <div class="percentage-box">
        <span class="percentage-value" :class="getPValueColor(props.pValue)">{{props.pValue}}%</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    icon: { type: String, default: '' }, // 设备图标
    deviceName: { type: String, default: '' }, // 设备名
    value: { type: Number, default: 0 }, // 设备数
    unit: { type: String, default: '' }, // 单位
    pValue: { type: Number, default: 0 }, // 同比
  });

  const getPValueColor = (value) => {
    if (value > 0) {
      return 'arrow-positive';
    } else if (value < 0) {
      return 'arrow-negative';
    } else {
      return '';
    }
  };
</script>

<style lang="less" scoped>
  .device-number-statistics {
    display: flex;
    align-items: center;
    .device-icon-box {
      width: 47px;
      height: 47px;
      line-height: 47px;
      background: url('../../../assets/images/operationScreen/device-icon-bg2.png') no-repeat
        center/100% 100%;
      text-align: center;
      margin-right: 14px;
      .device-icon {
        display: inline-block;
        font-size: 16px;
        width: 100%;
        background: linear-gradient(0deg, #89f7fe, #01b4f1);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .data-box {
      width: 132px;
      display: flex;
      align-items: center;
      padding: 10px 0;
      line-height: 1;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      .device-name-text {
        flex: 1.1;
        color: #fff;
        font-size: 12px;
      }
      .device-num-box {
        flex: 1;
        .value-text {
          font-size: 16px;
          color: #00f6ff;
        }
        .unit-text {
          color: #fff;
          font-size: 12px;
        }
      }
      .percentage-box {
        flex: 1.2;
        .percentage-value {
            font-size: 14px;
          }
          .arrow-positive {
            color: #ff4f38;
          }

          .arrow-negative {
            color: #00ba24;
          }

          .arrow-positive::before {
            content: '▲';
            display: inline-block;
            transform: scale(0.6);
            color: #ff4f38;
          }

          .arrow-negative::before {
            content: '▼';
            display: inline-block;
            transform: scale(0.6);
            color: #00ba24;
          }
      }
    }
  }
</style>