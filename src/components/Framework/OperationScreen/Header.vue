<template>
  <div class="header">
    <div class="logo">
      <img class="logo-img" src="../../../assets/images/da/logo.png">
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
  import { ref, onMounted, defineProps, watch, reactive } from 'vue';
  import DigitalClock from '/@/components/Framework/Chart/DigitalClock.vue';
  import WeatherDisplay from '/@/components/Framework/Chart/WeatherDisplay.vue';
  import * as CommonApi from '@/api/da/common';

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
    height: 0.7rem;
    padding: 0.1rem 0;
    background: url('../../../assets/images/da/header_bg.png') no-repeat center/100% 100%;

    .logo {
      width: 2.9rem;
      padding: 0.1rem 0 0 0.2rem;
      color: #fff;
      .logo-img {
        height: 0.3rem;
      }
    }

    .title {
      margin-left: 0.2rem;
      color: #fff;
      font-family: 'Microsoft YaHei', '微软雅黑';
      font-size: 0.24rem;
      font-weight: 400;
      line-height: 0.16rem;
    }

    .info {
      width: 2.9rem;
      display: flex;
      align-items: center;

      .time,
      .weather {
        margin-left: 0.2rem;
        background: transparent;
        cursor: pointer;
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }
</style>