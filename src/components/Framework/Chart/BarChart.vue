<template>
  <div ref="chart"></div>
</template>

<script setup>
  import { ref, onMounted, toRefs, defineProps } from 'vue';
  import * as d3 from 'd3';

  const props = defineProps({
    data: Array, // 柱状图和折线图数据
    width: Number, // 图表宽度
    height: Number, // 图表高度
    barColors: Array, // 柱状图颜色渐变配置
    lineColors: Array, // 折线图颜色配置
  });

  const { data, width, height, barColors, lineColors } = toRefs(props);
  const chart = ref(null);

  onMounted(() => {
    createCombinedChart(
      chart.value,
      data.value,
      width.value,
      height.value,
      barColors.value,
      lineColors.value,
    );
  });

  function createCombinedChart(container, data, width, height, barColors, lineColors) {
    // 创建SVG容器
    const svg = d3.select(container).append('svg').attr('width', width).attr('height', height);

    // 创建Y轴比例尺（柱状图）
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .range([height, 0]);

    // 创建X轴比例尺（柱状图）
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, width])
      .padding(0.1);

    // 绘制柱状图
    svg
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(d.label))
      .attr('y', (d) => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => height - yScale(d.value))
      .attr('fill', (d, i) => {
        // 使用颜色渐变
        const gradientId = `barGradient-${i}`;
        createGradient(svg, gradientId, barColors[i]);
        return `url(#${gradientId})`;
      });

    // 创建折线图的X轴和Y轴比例尺
    const xScaleLine = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, width]);
    const yScaleLine = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value * 2)])
      .range([height, 0]);

    // 创建折线生成器
    const lineGenerator = d3
      .line()
      .x((d) => xScaleLine(d.label) + xScaleLine.bandwidth() / 2)
      .y((d) => yScaleLine(d.value));

    // 绘制折线图
    svg
      .append('path')
      .datum(data)
      .attr('d', lineGenerator)
      .attr('fill', 'none')
      .attr('stroke', lineColors[0])
      .attr('stroke-width', 2);

    // 添加X轴（柱状图和折线图共用）
    svg.append('g').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(xScale));

    // 添加Y轴（柱状图）
    svg.append('g').call(d3.axisLeft(yScale));
  }

  // 创建颜色渐变
  function createGradient(svg, id, colors) {
    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', id)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');
    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('style', `stop-color:${colors[0]}; stop-opacity:1`);
    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('style', `stop-color:${colors[1]}; stop-opacity:1`);
  }
</script>
