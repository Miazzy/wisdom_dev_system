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
  import 'dayjs/locale/zh-cn';

  const { getAntdLocale } = useLocale();
  useTitle();

  onMounted(() => {
    listenThemeMessage();
  });
</script>
