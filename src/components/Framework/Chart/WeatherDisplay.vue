<template>
  <div class="weather-display" style="width: 1.2rem; margin-right: -0.2rem; margin-left: 0.1rem">
    <div class="weather-icon" style="">
      <!-- <Icon style="font-size: 0.34rem;" class="icon" icon="arcticons:quickweather" color="#32afff" /> -->
      <SvgIcon class="iconfont" :name="getWeatherIconName" style="width: 0.4rem; height:0.4rem;"> </SvgIcon>
    </div>
    <div class="weather-info" style="width: 1.65rem">
      <div class="temperature-range">
        <span>{{ weatherInfo.temp }}</span>
        <span class="unit">℃</span>
        <!-- <span style="margin: 0 0.1rem">~</span>
        <span>{{ props.max }}</span>
        <span class="unit">℃</span> -->
      </div>
      <div class="weather-description" style="width: 100%">
        <div class="weather-text">{{ weatherInfo.text }}</div>
        <div class="air-quality">{{ props.airQuality }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, reactive, onMounted } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { SvgIcon } from '/@/components/Icon';
  import { weatherIcons } from '@/utils/weatherIcon'
  import * as CommonApi from '@/api/da/common';

  const props = defineProps({
    airQuality: { type: [String, Number], default: '' },
  });

  const getWeatherIconName = computed(()=>{
    return weatherInfo.icon&&weatherIcons[weatherInfo.icon]?weatherIcons[weatherInfo.icon]: 'tianqi-wu2';
  })

  const weatherInfo = reactive({});
  const getWeatherData = async () => {
    let res = await CommonApi.getWeather({ lastDay: 'now' });
    Object.assign(weatherInfo, res.weather.now);
  };

  onMounted(() => {
    getWeatherData();
  });
</script>

<style lang="less" scoped>
  .weather-display {
    display: flex;
    align-items: center;

    .weather-icon {
      position: relative;
      width: 0.35rem;
      margin-right: 0.1rem;

      /* 添加天气图标的样式，可以根据需要自定义 */
      font-size: 0.48rem;

      .icon {
        position: absolute;
        top: -0.18rem;
        right: 0;
      }
    }

    .weather-info {
      /* 右侧天气信息的样式 */
      .temperature-range {
        color: #32afff;
        font-family: Digital;
        font-size: 0.24rem;
        letter-spacing: 0.02rem;

        .unit {
          margin: 0 0 0 0.05rem;
          font-size: 0.15rem;
        }
      }

      .weather-description {
        display: flex;
        margin-top: -0.05rem;

        .weather-text {
          width: 49.5%;
          opacity: 0.6;
          color: #fff;
          font-family: "Microsoft YaHei";
          font-size: 0.14rem;
          font-weight: 400;
        }

        .air-quality {
          width: 49.5%;
          opacity: 0.6;
          color: #fff;
          font-family: "Microsoft YaHei";
          font-size: 0.14rem;
          font-weight: 400;
          text-align: center;
        }
      }
    }
  }
</style>
