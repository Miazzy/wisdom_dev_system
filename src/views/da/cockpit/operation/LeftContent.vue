<template>
  <div class="left-content">
    <div class="top-section">
      <h2>上半部分</h2>
      <p>这里可以添加你的内容或组件</p>
    </div>
    <div class="bottom-section">
      <h2>下半部分</h2>
      <p>这里可以添加你的内容或组件</p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
  .left-content {
    flex: 33;
    width: 33%;
    padding: 0px;
    flex-shrink: 0;
  }

  .top-section {
    border: 0px solid #ccc;
    padding: 0px;
    width:100%;
    height: 50%;
  }

  .bottom-section {
    border: 0px solid #ccc;
    padding: 0px;
    width:100%;
    height: 50%;
  }
</style>
