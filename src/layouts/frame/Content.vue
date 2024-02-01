<template>
  <main class="app-content">
    <div class="vben-multiple-tabs">
      <div class="tabs-content" :style="contentWidth">
        <a-dropdown :trigger="['contextmenu']">
          <a-tabs
            v-model:activeKey="activeKey"
            :style="`width: ${tabWidth};`"
            class="vben-tabs-panes"
            type="editable-card"
            hideAdd
            @change="handleTabChange"
            @edit="handleTabEdit"
          >
            <a-tab-pane
              v-for="pane in panes"
              :key="pane.pageurl"
              :tab="pane.title"
              :closable="pane.closable"
            >
              {{ pane.content }}
            </a-tab-pane>
          </a-tabs>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a @click="handleRefreshTabPage">重新加载</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleCloseTabPage('now')">关闭当前</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleCloseTabPage('left')">关闭左侧</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleCloseTabPage('right')">关闭右侧</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleCloseTabPage('other')">关闭其他</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleCloseTabPage('all')">关闭全部</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <div class="tabs-buttons">
          <Icon :icon="'icons8:refresh'" size="15" @click="handleRefreshTabPage" />
          <a-dropdown :trigger="trigger">
            <Icon :icon="'codicon:fold-down'" size="13" />
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a @click="handleCloseTabPage('now')">关闭当前</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="handleCloseTabPage('left')">关闭左侧</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="handleCloseTabPage('right')">关闭右侧</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="handleCloseTabPage('other')">关闭其他</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="handleCloseTabPage('all')">关闭全部</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
      <div class="iframe-content" :class="contentClass" :style="contentWidth">
        <template v-for="pane in panes">
          <div v-show="pane.status" class="content" :style="contentStyle">
            <iframe v-if="pane.show" :key="pane.key" :src="pane.pageurl" :class="`${pane.status ? 'active' : 'disactive'}`" :style="iframeWidth"></iframe>
          </div>
        </template>
      </div>
    </div>
  </main>
