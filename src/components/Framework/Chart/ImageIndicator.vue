<template>
  <div class="image-indicator">
    <div class="image-container">
      <img :src="props.src" alt="Indicator Image" />
    </div>
    <div class="info-container">
      <div class="title">{{ props.title }}</div>
      <div class="data-container">
        <div class="data-row" style="width:55%">
          <span class="data-label">{{ props.text }}:</span>
          <span class="data-value">{{ props.power }}</span>
          <span class="data-unit">{{ props.unit }}</span>
        </div>
        <div class="data-row" style="width:45%">
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
    padding: 10px;
    border: 1px solid #1890FF30;
    border-radius: 5px;
    background: #1890FF25;
    z-index: 10000;

    .image-container {
      width: 50px;
      height: 50px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .info-container {
      flex: 1;
      margin-left: 10px;
  
      .title {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #FFFFFF;
        margin-bottom: 5px;
      }
      .data-container {
        display: flex;
        .data-row {
          font-family: Microsoft YaHei;
          color: #FFFFFF;
          font-size: 12px;
          .data-label {

          }
          .data-value {
            min-width: 30px;
            color: #1890FF;
            text-align: right;
          }
        }
      }
    }
  }
</style>
