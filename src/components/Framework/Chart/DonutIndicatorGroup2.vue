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
    display: flex;
    flex-wrap: wrap;
  }

  .indicator-item {
    width: calc(33.3% - 0.05rem);
    margin-right: 0.05rem;
    margin-bottom: 0.05rem;
  }
</style>
