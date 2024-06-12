<template>
  <div class="no-data">
    <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE" />
  </div>
</template>
<script lang="ts" setup>
  import { Empty } from 'ant-design-vue';
</script>
<style lang="less" scoped>
  .no-data {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    :deep(.ant-empty-normal) {
      margin: 0;
    }
    :deep(.ant-empty-img-simple-ellipse) {
      fill: #103c66 !important;
    }
    :deep(.ant-empty-img-simple-g) {
      stroke: #33597d !important;
    }
    :deep(.ant-empty-img-simple-path) {
      stroke: #33597d !important;
      fill: #05335f !important;
    }
    :deep(.ant-empty-normal) {
      color: rgba(255, 255, 255, 0.3) !important;
    }
    :deep(.ant-empty-img-simple) {
      width: 90px;
      height: 58px;
    }
    :deep(.ant-empty-normal .ant-empty-image) {
      height: 58px;
    }
  }
</style>
