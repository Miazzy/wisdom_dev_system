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
    </div>
    <div
      class="iframe-content"
      :class="contentClass + ' ' + screenClass + iframeClass"
      :style="contentWidth"
    >
      <Icon
        v-if="screenFlag"
        class="screen-icon"
        :icon="'iconamoon:screen-normal-thin'"
        size="26"
        @click="handleScreenTabPage"
      />
      <div class="content" :style="contentStyle">
        <Frame
          :isLoadOver="loadOverFlag"
          :isFirstPage="firstPageFlag"
          :status="activePane.status"
          :style="iframeWidth"
          :url="activeKey"
        />
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
  import Frame from '/@/components/Frame/Frame.vue';
  import { ElLoading } from 'element-plus';
  // import Workbench from '/@/views/workbench/Workbench.vue';

  const props = defineProps({
    path: { type: String, default: null },
    menu: { type: Object, default: null },
    mode: { type: String, default: 'single' },
  });

  const loading = ref(false);
  const userStore = useUserStore();
  const emit = defineEmits(['change']);
  const pageurl = '/#/frame/workbench';
  const cacheurl = '/#/frame/cachepage';
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
  const timestamp = new Date().getTime();
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
  const iframeClass = ref('');
  const loadOverFlag = ref(false);
  const firstPageFlag = ref(false);
  const loadingInstance = ref();

  // 处理Tab栏页签变更
  const handleTabChange = async (key, options: any = null) => {
    console.info('handleTabChange  :', new Date().getTime());
    activeKey.value = key;
    if (options) {
      for (let pane of panes.value) {
        pane.status = removeUrlRandom(pane.pageurl) === removeUrlRandom(key);
        if (options && pane.status) {
          pane.id = options.id;
          activeKey.value = pane.pageurl;
        }
      }
    }
  };

  // Tab栏关闭页签操作等
  const handleTabEdit = (targetKey: string | MouseEvent, action: string) => {
    if (action === 'remove') {
      handleRemoveItem(targetKey as string);
    }
  };

  // 计算iframe的Style样式
  const handleIframeStyle = () => {
    iframeWidth.value =
      loadOverFlag.value && firstPageFlag.value
        ? 'width: 100%; height: 100%;'
        : 'width: 100%; height: 100%; opacity: 0;';
  };

  // 处理浏览器窗口Resize函数
  const handleResize = () => {
    setTimeout(() => {
      if (window.screen.availWidth <= 1440 || window.outerWidth <= 1440) {
        tabWidth.value = window.outerWidth - menuTabMargin.value - 25 + 'px';
        contentClass.value = '';
        contentStyle.value = '';
        contentWidth.value = '';
        handleIframeStyle();
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
        handleIframeStyle();
      } else {
        tabWidth.value = cwidth - menuTabMargin.value - 25 + 'px';
        contentClass.value = '';
        contentStyle.value = '';
        contentWidth.value = '';
        handleIframeStyle();
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
    tempKey = tempKey.startsWith('/frame') ? tempKey : '/frame' + tempKey;
    const key = tempKey.includes('/#') ? tempKey : '/#' + tempKey;
    return key;
  };

  // 处理Tabs栏偏移量
  function handleDivTransformOffset(element, offsetX) {
    setTimeout(() => {
      // 获取原有的transform属性值
      const transformStyle = element.style.transform;
      // 使用正则表达式匹配translate的值
      const match = transformStyle.match(/translate\((-?\d+\.?\d*px),\s*(-?\d+\.?\d*px)\)/);
      if (match) {
        // 提取出原有的偏移量
        const currentX = parseFloat(match[1]);
        const currentY = parseFloat(match[2]);
        if (currentX) {
          // 计算新的偏移量
          const newX = currentX + offsetX;
          // 更新transform属性值
          element.style.transform = `translate(${newX}px, ${currentY}px)`;
        }
      }
    }, 150);
  }

  // 处理新增Tab页签Page的函数
  const handleNewTabPage = (value, name, menu) => {
    if (!firstPageFlag.value) {
      firstPageFlag.value = true;
      handleIframeStyle();
    }
    // 首页加载完毕后，才能触发跳转页面等操作
    if (loadOverFlag.value) {
      const path = value.startsWith('/') ? value : '/' + value;
      const id = menu && menu?.id && Reflect.has(menu, 'id') ? menu?.id : buildUUID();
      const element = document.querySelector('.ant-tabs-nav-list');
      let tempKey = path.replace('/da/', '/');
      tempKey = tempKey.startsWith('/frame') ? tempKey : '/frame' + tempKey;
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
      handleDivTransformOffset(element, -10);
    }
  };

  // 处理URL变更的函数
  const handleUrlChange = (key, loading = false) => {
    nextTick(() => {
      activePane.value.pageurl = key;
      MsgManager.getInstance().sendMsg('iframe-url-change', {
        url: key,
        loading,
      });
    });
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
    const result = keysArray.find((tkey) => {
      const resultA = removeUrlRandom(tkey);
      const resultB = removeUrlRandom(key);
      return resultA == resultB;
    });
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
    return url
      .replace(/([\?&])_random_=[^&]*&?/, '$1')
      .replace(/&$/, '')
      .replace(/\?$/, '');
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
    if (activeKey.value.includes('/frame/cockpit/')) {
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

  // 删除注释节点函数
  const handleDeleteCommentNode = () => {
    setTimeout(() => {
      const pnode = document.querySelector('.ant-tabs-nav-list');
      const inkBar = document.querySelector('.ant-tabs-nav-list .ant-tabs-ink-bar');
      if (pnode && inkBar) {
        const dom = pnode.childNodes[pnode.childNodes.length - 2];
        pnode.removeChild(dom);
        inkBar.parentNode.removeChild(inkBar);
      }
    }, 300);
  };

  // 处理推送Tab栏消息函数
  const handleTabMessage = (event) => {
    console.info('handleTabMessage:', new Date().getTime());
    const message = Reflect.has(event, 'type') && Reflect.has(event, 'data') ? event : event.data;
    const { data } = message;
    handlePanesEmpty();
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
        console.info('handleTabChange  :', new Date().getTime());
        handleTabChange(data.path, { id: data.id });
      } else {
        console.info('handleNewTabPage:', new Date().getTime());
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
    if (activeKey.value.includes('/frame/cockpit/')) {
      nextTick(() => {
        setTimeout(()=>{
          handleRefreshTabPage();
        }, 500)
      });
    }
  };

  // 判断当前页面是否在 iframe 中显示
  const checkInIframe = () => {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  };

  // 设置Mask的ZIndex样式函数
  const handleMaskZindex = (message) => {
    if (checkInIframe()) {
      return;
    }
    const { type } = message;
    if (type == 'open') {
      iframeClass.value = 'mask-zindex';
    } else if (type == 'remove') {
      iframeClass.value = '';
    }
  };

  const handlePanesEmpty = () => {
    if (!panes.value || panes.value.length === 0) {
      panes.value = [workbench];
      paneMap.set(panes.value[0].pageurl, panes.value[0]);
      activeKey.value = panes.value[0].pageurl;
    }
  };

  watch(
    () => props.path,
    () => {
      handlePanesEmpty();
      const path = handlePath(props.path);
      if (props.path == '') {
        return;
      }
      if (handleKeyExist(paneMap, path)) {
        handleTabChange(path, props.menu);
      } else {
        handleNewTabPage(props.path, props.menu.name, props.menu);
      }
    },
  );

  defineExpose({
    handleTabChange,
  });

  onMounted(() => {
    try {
      loadingInstance.value = ElLoading.service({ fullscreen: false, background: '#90909010', text: '正在加载框架...' });
      paneMap.set(panes.value[0].pageurl, panes.value[0]);
      iframeWidth.value = `width: 100%; height: 100%; opacity: 0;`;
      activeKey.value = panes.value[0].pageurl; //  + '?_tail=' + timestamp;
      tabWidth.value = document.body.clientWidth - menuTabMargin.value + 'px';
      panes.value[0].show = false;
      panes.value[0].pageurl = '';
      setTimeout(() => {
        panes.value[0].show = true;
        panes.value[0].pageurl = pageurl;
        activePane.value.pageurl = pageurl;
      }, 100);
    } catch {
      //
    }
    MsgManager.getInstance().listen('iframe-tabs-message', handleTabMessage);
    MsgManager.getInstance().listen('iframe-tabs-refresh-all', handleRefreshMenuAll);
    MsgManager.getInstance().listen('iframe-screen-emit', handleScreenTabPage);
    MsgManager.getInstance().listen('system-menu-collapse', handleMenuCollapsed);
    handleActivePath();
    handleResize();
    handleDeleteCommentNode();
    screenFlag.value = false;
    window.addEventListener('resize', handleReload);
    // 监听是否打开Dialog
    MsgManager.getInstance().listen('modal-open', (message) => {
      handleMaskZindex(message);
    });
    // 监听是否打开Drawer
    MsgManager.getInstance().listen('drawer-open', (message) => {
      handleMaskZindex(message);
    });
    // 监听loadover函数
    MsgManager.getInstance().listen('workbench-loadover', (message) => {
      loadOverFlag.value = message;
      handleIframeStyle();
      handlePanesEmpty();
      setTimeout(() => {
        loadingInstance.value.close();
      }, 300);
    });
    setTimeout(() => {
      handlePanesEmpty();
    }, 1000);
  });
</script>
<style lang="less">
  .theme1 {
    .app-content {
      .tabs-content {
        border-bottom: 1px solid transparent;

        .ant-tabs-tab {
          margin-right: 3px;

          &:last-of-type {
            margin-right: 15px !important;
          }
        }

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

        .ant-tabs-tab {
          margin-right: 3px;

          &:last-of-type {
            margin-right: 15px !important;
          }
        }

        .tabs-buttons {
          span {
            border-left: 1px solid #f0f0f0;
          }
        }
      }
    }
  }

  .anticon-close {
    height: 30px;
    line-height: 30px;
    width: 1.05rem;
    padding: 0 1rem 0 0;
  }
</style>
<style>
  .ant-tabs-nav-list div.ant-tabs-tab:last-of-type {
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

  :deep(.iframe-component) {
    position: absolute;
    z-index: 1000;
    width: 100%;
    height: calc(100vh - 85px);
    overflow-y: scroll;
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

    :deep(.vben-multiple-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
      color: #f0f0f0;
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
      height: calc(100vh - 82px);

      &.mask-zindex {
        z-index: 10000 !important;
      }

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
        margin: 0 !important;

        &.mask-zindex {
          z-index: 10000 !important;
        }

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