</template>
<script lang="ts" setup>
  import { onMounted, ref, watch, nextTick, getCurrentInstance } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { MsgManager } from '/@/message/MsgManager';
  import { useUserStore } from '/@/store/modules/user';
  import { buildUUID } from '/@/utils/uuid';

  const props = defineProps({
    path: { type: String, default: null },
    menu: { type: Object, default: null },
  });

  const userStore = useUserStore();
  const emit = defineEmits(['change']);
  const pageurl = '/#/framepage/workbench';
  const workbench = {
    title: '工作台',
    key: 'workbench',
    closable: false,
    show: true,
    status: true,
    pageurl: pageurl,
  };
  const panes = ref<any[]>([workbench]);
  const paneMap = new Map();
  const activeKey = ref(panes.value[0].key);
  const tabWidth = ref('');
  const trigger = ref(['click']);
  const contentClass = ref('');
  const contentStyle = ref('');
  const contentWidth = ref('');
  const iframeWidth = ref('width: 100%; height: 100%');
  const instance = getCurrentInstance();
  const menuTabMargin = ref(275);

  const handleTabChange = (key, options: any = null) => {
    activeKey.value = key;
    for (let pane of panes.value) {
      pane.status = pane.pageurl === key;
      if (options && pane.pageurl === key) {
        pane.id = options.id;
      }
    }
    handleActivePath();
  };

  const handleTabEdit = (targetKey: string | MouseEvent, action: string) => {
    if (action === 'remove') {
      handleRemoveItem(targetKey as string);
    }
  };

  // 处理浏览器窗口Resize函数
  const handleResize = () => {
    setTimeout(() => {
      if (window.screen.availWidth <= 1440 || window.outerWidth <= 1440) {
        tabWidth.value = window.outerWidth - menuTabMargin.value + 'px';
        contentClass.value = '';
        contentStyle.value = '';
        contentWidth.value = '';
        iframeWidth.value = 'width: 100%; height: 100%;';
        return;
      }
      const owidth = window.outerWidth;
      const swidth = window.screen.availWidth;
      const flag = owidth === swidth;
      if (!flag) {
        tabWidth.value = window.outerWidth - menuTabMargin.value + 'px';
        contentClass.value = 'layout-xscroll';
        contentStyle.value = `width: ${swidth - 190}px;`;
        contentWidth.value = `width: ${owidth - 190}px;`;
        iframeWidth.value = 'width: calc(100% - 30px); height: 100%;';
      } else {
        tabWidth.value = window.outerWidth - menuTabMargin.value + 'px';
        contentClass.value = '';
        contentStyle.value = '';
        contentWidth.value = '';
        iframeWidth.value = 'width: 100%; height: 100%;';
      }
    }, 100);
  };

  const handleRemoveItem = (targetKey: string) => {
    let lastIndex = 0;
    panes.value.forEach((pane, i) => {
      if (pane.pageurl === targetKey) {
        lastIndex = i - 1;
      }
    });
    panes.value = panes.value.filter((pane) => {
      return pane.pageurl !== targetKey;
    });
    paneMap.delete(targetKey);
    if (panes.value.length && activeKey.value === targetKey) {
      if (lastIndex >= 0) {
        activeKey.value = panes.value[lastIndex].pageurl;
      } else {
        activeKey.value = panes.value[0].pageurl;
      }
    }
    panes.value.map((pane) => (pane.status = pane.pageurl === activeKey.value));
    handleActivePath();
  };

  const handleRemoveItemById = (id: string) => {
    let lastIndex = 0;
    let targetKey = '';
    panes.value.forEach((pane, i) => {
      if (pane.id === id) {
        lastIndex = i - 1;
        targetKey = pane.paneurl;
      }
    });
    panes.value = panes.value.filter((pane) => {
      return pane.id !== id;
    });
    paneMap.delete(targetKey);
    if (panes.value.length && activeKey.value === targetKey) {
      if (lastIndex >= 0) {
        activeKey.value = panes.value[lastIndex].pageurl;
      } else {
        activeKey.value = panes.value[0].pageurl;
      }
    }
    panes.value.map((pane) => (pane.status = pane.pageurl === activeKey.value));
    handleActivePath();
  };

  watch(
    () => props.path,
    () => {
      const path = handlePath(props.path);
      if (props.path == '') {
        return;
      }
      if (paneMap.has(path)) {
        handleTabChange(path, props.menu);
      } else {
        handleNewTabPage(props.path, props.menu.name, props.menu);
      }
    },
  );

  const handlePath = (value) => {
    const path = value.startsWith('/') ? value : '/' + value;
    let tempKey = path.replace('/da/', '/');
    tempKey = tempKey.startsWith('/framepage') ? tempKey : '/framepage' + tempKey;
    const key = tempKey.includes('/#') ? tempKey : '/#' + tempKey;
    return key;
  };

  const handleNewTabPage = (value, name, menu) => {
    const path = value.startsWith('/') ? value : '/' + value;
    const id = menu && menu?.id && Reflect.has(menu, 'id') ? menu?.id : buildUUID();
    let tempKey = path.replace('/da/', '/');
    tempKey = tempKey.startsWith('/framepage') ? tempKey : '/framepage' + tempKey;
    const key = tempKey.includes('/#') ? tempKey : '/#' + tempKey;
    activeKey.value = key;
    if (!paneMap.has(key)) {
      paneMap.set(key, menu || props.menu);
      panes.value.push({
        id: id,
        title: name || props.menu.name,
        show: true,
        closable: true,
        status: true,
        pageurl: key,
      });
    }
    for (let pane of panes.value) {
      pane.key = pane.key ? pane.key : new Date().getTime();
      pane.status = pane.pageurl === key;
    }
    handleActivePath();
  };

  // 处理刷新当前页面的函数
  const handleRefreshTabPage = () => {
    for (let pane of panes.value) {
      if (activeKey.value == pane.pageurl) {
        pane.show = false;
        pane.key = '';
        nextTick(() => {
          pane.key = new Date().getTime();
          pane.show = true;
        });
      }
    }
  };

  // 处理刷新当前页面的函数
  const handleRefreshTabById = (id) => {
    for (let pane of panes.value) {
      if (pane.id === id) {
        pane.show = false;
        pane.key = '';
        nextTick(() => {
          pane.key = new Date().getTime();
          pane.show = true;
        });
      }
    }
  };

  // 关闭当前页签页面
  const handleCloseTabPage = (action) => {
    const element = JSON.parse(JSON.stringify(workbench));
    element.status = false;
    const currentIndex = panes.value.findIndex((pane) => pane.pageurl === activeKey.value);
    switch (action) {
      case 'now':
        if (activeKey.value !== workbench.pageurl) {
          handleRemoveItem(activeKey.value);
        }
        break;
      case 'left':
        panes.value = panes.value.filter((item, index) => {
          return index == 0 || index >= currentIndex;
        });
        break;
      case 'right':
        panes.value = panes.value.slice(0, currentIndex + 1);
        break;
      case 'other':
        panes.value = panes.value.filter((item, index) => {
          return index == 0 || index == currentIndex;
        });
        break;
      case 'all':
        activeKey.value = pageurl;
        panes.value = panes.value.filter((item, index) => {
          return index == 0;
        });
        break;
      default:
        break;
    }
    // 重新构建 paneMap
    paneMap.clear();
    panes.value.forEach((pane) => {
      pane.status = pane.pageurl === activeKey.value;
      paneMap.set(pane.pageurl, pane);
    });
    handleActivePath();
  };

  const handleActivePath = () => {
    userStore.setCurrentPath(activeKey.value);
    emit('change', activeKey.value, paneMap.get(activeKey.value));
  };

  const handleTabMessage = (event) => {
    const message = Reflect.has(event, 'type') && Reflect.has(event, 'data') ? event : event.data;
    const { data } = message;
    // 处理接收到的消息
    if (message.type === 'addTabPage') {
      handleNewTabPage(data.path, data.name, { id: data.id });
    } else if (message.type === 'addTabAndClose') {
      // 关闭原页面
      if (typeof data.closeID == 'undefined' || data.closeID == null || data.closeID == '') {
        handleRemoveItem(activeKey.value); // 默认关闭当前页面
      } else {
        if (paneMap.has(data.closeID)) {
          handleRemoveItem(data.closeID);
        } else {
          handleRemoveItemById(data.closeID);
        }
      }
      // 打开新页面 如果页面已打开过，则切换到相应页签；否则新打开一个页签
      if (paneMap.has(data.path)) {
        handleTabChange(data.path, { id: data.id });
      } else {
        handleNewTabPage(data.path, data.name, { id: data.id });
      }
      // 检查是否需要刷新页面
      if (data.refresh) {
        handleRefreshTabPage();
      }
    } else if (message.type === 'closeTabPage') {
      handleRemoveItem(data.path);
    } else if (message.type === 'closeCurrentTab') {
      handleRemoveItem(activeKey.value);
    } else if (message.type === 'closeTabById') {
      handleRemoveItemById(data.id);
    } else if (message.type === 'refreshTabPage') {
      handleRefreshTabPage();
    } else if (message.type === 'reloadTabById') {
      handleRefreshTabById(data.id);
    }
  };

  // 处理Reload函数
  const handleReload = () => {
    if (instance?.proxy) {
      nextTick(() => {
        instance?.proxy.$forceUpdate();
        handleResize();
      });
    } else {
      nextTick(() => {
        window.location.reload();
      });
    }
  };

  // 刷新Tab栏菜单
  const handleRefreshMenuAll = async () => {
    console.info('start loading refresh');
    setTimeout(() => {
      handleCloseTabPage('all');
    }, 100);
  };

  onMounted(() => {
    paneMap.set(panes.value[0].pageurl, panes.value[0]);
    activeKey.value = panes.value[0].pageurl;
    tabWidth.value = document.body.clientWidth - menuTabMargin.value + 'px';
    panes.value[0].show = false;
    panes.value[0].pageurl = '';
    setTimeout(() => {
      panes.value[0].show = true;
      panes.value[0].pageurl = pageurl;
    }, 100);
    MsgManager.getInstance().listen('iframe-tabs-message', handleTabMessage);
    MsgManager.getInstance().listen('iframe-tabs-refresh-all', handleRefreshMenuAll);
    handleActivePath();
    handleResize();
    window.addEventListener('resize', handleReload);
  });
