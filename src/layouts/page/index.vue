<template>
  <keep-alive>
    <RouterView>
      <template #default="{ Component, route }">
        <template v-if="handleIsCachedComponent(Component, route, 'reverse')">
          <component :is="handleComponent(Component, route)" :key="routeKey" />
        </template>
        <template v-else>
          <keep-alive>
            <component :is="handleComponent(Component, route)" :key="routeKey" />
          </keep-alive>
        </template>
      </template>
    </RouterView>
  </keep-alive>
  <FrameLayout v-if="getCanEmbedIFramePage" />
</template>

<script lang="ts">
  import { computed, defineComponent, unref, ref } from 'vue';
  import { setComponetInfo } from '/@/utils/cache';

  import FrameLayout from '/@/layouts/iframe/index.vue';

  import { useRootSetting } from '/@/hooks/setting/useRootSetting';

  import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting';
  import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting';
  import { getTransitionName } from './transition';

  import { useMultipleTabStore } from '/@/store/modules/multipleTab';

  export default defineComponent({
    name: 'PageLayout',
    components: { FrameLayout },
    setup() {
      const { getShowMultipleTab } = useMultipleTabSetting();
      const tabStore = useMultipleTabStore();

      const { getOpenKeepAlive, getCanEmbedIFramePage } = useRootSetting();

      const { getBasicTransition, getEnableTransition } = useTransitionSetting();

      const openCache = computed(() => unref(getOpenKeepAlive) && unref(getShowMultipleTab));
      const isCachedComponent = ref(true);

      const getCaches = computed((): string[] => {
        if (!unref(getOpenKeepAlive)) {
          return [];
        }
        return tabStore.getCachedTabList;
      });

      const routeKey = ref('');

      const handleComponent = (component, route) => {
        if (typeof component?.type != 'function') {
          routeKey.value = route.fullPath;
          setComponetInfo(route.fullPath + '#type', component?.type);
        } else {
          routeKey.value = route.fullPath;
          setComponetInfo(route.fullPath + '#type', component?.type);
        }
        return component;
      };

      const handleIsCachedComponent = (component, route, flag = 'forward'): boolean => {
        try {
          // 如果Path在刷新List中，则重新渲染，如果在Tab页签List中，则使用缓存
          const result = !tabStore.getRefreshList(route.fullPath);
          console.log('path use cache:', result, ' path:', route.fullPath);
          if (flag == 'forward') {
            return result;
          } else {
            return !result;
          }
        } catch (error) {
          return true;
        }
      };

      return {
        getTransitionName,
        openCache,
        getEnableTransition,
        getBasicTransition,
        getCaches,
        getCanEmbedIFramePage,
        isCachedComponent,
        handleComponent,
        handleIsCachedComponent,
        routeKey,
      };
    },
  });
</script>
