<template>
  <div class="dashboard">
    <Header />
    <div class="content">
      <LeftContent />
      <MiddleContent />
      <RightContent />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Header from '/@/views/da/header/Header.vue';
  import LeftContent from '/@/views/da/operation/LeftContent.vue';
  import MiddleContent from '/@/views/da/operation/MiddleContent.vue';
  import RightContent from '/@/views/da/operation/RightContent.vue';
</script>

<style scoped>
  .dashboard {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .content {
    flex: 1;
    display: flex;
  }
</style>
