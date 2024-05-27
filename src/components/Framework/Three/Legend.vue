<template>
  <div class="legend-container">
    <ul class="legend-list" ref="list">
      <li v-for="(item, index) in data" :key="index" class="legend-item">
        <span :style="{ backgroundColor: colors[index % colors.length] }" class="dot-icon"></span>
        <span class="name">{{ item.name }}</span>
        <span class="unit">
          <span :style="{ color: colors[index % colors.length] }">{{ item.value }}</span>
          <span class="unit-text"> {{ tUnit }} </span>
        </span>
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
    unit: {
      type: String,
      default: '',
    },
  });

  // Extract refs from props
  const { data, colors } = toRefs(props);

  const totalValue = ref([]);
  const list = ref(null);
  const tUnit = ref('');
  const calculatePercentage = (value) => ((value / totalValue.value) * 100).toFixed(2);

  onMounted(() => {
    if (props.data) {
      totalValue.value = props.data.reduce((sum, item) => sum + item.value, 0);
    }
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

  watch(
    () => props.data,
    (newData) => {
      totalValue.value = newData.reduce((sum, item) => sum + item.value, 0);
    },
  );

  watch(
    () => props.unit,
    (value) => {
      tUnit.value = value;
    },
  );
</script>

<style lang="less" scoped>
  .legend-container {
    position: relative;
    height: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center; /* Center horizontally */
    align-items: center; /* Center vertically */
    text-align: center;

    .legend-list {
      width: 110%;
      height: auto;
      max-height: 100%;
      overflow-y: scroll;
      text-align: center;
      list-style: none;
      padding: 0 5px 0 0;
      margin: 0;
      transition: transform 0.2s linear;
      display: flex;
      flex-direction: column;
      align-items: center; /* Center items horizontally */

      .legend-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        white-space:nowrap;
        padding: 5px 5px;
        width: 100%; /* Ensure items take full width */

        .dot-icon {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 2px;
        }

        .name {
          flex-grow: 1;
          white-space:nowrap;
        }

        .unit {
          margin-left: 5px;

          .unit-text {
            font-size: 12px;
          }
        }

        .value {
          margin-left: 5px;
        }
      }
    }
  }

  ::-webkit-scrollbar {
    width: 1px;
  }
</style>
