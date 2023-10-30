<template>
  <div class="middle-content">
    <!-- Middle content goes here -->
    <h2>中间内容</h2>
    <!-- Add your content and components here -->
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="less" scoped>
  .middle-content {
    flex: 30;
    width: 30%;
    padding: 0px;
    flex-shrink: 0;

    .layout {
      display: flex;
      flex-direction: column;
      height: 100%; /* 100% 窗口高度，可以根据需要调整 */
      flex-shrink: 0; 

      .top-section {
        flex: 10; /* 上部分高度占比，可以根据需要调整 */
        height: 33%;
      }

      .middle-section {
        flex: 10; /* 中间部分高度占比，可以根据需要调整 */
        height: 33%;
      }

      .bottom-section {
        flex: 10; /* 下部分高度占比，可以根据需要调整 */
        height: 33%;
      }
    }
  }
</style>
