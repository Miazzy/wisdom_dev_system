<template>
  <div class="indicator-item">
    <div class="left">
      <i class="indicator-icon iconfont" :class="`icon-${props.icon}`"></i>
    </div>
    <div class="right">
      <div class="label-text">{{props.label}}</div>
      <div class="value-box">
        <div class="value-text">{{props.value+props.unit}}</div>
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
    width: 3.04rem;
    height: 1.11rem;
    background-color: rgba(7, 29, 54, 0.66);
    border-radius: 0.01rem;
    
    .left {
      width: 0.9rem;
      height: 0.57rem;
      margin-right: 0.04rem;
      background: url('../../../assets/images/operationScreen/middle-indicator-icon-bg.png') no-repeat center/100% 100%;
      text-align: center;
      .indicator-icon {
        display: inline-block;
        font-size: 0.3rem;
        width: 100%;
        background: linear-gradient(0deg, #08fff6, #16cffe);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
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
          color: #00f6ff;
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