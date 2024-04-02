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
          <KeepAlive :max="1000">
            <component
              ref="componentRef"
              :is="Component"
              :key="handleRouteKey(route)"
              :name="handleRouteKey(route)"
            />
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
  const isRouterAlive = ref(true);
  const componentRef = ref();
  const instance = getCurrentInstance();

  // 收集已打开路由tabs的缓存
  const { caches, collectCaches } = useRouteCache();
  const visible = ref(false);

  useTitle();

  // 重新载入函数
  const reload = () => {
    isRouterAlive.value = false;
    nextTick(() => {
      try {
        if (instance?.proxy) {
          nextTick(() => {
            instance?.proxy?.$forceUpdate();
          });
        }
      } catch (error) {
        console.error('Force Update Error:', error);
      }
      isRouterAlive.value = true;
    });
  };

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
      } else {
        const isLocal = window.location.hostname == 'localhost';
        // 设置单独预览模式，Overview模式，预览模式，调试模式
        const isOverview =
          window.localStorage.getItem('overview-screen-flag') ||
          window.localStorage.getItem('overview');
        routePath != PageEnum.BASE_HOME && !isLocal && !isOverview
          ? router.push(PageEnum.BASE_HOME)
          : null;

        window.addEventListener('storage', function (e) {
          const hashFlag = window.location.hash && window.location.hash.startsWith('#');
          const routePath = hashFlag ? window.location.hash.slice(1) : window.location.hash;
          const loginFlag =
            routePath == PageEnum.BASE_LOGIN || routePath == PageEnum.BASE_LOGIN + '/';
          if (
            !loginFlag &&
            e?.storageArea?.length === 0 &&
            e?.key === null &&
            e?.newValue === null
          ) {
            sendOfflineMessage();
          }
        });
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
    }, 100);
  };

  // 处理路由变化函数
  const handleRouteChange = (message) => {
    try {
      if (!checkInIframe()) {
        return;
      }
      // 通知关闭窗口
      // MsgManager.getInstance().sendMsg('iframe-dialog-close', {});
      let { url, loading } = message; // const urls = panes.map((element) => element.pageurl.replace('/#/', '/'));
      url = url.replace('/#/', '/');
      caches.value.includes(url) ? null : (loading = true);
      router.push(url as string);
      if (loading) {
        nextTick(async () => {
          reload();
        });
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
</style>
