<template>
  <div class="number-display">
    <div class="title" :style="{ fontSize: props.tsize }">{{ props.title }}</div>
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

  // 将数字拆分成个位数字的数组
  const digitArray = ref([]);

  watch(
    () => props.value,
    (newValue) => {
      // 当数字值改变时，将其拆分成个位数字
      digitArray.value = String(newValue).split('').map(String) as never[];
    },
  );

  onMounted(() => {
    // 当数字值改变时，将其拆分成个位数字
    digitArray.value = String(props.value).split('').map(String) as never[];
  });

  const props = defineProps({
    title: { type: String },
    value: { type: Number, default: 0 },
    tsize: { type: String, default: '14px' },
    vsize: { type: String, default: '20px' },
    vcolor: { type: String, default: '#f0f0f0' },
    bcolor: { type: String },
  });
</script>

<style scoped>
  .number-display {
    margin-left: 15px;
    text-align: left;
  }

  .title {
    color: #32afff;
    font-family: 'Microsoft YaHei', '微软雅黑';
    font-size: 12px;
    font-weight: 300;
    text-align: left;
  }

  .number-container {
    display: flex;
    align-items: center;
    justify-content: left;
  }

  .number {
    position: relative;
    width: 30px;
    height: 42px;
    margin: 5px 3px 0 0; /* 根据需要调整数字之间的间距 */
    padding: 1px 2px; /* 根据需要调整内边距 */
    transform: scaleY(1.15);
    border: 0.001rem solid #0606fd50;
    border-radius: 5px; /* 可以根据需要调整圆角 */
    font-weight: 600;
    line-height: 1.35; /* 调整行高以增加数字的高度 */
    text-align: center;

    .mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0.001rem solid #0606fd50;
      border-radius: 5px; /* 可以根据需要调整圆角 */
      opacity: 0.35;
      background: #01b4f150; /* 设置数字背景色 */
    }
  }

  .number-dot {
    margin: 0 3px 0 0; /* 根据需要调整数字之间的间距 */
    padding: 1px 2px; /* 根据需要调整内边距 */
    border-radius: 5px; /* 可以根据需要调整圆角 */
    color: #07a6ff;
    font-weight: 600;
    line-height: 1; /* 调整行高以增加数字的高度 */
    text-align: center;
  }
</style>
