<template>
  <div ref="chart"></div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onUnmounted, toRefs, defineProps } from 'vue';
  import * as d3 from 'd3';

  const props = defineProps({
    data: Array,
    width: Number,
    height: Number,
    fontSize: {
      type: String,
      default: '12px',
    },
    fontColor: {
      type: String,
      default: 'black',
    },
  });

  const { data, width, height, fontSize, fontColor } = toRefs(props);
  const chart = ref(null);

  onMounted(() => {
    createBubbleChart(
      chart.value,
      data.value,
      width.value,
      height.value,
      fontSize.value,
      fontColor.value,
    );
  });

  onUnmounted(() => {
    // 清理组件卸载时的操作
  });

  function createBubbleChart(container, data, width, height, fontSize, fontColor) {
    const svg = d3.select(container).append('svg').attr('width', width).attr('height', height);

    const pack = d3.pack().size([width, height]).padding(1.5);
    const root = d3.hierarchy({ children: data }).sum((d) => d.value);
    const nodes = pack(root).leaves();

    svg
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', (d) => d.r * 0.97)
      .attr('cx', (d) => d.x * 1.0)
      .attr('cy', (d) => d.y * 1.0)
      .attr('fill', '#303030')
      .style('stroke', (d) => d.data.color || fontColor)
      .style('stroke-width', '3px');

    svg
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y)
      .attr('text-anchor', 'middle')
      .attr('dy', '.3em')
      .style('font-size', (d) => d.data.size || fontSize)
      .style('fill', (d) => d.data.color || fontColor)
      .text((d) => d.data.name);
  }
</script>
