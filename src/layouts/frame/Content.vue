<template>
  <main class="app-content">
    <div class="vben-multiple-tabs tabs-content">
      <a-tabs v-model:activeKey="activeKey" type="editable-card" hideAdd @change="handleTabChange">
        <a-tab-pane
          v-for="pane in panes"
          :key="pane.pageurl"
          :tab="pane.title"
          :closable="pane.closable"
        >
          {{ pane.content }}
        </a-tab-pane>
      </a-tabs>
      <div class="iframe-content">
        <template v-for="pane in panes">
          <div v-show="pane.status" class="content">
            <iframe :src="pane.pageurl" style="width:100%; height:100%"></iframe>
          </div>
        </template>
      </div>
    </div>
  </main>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';

  const panes = ref<any[]>([
    { title: '工作台', closable: false, status: true, pageurl: '/#/frame/workbench' },
    { title: '总览驾驶舱', closable: true, status: false, pageurl: '/#/cockpit/overview' },
  ]);

  const activeKey = ref(panes.value[0].key);

  const handleTabChange = (key) => {
    activeKey.value = key;
    for (let pane of panes.value) {
      pane.status = pane.pageurl === key;
    }
  };

  onMounted(() => {
    activeKey.value = panes.value[0].key;
  });
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
