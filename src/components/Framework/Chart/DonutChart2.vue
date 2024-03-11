<template>
  <div class="donut-chart-container" :style="`width:${typeof props.width == 'number' ? props.width + 'px' : props.width}; height:${typeof props.height == 'number' ? props.height + 'px' : props.height}`">
    <div class="donut-chart">
      <svg
        :width="200"
        :height="200"
        :viewBox="viewBox"
        preserveAspectRatio="xMidYMid meet" style="height: 100%;width: 100%;"
      >
        <!-- 绘制饼状图 -->
        <g :transform="'translate(' + radius + ',' + radius + ')'">
          <g v-for="(arc, index) in arcs" :key="index" class="arc">
            <path :d="arc.path" :fill="arc.data.color" @click="handleClick(index)" />
          </g>
        </g>
        <!-- <text
          style="font-size: 28px; dy: 5px"
          :x="(width * 0.75) / 2 - 14"
          :y="(height * 0.75) / 2 + 19"
          text-anchor="middle"
          dominant-baseline="middle"
          fill="white"
        >
          {{ totalValue }}
        </text>
        <text
          style="font-size: 15px"
          :x="(width * 0.75) / 2 - 12"
          :y="(height * 0.75) / 2 + 45"
          text-anchor="middle"
          dominant-baseline="middle"
          fill="white"
        >
          {{ props.title }}
        </text> -->
        <!-- 添加内圈的虚线 -->
        <circle
          r="62.5"
          cx="100"
          cy="100"
          fill="transparent"
          stroke="#2D5470"
          stroke-width="4"
          stroke-dasharray="4 4"
        />
        <!-- 添加内圈的虚线 -->
        <circle
          r="57"
          cx="100"
          cy="100"
          fill="transparent"
          stroke="rgba(0, 123, 255, 0.25)"
          stroke-width="4"
          stroke-dasharray="0 0"
        />
      </svg>
    </div>
    <div class="data-list">
      <DonutIndicatorGroup :data="groupList" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, defineProps, computed, watch } from 'vue';
  import * as d3 from 'd3';
  import DonutIndicatorGroup from './DonutIndicatorGroup2.vue';

  const props = defineProps({
    data: Array,
    width: [Number, String],
    height: [Number, String],
    radius: Number,
    sliceGap: { type: Number, default: 0.08 }, // 默认间距值，可以根据需要进行调整
    title: { type: String, default: '总指标' },
  });

  const radius = props.radius;
  const arcs = ref([]);
  const groupList = ref([]);

  // 创建饼状图布局
  const pie = d3
    .pie()
    .value((d) => d.value)
    .padAngle(props.sliceGap); // 调整扇形之间的间隔

  // 颜色比例尺函数
  const colorScale = d3.scaleOrdinal().range(d3.schemeCategory10);

  // 生成饼状图的路径
  const arcGenerator = d3
    .arc()
    .innerRadius(radius - 30)
    .outerRadius(radius - 8);

  const updateChart = () => {
    // 为每个数据项分配颜色
    const list = props.data.map((item, i) => {
      const color = item.color ? item.color : colorScale(i);
      const title = item.label;
      return { ...item, color, title };
    });
    groupList.value = list;
    arcs.value = pie(list).map((arc) => ({
      data: arc.data,
      path: arcGenerator(arc),
    }));
  };

  const emit = defineEmits(['clickItem']);

  const handleClick = (index)=>{
    emit('clickItem', groupList.value[index]);
  }

  watch(
    () => props.data,
    () => {
      updateChart();
    },
    {
      deep: true,
    },
  );

  // 生成饼状图数据
  onMounted(() => {
    updateChart();
  });

  // 计算 viewBox 属性以保持饼状图居中
  const viewBox = ref(`0 0 ${2 * radius} ${2 * radius}`);
  // const totalValue = computed(() => props.data.reduce((acc, curr) => acc + curr.value, 0));
</script>

<style scoped>
  /* .donut-chart-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  } */

  .donut-chart {
    /* flex: 1; */
    text-align: center;
  }

  .arc {
    cursor: pointer;
  }

  .data-list {
    width: 100%;
  }

  .data-item {
    display: flex;
    align-items: center;
    margin: 0.04rem 0;
    cursor: pointer;
  }

  .data-color {
    width: 0.2rem;
    height: 0.2rem;
    margin-right: 0.08rem;
    border-radius: 50%;
  }

  .data-label {
    font-size: 0.14rem;
  }

  .data-value {
    margin-left: 0.05rem;
    font-size: 0.14rem;
  }

  .data-item:hover {
    background-color: #f0f0f0;
  }

  .data-item:hover .data-color {
    box-shadow: 0 0 0.04rem rgb(0 0 0 / 50%);
  }

  .data-item:hover .data-label {
    text-decoration: underline;
  }
</style>
