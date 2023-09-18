<!--
 * @Description: 
 * @Date: 2023-09-14 14:31:30
 * @LastEditTime: 2023-09-18 10:35:22
 * @FilePath: \ygwl-framework\src\components\Framework\ApprovalDrawer\ApprovalDrawer.vue
-->
<template>
  <BasicDrawer class="test" v-bind="$attrs" :isDetail="true" width="33.33%" :headerStyle="{display: 'none'}" :drawerStyle="{boxShadow: '0px 1px 3px 0px #E9E9E9', borderTop:'1px solid #F0F0F0'}" showFooter footerHeight="64">
    <div>
      <Tabs class="fit-approval-tab" v-model:activeKey="activeKey">
        <TabPane key="1" tab="流程审批">
          <ApprovalTab />
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
      <Button class="fit-footer-btn" @click="handleBack">驳回</Button>
      <Button class="fit-footer-btn" @click="handleSave">保存</Button>
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

  // export default defineComponent({
  //   components: { BasicDrawer },
  // });
  const activeKey = ref('1');

  // 更多
  const handleMenuClick: MenuProps['onClick'] = e => {
      console.log('click', e);
  };

  // 同意
  function handleAgree() {
    console.log('handleAgree');
  };

  // 驳回
  function handleBack() {
    console.log('handleBack');
  }

  // 保存
  function handleSave() {
    console.log('handleSave');
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
  width: 64px;
  margin-right: 10px;
  padding: 4px 0;
  border-color: #D9D9D9;
  color: #262626;

  &> span + .anticon {
    margin-left: 0;
  }
}

.fit-footer-btn.ant-btn.ant-btn-primary {
  border-color: #1890FF;
  background: #1890FF;
  color: #fff;
}
</style>