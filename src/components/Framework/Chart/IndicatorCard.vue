<template>
  <div class="indicator-card">
    <div class="icon-box">
      <img :src="icons[iconName]" style="width: 0.5rem;" />
    </div>
    <div class="label-text">{{label}}</div>
    <div class="value-text">{{formatPercent(value)}}</div>
    <div class="info">
      <div class="info-item" style="margin-right: 0.14rem;">
        <span class="slabel-text">同比</span>
        <span v-if="lPercent!=0" class="trend" :class="lPercent>=0?'red':'green'"></span>
        <span class="svalue-text" :class="lPercent>=0?'red':'green'">{{ formatPercent(lPercent) }}</span>
      </div>
      <div class="info-item">
        <span class="slabel-text">环比</span>
        <span v-if="rPercent!=0" class="trend" :class="rPercent>=0?'red':'green'"></span>
        <span class="svalue-text" :class="rPercent>=0?'red':'green'">{{ formatPercent(rPercent) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, PropType, toRefs } from 'vue';
  import factoryIcon from '/@/assets/images/factory-icon.png';
  import efficiencyIcon from '/@/assets/images/efficiency-icon.png';
  import planIcon from '/@/assets/images/plan-icon.png';

  const icons = {
    factoryIcon,
    efficiencyIcon,
    planIcon
  };

  type CardData = {
    label: string;
    value: string | number;
    lPercent: string | number;
    rPercent: string | number;
    iconName: string;
  };

  const props = defineProps({
    data: { type: Object as PropType<CardData> },
  });

  const { label, value, lPercent, rPercent, iconName } = toRefs(props.data);

  const formatPercent = (value) => {
    if (typeof value == 'number') {
      return `${value.toFixed(2)}%`;
    } else {
      return `${value as string}%`;
    }
  };
</script>

<style lang="less" scoped>
  .indicator-card {
    width: 2rem;
    height: 1.4rem;
    border-radius: 0.02rem;
    background: linear-gradient(0deg, rgb(53 158 255 / 8%) 0%, rgb(53 158 255 / 0%) 100%);
    font-family: Arial, sans-serif;
    line-height: 1;
    text-align: center;
  }

  .icon-box {
    height: 0.5rem;
    margin-bottom: 0.12rem;
  }

  .label-text {
    margin-bottom: 0.08rem;
    color: #fff;
    font-size: 0.14rem;
  }

  .value-text {
    margin-bottom: 0.1rem;
    color: #32afff;
    font-size: 0.24rem;
    font-weight: 600;
  }

  .info {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    .info-item {
      display: flex;
      align-items: center;
    }

    .slabel-text {
      margin-right: 0.07rem;
      color: rgb(255 255 255 / 60%);
      font-size: 0.12rem;
    }

    .svalue-text {
      font-size: 0.12rem;

      &.red {
        color: #ff4f38;
      }

      &.green {
        color: #00ba24;
      }
    }

    .trend {
      width: 0.08rem;
      border: 0.04rem solid transparent;

      &.red {
        border-top: none;
        border-bottom: 0.04rem solid #ff4f38;
      }

      &.green {
        border-top: 0.04rem solid #00ba24;
        border-bottom: none;
      }
    }
  }
</style>
