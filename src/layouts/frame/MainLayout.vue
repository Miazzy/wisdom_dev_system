<template>
  <div class="main-layout">
    <Header />
    <div class="main-content">
      <Menu />
      <Content />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import Header from './Header.vue';
  import Menu from './Menu.vue';
  import Content from './Content.vue';
</script>
<style scoped>
  .main-layout {
    display: flex;
    flex-direction: column;
    height: 100vh; /* 100%视窗高度，使布局充满整个屏幕 */
  }

  .main-content {
    display: flex;
    flex: 1; /* Content 占据剩余空间 */
  }
</style>
