<template>
  <aside class="app-menu" ref="containerRef" :class="systemTheme + ' ' + systemCollClass">
    <a-menu
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      class="menu-content"
      :mode="systemMode"
      :theme="systemTheme"
      :inline-collapsed="systemCollapsed"
      @click="handleMenuClick"
    >
      <template v-for="menu in menuList" :key="menu.id">
        <template v-if="menu?.visible && menu?.component === 'LAYOUT'">
          <a-sub-menu :key="menu?.id">
            <template #icon>
              <Icon :icon="menu.icon" :color="iconColor" size="22" />
            </template>
            <template #title>{{ menu.name }}</template>
            <template v-for="item in menu.children">
              <template v-if="item?.visible && item?.component !== 'LAYOUT'">
                <a-menu-item :key="handleMenuItemId(item)">{{ item?.name }}</a-menu-item>
              </template>
              <template v-if="item?.visible && item?.component === 'LAYOUT'">
                <a-sub-menu :key="item?.id" :title="item?.name">
                  <template v-for="subitem in item.children">
                    <template v-if="subitem?.visible && subitem?.component !== 'LAYOUT'">
                      <a-menu-item :key="handleMenuItemId(subitem)">{{ subitem?.name }}</a-menu-item>
                    </template>
                    <template v-if="subitem?.visible && subitem?.component === 'LAYOUT'">
                      <a-sub-menu :key="subitem?.id" :title="subitem?.name">
                        <template v-for="secsubitem in subitem.children">
                          <template v-if="secsubitem?.visible">
                            <a-menu-item :key="handleMenuItemId(secsubitem)">{{ secsubitem?.name }}</a-menu-item>
                          </template>
                        </template>
                      </a-sub-menu>
                    </template>
                  </template>
                </a-sub-menu>
              </template>
            </template>
          </a-sub-menu>
        </template>
        <template v-else-if="menu?.visible && menu?.component !== 'LAYOUT'">
          <a-menu-item :key="handleMenuItemId(menu)">
            <template #icon>
              <Icon :icon="menu.icon" :color="iconColor" size="22" />
            </template>
            {{ menu.name }}
          </a-menu-item>
        </template>
      </template>
    </a-menu>

    <a-affix class="app-menu-collClass-icon" @click="handleCollapsed">
      <Icon :icon="`${systemCollapsed ? 'gg:move-right' : 'gg:move-left'}`" />
    </a-affix>
  </aside>
</template>
<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';

  const menuList = ref<any[]>([]);
  const systemTheme = ref('');
  const systemMode = ref('');
  const openKeys = ref<string[]>(['']);
  const selectedKeys = ref<string[]>(['']);
  const iconColor = ref('#333');
  const systemCollapsed = ref(false);
  const systemCollClass = ref('');
  const containerRef = ref();
  const menuMap = new Map();

  const props = defineProps({
    mode: { type: String, default: 'inline' },
    theme: { type: String, default: 'light' },
    menus: { type: Array, default: null },
  });

  const emit = defineEmits(['click']);

  watch(
    () => props.menus,
    () => {
      menuList.value = props.menus;
    },
  );

  watch(
    () => props.theme,
    (theme) => {
      systemTheme.value = props.theme;
      iconColor.value = theme == 'dark' ? '#ccc' : '#333';
    },
  );

  watch(
    () => props.mode,
    () => {
      systemMode.value = props.mode;
    },
  );

  const handleCollapsed = () => {
    systemCollapsed.value = !systemCollapsed.value;
    systemCollClass.value = systemCollapsed.value ? 'collapsed' : '';
  };

  const handleMenuItemId = (element) => {
    menuMap.set(element?.id, element);
    return element?.id;
  };

  const handleMenuClick = (event) => {
    const { key } = event;
    const menu = menuMap.get(key);
    emit('click', key, menu, event);
  };

  onMounted(() => {
    menuList.value = props.menus;
    systemTheme.value = props.theme;
    systemMode.value = props.mode;
  });
</script>
<style scoped>
  .app-menu {
    width: 220px;
    min-width: 220px;
    height: calc(100vh - 3.25rem);
    background-color: #fff;
    padding: 0 0 0 0;
    overflow-y: scroll;
    overflow-x: hidden;

    .menu-content {
      width: 220px;
      height: 100%;
    }

    .app-menu-collClass-icon {
      position: fixed;
      bottom: 50vh;
      left: 205px;
      height: 1rem;
      line-height: 1rem;
      background: #f0f0f0;
      border-radius: 20px;
    }

    &.dark {
      background-color: #000;
    }

    &.collapsed {
      width: 60px;
      .menu-content {
        width: 55px;
        height: 100%;
      }
      .app-menu-collClass-icon {
        position: fixed;
        bottom: 50vh;
        left: 50px;
        height: 1rem;
        line-height: 1rem;
        background: #f0f0f0;
        border-radius: 20px;
      }
    }
  }
  .logo {
    width: 100%;
    height: calc(100vh - 3.25rem);
  }
</style>
