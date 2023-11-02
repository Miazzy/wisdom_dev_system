<template>
  <div class="row-data-display" :style="containerStyle" ref="container">
    <div class="scroll-container">
      <div
        v-for="(item, index) in data"
        :key="index"
        class="row"
        :style="{
          'background-color': index % 2 === 0 ? evenRowColor : oddRowColor,
          'line-height': rowHeight + 'px',
        }"
      >
        <div class="title" :style="titleStyle">{{ item.title || item.label }}</div>
        <div class="content" :style="contentStyle">
          <span :style="`color: ${item.color}; margin: 0 5px 0 0;`">{{ item.value }}</span>
          <span style="color: white">{{ item.unit }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, onUnmounted, ref } from 'vue';

  // 传入的数据数组
  const props = defineProps({
    data: Array,
    width: { type: Number, default: 200 },
    height: { type: Number, default: 228 },
    rowHeight: { type: Number, default: '28' },
    evenRowColor: { type: String, default: '#DAF1FE05' },
    oddRowColor: { type: String, default: '#DAF1FE10' },
  });

  const containerStyle = ref({
    width: props.width + 'px',
    height: props.height + 'px',
  });

  const titleStyle = ref({
    width: '35%',
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
    'white-space': 'nowrap',
  });

  const contentStyle = ref({
    width: '65%',
    'text-align': 'right',
    'white-space': 'nowrap',
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
  });

  const container = ref(null);

  const scrollHeight = ref(0);
  const scrollStep = 0.5; // Adjust the scroll step as needed
  const scrollInterval = ref(null);

  onMounted(() => {
    const containerEl = container.value as any;
    const scrollContainer = containerEl.querySelector('.scroll-container');
    const rows = containerEl.querySelectorAll('.row');

    function updateScroll() {
      scrollHeight.value += scrollStep;
      scrollContainer.style.transform = `translateY(-${scrollHeight.value}px)`;
      const tableHeight = (rows.length - 3) * props.rowHeight;
      if (scrollHeight.value >= tableHeight) {
        scrollHeight.value = 0;
        scrollContainer.style.transform = `translateY(-${scrollHeight.value}px)`;
        clearInterval(scrollInterval.value);
        setTimeout(() => {
          scrollInterval.value = setInterval(updateScroll, 150);
        }, 300);
      }
      console.info('scroll height:', scrollHeight.value, ' tableHeight:', tableHeight);
    }

    scrollInterval.value = setInterval(updateScroll, 100); // Adjust the interval as needed

    // Clear the interval when the component is unmounted
    onUnmounted(() => {
      clearInterval(scrollInterval);
    });
  });
</script>

<style lang="less" scoped>
  .row-data-display {
    display: flex;
    flex-direction: column;
    overflow: auto;
    position: relative;
    width: 100%;

    .scroll-container {
      display: flex;
      flex-direction: column;
      scrollbar-width: none;

      .row {
        display: flex;
        align-items: center;
        padding: 5px;
        .title {
          margin: 0 0 0 10px;
          font-weight: bold;
          color: #fefefe;
        }
        .content {
          margin: 0 10px 0 0;
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }
  ::-webkit-scrollbar {
    width: 1px;
  }
</style>
