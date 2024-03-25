<template>
  <div class="header">
    <div class="logo">
      <div class="logo-img-box"></div>
    </div>
    <div class="title"> {{ props.title }} </div>
    <div class="info">
      <span class="time">
        <DigitalClock />
      </span>
      <span class="weather">
        <WeatherDisplay :temp="weatherInfo.temp" :weatherText="weatherInfo.text" :weatherIcon="weatherInfo.icon" />
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, defineProps, watch, reactive } from 'vue';
  import DigitalClock from '/@/components/Framework/Chart/DigitalClock.vue';
  import WeatherDisplay from '/@/components/Framework/Chart/WeatherDisplay.vue';
  import * as CommonApi from '@/api/da/common';

  const props = defineProps({
    title: { type: String, default: '' }, // 标题
  });

  const weatherInfo = reactive({});

  const getWeatherData = async () => {
    let res = await CommonApi.getWeather({ lastDay: 'now' });
    let { temp, text, icon } = res.weather.now;
    Object.assign(weatherInfo, { temp, text, icon });
  };

  onMounted(() => {
    getWeatherData();
  });
</script>
<style>
  @font-face {
    font-family: Digital;
    font-style: normal;
    font-weight: normal;
    src: url('../../../assets/fonts/DSDIGI.ttf') format('truetype');
  }
</style>
<style lang="less" scoped>
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 0.8rem;
    background: url('../../../assets/images/operationScreen/title-bg.png') no-repeat center/cover;

    .logo {
      flex: 1;

      .logo-img-box {
        width: 1.08rem;
        height: 0.33rem;
        margin-left: 0.2rem;
        background: url('../../../assets/images/my-logo-dark.png') no-repeat center/cover;
      }
    }

    .title {
      flex: 1;
      background-clip: text;
      -webkit-background-clip: text;
      background-image: linear-gradient(0deg, #16cffe 0%, #00f6ff 100%);
      color: transparent;
      font-family: 'Microsoft YaHei', '微软雅黑';
      font-size: 0.3rem;
      font-weight: 600;
      text-align: center;
    }

    .info {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: flex-end;

      .time {
        :deep(.time-display .clock) {
          color: #00f6ff;
        }
        :deep(.time-display .date) {
          color: rgba(255, 255, 255, 0.6);
        }
      }

      .weather {
        margin-right: 0.2rem;
        :deep(.weather-display .weather-info .temperature-range) {
          color: #00f6ff;
        }
      }

      .time,
      .weather {
        margin-left: 0.2rem;
        background: transparent;
        cursor: pointer;
      }
    }
  }
</style>