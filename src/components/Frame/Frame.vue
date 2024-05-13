<template>
  <div
    v-if="showCompFlag"
    id="iframe-component"
    class="iframe-component"
    :url="activeKey"
    :path="framePath"
  >
    <keep-alive>
      <component :is="currentComponent" :key="activeKey" />
    </keep-alive>
  </div>
</template>
<script lang="ts" setup>
  // import { PageEnum } from '/@/enums/pageEnum';
  import { onMounted, ref, watch, defineProps, computed } from 'vue';
  import { urlToPath } from '/@/utils/route'; // pathToUrl
  import Workbench from '/@/views/workbench/Workbench.vue';
  import { routeMap } from '@/router/frame';
  import { Memory } from '@/router/index';
  import { useRouter } from 'vue-router';

  defineOptions({
    name: 'Frame',
    inheritAttrs: false,
  });

  const props = defineProps({
    isLoadOver: { type: [String, Boolean], default: false },
    isFirstPage: { type: [String, Boolean], default: false },
    status: { type: [String, Boolean], default: true },
    style: { type: [String, Object], default: '' },
    url: { type: String, default: '' },
  });

  // 定义emits const emit = defineEmits(['click', 'change']);
  const currentComponent = ref<any>(Workbench);
  const activeKey = ref('');
  const loadOverFlag = ref();
  const firstPageFlag = ref();
  const framePath = ref('');
  const componentFlag = ref(true);
  const router = useRouter();
  // const routeMap = ref(null);

  const showCompFlag = computed(() => {
    if (componentFlag.value) {
      return true;
    } else if (!loadOverFlag.value || !firstPageFlag.value) {
      return true;
    } else {
      return false;
    }
  });

  watch(
    () => props.url,
    async () => {
      const { path, params } = urlToPath(props.url);
      activeKey.value = props.url;

      Memory.getInstance().url = props.url;
      Memory.getInstance().path = path;
      Memory.getInstance().params = params;
      Memory.getInstance().query = params;

      console.info('url:', props.url);
      framePath.value = path;

      // const __path__ = window.decodeURIComponent(path);
      // const url = pathToUrl(PageEnum.BASE_HOME, { __path__, ...params });
      // if (url !== window.location.hash) {
      //   // router.push(url);
      // }

      const component = routeMap ? routeMap.get(path) : null;
      if (component) {
        componentFlag.value = true;
        currentComponent.value = component;
        console.info('use component...');
      } else {
        componentFlag.value = false;
      }
    },
  );

  watch(
    () => props.isLoadOver,
    () => {
      loadOverFlag.value = props.isLoadOver;
    },
  );

  watch(
    () => props.isFirstPage,
    () => {
      firstPageFlag.value = props.isFirstPage;
    },
  );

  onMounted(() => {
    activeKey.value = props.url;
    loadOverFlag.value = props.isLoadOver;
    firstPageFlag.value = props.isFirstPage;

    // nextTick(async () => {
    //   const frame = await import(`@/router/frame`);
    //   routeMap.value = frame.routeMap;
    // });
  });
</script>

<style lang="less" scoped></style>
