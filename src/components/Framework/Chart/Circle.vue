<template>
  <div class="circle-container">
    <svg :width="diameter" :height="diameter">
      <circle
        :cx="radius"
        :cy="radius"
        :r="radius - strokeWidth / 2"
        :fill="gradientFill"
        :stroke="borderColor"
        :stroke-width="strokeWidth"
      />
    </svg>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import * as d3 from 'd3';

  // 传入的数据数组
  const props = defineProps({
    diameter: { type: Number, default: 50 },
    backgroundColor: { type: String, default: '#fefefe' },
    borderColor: { type: String, default: '#fefefe' },
    strokeWidth: { type: Number, default: 1 },
  });
  const radius = props.diameter / 2;
  const gradientFill = ref<string>('');

  onMounted(() => {
    const gradient = d3
      .select('.circle-container')
      .select('svg')
      .append('defs')
      .append('radialGradient')
      .attr('id', 'circle-gradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');

    gradient
      .append('stop')
      .attr('offset', '0%')
      .style('stop-color', props.backgroundColor)
      .style('stop-opacity', 1);

    gradient
      .append('stop')
      .attr('offset', '100%')
      .style('stop-color', props.backgroundColor)
      .style('stop-opacity', 0);

    gradientFill.value = 'url(#circle-gradient)';
  });
</script>

<style scoped>
  .circle-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
