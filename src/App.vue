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
  import 'dayjs/locale/zh-cn';

  const { getAntdLocale } = useLocale();
  const router = useRouter();

  useTitle();

  const handleRoutePath = () => {
    try {
      const flag = checkInIframe();
      const hashFlag = window.location.hash && window.location.hash.startsWith('#');
      const routePath = hashFlag ? window.location.hash.slice(1) : window.location.hash;
      if (flag) {
        const iframePath = window.frameElement.src.split('/#')[1];
        const baseFlag = iframePath == PageEnum.BASE_HOME || iframePath == PageEnum.BASE_HOME + '/';
        const routeFlag = routePath == PageEnum.BASE_HOME || routePath == PageEnum.BASE_HOME + '/';
        const loginFlag =
          iframePath == PageEnum.BASE_LOGIN || iframePath == PageEnum.BASE_LOGIN + '/';
        if (iframePath == routePath && baseFlag) {
          SysMessage.getInstance().warning('警告：页签页面不能打开框架页面！');
          nextTick(closeCurrentTab);
        } else if (iframePath !== routePath) {
          router.push(iframePath as string);
        } else if (routeFlag) {
          window.location.reload();
        } else if (loginFlag) {
          sendOfflineMessage();
        }
        console.info('currentPath: ', iframePath);
        console.info('routePath: ', routePath);
      } else {
        const isLocal = window.location.hostname == 'localhost';
        routePath != PageEnum.BASE_HOME && !isLocal ? router.push(PageEnum.BASE_HOME) : null;

        window.addEventListener('storage', function (e) {
          const hashFlag = window.location.hash && window.location.hash.startsWith('#');
          const routePath = hashFlag ? window.location.hash.slice(1) : window.location.hash;
          const loginFlag = routePath == PageEnum.BASE_LOGIN || routePath == PageEnum.BASE_LOGIN + '/';
          if (!loginFlag && e?.storageArea?.length === 0 && e?.key === null && e?.newValue === null) {
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
  function checkInIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true; // 如果出现错误，假定在 iframe 中显示
    }
  }

  onMounted(() => {
    listenThemeMessage();
    setTimeout(() => {
      handleRoutePath();
    }, 150);
  });
</script>
