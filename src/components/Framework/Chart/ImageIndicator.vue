<template>
  <div class="image-indicator">
    <div class="image-container">
      <img :src="props.src" alt="Indicator Image" />
    </div>
    <div class="info-container">
      <div class="title">{{ props.title }}</div>
      <div class="data-container">
        <div class="data-row" style="width: 55%">
          <span class="data-label">{{ props.text }}:</span>
          <span class="data-value">{{ props.power }}</span>
          <span class="data-unit">{{ props.unit }}</span>
        </div>
        <div class="data-row" style="width: 45%">
          <span class="data-label">{{ props.subText }}:</span>
          <span class="data-value">{{ props.realPower }}</span>
          <span class="data-unit">{{ props.subUnit }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  const props = defineProps({
    src: { type: String, default: '../../../../src/assets/images/indicatorimage.png' },
    title: { type: String, default: '光伏电站' },
    text: { type: String, default: '今日发电量' },
    subText: { type: String, default: '实时功率' },
    unit: { type: String, default: '万kWh' },
    subUnit: { type: String, default: 'MW' },
    power: { type: [Number, String], default: '' },
    realPower: { type: [Number, String], default: '' },
  });
</script>
<style lang="less" scoped>
  .image-indicator {
    display: flex;
    align-items: center;
    padding: 0.1rem;
    border: 0.01rem solid #1890ff30;
    border-radius: 0.05rem;
    background: #1890ff25;
    z-index: 10000;

    .image-container {
      width: 0.5rem;
      height: 0.5rem;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .info-container {
      flex: 1;
      margin-left: 0.1rem;

      .title {
        font-size: 0.16rem;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #ffffff;
        margin-bottom: 0.05rem;
      }
      .data-container {
        display: flex;
        .data-row {
          font-family: Microsoft YaHei;
          color: #ffffff;
          font-size: 0.12rem;
          .data-value {
            min-width: 0.3rem;
            color: #1890ff;
            text-align: right;
          }
        }
      }
    }
  }
</style>
