<template>
  <div class="dashboard">
    <Header :title="title" />
    <div class="content">
      <LeftContent />
      <MiddleContent />
      <RightContent />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import Header from '/@/views/da/header/Header.vue';
  import LeftContent from '/@/views/da/security/LeftContent.vue';
  import MiddleContent from '/@/views/da/security/MiddleContent.vue';
  import RightContent from '/@/views/da/security/RightContent.vue';

  const title = ref('安全驾驶舱');
</script>

<style lang="less" scoped>
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
