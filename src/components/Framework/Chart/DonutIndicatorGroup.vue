<template>
  <div class="indicator-group">
    <div v-for="(item, index) in props.data" :key="index" class="indicator-item">
      <DonutIndicator :title="item.title" :value="item.value" :color="item.color"/>
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
    width: calc(49.5% - 5px);
    margin-right: 5px;
    margin-bottom: 5px;
  }
</style>
