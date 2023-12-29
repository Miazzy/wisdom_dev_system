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
  import { useUserStore } from '/@/store/modules/user';
  import { useRouter } from 'vue-router';
  import 'dayjs/locale/zh-cn';

  const { getAntdLocale } = useLocale();
  const userStore = useUserStore();
  const router = useRouter();

  useTitle();

  const handleRoutePath = () => {
    const currentPath = (userStore.getCurrentPath as string).replace('/#/', '/');
    const routePath = router.currentRoute.value.path;
    const flag = checkInIframe();
    if (flag && currentPath !== routePath) {
      debugger;
      router.push(currentPath as string);
    }
    console.info('currentPath: ', currentPath);
    console.info('routePath: ', routePath);
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
    }, 500);
  });
</script>
