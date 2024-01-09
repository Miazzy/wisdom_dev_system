<template>
  <div class="main-layout">
    <Header @click="handleModuleClick" />
    <div class="main-content">
      <Menu :menus="menuList" @click="handleMenuClick" :theme="systemTheme" />
      <Content
        :path="currentPath"
        :menu="currentMenu"
        :style="contentStyle"
        @change="handleTabsClick"
      />
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
  const contentClass = ref('');
  const contentStyle = ref('');
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

  // 处理浏览器窗口Resize函数
  const handleResize = () => {
    const owidth = window.outerWidth;
    const swidth = window.screen.availWidth;
    const flag = owidth === swidth;
    if (!flag) {
      contentClass.value = 'layout-xscroll';
      contentStyle.value = `width: ${swidth - 220}px;`;
    } else {
      contentClass.value = '';
      contentStyle.value = '';
    }
  };

  // Mounted时加载函数
  onMounted(() => {
    MsgManager.getInstance().listen('notify-message', handleOfflineMessage);
    systemTheme.value = 'light';
    handleRouteGo();
    handleResize();
    window.addEventListener('resize', () => {
      window.location.reload();
    }); // 添加窗口大小变化的事件监听器
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
      background-color: #f0f2f5;
    }
  }
</style>
<style lang="less" scoped>
  .main-layout {
    display: flex;
    flex-direction: column;
    height: 100vh; /* 100%视窗高度，使布局充满整个屏幕 */
    overflow-y: hidden;
    overflow-x: hidden;
  }

  .layout-xscroll {
    overflow-x: scroll !important;
  }

  .main-content {
    display: flex;
    flex: 1; /* Content 占据剩余空间 */
  }
</style>
<style lang="less">
  @import url('../default/tabs/index.less');
</style>
