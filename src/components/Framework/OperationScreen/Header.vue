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
        <WeatherDisplay />
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, defineProps, watch } from 'vue';
  import DigitalClock from '/@/components/Framework/Chart/DigitalClock.vue';
  import WeatherDisplay from '/@/components/Framework/Chart/WeatherDisplay.vue';

  const props = defineProps({
    title: { type: String, default: '' }, // 标题
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
    height: 80px;
    background: url('../../../assets/images/operationScreen/title-bg.png') no-repeat center/cover;

    .logo {
      flex: 1;

      .logo-img-box {
        width: 108px;
        height: 33px;
        margin-left: 20px;
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
      font-size: 30px;
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
          color: #00F6FF;
        }
        :deep(.time-display .date) {
          color: rgba(255, 255, 255, .6);
        }
      }

      .weather {
        margin-right: 20px;
        :deep(.weather-display .weather-info .temperature-range) {
          color: #00F6FF;
        }
      }

      .time,
      .weather {
        margin-left: 20px;
        background: transparent;
        cursor: pointer;
      }
    }
  }
</style>