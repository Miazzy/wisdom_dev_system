<template>
  <div class="chart-content">
    <svg :width="width" :height="height">
      <g class="x-axis" />
      <g class="y-axis" />

      <!-- 绘制柱状图 -->
      <g class="bar-chart">
        <rect
          v-for="(bar, index) in barData"
          :key="index"
          :x="xScale(index)"
          :y="height - yScale(bar.barValue)"
          :width="barWidth"
          :height="yScale(bar.barValue)"
          :fill="barGradients[index % barGradients.length]"
          @mouseover="showBarInfo(bar, $event)"
          @mouseleave="hideBarInfo"
        />
      </g>

      <!-- 绘制折线图 -->
      <g class="line-chart">
        <path class="line" :d="lineGenerator(lineData)" :stroke="lineColors[0]" fill="none" />
      </g>
    </svg>
    <!-- 显示柱状图柱子信息 -->
    <div v-if="showingBarInfo" class="bar-info" :style="barInfoStyle">
      {{ barInfo }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onUnmounted, toRefs, defineProps } from 'vue';
  import * as d3 from 'd3';

  const props = defineProps({
    data: Array,
    width: Number,
    height: Number,
    barColors: Array,
    lineColors: Array,
    barWidth: Number,
  });

  const showingBarInfo = ref(false);
  const barInfo = ref('');
  const barInfoStyle = ref({ left: '0px', top: '0px' });

  const xScale = d3.scaleBand().domain(d3.range(props.data.length)).range([0, props.width]);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(props.data, (d) => d.barValue)])
    .range([0, props.height]);
  const lineGenerator = d3
    .line()
    .x((d, i) => xScale(i) + xScale.bandwidth() / 2)
    .y((d) => props.height - yScale(d.lineValue));

  const barData = props.data;
  const lineData = props.data;

  const showBarInfo = (bar, event) => {
    showingBarInfo.value = true;
    barInfo.value = `Value: ${bar.barValue}`;
    barInfoStyle.value = {
      left: `${event.clientX - 220}px`,
      top: `${props.height - event.clientY}px`,
    };
  };

  const hideBarInfo = () => {
    showingBarInfo.value = false;
  };

  const barGradients = ref([]);

  // 添加 x 轴（在底部显示）
  onMounted(() => {
    const xAxis = d3.axisBottom(xScale);
    // d3.select('.x-axis').call(xAxis);
  });

  // 添加 y 轴（在左侧显示）
  onMounted(() => {
    const yAxis = d3.axisLeft(yScale);
    d3.select('.y-axis').call(yAxis);
  });

  // 创建柱状图的颜色渐变
  onMounted(() => {
    barGradients.value = props.barColors.map((color, index) => {
      const gradientId = `barGradient-${index}`;
      createGradient(gradientId, color);
      return `url(#${gradientId})`;
    });
  });

  function createGradient(id, color) {
    const svg = d3.select('svg');
    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', id)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient.append('stop').attr('offset', '0%').attr('stop-color', color);
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#fff');
  }
</script>

<style scoped>
  .chart-content {
    position: relative;
    .bar-info {
      position: absolute;
      background: rgba(255, 255, 255, 0.9);
      padding: 4px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
  }
</style>
