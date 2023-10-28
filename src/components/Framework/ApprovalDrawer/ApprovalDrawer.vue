<!--
 * @Description: 
 * @Date: 2023-09-14 14:31:30
 * @LastEditTime: 2023-10-28 13:13:59
 * @FilePath: \ygwl-framework\src\components\Framework\ApprovalDrawer\ApprovalDrawer.vue
-->
<template>
  <BasicDrawer class="test" v-bind="$attrs" :isDetail="true" width="33.33%" :headerStyle="{ display: 'none' }" :drawerStyle="{ boxShadow: '0px 1px 3px 0px #E9E9E9', borderTop: '1px solid #F0F0F0' }"
    showFooter footerHeight="64">
    <div>
      <Tabs class="fit-approval-tab" v-model:activeKey="activeKey">
        <TabPane key="1" tab="流程审批">
          <ApprovalTab ref="approvalTabRef" :flowData="currentNodeData" type="approval" />
        </TabPane>
        <TabPane key="2" tab="流程轨迹" force-render>
          <ApprovalTab ref="trackTabRef" :flowData="flowData" type="track" />
        </TabPane>
        <TabPane key="3" tab="关联业务">
          <div>关联业务</div>
        </TabPane>
      </Tabs>
    </div>
    <template #footer>
      <Button class="fit-footer-btn" type="primary" v-if="props.isHandle == 1" @click="handleAgree">同意</Button>
      <Button class="fit-footer-btn" v-if="props.isHandle == 1" @click="handleReject">驳回</Button>
      <Button class="fit-footer-btn" v-if="props.isHandle == 1" @click="handleSave">保存</Button>
      <Dropdown>
        <template #overlay>
          <Menu @click="handleMenuClick">
            <MenuItem v-if="props.isHandle == 1" key="1">终止</MenuItem>
            <MenuItem v-if="props.isHandle == 1" key="2">转办</MenuItem>
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
  import { watch, ref, toRaw, onMounted } from 'vue';
  import { Tabs, TabPane, Button, Dropdown, Menu, MenuItem, message } from 'ant-design-vue';
  import type { MenuProps } from 'ant-design-vue';
  import { propTypes } from '@/utils/propTypes';
  import Icon from '@/components/Icon/Icon.vue';

  import { BasicDrawer } from '/@/components/Drawer';
  import ApprovalTab from '/@/components/Framework/ApprovalDrawer/components/ApprovalTab.vue';
  import * as ProcessInstanceApi from '@/api/bpm/processInstance';
  import { useUserStore } from '/@/store/modules/user';

  const props = defineProps({
    flowData: { type: Array },
    processInstanceId: propTypes.string.def(''),
    isHandle: { type: Number, default: 1} //当前流程是否处理默认当前流程未处理（1 未处理、2 已处理）
  });

  const userStore = useUserStore();
  // 编辑权限
  const editAuthority = (item) => {
    const getUserInfo = toRaw(userStore.getUserInfo);
    return item.assigneeUser.id === getUserInfo.userId;
  };

  // 当前节点数据
  const currentNodeData = ref([]);
  watch(
    () => props.flowData,
    (newValue) => {
      const newArr = [];
      newValue?.forEach((item) => {
        if (item.result === 1 && editAuthority(item)) {
          newArr.push(item);
        }
      });
      currentNodeData.value = newArr;
    },
  );

  const trackTabRef = ref();
  const approvalTabRef = ref();

  const processInstanceId = ref(null);

  const activeKey = ref('1');

  const emit = defineEmits(['agree', 'reject', 'save', 'end', 'transfer', 'notice', 'collect']);

  // 更多
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const { key } = e;
    const { innerFlowData } = trackTabRef.value;
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
    const { innerFlowData } = trackTabRef.value;
    emit('agree', innerFlowData);
  }

  // 驳回
  function handleReject() {
    const { innerFlowData } = trackTabRef.value;
    emit('reject', innerFlowData);
  }

  // 保存
  function handleSave() {
    const { innerFlowData } = trackTabRef.value;
    emit('save', innerFlowData);
  }

  // const getProcessInstance = async () => {
  //   const data = await ProcessInstanceApi.getProcessInstance(processInstanceId.value);
  //   if (!data) {
  //     message.error('查询不到流程信息！');
  //     return;
  //   }
  //   // isHandle.value = data['status'];
  //   console.log('流程信息', data);
  // };

  // watch(
  //   () => props.processInstanceId,
  //   (newValue) => {
  //     processInstanceId.value = props.processInstanceId;
  //     if (processInstanceId.value.length != 0) {
  //       getProcessInstance();
  //     }
  //   },
  // );


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
