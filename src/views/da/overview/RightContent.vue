<template>
  <div class="right-content">
    <!-- Right content goes here -->
    <h2>右侧内容</h2>
    <!-- Add your content and components here -->
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="less" scoped>
  .right-content {
    flex: 30;
    width: 30%;
    flex-shrink: 0;
    padding: 0;

    .layout {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      height: 100%; /* 100% 窗口高度，可以根据需要调整 */
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
