<template>
  <div
    v-if="showCompFlag"
    id="iframe-component"
    class="iframe-component"
    :url="activeKey"
    :path="framePath"
  >
    <keep-alive>
      <component :is="currentComponent" />
    </keep-alive>
  </div>
  <iframe
    v-show="!showCompFlag"
    ref="iframeContent"
    :src="activeKey"
    :panekey="activeKey"
    :pageurl="activeKey"
    :class="`${status ? 'active' : 'disactive'}`"
    :style="props.style"
  ></iframe>
</template>
<script lang="ts" setup>
  import { onMounted, ref, watch, defineProps, computed } from 'vue';
  import { urlToPath } from '/@/utils/route';
  import FrameBlank from '/@/views/sys/iframe/FrameBlank.vue';
  import Workbench from '/@/views/workbench/Workbench.vue';
  import { Memory } from '@/router/index';

  const routeList = [
    ['/frame/cachepage', FrameBlank],
    ['/frame/workbench', Workbench],
  ];

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
  const iframeContent = ref();
  const activeKey = ref('');
  const loadOverFlag = ref();
  const firstPageFlag = ref();
  const routeMap = new Map<string, Object>();
  const framePath = ref('');
  const componentFlag = ref(true);

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
      const component = routeMap.get(path);
      activeKey.value = props.url;
      framePath.value = path;

      Memory.getInstance().url = props.url;
      Memory.getInstance().path = path;
      Memory.getInstance().params = params;
      Memory.getInstance().query = params;

      if (component) {
        currentComponent.value = component;
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
    routeList.forEach((element) => {
      const [path, component] = element;
      if (typeof path === 'string') {
        routeMap.set('/#' + path, component);
      }
    });
  });
</script>

<style lang="less" scoped></style>
