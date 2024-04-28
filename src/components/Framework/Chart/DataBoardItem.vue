<template>
  <div class="data-board-item">
    <div>
      <div class="title-box">
        <div class="icon-box">
          <img class="icon-img" :src="getIcon(icon)">
        </div>
        <div class="title-value-box">
          <div class="title-text">{{title}}</div>
          <div class="value-text">{{value}}</div>
        </div>
      </div>
      <div class="percent-data-box">
        <div v-if="tRatio||tRatio===0" class="percent-item">
          <span class="p-value" :class="handleTextClass(tRatio)">{{handleTextPercent(tRatio)}}</span>
          <span class="p-title">同比</span>
        </div>
        <div v-if="hRatio||hRatio===0" class="percent-item">
          <span class="p-value" :class="handleTextClass(hRatio)">{{handleTextPercent(hRatio)}}</span>
          <span class="p-title">环比</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue';

  // 传入参数
  const props = defineProps({
    title: { type: String, default: '今日发电量(万kWh)' },
    value: { type: Number, default: 0 },
    tRatio: { type: [Number, String], default: '' },
    hRatio: { type: [Number, String], default: '' },
    icon: String,
  });

  // 图标
  const iconUrls = {
    dayGen: '../../../assets/images/da/icon_day_gen.png', // 今日发电量
    earnings: '../../../assets/images/da/icon_earnings.png', // 今日收益
    dayOnline: '../../../assets/images/da/icon_day_online.png', // 累计上网电量
    warningCount: '../../../assets/images/da/icon_warning_count.png', // 天气预警
  };
  const getIcon = (icon: string) => {
    return new URL(iconUrls[icon], import.meta.url).href;
  };

  // 根据数据内容判断class
  const handleTextClass = (text) => {
    if (typeof text == 'string') {
      return text.startsWith('-') ? 'arrow-negative' : 'arrow-positive';
    } else if (typeof text == 'number') {
      return text < 0 ? 'arrow-negative' : 'arrow-positive';
    }
    return 'arrow-positive';
  };

  // 根据数据内容判断是否添加%符号
  const handleTextPercent = (text) => {
    if (typeof text == 'string') {
      return text;
    } else if (typeof text == 'number') {
      return String(text) + '%';
    }
    return text;
  };

  onMounted(() => {});
</script>

<style lang="less" scoped>
  .data-board-item {
    display: flex;
    align-items: center;
    width: 2.24rem;
    height: 1.1rem;
    background-color: rgba(24, 144, 255, 0.1);
    border-radius: 0.04rem;
    border: 1px solid rgba(24, 144, 255, 0.3);
    padding: 0 0.15rem;
    .title-box {
      display: flex;
      align-items: center;
      padding-top: 0.2rem;
      margin-bottom: 0.1rem;
      .icon-box {
        width: 0.56rem;
        height: 0.62rem;
        background: url('../../../assets/images/da/icon_bg.png') no-repeat center bottom/contain;
        margin-right: 0.04rem;
        text-align: center;
        .icon-img {
          width: 0.46rem;
        }
      }
      .title-text {
        font-size: 0.14rem;
        line-height: 1;
        color: #fff;
        margin-bottom: 0.1rem;
      }
      .value-text {
        font-size: 0.22rem;
        line-height: 1;
        color: #1890ff;
      }
    }
    .percent-data-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 1;
      .p-value {
        font-size: 0.14rem;
        margin-right: 0.04rem;
        &::before {
          margin-right: 0.04rem;
          transform: scale(0.7);
          display: inline-block;
        }
      }
      .p-title {
        font-size: 0.12rem;
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }

  .arrow-positive {
    color: #e05b5b;
  }

  .arrow-negative {
    color: #00ba24;
  }

  .arrow-positive::before {
    content: '▲';
    color: #e05b5b;
  }

  .arrow-negative::before {
    content: '▼';
    color: #00ba24;
  }
</style>
