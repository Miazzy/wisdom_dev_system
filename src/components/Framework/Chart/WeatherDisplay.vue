<template>
  <div class="weather-display" style="width: 200px; margin-right: -20px; margin-left: 10px">
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
      position: relative;
      width: 35px;
      margin-right: 10px;

      /* 添加天气图标的样式，可以根据需要自定义 */
      font-size: 48px;

      .icon {
        position: absolute;
        top: -18px;
        right: 0;
      }
    }

    .weather-info {
      /* 右侧天气信息的样式 */
      .temperature-range {
        color: #32afff;
        font-family: Digital;
        font-size: 24px;
        letter-spacing: 2px;

        .unit {
          margin: 0 0 0 5px;
          font-size: 15px;
        }
      }

      .weather-description {
        display: flex;
        margin-top: -5px;

        .weather-text {
          width: 49.5%;
          opacity: 0.6;
          color: #fff;
          font-family: "Microsoft YaHei";
          font-size: 14px;
          font-weight: 400;
        }

        .air-quality {
          width: 49.5%;
          opacity: 0.6;
          color: #fff;
          font-family: "Microsoft YaHei";
          font-size: 14px;
          font-weight: 400;
          text-align: center;
        }
      }
    }
  }
</style>
