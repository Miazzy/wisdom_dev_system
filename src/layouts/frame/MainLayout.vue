<template>
  <div class="main-layout">
    <template v-if="mode">
      <Header v-show="!screenFlag" @click="handleModuleClick" />
      <div class="main-content">
        <Menu
          v-show="!screenFlag"
          :menus="menuList"
          @click="handleMenuClick"
          :theme="systemTheme"
        />
        <Content
          :path="currentPath"
          :menu="currentMenu"
          :style="contentStyle"
          @change="handleTabsClick"
        />
      </div>
    </template>
    <template v-else>
      <iframe ref="pageFrame" :src="pageURL" class="page-frame"></iframe>
    </template>
  </div>
</template>
<script lang="ts" setup>
  import { nextTick, onMounted, reactive, ref, getCurrentInstance, watch } from 'vue';
  import Header from './Header.vue';
  import Menu from './Menu.vue';
  import Content from './Content.vue';
  import { handleRouteGo, listenOfflineMessage, urlToPath } from '/@/utils/route';
  import { MsgManager } from '/@/message/MsgManager';
  import { CacheManager } from '/@/message/CacheManager';

  import { getDownloadURL } from '@/utils/upload';
  import * as ParameterApi from '@/api/system/parameter';
  import * as FileApi from '@/api/infra/file';
  import { useUserStore } from '/@/store/modules/user';
  import { DICT_TYPE } from '@/utils/dict';

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
  const instance = getCurrentInstance();
  const screenFlag = ref(false);
  const mode = ref(false);
  const pageURL = ref('');
  const userStore = useUserStore();

  // 处理顶部模块点击函数
  const handleModuleClick = (cmodule, menus) => {
    menuList.value = menus;
    currentModule.value = cmodule;
  };

  // 处理菜单点击函数
  const handleMenuClick = (key, menu, event) => {
    try {
      currentPath.value = '';
      nextTick(() => {
        currentPath.value = menu.url;
        currentMenu.value = menu;
      });
    } catch {
      //
    }
    // MsgManager.getInstance().sendMsg('check-iframe-framepage', {});
  };

  // 处理页签切换点击函数
  const handleTabsClick = (key, menu) => {
    try {
      const preKey = !currentPath.value.includes('/#')
        ? '/#' + currentPath.value
        : currentPath.value;
      if (key != preKey && currentPath.value) {
        state.path = key;
        state.menu = menu;
      }
    } catch {
      //
    }
    // MsgManager.getInstance().sendMsg('check-iframe-framepage', {});
  };

  // 处理浏览器窗口Resize函数
  const handleResize = () => {
    if (window.screen.availWidth <= 1440 || window.outerWidth <= 1440) {
      contentClass.value = '';
      contentStyle.value = '';
      return;
    }
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

  // 处理Reload函数
  const handleReload = () => {
    if (instance?.proxy) {
      nextTick(() => {
        instance?.proxy.$forceUpdate();
        handleResize();
      });
    } else {
      nextTick(() => {
        window.location.reload();
      });
    }
  };

  // 处理屏幕消息
  const handleScreenMessage = (message) => {
    const { status } = message;
    if (status == 'on') {
      screenFlag.value = true;
    } else if (status == 'off') {
      screenFlag.value = false;
    }
  };

  const handleLoadUserExtra = async () => {
    try {
      const code = DICT_TYPE.SYSTEM_MULTI_ORGANIZATION;
      const userInfo = userStore.getUserInfo;
      const multiOrganization = await ParameterApi.getParameterByCode(code);
      const flag = multiOrganization.value == 'false' || multiOrganization.value == false ? false : true;
      const resp = await FileApi.getFiles({ bizId: userInfo?.userId });
      const path = getDownloadURL(resp[0].url);
      userInfo.avatar = path;
      userStore.setMultiOrganization(flag);
      userStore.setUserInfo(userInfo);
      CacheManager.getInstance().setCache('AVATAR', path);
    } catch (error) {
      //
    }
  };

  // Mounted时加载函数
  onMounted(() => {
    const { params } = urlToPath();
    systemTheme.value = 'light';

    handleRouteGo();
    handleResize();
    listenOfflineMessage();
    handleLoadUserExtra();

    window.addEventListener('resize', handleReload);
    MsgManager.getInstance().listen('iframe-screen', handleScreenMessage);

    mode.value = params.mode ? false : true;
    pageURL.value = params.mode ? window.origin + '/#' + window.decodeURIComponent(params.path) : '';
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

    .page-frame {
      width: 100%;
      height: 100%;
    }
  }

  .layout-xscroll {
    overflow-x: scroll !important;
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
