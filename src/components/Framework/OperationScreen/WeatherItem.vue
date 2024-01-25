<template>
  <div class="weather-item">
    <template v-if="props.type==='today'">
      <div class="today-layout bg">
        <div class="day-text">{{props.day}}</div>
        <div class="weather-info">
          <div class="weather-icon">
            <SvgIcon class="iconfont" :name="props.weatherIcon" style="width: 0.5rem; height:0.5rem;"> </SvgIcon>
            <!--  :size="50" -->
          </div>
          <div class="weather-data">
            <div class="temperature-text">{{props.temperature}}</div>
            <div class="weather-text">{{props.description}}</div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="other-layout bg">
        <div class="day-text">{{props.day}}</div>
        <div class="weather-icon">
          <SvgIcon class="iconfont" :name="props.weatherIcon" style="width: 0.24rem; height:0.24rem;"> </SvgIcon>
        </div>
        <div class="temperature-text">{{props.temperature}}</div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { SvgIcon } from '/@/components/Icon';

  const props = defineProps({
    type: { type: String, default: '' }, // 类型
    day: { type: String, default: '' }, // 周几/今天
    weatherIcon: { type: String, default: '' }, // 天气图标
    temperature: { type: String, default: '' }, // 温度
    description: { type: String, default: '' }, // 天气描述
  });
</script>

<style lang="less" scoped>
  .weather-item {
    .bg {
      background-color: rgba(0, 246, 255, 0.15);
      border-radius: 0.04rem;
      border: 0.01rem solid rgba(0, 246, 255, 0.2);
    }
    .day-text {
      font-size: 0.12rem;
      color: #fff;
      text-align: center;
      opacity: 0.6;
      line-height: 1;
      padding-top: 0.06rem;
    }
    .today-layout {
      width: 1.26rem;
      height: 0.78rem;
      .weather-info {
        display: flex;
        justify-content: center;
        align-items: center;

        .weather-icon {
          margin-right: 0.12rem;
        }
        .weather-data {
          color: #fff;
          line-height: 1;
        }
        .temperature-text {
          font-size: 0.18rem;
          margin-bottom: 0.07rem;
        }
        .weather-text {
          font-size: 0.12rem;
          opacity: 0.9;
          transform: scale(0.83);
          transform-origin: left;
        }
      }
    }

    .other-layout {
      width: 0.64rem;
      height: 0.78rem;
      text-align: center;
      line-height: 1;
      .day-text {
        margin-bottom: 0.13rem;
      }
      .weather-icon {
        margin-bottom: 0.03rem;
      }
      .temperature-text {
        color: #fff;
        font-size: 0.12rem;
        transform: scale(0.83);
      }
    }
  }
</style>