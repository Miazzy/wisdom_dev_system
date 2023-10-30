<template>
  <div class="number-display" >
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
        <div class="mask" > </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref, watch } from 'vue';

  // 将数字拆分成个位数字的数组
  const digitArray = ref([]);

  watch(
    () => props.value,
    (newValue) => {
      // 当数字值改变时，将其拆分成个位数字
      digitArray.value = String(newValue).split('').map(String);
    },
  );

  onMounted(() => {
    // 当数字值改变时，将其拆分成个位数字
    digitArray.value = String(props.value).split('').map(String);
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
    text-align: left;
    margin-left: 15px;
  }

  .title {
    font-weight: 300;
    text-align: left;
    font-size: 12px;
    color: #32AFFF;
    font-family: 'Microsoft YaHei', '微软雅黑';
  }

  .number-container {
    display: flex;
    justify-content: left;
    align-items: center;
  }

  .number {
    position: relative;
    padding: 1px 2px 1px 2px; /* 根据需要调整内边距 */
    border-radius: 5px; /* 可以根据需要调整圆角 */
    border: 0.001rem solid #0606fd50;
    margin: 5px 3px 0px 0px; /* 根据需要调整数字之间的间距 */
    text-align: center;
    font-weight: 600;
    transform: scaleY(1.15);
    height: 42px;
    width: 30px;
    text-align: center;
    line-height: 1.35; /* 调整行高以增加数字的高度 */

    .mask {
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      position: absolute;
      border-radius: 5px; /* 可以根据需要调整圆角 */
      background: #01B4F150; /* 设置数字背景色 */
      border: 0.001rem solid #0606fd50;
      opacity: 0.35;
    }
  }
  .number-dot {
    padding: 1px 2px; /* 根据需要调整内边距 */
    border-radius: 5px; /* 可以根据需要调整圆角 */
    margin: 0px 3px 0px 0px; /* 根据需要调整数字之间的间距 */
    text-align: center;
    color: #07A6FF;
    font-weight: 600;
    line-height: 1; /* 调整行高以增加数字的高度 */
  }
</style>
