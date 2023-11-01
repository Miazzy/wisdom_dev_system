<template>
  <div class="subtitle-bar">
    <div class="left-section">
      <div class="vertical-line"></div>
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

<style scoped>
  .subtitle-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    color: #fefefe;
  }

  .left-section {
    display: flex;
    align-items: center;
  }

  .vertical-line {
    width: 5px;
    height: 20px;
    background-color: #32AFFF;
    margin-right: 10px;
  }

  .subtitle {
    font-size: 18px;
  }

  .right-section {

  }
</style>
