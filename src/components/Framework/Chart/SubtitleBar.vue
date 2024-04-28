<template>
  <div class="subtitle-bar">
    <div class="left-section">
      <div class="subtitle">{{ subtitle }}</div>
    </div>
    <div class="right-section">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    subtitle: { type: String, default: '' },
  });
</script>

<style lang="less" scoped>
  .subtitle-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.12rem 0.16rem 0.08rem;
    color: #fefefe;
    :deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
        height: 0.26rem !important;
        border: 0.01rem solid #07a6ff70;
        border-radius: 0;
        background-color: transparent;
      }

      :deep(.ant-select-single .ant-select-selector .ant-select-selection-placeholder) {
        height: 0.26rem;
        line-height: 0.26rem;
      }

      :deep(.ant-select-arrow) {
        color: rgb(255 255 255 / 50%);
      }
  }

  .left-section {
    padding-left: 0.04rem;
  }

  .subtitle {
    font-size: 0.16rem;
  }
</style>
