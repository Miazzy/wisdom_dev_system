<template>
  <main class="app-content">
    <div class="vben-multiple-tabs tabs-content" >
      <a-tabs v-model:activeKey="activeKey" type="editable-card" hideAdd @edit="onEdit">
        <a-tab-pane
          v-for="pane in panes"
          :key="pane.key"
          :tab="pane.title"
          :closable="pane.closable"
        >
          {{ pane.content }}
        </a-tab-pane>
      </a-tabs>
      <div class="iframe-content">
        <iframe >
          
        </iframe>
      </div>
    </div>
  </main>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';

  const panes = ref<{ title: string; content: string; key: string; closable?: boolean }[]>([
    { title: '工作台', content: '', key: '1', closable: false },
  ]);

  const activeKey = ref(panes.value[0].key);

  const newTabIndex = ref(0);

  const add = () => {
    activeKey.value = `newTab${++newTabIndex.value}`;
    panes.value.push({ title: 'New Tab', content: 'Content of new Tab', key: activeKey.value });
  };

  const remove = (targetKey: string) => {
    let lastIndex = 0;
    panes.value.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    panes.value = panes.value.filter((pane) => pane.key !== targetKey);
    if (panes.value.length && activeKey.value === targetKey) {
      if (lastIndex >= 0) {
        activeKey.value = panes.value[lastIndex].key;
      } else {
        activeKey.value = panes.value[0].key;
      }
    }
  };

  const onEdit = (targetKey: string | MouseEvent, action: string) => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey as string);
    }
  };
</script>
<style scoped>
  .app-content {
    flex: 1;
    padding: 0.1rem 0 0.2rem 0.2rem;
    background-color: #fff;

    :deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
      color: #fefefe;
    }
    :deep(.ant-tabs-tab:first-child .ant-tabs-tab-btn) {
      margin: 0px 0.3rem 0 0.1rem;
    }
    :deep(.ant-tabs-tab .ant-tabs-tab-btn) {
      margin: 0px 0.05rem 0 0.3rem;
    }

    .iframe-content {
      width: 100%;
      height: calc(100vh - 85px);
      background: transparent;
    }
  }
</style>
<style lang="less">
  @import url('../default/tabs/index.less');
</style>
