<template>
  <div class="number-display" >
    <div class="title" :style="{ fontSize: props.tsize }">{{ props.title }}</div>
    <div class="number-container">
      <div
        :class="`${digit == '.' ? 'number-dot' : 'number'}`"
        v-for="(digit, index) in digitArray"
        :key="index"
        :style="{
          backgroundColor: digit == '.' ? '' : `${props.bcolor}80`,
          fontSize: props.vsize,
          color: digit == '.' ? '' : props.vcolor,
        }"
      >
        {{ digit }}
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
  }

  .title {
    font-weight: bold;
    text-align: left;
  }

  .number-container {
    display: flex;
    justify-content: left;
    align-items: center;
  }

  .number {
    background-color: rgba(0, 0, 0, 0.1); /* 设置数字背景色 */
    padding: 1px 10px 1px 10px; /* 根据需要调整内边距 */
    border-radius: 5px; /* 可以根据需要调整圆角 */
    border: 0.001rem solid #0606fd;
    margin: 5px 3px 0px 0px; /* 根据需要调整数字之间的间距 */
    text-align: center;
    font-weight: 600;
    transform: scaleY(1.15);
    line-height: 1.35; /* 调整行高以增加数字的高度 */
  }
  .number-dot {
    padding: 1px 5px; /* 根据需要调整内边距 */
    border-radius: 5px; /* 可以根据需要调整圆角 */
    margin: 0px 3px 0px 0px; /* 根据需要调整数字之间的间距 */
    text-align: center;
    color: #07A6FF;
    font-weight: 600;
    line-height: 1; /* 调整行高以增加数字的高度 */
  }
</style>
