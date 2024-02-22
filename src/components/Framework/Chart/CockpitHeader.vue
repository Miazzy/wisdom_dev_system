<template>
  <div class="header">
    <div class="title"> {{ props.title }} </div>
    <div class="info">
      <button class="settings">
        <Icon icon="octicon:screen-full-24" color="#32afff" style="cursor: pointer;font-size:0.28rem;" @click="handleScreen"/>
      </button>
      <span class="time">
        <DigitalClock />
      </span>
      <span class="weather">
        <WeatherDisplay />
      </span>
      <button class="settings">
        <Icon icon="arcticons:settings" color="#32afff" style="cursor: pointer;font-size:0.28rem;" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, defineProps, watch } from 'vue';
  import DigitalClock from '/@/components/Framework/Chart/DigitalClock.vue';
  import WeatherDisplay from '/@/components/Framework/Chart/WeatherDisplay.vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { MsgManager } from '/@/message/MsgManager';

  const props = defineProps({
    title: { type: String, default: '' }, // 列定义
    date: { type: String, default: '' }, // 表格数据
  });

  const handleScreen = () => {
    MsgManager.getInstance().sendMsg('iframe-screen-emit', {});
  };

  onMounted(() => {
    
  });
</script>
<style>
  @font-face {
    font-family: 'Digital';
    src: url('../../../assets/fonts/DSDIGI.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }
</style>
<style lang="less" scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.1rem;
    color: white;
    height: 0.8rem;
    border-bottom: 0.02rem solid #01D8FF12;

    .title {
      font-size: 0.24rem;
      font-family: 'Microsoft YaHei', '微软雅黑';
      font-weight: 400;
      color: #ffffff;
      line-height: 0.16rem;
      margin-left: 0.2rem;
    }
    .info {
      display: flex;
      align-items: center;

      .time,
      .weather,
      .settings {
        margin-left: 0.2rem;
        background: transparent;
        cursor: pointer;
      }
    }
  }
</style>
