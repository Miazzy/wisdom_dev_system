<template>
  <div class="hidden-defect-progress">
    <div class="rank-icon-box">
      <i class="rank-icon iconfont icon-shubiao" :style="{color: getRankIconColor(index)}"></i>
      <span class="index-text">{{props.index}}</span>
    </div>
    <div class="label-text">{{props.label}}</div>
    <div class="progress-box">
      <a-progress :stroke-color="{'0%': '#4FACFE', '100%': '#00F6FF',}" :percent="props.percent" :showInfo="false" trailColor="rgba(14, 229, 254, 0.1)" :strokeWidth="10" />
    </div>
    <div class="value-text">{{props.value}}</div>
    <div class="percent-text">{{props.percent}}%</div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    index: { type: Number, default: 1 }, // 排名序号
    label: { type: String, default: '' }, // 名
    value: { type: Number, default: 0 }, // 数值
    percent: { type: Number, default: 0 }, // 百分比
  });

  const getRankIconColor = (index) => {
    if (index === 1) {
      return '#FF3232';
    } else if (index === 2) {
      return '#FF9800';
    } else if (index === 3) {
      return '#FFD200';
    } else {
      return '#03A9FF';
    }
  };
</script>

<style lang="less" scoped>
  .hidden-defect-progress {
    display: flex;
    align-items: center;
    font-size: 0.14rem;
    margin-bottom: 0.06rem;

    .rank-icon-box {
      position: relative;
      padding-right: 0.05rem;
      .rank-icon {
        font-size: 0.15rem;
      }
      .index-text {
        position: absolute;
        left: 0;
        top: 0.01rem;
        width: 0.17rem;
        font-size: 0.12rem;
        color: #fff;
        text-align: center;
        transform: scale(0.83);
      }
    }

    .label-text {
      width: 4em;
      color: #d8d9dd;
    }

    .progress-box {
      flex: 1;
      padding: 0 0.16rem 0 0.07rem
    }

    .value-text {
      width: 3em;
      color: #f0f0f0;
    }

    .percent-text {
      width: 4em;
      color: #f0f0f0;
    }
  }
</style>