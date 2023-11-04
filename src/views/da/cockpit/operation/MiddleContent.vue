<template>
  <div class="middle-content">
    <div class="content-top">

    </div>
    <div class="content-middle">

    </div>
    <div class="content-bottom">

    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="less" scoped>
  .middle-content {
    display: flex;
    flex: 34%;
    width: 34%;
    flex-direction: column;
    height: 100%;
  }

  .content-top,
  .content-middle,
  .content-bottom {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: top;
    align-items: top;
    text-align: top;
    border: 1px solid #ccc;
    padding: 10px;
  }
</style>
