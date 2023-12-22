<template>
  <div class="main-layout">
    <Header @click="handleModuleClick" />
    <div class="main-content">
      <Menu :menus="menuList" @click="handleMenuClick" :theme="systemTheme"/>
      <Content @click="handleTabsClick" />
    </div>
  </div>
</template>
<script lang="ts" setup>
    import { onMounted, ref, watch } from 'vue';
  import Header from './Header.vue';
  import Menu from './Menu.vue';
  import Content from './Content.vue';

  const currentModule = ref(null);
  const menuList = ref([]);
  const systemTheme = ref('');

  // 处理顶部模块点击函数
  const handleModuleClick = (cmodule, menus) => {
    menuList.value = menus;
    currentModule.value = cmodule;
  };

  // 处理菜单点击函数
  const handleMenuClick = (menu, path, mode) => {

  };

  // 处理页签切换点击函数
  const handleTabsClick = (tabs, tabName, tabUrl) => {

  };

  // Mounted时加载函数
  onMounted(() => {
    systemTheme.value = 'light';
  });

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
