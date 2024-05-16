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
        <span class="percentage-value" :class="getPValueColor(props.pValue)">{{props.pValue}}{{props.hasBracket? '(%)':'%'}}</span>
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
    hasBracket: { type: Boolean, default: true }, // 百分比是否加括号
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
      width: 0.47rem;
      height: 0.47rem;
      line-height: 0.47rem;
      background: url('../../../assets/images/operationScreen/device-icon-bg2.png') no-repeat
        center/100% 100%;
      text-align: center;
      margin-right: 0.14rem;
      .device-icon {
        display: inline-block;
        font-size: 0.16rem;
        width: 100%;
        background: linear-gradient(180deg, #1890FF, #18C8FF);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .data-box {
      width: 1.44rem;
      display: flex;
      align-items: center;
      padding: 0.1rem 0;
      line-height: 1;
      border-bottom: 0.01rem solid rgba(255, 255, 255, 0.1);
      .device-name-text {
        flex: 1.1;
        color: #fff;
        font-size: 0.12rem;
      }
      .device-num-box {
        flex: 1;
        .value-text {
          font-size: 0.16rem;
          color: #1890FF;
        }
        .unit-text {
          color: #fff;
          font-size: 0.12rem;
        }
      }
      .percentage-box {
        flex: 1.3;
        .percentage-value {
            font-size: 0.14rem;
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