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
    font-size: 14px;
    margin-bottom: 6px;

    .rank-icon-box {
      position: relative;
      padding-right: 5px;
      .rank-icon {
        font-size: 15px;
      }
      .index-text {
        position: absolute;
        left: 0;
        top: 1px;
        width: 17px;
        font-size: 12px;
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
      padding: 0 16px 0 7px;
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