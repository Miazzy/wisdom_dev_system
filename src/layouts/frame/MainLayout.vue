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
  import { nextTick, onMounted, reactive, ref, watch } from 'vue';
  import Header from './Header.vue';
  import Menu from './Menu.vue';
  import Content from './Content.vue';
  import { useUserStore } from '/@/store/modules/user';
  import { MsgManager } from '/@/message/MsgManager';
  import { handleRouteGo } from '/@/utils/route';

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
    currentPath.value = '';
    nextTick(() => {
      currentPath.value = menu.url;
      currentMenu.value = menu;
    });
  };

  // 处理页签切换点击函数
  const handleTabsClick = (key, menu) => {
    const preKey = !currentPath.value.includes('/#') ? '/#' + currentPath.value : currentPath.value;
    if (key != preKey && currentPath.value) {
      state.path = key;
      state.menu = menu;
    }
  };

  // 用户下线消息处理函数
  const handleOfflineMessage = (message) => {
    const userStore = useUserStore();
    if (message.type === 'userOffline') {
      userStore.logout(true);
    }
  };

  // Mounted时加载函数
  onMounted(() => {
    MsgManager.getInstance().listen('notify-message', handleOfflineMessage);
    systemTheme.value = 'light';
    handleRouteGo();
  });
</script>
<style lang="less">
.theme1 {
  .main-layout {
    background: url('../../assets/images/background4.png') no-repeat center/100% 100%;
  }
}

.theme3 {
  .main-layout {
    background-color: #F0F2F5;
  } 
}
</style>
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
