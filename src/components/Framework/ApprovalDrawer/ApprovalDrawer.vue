<!--
 * @Description: 
 * @Date: 2023-09-14 14:31:30
 * @LastEditTime: 2023-09-16 17:05:09
 * @FilePath: \ygwl-framework\src\components\Framework\ApprovalDrawer\ApprovalDrawer.vue
-->
<template>
  <BasicDrawer class="test" v-bind="$attrs" :isDetail="true" width="33.33%" :headerStyle="{display: 'none'}" :drawerStyle="{boxShadow: '0px 1px 3px 0px #E9E9E9', borderTop:'1px solid #F0F0F0'}" showFooter footerHeight="64">
    <div>
      <Tabs class="fit-approval-tab" v-model:activeKey="activeKey">
        <TabPane key="1" tab="流程审批">
          <ApprovalTab />
        </TabPane>
        <TabPane key="2" tab="流程轨迹" force-render>Content of Tab Pane 2</TabPane>
        <TabPane key="3" tab="关联业务">Content of Tab Pane 3</TabPane>
      </Tabs>
    </div>
    <template #footer>
      <Button class="fit-footer-btn" type="primary">同意</Button>
      <Button class="fit-footer-btn">驳回</Button>
      <Button class="fit-footer-btn">保存</Button>
      <Dropdown>
        <template #overlay>
          <Menu @click="handleMenuClick">
            <MenuItem key="1">1st item</MenuItem>
            <MenuItem key="2">2nd item</MenuItem>
            <MenuItem key="3">3rd item</MenuItem>
          </Menu>
        </template>
        <Button class="fit-footer-btn">
          更多
          <Icon icon="ant-design:down-outlined" />
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

  // export default defineComponent({
  //   components: { BasicDrawer },
  // });
  const activeKey = ref('1');

  const handleMenuClick: MenuProps['onClick'] = e => {
      console.log('click', e);
  };
</script>
<style lang="less">
.vben-basic-drawer-footer {
  border-top-color: #eee;
}
</style>
<style lang="less" scoped>
// :deep(.vben-basic-drawer .ant-drawer-body .scrollbar__wrap) {
    // padding: 0 !important;
// }
.fit-approval-tab {
  :deep(.ant-tabs-tab) {
    font-size: 16px;

    &.ant-tabs-tab-active .ant-tabs-tab-btn {
      color: #1890FF;
    }
  }

  :deep(&.ant-tabs > .ant-tabs-nav .ant-tabs-nav-wrap) {
    padding: 0 20px;
  }

  :deep(.ant-tabs-ink-bar) {
    background-color: #1890FF;
  }
}

.fit-footer-btn.ant-btn {
  margin-right: 10px;
  padding: 4px 18px;
  border-color: #D9D9D9;
  color: #262626;
}

.fit-footer-btn.ant-btn.ant-btn-primary {
  border-color: #1890FF;
  background: #1890FF;
  color: #fff;
}
</style>