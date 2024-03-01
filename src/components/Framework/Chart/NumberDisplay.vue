<template>
  <div class="number-display">
    <div class="title-container">
      <div class="title" :style="{ fontSize: props.tsize }">{{ props.title }}</div>
      <div v-show="props?.subtitle" class="subtitle">
        <span v-show="props?.subtitle?.mtext">{{ props.subtitle.mtext }}</span>
        <span
          v-show="props?.subtitle?.mvalue"
          class="arrow"
          :class="handleTextClass(props?.subtitle?.mvalue)"
        >
          {{ handleTextPercent(props.subtitle.mvalue) }}
        </span>
        <span v-show="props?.subtitle?.stext" style="margin-left: 0.1rem">{{
          props.subtitle.stext
        }}</span>
        <span
          v-show="props?.subtitle?.svalue"
          class="arrow"
          :class="handleTextClass(props?.subtitle?.svalue)"
          >{{ handleTextPercent(props.subtitle.svalue) }}</span
        >
      </div>
    </div>
    <div class="number-container">
      <div
        :class="`${digit == '.' ? 'number-dot' : 'number'}`"
        v-for="(digit, index) in digitArray"
        :key="index"
        :style="{
          fontSize: props.vsize,
          color: digit == '.' ? '' : props.vcolor,
        }"
      >
        <span>{{ digit }}</span>
        <div class="mask"> </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue';

  // 传入参数
  const props = defineProps({
    title: { type: String, default: '' },
    subtitle: { type: Object, default: {} as Object },
    value: { type: Number, default: 0 },
    tsize: { type: String, default: '14px' },
    vsize: { type: String, default: '20px' },
    vcolor: { type: String, default: '#f0f0f0' },
    bcolor: { type: String, default: '#01B4F1' },
  });

  // 将数字拆分成个位数字的数组
  const digitArray = ref([]);

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

  watch(
    () => props.value,
    () => {
      digitArray.value = String(props.value).split('').map(String) as never[];
    },
  );

  watch(
    () => props.subtitle,
    () => {
      digitArray.value = String(props.value).split('').map(String) as never[];
    },
  );

  onMounted(() => {
    digitArray.value = String(props.value).split('').map(String) as never[];
  });
</script>

<style lang="less" scoped>
  .number-display {
    margin-left: 0.15rem;
    text-align: left;
  }

  .title-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .title {
    color: #32afff;
    font-family: 'Microsoft YaHei', '微软雅黑';
    font-size: 0.12rem;
    font-weight: 300;
    text-align: left;
    white-space: nowrap;
  }

  .subtitle {
    transform: scale(0.80);
    color: #32afff;
    font-size: 0.12rem;
    white-space: nowrap;
  }

  .number-container {
    display: flex;
    align-items: center;
    justify-content: left;
  }

  .number {
    position: relative;
    width: 0.3rem;
    height: 0.42rem;
    margin: 0.05rem 0.03rem 0 0; /* 根据需要调整数字之间的间距 */
    padding: 0.01rem 0.02rem; /* 根据需要调整内边距 */
    transform: scaleY(1.15);
    border: 0.01rem solid #01b5f140;
    border-radius: 0.05rem; /* 可以根据需要调整圆角 */
    font-weight: 600;
    line-height: 1.35; /* 调整行高以增加数字的高度 */
    text-align: center;

    .mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0.01rem solid #0606fd50;
      border-radius: 0.05rem; /* 可以根据需要调整圆角 */
      opacity: 0.35;
      background: #01b4f150; /* 设置数字背景色 */
    }
  }

  .number-dot {
    margin: 0 0.03rem 0 0; /* 根据需要调整数字之间的间距 */
    padding: 0.01rem 0.02rem; /* 根据需要调整内边距 */
    border-radius: 0.05rem; /* 可以根据需要调整圆角 */
    color: #07a6ff;
    font-weight: 600;
    line-height: 1; /* 调整行高以增加数字的高度 */
    text-align: center;
  }

  .arrow {
    margin-right: 0.04rem;
    margin-left: 0.04rem;
    color: #32afff;
  }

  .arrow-positive {
    color: #FF4F38;
  }

  .arrow-negative {
    color: #00BA24;
  }

  .arrow-positive::before {
    content: '▲';
    color: #FF4F38;
  }

  .arrow-negative::before {
    content: '▼';
    color: #00BA24;
  }
</style>
