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
          <Icon :icon="'icons8:refresh'" color="#333" size="15" />
          <Icon :icon="'codicon:fold-down'" color="#333" size="13" />
        </div>
      </div>
      <div class="iframe-content">
        <template v-for="pane in panes">
          <div v-show="pane.status" class="content">
            <iframe :src="pane.pageurl" style="width: 100%; height: 100%"></iframe>
          </div>
        </template>
      </div>
    </div>
  </main>
</template>
<script lang="ts" setup>
  import { onMounted, ref, watch, reactive } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';

  const props = defineProps({
    path: { type: String, default: null },
    menu: { type: Object, default: null },
  });

  const emit = defineEmits(['change']);

  const panes = ref<any[]>([
    { title: '工作台', closable: false, status: true, pageurl: '/#/frame/workbench' },
  ]);

  const paneMap = new Map();
  const activeKey = ref(panes.value[0].key);
  const tabWidth = ref('');

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
          closable: true,
          status: true,
          pageurl: key,
        });
      }
      for (let pane of panes.value) {
        pane.status = pane.pageurl === key;
      }
      emit('change', activeKey.value, paneMap.get(activeKey.value));
    },
  );

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
      margin: 0px 0.3rem 0 0.1rem;
    }
    :deep(.ant-tabs-tab .ant-tabs-tab-btn) {
      margin: 0px 0.05rem 0 0.3rem;
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
          cursor: pointer;
          display: inline-flex;
          padding: 5px 5px;
          border-left: 1px solid #f0f0f0;
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
