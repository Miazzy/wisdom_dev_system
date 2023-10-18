<template>
  <div class="donut-chart-container" :style="`width:${width * 1.0 + 120}px; height:${height}px`">
    <div class="donut-chart">
      <svg
        :width="width * 0.75"
        :height="height * 0.75"
        :viewBox="viewBox"
        preserveAspectRatio="xMidYMid meet"
      >
        <!-- 绘制饼状图 -->
        <g :transform="'translate(' + radius + ',' + radius + ')'">
          <g v-for="(arc, index) in arcs" :key="index" class="arc">
            <path
              :d="arc.path"
              :fill="arc.data.color"
              @mouseover="showDataItem(arc.data, $event)"
              @mouseleave="hideDataItem"
            />
          </g>
        </g>
        <text
          style="font-size: 22px"
          :x="(width * 0.75) / 2 - 12"
          :y="(height * 0.75) / 2 + 14"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ totalValue }}
        </text>
        <text
          style="font-size: 15px"
          :x="(width * 0.75) / 2 - 12"
          :y="(height * 0.75) / 2 + 39"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ `总人数` }}
        </text>
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
    <div class="data-list" style="margin-left: -40px">
      <div v-for="(item, index) in data" :key="index" class="data-item">
        <div class="data-color" :style="'background-color: ' + item.color"></div>
        <div class="data-label">{{ item.label }}</div>
        <div class="data-value">{{ item.value }}{{ `(人数)` }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, defineProps, computed } from 'vue';
  import * as d3 from 'd3';

  const props = defineProps({
    data: Array,
    width: Number,
    height: Number,
    radius: Number,
  });

  const radius = props.radius;
  const arcs = ref([]);
  const showingDataItem = ref(null);

  // 创建饼状图布局
  const pie = d3
    .pie()
    .value((d) => d.value)
    .padAngle(0.03); // 调整扇形之间的间隔

  // 颜色比例尺
  const colorScale = d3.scaleOrdinal().range(d3.schemeCategory10);

  // 为每个数据项分配颜色
  props.data.forEach((d, i) => (d.color = colorScale(i)));

  // 生成饼状图的路径
  const arcGenerator = d3
    .arc()
    .innerRadius(radius - 30)
    .outerRadius(radius - 10);

  // 生成饼状图数据
  onMounted(() => {
    arcs.value = pie(props.data).map((arc) => ({
      data: arc.data,
      path: arcGenerator(arc),
    }));
  });

  // 计算 viewBox 属性以保持饼状图居中
  const viewBox = ref(`0 0 ${2 * radius} ${2 * radius}`);
  const totalValue = computed(() => props.data.reduce((acc, curr) => acc + curr.value, 0));

  // 显示数据项信息
  const showDataItem = (data, event) => {
    showingDataItem.value = data;
    const dataItem = document.querySelector('.data-item');
    const itemHeight = dataItem.clientHeight;
    showingDataItem.value.top = `${event.clientY - itemHeight / 2}px`;
    showingDataItem.value.left = `${event.clientX + 10}px`;
  };

  // 隐藏数据项信息
  const hideDataItem = () => {
    showingDataItem.value = null;
  };
</script>

<style scoped>
  .donut-chart-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .donut-chart {
    flex: 1;
  }

  .arc {
    cursor: pointer;
  }

  .data-list {
    width: 40%;
  }

  .data-item {
    display: flex;
    align-items: center;
    margin: 4px 0;
    cursor: pointer;
  }

  .data-color {
    width: 20px;
    height: 20px;
    margin-right: 8px;
    border-radius: 50%;
  }

  .data-label {
    font-size: 14px;
  }

  .data-value {
    margin-left: 5px;
    font-size: 14px;
  }

  .data-item:hover {
    background-color: #f0f0f0;
  }

  .data-item:hover .data-color {
    box-shadow: 0 0 4px rgb(0 0 0 / 50%);
  }

  .data-item:hover .data-label {
    text-decoration: underline;
  }
</style>

function computed(arg0: () => unknown) { throw new Error('Function not implemented.'); }
