<template>
  <div class="weather-display" style="width: 200px; margin-left: 10px; margin-right: -20px;">
    <div class="weather-icon" style="">
      <Icon class="icon" icon="arcticons:quickweather" color="#32afff" size="34" />
    </div>
    <div class="weather-info" style="width: 165px">
      <div class="temperature-range">
        <span>{{ props.min }}</span>
        <span class="unit">℃</span>
        <span style="margin: 0 10px">~</span>
        <span>{{ props.max }}</span>
        <span class="unit">℃</span>
      </div>
      <div class="weather-description" style="width: 100%">
        <div class="weather-text">{{ props.weatherText }}</div>
        <div class="air-quality">{{ props.airQuality }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';

  const props = defineProps({
    min: { type: [String, Number], default: '28' },
    max: { type: [String, Number], default: '37' },
    weatherText: { type: [String, Number], default: '晴转多云' },
    airQuality: { type: [String, Number], default: 'PM 2.5' },
  });
</script>

<style lang="less" scoped>
  .weather-display {
    display: flex;
    align-items: center;
    .weather-icon {
      /* 添加天气图标的样式，可以根据需要自定义 */
      font-size: 48px;
      margin-right: 10px;
      width: 35px;position: relative;

      .icon {
        position: absolute;
        top: -18px;
        right: 0px;
      }
    }
    .weather-info {
      /* 右侧天气信息的样式 */
      .temperature-range {
        font-family: 'Digital';
        font-size: 24px;
        font-family: 300-CAI978;
        color: #32afff;
        letter-spacing: 2px;

        .unit {
          margin: 0 0 0 5px;
          font-size: 15px;
        }
      }
      .weather-description {
        margin-top: -5px;
        display: flex;

        .weather-text {
          width: 49.5%;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #ffffff;
          opacity: 0.6;
        }
        .air-quality {
          text-align: center;
          width: 49.5%;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #ffffff;
          opacity: 0.6;
        }
      }
    }
  }
</style>
