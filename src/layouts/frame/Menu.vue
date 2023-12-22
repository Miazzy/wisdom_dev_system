<template>
  <aside class="app-menu">
    <a-menu
      v-model:selectedKeys="selectedKeys"
      style="width: 220px"
      mode="inline"
      :open-keys="openKeys"
      @openChange="onOpenChange"
    >
      <template v-for="menu in menuList" :key="menu.id">
        <template v-if="menu?.visible && menu?.component === 'LAYOUT'">
          <a-sub-menu :key="menu?.id">
            <template #icon>
              <Icon :icon="menu.icon" color="#333" size="22" />
            </template>
            <template #title>{{ menu.name }}</template>
            <template v-for="item in menu.children">
              <template v-if="item?.visible && item?.component !== 'LAYOUT'">
                <a-menu-item :key="item?.id">{{ item?.name }}</a-menu-item>
              </template>
              <template v-if="item?.visible && item?.component === 'LAYOUT'">
                <a-sub-menu :key="item?.id" :title="item?.name">
                  <template v-for="subitem in item.children">
                    <template v-if="subitem?.visible">
                      <a-menu-item :key="subitem?.id">{{ subitem?.name }}</a-menu-item>
                    </template>
                  </template>
                </a-sub-menu>
              </template>
            </template>
          </a-sub-menu>
        </template>
        <template v-else-if="menu?.visible && menu?.component !== 'LAYOUT'">
          <a-menu-item :key="menu?.id">
            <template #icon>
              <Icon :icon="menu.icon" color="#333" size="22" />
            </template>
            <template #title>{{ menu.name }}</template>
            {{ menu.name }}
          </a-menu-item>
        </template>
      </template>
    </a-menu>
  </aside>
</template>
<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
import { template } from 'lodash-es';

  const menuList = ref([]);

  const props = defineProps({
    menus: { type: Array, default: null },
  });

  watch(
    () => props.menus,
    () => {
      menuList.value = props.menus;
      debugger;
    },
  );

  onMounted(() => {
    menuList.value = props.menus;
  });
</script>
<style scoped>
  .app-menu {
    width: 220px;
    height: calc(100vh - 3.25rem);
    background-color: #eee;
    padding: 0 0 0 0;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .logo {
    width: 100%;
    height: calc(100vh - 3.25rem);
  }
</style>
