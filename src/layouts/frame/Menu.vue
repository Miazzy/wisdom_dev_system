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
              <Icon :icon="menu.icon" size="16" />
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
                      <a-menu-item :key="handleMenuItemId(subitem)">{{
                        subitem?.name
                      }}</a-menu-item>
                    </template>
                    <template v-if="subitem?.visible && subitem?.component === 'LAYOUT'">
                      <a-sub-menu :key="subitem?.id" :title="subitem?.name">
                        <template v-for="secsubitem in subitem.children">
                          <template v-if="secsubitem?.visible">
                            <a-menu-item :key="handleMenuItemId(secsubitem)">{{
                              secsubitem?.name
                            }}</a-menu-item>
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
              <Icon :icon="menu.icon" size="16" />
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
  import { getAuthCache } from '/@/utils/auth';
  import { TOKEN_KEY } from '/@/enums/cacheEnum';
  import { useUserStore } from '/@/store/modules/user';
  import { MsgManager } from '/@/message/MsgManager';
  import { Config, ScreenList } from '/@/constant/constant';

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
  const userStore = useUserStore();
  const loadOverFlag = ref(false);

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
    systemCollClass.value = systemCollapsed.value ? 'collapsed' : 'expand';
    if (systemCollapsed.value) {
      MsgManager.getInstance().sendMsg('system-menu-collapse', { status: 'collapsed' });
    } else {
      MsgManager.getInstance().sendMsg('system-menu-collapse', { status: 'expand' });
    }
    if (systemCollClass.value == 'expand') {
      setTimeout(() => {
        systemCollClass.value = '';
      }, 300);
    }
  };

  const handleMenuItemId = (element) => {
    menuMap.set(element?.id, element);
    return element?.id;
  };

  const handlePath = (value) => {
    const path = value.startsWith('/') ? value : '/' + value;
    let tempKey = path.replace('/da/', '/');
    tempKey = tempKey.startsWith('/frame') ? tempKey : '/frame' + tempKey;
    const key = tempKey.includes('/#') ? tempKey : '/#' + tempKey;
    return key;
  };

  const handleClickEmit = (event) => {
    const { key } = event;
    const menu = menuMap.get(key);
    const screenRouteMap = new Map(ScreenList);
    if (menu.openWindowModel === 'newWindow') {
      const path = handlePath(menu.url);
      if (screenRouteMap.has(path)) {
        window.open(`${window.origin}${screenRouteMap.get(path)}`, '_blank');
      } else {
        window.open(`${window.origin}${path}`, '_blank');
      }
    } else {
      emit('click', key, menu, event);
    }
  };

  const handleMenuClick = (event) => {
    const token = getAuthCache<string>(TOKEN_KEY);
    if (typeof token == 'undefined' || token == null || token == '') {
      return userStore.logout();
    }
    if (loadOverFlag.value) {
      handleClickEmit(event);
    } else {
      handleClickEmit(event);
    }
  };

  onMounted(() => {
    menuList.value = props.menus;
    systemTheme.value = props.theme;
    systemMode.value = props.mode;

    MsgManager.getInstance().listen('workbench-loadover', (message) => {
      loadOverFlag.value = message;
    });
  });
</script>
<style lang="less">
  .app-menu {
    .ant-menu-light .ant-menu-item:hover,
    .ant-menu-light .ant-menu-item-active,
    .ant-menu-light .ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
    .ant-menu-light .ant-menu-submenu-active,
    .ant-menu-light .ant-menu-submenu-title:hover {
      color: #1890ff;
    }
  }

  .theme1 {
    .app-menu {
      background-color: rgb(10 36 74 / 70%);

      .ant-menu {
        background-color: transparent;
        color: #a7adb4;
      }

      .ant-menu-sub.ant-menu-inline {
        background-color: rgb(5 22 41 / 70%);
      }

      .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
        background-color: #1890ff;
      }

      .ant-menu-item:active,
      .ant-menu-submenu-title:active {
        background-color: #1890ff;
      }

      .ant-menu-item-selected,
      .ant-menu-submenu-selected {
        color: #fefefe;
      }

      .ant-menu-light .ant-menu-item-selected.ant-menu-item:hover {
        color: #fefefe;
      }

      .ant-menu-light .ant-menu-item-selected.ant-menu-item-active {
        color: #fefefe;
      }

      .ant-menu-submenu-expand-icon,
      .ant-menu-submenu-arrow {
        color: #a7adb4;
      }
    }
  }

  .theme3 {
    .app-menu {
      background-color: #001529;

      .ant-menu {
        background-color: #001529;
        color: #a7adb4;
      }

      .ant-menu-sub.ant-menu-inline {
        background-color: #000c17;
      }

      .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
        background-color: #1890ff;
      }

      .ant-menu-item:active,
      .ant-menu-submenu-title:active {
        background-color: #1890ff;
      }

      .ant-menu-item-selected,
      .ant-menu-submenu-selected {
        color: #fefefe;
      }

      .ant-menu-light .ant-menu-item-selected.ant-menu-item:hover {
        color: #fefefe;
      }

      .ant-menu-light .ant-menu-item-selected.ant-menu-item-active {
        color: #fefefe;
      }

      .ant-menu-submenu-expand-icon,
      .ant-menu-submenu-arrow {
        color: #a7adb4;
      }
    }
  }
</style>
<style lang="less" scoped>
  .app-menu {
    width: 220px;
    min-width: 220px;
    height: calc(100vh - 3.25rem);
    padding: 0;
    overflow-x: hidden;
    overflow-y: scroll;

    &.expand {
      transition: all 0.3s;
      border-right: none;
    }

    .menu-content {
      width: 220px;
      height: 100%;
    }

    .app-menu-collClass-icon {
      position: fixed;
      bottom: 50vh;
      left: 205px;
      height: 1rem;
      border-radius: 20px;
      background: #f0f0f0;
      line-height: 1rem;
    }

    &.dark {
      background-color: #000;
    }

    &.collapsed {
      width: 60px;
      min-width: 60px;
      transition: all 0.1s;
      border-right: none;
      border-left: none;

      .menu-content {
        width: 55px;
        height: 100%;
      }

      .app-menu-collClass-icon {
        position: fixed;
        bottom: 50vh;
        left: 50px;
        height: 1rem;
        transition: all 0.1s;
        border-radius: 20px;
        background: #f0f0f0;
        line-height: 1rem;
      }
    }
  }

  .logo {
    width: 100%;
    height: calc(100vh - 3.25rem);
  }
</style>
