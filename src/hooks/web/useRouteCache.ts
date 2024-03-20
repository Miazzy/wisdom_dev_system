import { ref, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';

const caches = ref<string[]>([]);
let collect = false;

export function useRouteCache() {
  const route = useRoute();

  // 收集当前路由相关的缓存
  function collectRouteCaches(fullPath) {
    const componentName: any = fullPath;
    if (!componentName) {
      return;
    }
    addCache(componentName);
  }

  // 收集缓存（通过监听）
  function collectCaches() {
    if (collect) {
      return;
    }
    collect = true;
    watch(() => route.fullPath, collectRouteCaches, { immediate: true });
  }

  // 添加缓存的路由组件
  function addCache(componentName: string | string[]) {
    if (Array.isArray(componentName)) {
      componentName.forEach(addCache);
      return;
    }
    if (!componentName || caches.value.includes(componentName)) return;
    caches.value.push(componentName);
  }

  // 移除缓存的路由组件
  function removeCache(componentName: string | string[]) {
    if (Array.isArray(componentName)) {
      componentName.forEach(removeCache);
      return;
    }
    const index = caches.value.indexOf(componentName);
    if (index > -1) {
      return caches.value.splice(index, 1);
    }
  }

  // 移除缓存的路由组件的实例
  async function removeCacheEntry(componentName: string) {
    if (removeCache(componentName)) {
      await nextTick();
      addCache(componentName);
    }
  }

  return {
    collectCaches,
    caches,
    addCache,
    removeCache,
    removeCacheEntry,
  };
}
