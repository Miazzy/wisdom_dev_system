<template>
  <div class="main-layout">
    <Header @click="handleModuleClick" />
    <div class="main-content">
      <Menu :menus="menuList" @click="handleMenuClick" :theme="systemTheme" />
      <Content :path="currentPath" :menu="currentMenu" @change="handleTabsClick" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, reactive, ref, watch } from 'vue';
  import Header from './Header.vue';
  import Menu from './Menu.vue';
  import Content from './Content.vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '/@/store/modules/user';

  const router = useRouter();
  const currentModule = ref(null);
  const menuList = ref([]);
  const systemTheme = ref('');
  const currentPath = ref('');
  const currentMenu = ref();
  const state = reactive({
    path: '',
    menu: null,
  });

  // 处理顶部模块点击函数
  const handleModuleClick = (cmodule, menus) => {
    menuList.value = menus;
    currentModule.value = cmodule;
  };

  // 处理菜单点击函数
  const handleMenuClick = (key, menu, event) => {
    currentPath.value = menu.url;
    currentMenu.value = menu;
  };

  // 处理页签切换点击函数
  const handleTabsClick = (key, menu) => {
    const preKey = !currentPath.value.includes('/#') ? '/#' + currentPath.value : currentPath.value;
    if (key != preKey && currentPath.value) {
      state.path = key;
      state.menu = menu;
    }
  };

  const handleOfflineMessage = (event) => {
    const userStore = useUserStore();
    const message = event.data;
    // 处理接收到的消息
    if (message.type === 'userOffline') {
      userStore.logout(true);
    }
  };

  // Mounted时加载函数
  onMounted(() => {
    window.addEventListener('message', handleOfflineMessage, false);
    systemTheme.value = 'light';
  });
</script>
<style scoped>
  .main-layout {
    display: flex;
    flex-direction: column;
    height: 100vh; /* 100%视窗高度，使布局充满整个屏幕 */
    overflow-x: hidden;
    overflow-y: hidden;
  }

  .main-content {
    display: flex;
    flex: 1; /* Content 占据剩余空间 */
  }
</style>
<style lang="less">
  @import url('../default/tabs/index.less');
</style>
