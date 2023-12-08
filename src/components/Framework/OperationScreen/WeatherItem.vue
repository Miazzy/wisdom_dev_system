<template>
  <div class="weather-item">
    <template v-if="props.type==='today'">
      <div class="today-layout bg">
        <div class="day-text">{{props.day}}</div>
        <div class="weather-info">
          <div class="weather-icon">
            <SvgIcon class="iconfont" :name="props.weatherIcon" :size="50"> </SvgIcon>
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
          <SvgIcon class="iconfont" :name="props.weatherIcon" :size="24"> </SvgIcon>
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
      border-radius: 4px;
      border: 1px solid rgba(0, 246, 255, 0.2);
    }
    .day-text {
      font-size: 12px;
      color: #fff;
      text-align: center;
      opacity: 0.6;
      line-height: 1;
      padding-top: 6px;
    }
    .today-layout {
      width: 126px;
      height: 78px;
      // .day-text {
      //   margin-bottom: 8px;
      // }
      .weather-info {
        display: flex;
        justify-content: center;
        align-items: center;

        .weather-icon {
          margin-right: 12px;
        }
        .weather-data {
          color: #fff;
          line-height: 1;
        }
        .temperature-text {
          font-size: 18px;
          margin-bottom: 7px;
        }
        .weather-text {
          font-size: 12px;
          opacity: 0.9;
          transform: scale(0.83);
          transform-origin: left;
        }
      }
    }

    .other-layout {
      width: 64px;
      height: 78px;
      text-align: center;
      line-height: 1;
      .day-text {
        margin-bottom: 13px;
      }
      .weather-icon {
        margin-bottom: 3px;
      }
      .temperature-text {
        color: #fff;
        font-size: 12px;
        transform: scale(0.83);
      }
    }
  }
</style>