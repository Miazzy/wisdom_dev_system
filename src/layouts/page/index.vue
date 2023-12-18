<template>
  <RouterView>
    <template #default="{ Component, route }">
      <keep-alive>
        <component :is="handleComponent(Component, route)" :key="routeKey" />
      </keep-alive>
    </template>
  </RouterView>
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

      return {
        getTransitionName,
        openCache,
        getEnableTransition,
        getBasicTransition,
        getCaches,
        getCanEmbedIFramePage,
        handleComponent,
        routeKey,
      };
    },
  });
</script>
