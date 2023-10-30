<template>
  <div class="left-content">
    <!-- Left content goes here -->
    <h2>左侧内容</h2>
    <!-- Add your content and components here -->
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="less" scoped>
  .left-content {
    flex: 40;
    width: 45%;
    padding: 0px;
    flex-shrink: 0; 
    border-left: 0px solid #000;
  }

  .top-section {
    margin-bottom: 20px;
    height: 150px;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap; /* 使数字自动换行 */

    div.element {
      flex: 50%;
      padding: 0px;
    }
  }

  .middel-section {
    margin-top: -80px;
    margin-left: -80px;
  }

  .bottom-section {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap; /* 使数字自动换行 */
    margin: 0px 15px;
    div.element {
      flex: 18.5%;
      padding: 0px;
      height: 150px;
    }
  }

  .number {
    display: inline-block;
    margin-right: 20px;
  }

  .number .label {
    font-weight: bold;
  }
</style>
