<template>
  <div class="device-status-info">
    <div class="left">
      <div class="station-name">
        {{props.stationName}}
      </div>
    </div>
    <div class="middle">
      <!-- <i class="weather-icon iconfont" :class="`icon-${props.weatherIcon}`"></i> -->
      <SvgIcon class="iconfont" :name="props.weatherIcon" :size="36"> </SvgIcon>
    </div>
    <div class="right">
      <div class="warning-type">
        <span class="weather-text">{{props.weatherName}}</span>
        <span :class="props.warningLevel">{{color[props.warningLevel]}}</span>
      </div>
      <p class="warning-content" :title="props.warningContent">
        {{props.warningContent}}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import { SvgIcon } from '/@/components/Icon';
  const props = defineProps({
    stationName: { type: String, default: '天门通力' }, // 电站名
    weatherIcon: { type: String, default: 'tianqi-leiyu' }, // 天气图标
    weatherName: { type: String, default: '暴雨' }, // 天气名
    warningLevel: { type: String, default: 'red' }, // 预警级别
    warningContent: {
      type: String,
      default: '未来24小时内，部分地区会出现暴雨，预计降雨量将达到100-200毫米，请大家注意防范。',
    }, // 预警内容
  });
  const color = reactive({
    red: '红色预警',
    orange: '橙色预警',
  });
</script>

<style lang="less" scoped>
  .device-status-info {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 0.64rem;
    padding: 0 0.12rem;
    border-bottom: 0.01rem solid rgba(255, 255, 255, 0.1);
    &:last-child {
      border-bottom: none;
    }
    &:hover {
      background-color: rgba(255, 255, 255, 0.06);
    }

    .left {
      flex: 1.2;
      .station-name {
        font-size: 0.14rem;
        color: #fff;
        line-height: 1;
      }
    }

    .middle {
      flex: 1;
    }

    .right {
      flex: 3.8;
      .warning-type {
        margin-bottom: 0.04rem;
        line-height: 1;
        font-size: 0.12rem;
        opacity: 0.9;
        .weather-text {
          margin-right: 0.04rem;
          color: #fff;
        }
        .red {
          color: #ff4f38;
        }
        .orange {
          color: #f7c824;
        }
      }
      .warning-content {
        margin-bottom: 0;
        font-size: 0.12rem;
        color: #ffffff;
        line-height: 0.16rem;
        opacity: 0.5;
        display: -webkit-box; /* Safari */
        -webkit-line-clamp: 2; /* number of lines to show */
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
</style>