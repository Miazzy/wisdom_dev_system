<template>
  <div class="indicator-group">
    <div v-for="(item, index) in props.data" :key="index" class="indicator-item">
      <DonutIndicator :title="item.title" :color="item.color" :showValue="false"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import DonutIndicator from './DonutIndicator.vue';

  const props = defineProps({
    data: { type: Array, default: [] as any[] },
  });
</script>

<style scoped>
  .indicator-group {
    width: 135%;
    display: flex;
    flex-wrap: wrap;
    margin-left: 0%;
    transform: scale(0.8);
    transform-origin: 0% 0%;
  }

  .indicator-item {
    width: calc(33.3% - 0.05rem);
    margin-right: 0.05rem;
    margin-bottom: 0.05rem;
  }
</style>
