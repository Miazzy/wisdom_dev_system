<template>
  <div class="three-pie-chart">
    <div class="tree-d-pie">
      <TreeDPie :data="data" :colors="colors" :width="width" :height="height" :alpha="alpha" :opacity="opacity" :ratio="ratio" />
    </div>
    <div class="legend">
      <Legend :data="tData" :colors="tColors" :unit="tUnit" />
    </div>
  </div>
</template>

<script setup>
  import { defineProps, onMounted, ref, watch } from 'vue';
  import TreeDPie from '@/components/Framework/Three/TreeDPie.vue';
  import Legend from '@/components/Framework/Three/Legend.vue';

  const props = defineProps({
    data: { type: Array, default: [] },
    colors: { type: Array, default: [] },
    width: { type: Number, default: 400 },
    height: { type: Number, default: 400 },
    alpha: { type: Number, default: 15 },
    opacity: { type: Number, default: 0.75 },
    distance: { type: Number, default: 200 },
    ratio: { type: Number, default: 0.8 },
    unit: { type: String, default: '' },
  });

  const tData = ref(null);
  const tColors = ref(null);
  const tUnit = ref('');

  const handleOptions = () => {
    tData.value = props.data;
    tColors.value = props.colors;
    tUnit.value = props.unit;
  };

  const handleStyle = () => {};

  watch(
    () => props.options,
    () => {
      handleOptions();
      handleStyle();
    },
  );

  watch(
    () => props.colors,
    () => {
      handleOptions();
      handleStyle();
    },
  );

  watch(
    () => props.data,
    () => {
      handleOptions();
      handleStyle();
    },
  );

  onMounted(() => {
    handleOptions();
    handleStyle();
  });
</script>

<style lang="less" scoped>
  .three-pie-chart {
    display: flex;
    width: 100%;
    height: 100%;

    .tree-d-pie {
      padding-top: -0.1rem;
      height: 100%;
    }

    .legend {
      margin-left: -30px;
      margin-top: 30px;
      min-width: 150px;
      padding-top: 0;
    }
  }
</style>
