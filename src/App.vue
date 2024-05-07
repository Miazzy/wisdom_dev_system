<template>
  <ConfigProvider :locale="getAntdLocale" :autoInsertSpaceInButton="false">
    <AppProvider>
      <teleport to="body">
        <div class="modal-mask" v-if="visible" @mousewheel.prevent>
          <div class="modal-mask-container" @mousewheel.prevent></div>
        </div>
      </teleport>
      <RouterView v-slot="{ Component, route }">
        <template v-if="handleRoute(route)">
          <KeepAlive :max="100">
            <transition name="fade" mode="out-in">
              <component
                ref="componentRef"
                :is="Component"
                :key="handleRouteKey(route)"
                :name="handleRouteKey(route)"
              />
            </transition>
          </KeepAlive>
        </template>
        <template v-else>
          <component :is="Component" :key="handleRouteKey(route)" :name="handleRouteKey(route)" />
        </template>
      </RouterView>
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { onMounted, nextTick, ref, getCurrentInstance } from 'vue';
  import { ConfigProvider } from 'ant-design-vue';
  import { AppProvider } from '@/components/Application';
  import { useTitle } from '@/hooks/web/useTitle';
  import { useLocale } from '@/locales/useLocale';
  import { listenThemeMessage } from '@/utils/theme';
  import { useRouter } from 'vue-router';
  import { PageEnum } from '/@/enums/pageEnum';
  import { closeCurrentTab, sendOfflineMessage } from '@/utils/route';
  import { SysMessage } from '/@/hooks/web/useMessage';
  import { MsgManager } from '/@/message/MsgManager';
  import { useRouteCache } from '@/hooks/web/useRouteCache';
  import 'dayjs/locale/zh-cn';

  const { getAntdLocale } = useLocale();
  const router = useRouter();
  const componentRef = ref();
  const { collectCaches } = useRouteCache();
  const visible = ref(false);

  useTitle();

  // 处理route函数
  const handleRoute = (route) => {
    return route.meta.keepAlive;
  };

  // 处理route函数
  const handleRouteKey = (route) => {
    return route.fullPath;
  };

  // 处理路由路径函数
  const handleRoutePath = () => {
    try {
      const flag = checkInIframe();
      const hashFlag = window.location.hash && window.location.hash.startsWith('#');
      let routePath = hashFlag ? window.location.hash.slice(1) : window.location.hash;
      if (routePath && routePath.includes('?')) {
        routePath = routePath.split('?')[0];
      }
      if (flag) {
        let iframePath = window.frameElement.src.split('/#')[1];
        if (iframePath && iframePath.includes('?')) {
          iframePath = iframePath.split('?')[0];
        }
        const baseFlag = iframePath == PageEnum.BASE_HOME || iframePath == PageEnum.BASE_HOME + '/';
        const routeFlag = routePath == PageEnum.BASE_HOME || routePath == PageEnum.BASE_HOME + '/';
        const loginFlag =
          iframePath == PageEnum.BASE_LOGIN || iframePath == PageEnum.BASE_LOGIN + '/';
        if (iframePath !== routePath && !baseFlag) {
          router.push(iframePath as string);
        } else if (baseFlag) {
          SysMessage.getInstance().warning('警告：页签页面不能打开框架页面！');
          nextTick(closeCurrentTab);
        } else if (routeFlag) {
          SysMessage.getInstance().warning('警告：页签页面不能打开框架页面...');
          nextTick(closeCurrentTab);
        } else if (loginFlag) {
          sendOfflineMessage();
        }
        console.info('currentPath: ', iframePath);
        console.info('routePath: ', routePath);
      }
    } catch (error) {
      //
    }
  };

  // 判断当前页面是否在 iframe 中显示
  const checkInIframe = () => {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  };

  // 处理 IframePage 函数
  const handleIframePage = () => {
    setTimeout(() => {
      handleRoutePath();
    }, 10);
  };

  // 处理路由变化函数
  const handleRouteChange = (message) => {
    try {
      if (checkInIframe()) {
        console.info('handleRouteChange:', new Date().getTime());
        // 通知关闭窗口
        let { url } = message;
        url = url.replace('/#/', '/');
        router.push(url as string);
      }
    } catch (error) {
      //
    }
  };

  // 处理是否显示隐藏Mask函数
  const handleMask = (message) => {
    if (checkInIframe()) {
      return;
    }
    const { type } = message;
    if (type == 'open') {
      visible.value = true;
    } else if (type == 'remove') {
      visible.value = false;
    }
  };

  onMounted(() => {
    collectCaches();
    listenThemeMessage();
    handleIframePage();

    // 监听check-iframe-framepage消息
    MsgManager.getInstance().listen('check-iframe-framepage', () => {
      handleIframePage();
    });

    // Single-Iframe-Mode
    MsgManager.getInstance().listen('iframe-url-change', (message) => {
      handleRouteChange(message);
    });

    // 监听是否打开Dialog
    MsgManager.getInstance().listen('modal-open', (message) => {
      handleMask(message);
    });

    // 监听是否打开Drawer
    MsgManager.getInstance().listen('drawer-open', (message) => {
      handleMask(message);
    });

    // 监听是否退出登录
    MsgManager.getInstance().listen('logouting', (message) => {
      SysMessage.logouting = message;
    });

    // 监听清空缓存操作
    window.addEventListener('storage', function (e) {
      if (e?.storageArea?.length === 0 && e?.key === null && e?.newValue === null) {
        sendOfflineMessage();
      }
    });
  });
</script>
<style lang="less" scoped>
  .modal-mask {
    display: flex;
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgb(0 0 0 / 15%);

    .modal-mask-container {
      display: flex;
      position: absolute;
      z-index: 1000;
      top: 0;
      left: 0;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background-color: rgb(0 0 0 / 15%);
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.1s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>
