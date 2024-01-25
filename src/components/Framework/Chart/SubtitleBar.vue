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
    align-items: center;
    justify-content: space-between;
    padding: 0.1rem 0;
    color: #fefefe;
  }

  .left-section {
    display: flex;
    align-items: center;
  }

  .vertical-line {
    width: 0.05rem;
    height: 0.2rem;
    margin-right: 0.1rem;
    background-color: #32AFFF;
  }

  .subtitle {
    font-size: 0.18rem;
  }
</style>
