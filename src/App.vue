<!--
 * @Description: 
 * @Date: 2023-09-12 09:04:31
 * @LastEditTime: 2023-09-16 17:10:02
 * @FilePath: \ygwl-framework\src\App.vue
-->
<template>
  <ConfigProvider :locale="getAntdLocale" :autoInsertSpaceInButton="false">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { onMounted, nextTick } from 'vue';
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
  import 'dayjs/locale/zh-cn';

  const { getAntdLocale } = useLocale();
  const router = useRouter();

  useTitle();

  // 处理路由路径函数
  const handleRoutePath = () => {
    try {
      const flag = checkInIframe();
      const hashFlag = window.location.hash && window.location.hash.startsWith('#');
      let routePath = hashFlag ? window.location.hash.slice(1) : window.location.hash;
      let iframePath = window.frameElement.src.split('/#')[1];
      if (iframePath && iframePath.includes('?')) {
        iframePath = iframePath.split('?')[0];
      }
      if (routePath && routePath.includes('?')) {
        routePath = routePath.split('?')[0];
      }
      if (flag) {
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
        const isOverview = window.localStorage.getItem('overview-screen-flag');
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
            console.info('listening clear storage ...');
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
      return true; // 如果出现错误，假定在 iframe 中显示
    }
  };

  // 处理 IframePage 函数
  const handleIframePage = () => {
    setTimeout(() => {
      handleRoutePath();
    }, 150);
  };

  onMounted(() => {
    listenThemeMessage();
    handleIframePage();
    MsgManager.getInstance().listen('check-iframe-framepage', () => {
      console.info('listen check iframe page message ...');
      handleIframePage();
    });
  });
</script>
