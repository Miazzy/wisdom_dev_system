<template>
  <main class="app-content">
    <div class="vben-multiple-tabs" :class="screenClass + '-tabs'">
      <div v-show="!screenFlag" class="tabs-content" :class="screenClass" :style="contentWidth">
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
          <Icon :icon="'octicon:screen-full-24'" size="15" @click="handleScreenTabPage" />
          <Icon :icon="'icons8:refresh'" :spin="loading" size="15" @click="handleRefreshTabPage" />
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
      <div class="iframe-content" :class="contentClass + ' ' + screenClass" :style="contentWidth">
        <Icon
          v-if="screenFlag"
          class="screen-icon"
          :icon="'iconamoon:screen-normal-thin'"
          size="26"
          @click="handleScreenTabPage"
        />
        <div v-if="props.mode === 'multi'" class="content" :style="contentStyle">
          <template v-for="pane in panes">
            <div v-show="pane.status" class="content" :style="contentStyle">
              <iframe
                v-if="pane.show"
                :key="pane.key"
                :src="pane.pageurl"
                :class="`${pane.status ? 'active' : 'disactive'}`"
                :style="iframeWidth"
              ></iframe>
            </div>
          </template>
        </div>
        <div v-else-if="props.mode === 'single'" class="content" :style="contentStyle">
          <iframe
            :src="activePane.pageurl"
            :panekey="activeKey"
            :pageurl="activePane.pageurl"
            :class="`${activePane.status ? 'active' : 'disactive'}`"
            :style="iframeWidth"
          ></iframe>
        </div>
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
    mode: { type: String, default: 'single' },
  });

  const loading = ref(false);
  const userStore = useUserStore();
  const emit = defineEmits(['change']);
  const pageurl = '/#/framepage/workbench';
  const cacheurl = '/#/framepage/cachepage';
  const workbench = {
    title: '工作台',
    key: 'workbench',
    closable: false,
    show: true,
    status: true,
    pageurl: pageurl,
  };
  const cachepage = {
    title: '缓存',
    key: 'cachepage',
    closable: false,
    show: true,
    status: true,
    pageurl: cacheurl,
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
  const screenFlag = ref(false);
  const screenClass = ref('');
  const activePane = ref(cachepage); // Single-Iframe-Mode

  // 处理Tab栏页签变更
  const handleTabChange = async (key, options: any = null) => {
    activeKey.value = key;
    for (let pane of panes.value) {
      pane.status = removeUrlRandom(pane.pageurl) === removeUrlRandom(key);
      if (options && pane.status) {
        pane.id = options.id;
      }
    }
    handleActivePath();
  };

  // 处理当前激活状态Pane函数
  const handleActivePane = (pane) => {
    // Single-Iframe-Mode
    if (pane.status) {
      activePane.value.pageurl = pane.pageurl;
      activePane.value.key = pane.key;
      activePane.value.title = pane.title;
      activePane.value.closable = pane.closable;
      activePane.value.status = pane.status;
    }
  };

  // Tab栏关闭页签操作等
  const handleTabEdit = (targetKey: string | MouseEvent, action: string) => {
    if (action === 'remove') {
      handleRemoveItem(targetKey as string);
    }
  };

  // 处理浏览器窗口Resize函数
  const handleResize = () => {
    setTimeout(() => {
      if (window.screen.availWidth <= 1440 || window.outerWidth <= 1440) {
        tabWidth.value = window.outerWidth - menuTabMargin.value - 25 + 'px';
        contentClass.value = '';
        contentStyle.value = '';
        contentWidth.value = '';
        iframeWidth.value = 'width: 100%; height: 100%;';
        return;
      }
      const swidth = window.screen.availWidth;
      const cwidth = document.body.clientWidth;

      const flag = cwidth === swidth;
      if (!flag) {
        tabWidth.value = cwidth - menuTabMargin.value - 25 + 'px';
        contentClass.value = 'layout-xscroll';
        contentStyle.value = `width: ${cwidth - 220}px;`;
        contentWidth.value = `width: ${cwidth - 220}px;`;
        iframeWidth.value = 'width: 100%; height: 100%;';
      } else {
        tabWidth.value = cwidth - menuTabMargin.value - 25 + 'px';
        contentClass.value = '';
        contentStyle.value = '';
        contentWidth.value = '';
        iframeWidth.value = 'width: 100%; height: 100%;';
      }
    }, 100);
  };

  // 处理删除页签元素函数
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

  // 通过ID删除页签元素
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

  // 处理路径函数
  const handlePath = (value) => {
    const path = value.startsWith('/') ? value : '/' + value;
    let tempKey = path.replace('/da/', '/');
    tempKey = tempKey.startsWith('/framepage') ? tempKey : '/framepage' + tempKey;
    const key = tempKey.includes('/#') ? tempKey : '/#' + tempKey;
    return key;
  };

  // 处理新增Tab页签Page的函数
  const handleNewTabPage = (value, name, menu) => {
    const path = value.startsWith('/') ? value : '/' + value;
    const id = menu && menu?.id && Reflect.has(menu, 'id') ? menu?.id : buildUUID();
    let tempKey = path.replace('/da/', '/');
    tempKey = tempKey.startsWith('/framepage') ? tempKey : '/framepage' + tempKey;
    let key = tempKey.includes('/#') ? tempKey : '/#' + tempKey;
    activePane.value.pageurl = cacheurl; // Single-Iframe-Mode

    if (!handleKeyExist(paneMap, key)) {
      const nkey: string = calcUrlRandom(key);
      const pane = {
        id: id,
        title: name || props.menu.name,
        show: true,
        closable: true,
        status: true,
        pageurl: nkey,
      };
      paneMap.set(nkey, menu || props.menu);
      panes.value.push(pane);
      activeKey.value = nkey;
    }

    for (let pane of panes.value) {
      pane.key = pane.key ? pane.key : new Date().getTime();
      pane.status = removeUrlRandom(pane.pageurl) === removeUrlRandom(key);
      if (pane.status) {
        activeKey.value = pane.pageurl;
      }
    }
    handleActivePath();
  };

  // 处理URL变更的函数
  const handleUrlChange = (key, loading = false) => {
    // Single-Iframe-Mode
    setTimeout(() => {
      activePane.value.pageurl = key;
      MsgManager.getInstance().sendMsg('iframe-url-change', {
        url: key,
        loading,
        panes: panes.value,
      });
    }, 150);
  };

  // 处理刷新当前页面的函数
  const handleRefreshTabPage = () => {
    loading.value = true;
    for (let pane of panes.value) {
      if (activeKey.value == pane.pageurl) {
        pane.show = false;
        pane.key = '';
        nextTick(() => {
          pane.key = new Date().getTime();
          pane.show = true;
          handleUrlChange(calcUrlRandom(activeKey.value), loading.value);
        });
        setTimeout(() => {
          loading.value = false;
        }, 1200);
      }
    }
  };

  // 判断Map中是否存在此Key值的函数
  const handleKeyExist = (paneMap, key) => {
    const keysArray = Array.from(paneMap.keys());
    const result = keysArray.find((tkey) => removeUrlRandom(tkey) === removeUrlRandom(key));
    return result ? true : false;
  };

  // 给url添加random函数
  const calcUrlRandom = (url: string): string => {
    const randomValue = Math.floor(Math.random() * 10000000);
    const paramStr = `_random_=${randomValue}`;
    if (url?.includes('_random_')) {
      return url.replace(/_random_=[^&]*/, paramStr); // 替换_random_的值
    } else {
      return url?.includes('?') ? url + '&' + paramStr : url + '?' + paramStr; // 添加_random_参数
    }
  };

  // 移除URL参数中随机数
  const removeUrlRandom = (url) => {
    return url.replace(/([\?&])_random_=[^&]*&?/, '$1').replace(/&$/, '');
  };

  // 处理Tab栏放大屏幕函数
  const handleScreenTabPage = () => {
    if (screenClass.value == '') {
      screenFlag.value = true;
      screenClass.value = 'iframe-screen';
      MsgManager.getInstance().sendMsg('iframe-screen', { status: 'on' });
    } else {
      screenFlag.value = false;
      screenClass.value = '';
      MsgManager.getInstance().sendMsg('iframe-screen', { status: 'off' });
    }
    if (activeKey.value.includes('/framepage/cockpit/')) {
      nextTick(() => {
        handleRefreshTabPage();
      });
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

  // 处理激活当前路由函数
  const handleActivePath = () => {
    userStore.setCurrentPath(activeKey.value);
    handleUrlChange(activeKey.value);
    emit('change', activeKey.value, paneMap.get(activeKey.value));
  };

  // 处理推送Tab栏消息函数
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

  // 处理菜单折叠函数
  const handleMenuCollapsed = (message) => {
    const { status } = message;
    if (status === 'collapsed') {
      menuTabMargin.value = 115;
    } else if (status === 'expand') {
      menuTabMargin.value = 275;
    }
    handleResize();
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

  onMounted(() => {
    paneMap.set(panes.value[0].pageurl, panes.value[0]);
    activeKey.value = panes.value[0].pageurl;
    tabWidth.value = document.body.clientWidth - menuTabMargin.value + 'px';
    panes.value[0].show = false;
    panes.value[0].pageurl = '';
    setTimeout(() => {
      panes.value[0].show = true;
      panes.value[0].pageurl = pageurl;
      activePane.value.pageurl = pageurl;
    }, 100);
    MsgManager.getInstance().listen('iframe-tabs-message', handleTabMessage);
    MsgManager.getInstance().listen('iframe-tabs-refresh-all', handleRefreshMenuAll);
    MsgManager.getInstance().listen('iframe-screen-emit', handleScreenTabPage);
    MsgManager.getInstance().listen('system-menu-collapse', handleMenuCollapsed);
    handleActivePath();
    handleResize();
    screenFlag.value = false;
    window.addEventListener('resize', handleReload);
  });
</script>
<style lang="less">
  .theme1 {
    .app-content {
      .tabs-content {
        border-bottom: 1px solid transparent;

        .ant-tabs {
          background-color: transparent;
        }

        .tabs-buttons {
          span {
            border-left: 1px solid rgb(255 255 255 / 16%);
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
<style>
  .ant-tabs-nav-list div.ant-tabs-tab:last-child {
    padding-right: 6px;
    border-radius: 0;
  }
</style>
<style lang="less" scoped>
  .theme1 {
    .tabs-content {
      border-bottom: 1px solid rgb(222 222 222 / 3%);
    }
  }

  .theme3 {
    .tabs-content {
      border-bottom: 0.01rem solid #f9f9f9;
    }
  }

  .ant-tabs-top {
    :deep(.ant-tabs-nav) {
      &::before {
        border-bottom: 0 solid transparent;
      }
    }
  }

  .app-content {
    flex: 1;

    /* padding: 0.1rem 0 0.2rem 0.2rem; */

    .ant-tabs {
      &.ant-tabs-card {
        .ant-tabs-nav {
          :deep(.ant-tabs-tab) {
            &:last-child {
              padding-right: 5px;
            }
          }
        }
      }
    }

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

      &.iframe-screen-tabs {
        background: transparent;
      }
    }

    .tabs-content {
      display: flex;
      flex-direction: row;
      align-items: left;
      justify-content: left;

      .tabs-buttons {
        width: 90px;

        span {
          display: inline-flex;
          padding: 5px;
          cursor: pointer;
        }
      }
    }

    .iframe-content {
      position: relative;
      width: 100%;
      height: calc(100vh - 85px);

      .screen-icon {
        position: absolute;
        top: 0.5rem;
        right: 1rem;
        color: transparent;

        &:hover {
          background: #fefefe;
          color: #333;
        }
      }

      .content {
        width: 100%;
        height: 100%;

        iframe {
          width: 100%;
          height: 100%;
        }
      }

      &.iframe-screen {
        height: calc(100vh);
      }
    }

    .layout-xscroll {
      overflow-x: scroll !important;
      overflow-y: hidden;
    }
  }

  .theme1 {
    .app-content {
      .iframe-content {
        .screen-icon {
          color: transparent;

          &:hover {
            background: #000;
            color: #fff;
          }
        }
      }
    }
  }
</style>
<style lang="less">
  @import url('../default/tabs/index.less');
</style>
