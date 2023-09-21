<!--
 * @Description: 
 * @Date: 2023-09-14 14:31:30
 * @LastEditTime: 2023-09-21 09:06:01
 * @FilePath: \ygwl-framework\src\components\Framework\ApprovalDrawer\ApprovalDrawer.vue
-->
<template>
  <BasicDrawer
    class="test"
    v-bind="$attrs"
    :isDetail="true"
    width="33.33%"
    :headerStyle="{ display: 'none' }"
    :drawerStyle="{ boxShadow: '0px 1px 3px 0px #E9E9E9', borderTop: '1px solid #F0F0F0' }"
    showFooter
    footerHeight="64"
  >
    <div>
      <Tabs class="fit-approval-tab" v-model:activeKey="activeKey">
        <TabPane key="1" tab="流程审批">
          <ApprovalTab ref="approvalTabRef" :flowData="flowData" />
        </TabPane>
        <TabPane key="2" tab="流程轨迹" force-render>
          <div>流程轨迹</div>
        </TabPane>
        <TabPane key="3" tab="关联业务">
          <div>关联业务</div>
        </TabPane>
      </Tabs>
    </div>
    <template #footer>
      <Button class="fit-footer-btn" type="primary" @click="handleAgree">同意</Button>
      <Button class="fit-footer-btn" @click="handleReject">驳回</Button>
      <Button class="fit-footer-btn" @click="handleSave">保存</Button>
      <Dropdown>
        <template #overlay>
          <Menu @click="handleMenuClick">
            <MenuItem key="1">终止</MenuItem>
            <MenuItem key="2">转办</MenuItem>
            <MenuItem key="3">知会</MenuItem>
            <MenuItem key="4">收藏任务</MenuItem>
          </Menu>
        </template>
        <Button class="fit-footer-btn">
          更多
          <Icon icon="ant-design:down-outlined" color="#BFBFBF" size="14" />
        </Button>
      </Dropdown>
    </template>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Tabs, TabPane, Button, Dropdown, Menu, MenuItem } from 'ant-design-vue';
  import type { MenuProps } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';

  import { BasicDrawer } from '/@/components/Drawer';
  import ApprovalTab from '/@/components/Framework/ApprovalDrawer/components/ApprovalTab.vue';

  const props = defineProps({
    flowData: { type: Array },
  });

  const approvalTabRef = ref();

  const activeKey = ref('1');

  const emit = defineEmits(['agree', 'reject', 'save', 'end', 'transfer', 'notice', 'collect']);

  // 更多
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const { key } = e;
    const { innerFlowData } = approvalTabRef.value;
    switch (key) {
      case '1':
        // 终止
        emit('end', innerFlowData);
        break;
      case '2':
        // 转办
        emit('transfer', innerFlowData);
        break;
      case '3':
        // 知会
        emit('notice', innerFlowData);
        break;
      case '4':
        // 收藏任务
        emit('collect', innerFlowData);
        break;
    }
  };

  // 同意
  function handleAgree() {
    const { innerFlowData } = approvalTabRef.value;
    emit('agree', innerFlowData);
  }

  // 驳回
  function handleReject() {
    const { innerFlowData } = approvalTabRef.value;
    emit('reject', innerFlowData);
  }

  // 保存
  function handleSave() {
    const { innerFlowData } = approvalTabRef.value;
    emit('save', innerFlowData);
  }
</script>
<style lang="less">
  .vben-basic-drawer-footer {
    border-top-color: #eee;
  }
</style>
<style lang="less" scoped>
  .fit-approval-tab {
    :deep(.ant-tabs-tab) {
      font-size: 16px;

      &.ant-tabs-tab-active .ant-tabs-tab-btn {
        color: #1890ff;
      }
    }

    :deep(&.ant-tabs > .ant-tabs-nav .ant-tabs-nav-wrap) {
      padding: 0 20px;
    }

    :deep(.ant-tabs-ink-bar) {
      background-color: #1890ff;
    }
  }

  .fit-footer-btn.ant-btn {
    width: 64px;
    margin-right: 10px;
    padding: 4px 0;
    border-color: #d9d9d9;
    color: #262626;

    & > span + .anticon {
      margin-left: 0;
    }
  }

  .fit-footer-btn.ant-btn.ant-btn-primary {
    border-color: #1890ff;
    background: #1890ff;
    color: #fff;
  }
</style>
