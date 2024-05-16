<template>
  <div class="indicator-item">
    <div class="left" :class="`${props.icon}`"></div>
    <div class="right">
      <div class="label-text">{{props.label}}</div>
      <div class="value-box">
        <div class="value-text" :style="`color: ${vColor}`">{{props.value+props.unit}}</div>
        <div class="percentage-box" v-if="props.pLabel">
          <span class="percentage-label">{{props.pLabel}}</span>
          <span class="percentage-value" :class="getPValueColor(props.pValue)">{{props.pValue}}{{props.hasBracket? '(%)':'%'}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    icon: { type: String, default: '' }, // 图标
    label: { type: String, default: '' }, // 指标项
    value: { type: Number, default: 0 }, // 指标值
    vColor: { type: String, default: '' }, // 指标值颜色
    pLabel: { type: String, default: '' }, // 同比项
    pValue: { type: Number, default: 0 }, // 同比百分比
    unit: { type: String, default: '' }, // 单位
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
  .indicator-item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 15.83vw;
    height: 10.09vh;
    background-color: rgba(24, 144, 255, 0.1);
    border-radius: 0.04rem;
    border: 0.01rem solid rgba(24, 144, 255, 0.3);
    
    .left {
      width: 29.6%;
      height: 52.29%;
      margin-right: 5%;
      text-align: center;
      &.gf-capacity {
        background: url('../../../assets/images/operationScreen/gf-capacity.png') no-repeat center/auto 100%;
      }
      &.cn-capacity {
        background: url('../../../assets/images/operationScreen/cn-capacity.png') no-repeat center/auto 100%;
      }
      &.safe-operation {
        background: url('../../../assets/images/operationScreen/safe-operation.png') no-repeat center/auto 100%;
      }
      &.active-power {
        background: url('../../../assets/images/operationScreen/active-power.png') no-repeat center/auto 100%;
      }
      &.max-active {
        background: url('../../../assets/images/operationScreen/max-active.png') no-repeat center/auto 100%;
      }
      &.today-gen {
        background: url('../../../assets/images/operationScreen/today-gen.png') no-repeat center/auto 100%;
      }
      &.rate {
        background: url('../../../assets/images/operationScreen/rate.png') no-repeat center/auto 100%;
      }
      &.loss {
        background: url('../../../assets/images/operationScreen/loss.png') no-repeat center/auto 100%;
      }
      &.person-total {
        background: url('../../../assets/images/operationScreen/person-total.png') no-repeat center/auto 100%;
      }
    }

    .right {
      line-height: 1;
      .label-text {
        font-size: 0.14rem;
        color: #fff;
        margin-bottom: 0.08rem;
      }
      .value-box {
        display: flex;
        align-items: baseline;
        .value-text {
          font-size: 0.28rem;
          font-weight: 500;
          margin-right: 0.08rem;
        }
        .percentage-box {
          display: flex;
          .percentage-label {
            font-size: 0.12rem;
            color: #fff;
            opacity: 0.6;
            margin-right: 0.07rem;
          }
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
  }
</style>