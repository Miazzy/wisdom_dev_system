<template>
  <main class="app-content">
    <div class="vben-multiple-tabs">
      <div class="tabs-content">
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
        <div class="tabs-buttons">
          <Icon :icon="'icons8:refresh'" color="#333" size="15" @click="handleRefreshTabPage" />
          <a-dropdown :trigger="trigger">
            <Icon :icon="'codicon:fold-down'" color="#333" size="13" />
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a @click="handleRefreshTabPage">重新加载</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="handleCloseTabPage('now')">关闭标签页</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="handleCloseTabPage('left')">关闭左侧标签页</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="handleCloseTabPage('right')">关闭右侧标签页</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="handleCloseTabPage('other')">关闭其他标签页</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="handleCloseTabPage('all')">关闭全部标签页</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
      <div class="iframe-content">
        <template v-for="pane in panes">
          <div v-show="pane.status" class="content">
            <iframe :key="pane.key" :src="pane.pageurl" style="width: 100%; height: 100%"></iframe>
          </div>
        </template>
      </div>
    </div>
  </main>
</template>
<script lang="ts" setup>
  import { onMounted, ref, watch, reactive, nextTick } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';

  const props = defineProps({
    path: { type: String, default: null },
    menu: { type: Object, default: null },
  });

  const emit = defineEmits(['change']);
  const workbench = {
    title: '工作台',
    key: 'workbench',
    closable: false,
    show: true,
    status: true,
    pageurl: '/#/frame/workbench',
  };
  const panes = ref<any[]>([workbench]);

  const paneMap = new Map();
  const activeKey = ref(panes.value[0].key);
  const tabWidth = ref('');
  const trigger = ref(['click']);

  const handleTabChange = (key) => {
    activeKey.value = key;
    for (let pane of panes.value) {
      pane.status = pane.pageurl === key;
    }
    emit('change', activeKey.value, paneMap.get(activeKey.value));
  };

  const handleTabEdit = (targetKey: string | MouseEvent, action: string) => {
    if (action === 'remove') {
      handleRemoveItem(targetKey as string);
    }
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
    emit('change', activeKey.value, paneMap.get(activeKey.value));
  };

  watch(
    () => props.path,
    () => {
      const path = props.path.startsWith('/') ? props.path : '/' + props.path;
      const tempKey = path
        .replace('/da/', '/')
        .replace('/po/', '/framepage/po/')
        .replace('/monitor/', '/framepage/monitor/');
      const key = tempKey.includes('/#') ? tempKey : '/#' + tempKey;
      activeKey.value = key;
      if (!paneMap.has(key)) {
        paneMap.set(key, props.menu);
        panes.value.push({
          title: props.menu.name,
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
      emit('change', activeKey.value, paneMap.get(activeKey.value));
    },
  );

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
        activeKey.value = '/#/frame/workbench';
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
      paneMap.set(pane.pageurl, pane);
    });
    emit('change', activeKey.value, paneMap.get(activeKey.value));
  };

  onMounted(() => {
    paneMap.set(panes.value[0].pageurl, panes.value[0]);
    activeKey.value = panes.value[0].pageurl;
    tabWidth.value = document.body.clientWidth - 280 + 'px';
    emit('change', activeKey.value, paneMap.get(activeKey.value));
  });
</script>
<style scoped>
  .app-content {
    flex: 1;
    padding: 0.1rem 0 0.2rem 0.2rem;

    :deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
      color: #fefefe;
    }

    :deep(.ant-tabs-tab:first-child .ant-tabs-tab-btn) {
      margin: 0 0.3rem 0 0.1rem;
    }

    :deep(.ant-tabs-tab .ant-tabs-tab-btn) {
      margin: 0 0.05rem 0 0.3rem;
    }

    .tabs-content {
      display: flex;
      flex-direction: row;
      align-items: left;
      justify-content: left;
      border-bottom: 1px solid #f0f0f0;

      .tabs-buttons {
        width: 60px;

        span {
          display: inline-flex;
          padding: 5px;
          border-left: 1px solid #f0f0f0;
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
  }
</style>
<style lang="less">
  @import url('../default/tabs/index.less');
</style>
