<template>
  <div class="donut-chart-container" :style="`width:${width * 1.0 + 120}px; height:${height}px`">
    <div class="donut-chart">
      <svg :width="width * 0.75" :height="height * 0.75" :viewBox="viewBox">
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
          :x="(width * 0.75) / 2 - 12"
          :y="(height * 0.75) / 2 + 14"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ totalValue }}
        </text>
        <text
          :x="(width * 0.75) / 2 - 12"
          :y="(height * 0.75) / 2 + 39"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ `总人数` }}
        </text>
        <g>
          <path
            d="M0,100A100,100 0 1,1 0,99.99Z"
            fill="transparent"
            stroke="#2D5470"
            stroke-width="4"
            stroke-dasharray="4 4"
          />
          <path
            d="M0,95A95,95 0 1,1 0,94.99Z"
            fill="transparent"
            stroke="rgba(0, 123, 255, 0.25)"
            stroke-width="4"
            stroke-dasharray="0 0"
          />
        </g>
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
  const viewBox = computed(() => `0 0 ${2 * radius} ${2 * radius}`);
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
