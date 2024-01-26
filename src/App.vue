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
  import { onMounted } from 'vue';
  import { ConfigProvider } from 'ant-design-vue';
  import { AppProvider } from '@/components/Application';
  import { useTitle } from '@/hooks/web/useTitle';
  import { useLocale } from '@/locales/useLocale';
  import { listenThemeMessage } from '@/utils/theme';
  import { useRouter } from 'vue-router';
  import { PageEnum } from '/@/enums/pageEnum';
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
        if (iframePath !== routePath) {
          router.push(iframePath as string);
        } else if (routePath == PageEnum.BASE_HOME) {
          window.location.reload();
        }
        console.info('currentPath: ', iframePath);
        console.info('routePath: ', routePath);
      } else {
        routePath != PageEnum.BASE_HOME ? router.push(PageEnum.BASE_HOME) : null;
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
