<template>
  <div class="bubble-chart" style="position:relative;">
    <div ref="chart"></div>
    <BubbleDataGrid :data="props.data" :style="`position:absolute; top: 0px; left: ${width + 5}px;`"/>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onUnmounted, toRefs, defineProps, watch } from 'vue';
  import BubbleDataGrid from '/@/components/Framework/Chart/BubbleDataGrid.vue';
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
      .attr('r', (d) => d.r * 0.90)
      .attr('cx', (d) => d.x * 1.0)
      .attr('cy', (d) => d.y * 1.0)
      .attr('fill', (d) => {
        const color = d.data.color;
        return d3.color(color).copy({ opacity: 0.075 });
      })
      .style('stroke', (d) => d.data.color)
      .style('stroke-width', '2px');

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

  watch(
    () => props.data,
    () => {
      createBubbleChart(
      chart.value,
      data.value,
      width.value,
      height.value,
      fontSize.value,
      fontColor.value,
    );
    },
    {
      deep: true,
    },
  );

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
</script>
