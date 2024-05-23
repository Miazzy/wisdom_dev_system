<template>
  <div class="legend-container">
    <ul class="legend-list" ref="list">
      <li v-for="(item, index) in data" :key="index" class="legend-item">
        <span :style="{ backgroundColor: colors[index % colors.length] }" class="dot-icon"></span>
        <span class="name">{{ item.name }}</span>
        <span class="value" :style="{ color: colors[index % colors.length] }"
          >{{ calculatePercentage(item.value) }}%</span
        >
      </li>
    </ul>
  </div>
</template>

<script setup>
  import { ref, onMounted, nextTick, watch, toRefs } from 'vue';

  // Define props
  const props = defineProps({
    data: {
      type: Array,
      required: true,
    },
    colors: {
      type: Array,
      required: true,
    },
    height: {
      type: Number,
      default: 200,
    },
    width: {
      type: Number,
      default: 200,
    },
  });

  // Extract refs from props
  const { data, colors } = toRefs(props);

  const totalValue = ref(data.value.reduce((sum, item) => sum + item.value, 0));

  const calculatePercentage = (value) => ((value / totalValue.value) * 100).toFixed(2);

  const list = ref(null);

  onMounted(() => {
    nextTick(() => {
      const scrollContainer = list.value;
      let isScrollingDown = true;

      const scroll = () => {
        if (isScrollingDown) {
          scrollContainer.scrollTop += 1;
          const isAttachBottom =
            scrollContainer.scrollTop + scrollContainer.clientHeight >=
            scrollContainer.scrollHeight;
          if (isAttachBottom) {
            setTimeout(() => {
              scrollContainer.scrollTop = 0;
            }, 300);
          }
        }
      };

      setInterval(scroll, 100);
    });
  });

  watch(data, (newData) => {
    totalValue.value = newData.reduce((sum, item) => sum + item.value, 0);
  });
</script>

<style scoped>
  .legend-container {
    position: relative;
    height: var(--height, 200px);
    overflow: hidden;
    text-align: center;

    .legend-list {
      width: var(--width, 200px);
      height: auto;
      max-height: 100%;
      overflow-y: scroll;
      text-align: center;
      list-style: none;
      padding: 0;
      margin: 0;
      transition: transform 0.2s linear;

      .legend-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 5px 5px;

        .dot-icon {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 2px;
        }

        .name {
          flex-grow: 1;
        }

        .value {
          margin-left: 10px;
        }
      }
    }
  }

  ::-webkit-scrollbar {
    width: 1px;
  }
</style>
