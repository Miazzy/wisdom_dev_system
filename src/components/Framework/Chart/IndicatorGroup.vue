<template>
  <div class="indicator-group">
    <div class="indicator-item" v-for="(item, index) in props.data" :key="index" @click="handleClick(item, index)">
      <div class="value-text">{{ (item.value || item.value===0)?item.value:'&nbsp;' }}</div>
      <div class="label-text">{{ item.label }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  // import { computed } from 'vue';

  const props = defineProps({
    data: Array,
  });
  const emit = defineEmits(['clickItem']);

  const handleClick = (item, index) => {
    emit('clickItem', item, index);
  }
</script>

<style lang="less" scoped>
  .indicator-group {
    display: flex;
    justify-content: space-between;
    width: 100%;

    .indicator-item {
      line-height: 1;
      text-align: center;
      cursor: pointer;

      .value-text {
        margin-bottom: 0.06rem;
        color: #1890FF;
        font-size: 0.22rem;
        font-weight: 600;
      }

      .label-text {
        color: rgb(255 255 255 / 80%);
        font-size: 0.12rem;
      }
    }
  }
</style>
