<template>
  <div class="indicator-group">
    <div class="indicator-item" v-for="(item, index) in props.data" :key="index">
      <div class="value-text">{{item.value}}</div>
      <div class="label-text">{{item.label}}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  // import { computed } from 'vue';

  const props = defineProps({
    data: Array
  });

  
</script>

<style lang="less" scoped>
.indicator-group {
  display: flex;
  justify-content: space-between;
  width: 100%;

  .indicator-item {
    line-height: 1;
    text-align: center;

    .value-text {
      margin-bottom: 10px;
      color: #32AFFF;
      font-size: 22px;
      font-weight: 600;
    }

    .label-text {
      color: rgb(255 255 255 / 80%);
      font-size: 12px;
    }
  }
}

</style>