</script>
<style lang="less">
  .theme1 {
    .app-content {
      .tabs-content {
        .ant-tabs {
          background-color: transparent;
        }
        border-bottom: 1px solid transparent;
        .tabs-buttons {
          span {
            border-left: 1px solid rgba(255, 255, 255, 0.16);
          }
        }
      }
    }
  }

  .theme3 {
    .app-content {
      .tabs-content {
        border-bottom: 1px solid #f0f0f0;
        .tabs-buttons {
          span {
            border-left: 1px solid #f0f0f0;
          }
        }
      }
    }
  }
</style>
<style lang="less" scoped>
  .app-content {
    flex: 1;
    /* padding: 0.1rem 0 0.2rem 0.2rem; */

    :deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
      color: #fefefe;
    }

    :deep(.ant-tabs-tab:first-child .ant-tabs-tab-btn) {
      margin: 0 0.3rem 0 0.1rem;
    }

    :deep(.ant-tabs-tab .ant-tabs-tab-btn) {
      margin: 0 0.05rem 0 0.3rem;
    }

    .vben-multiple-tabs {
      position: relative;
    }

    .tabs-content {
      display: flex;
      flex-direction: row;
      align-items: left;
      justify-content: left;

      .tabs-buttons {
        width: 60px;

        span {
          display: inline-flex;
          padding: 5px;
          cursor: pointer;
        }
      }
    }

    .iframe-content {
      width: 100%;
      height: calc(100vh - 85px);

      .content {
        width: 100%;
        height: 100%;

        iframe {
          width: 100%;
          height: 100%;
        }
      }
    }
    .layout-xscroll {
      overflow-x: scroll !important;
      overflow-y: hidden;
    }
  }
</style>
<style lang="less">
  @import url('../default/tabs/index.less');
</style>
