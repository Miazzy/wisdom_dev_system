<!--
 * @Description: 
 * @Date: 2023-09-14 14:31:30
 * @LastEditTime: 2023-11-13 16:11:49
 * @FilePath: \ygwl-framework\src\components\Framework\ApprovalDrawer\ApprovalDrawer.vue
-->
<template>
  <BasicDrawer class="test" v-bind="$attrs" :isDetail="true" width="33.33%" :headerStyle="{ display: 'none' }" :drawerStyle="{ boxShadow: '0px 1px 3px 0px #E9E9E9', borderTop: '1px solid #F0F0F0' }"
    :showFooter="currentNodeData[0]&&editAuthority(currentNodeData[0])" footerHeight="64" @visible-change="handleChange">
    <OrganDialog :title="`组织人员Dialog`" :visible="organVisible" @update:visible="organVisible = $event" :tdata="treeData" :tfields="{ key: 'id', title: 'name' }" :width="800" :height="600"
      @cancel="cancelOrganDialog" @confirm="handleOrganConfirm" />

    <div>
      <Tabs class="fit-approval-tab" v-model:activeKey="activeKey">
        <TabPane v-if="currentNodeData[0]&&editAuthority(currentNodeData[0])" key="1" tab="流程审批">
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
    <template v-if="currentNodeData[0]&&editAuthority(currentNodeData[0])" #footer>
      <Button class="fit-footer-btn" type="primary" v-if="props.isHandle == 1" @click="handleAgree">同意</Button>
      <Button class="fit-footer-btn" v-if="props.isHandle == 1" @click="handleReject">驳回</Button>
      <!-- <Button class="fit-footer-btn" v-if="props.isHandle == 1" @click="handleFlowSave"
        >保存</Button
      > -->
      <Dropdown>
        <template #overlay>
          <Menu @click="handleMenuClick">
            <MenuItem key="1">终止</MenuItem>
            <MenuItem key="2">转办</MenuItem>
            <MenuItem key="3">知会</MenuItem>
            <!-- <MenuItem key="4">收藏任务</MenuItem> -->
          </Menu>
        </template>
        <Button v-if="props.isHandle == 1" class="fit-footer-btn">
          更多
          <Icon icon="ant-design:down-outlined" color="#BFBFBF" size="14" />
        </Button>
      </Dropdown>
    </template>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { assign, forEach } from 'min-dash';
  import { watch, ref, toRaw, onMounted, createVNode } from 'vue';
  import { Tabs, TabPane, Button, Dropdown, Menu, MenuItem, message, Modal } from 'ant-design-vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import type { MenuProps } from 'ant-design-vue';
  import { propTypes } from '@/utils/propTypes';
  import Icon from '@/components/Icon/Icon.vue';

  import { BasicDrawer } from '/@/components/Drawer';
  import ApprovalTab from '/@/components/Framework/ApprovalDrawer/components/ApprovalTab.vue';
  import { useUserStore } from '/@/store/modules/user';
  import { TreeItem } from '/@/components/Tree';
  import OrganDialog from '@/components/Framework/Modal/OrganDialog.vue';
  import * as ProcessInstanceApi from '@/api/bpm/processInstance';
  import * as TaskApi from '@/api/bpm/task';
  import * as OrgApi from '@/api/sys/org';
  import { reloadTreeData } from '@/utils/tree';
  import type { PropType } from 'vue';

  type Modes = 'default' | 'before'; // default: 默认不需要在流程同意、驳回、终止等之前，业务有保存或提交数据；before: 需要在流程同意、驳回、终止等之前，业务保存或提交数据

  const props = defineProps({
    flowData: { type: Array },
    processInstanceId: propTypes.string.def(''),
    isHandle: { type: Number, default: 1 }, //当前流程是否处理默认当前流程未处理（1 未处理、2 已处理）
    mode: { type: String as PropType<Modes>, default: 'default' },
    businessStatus: { type: String, default: '' },
  });

  const organVisible = ref(false);
  const organConfirm = ref('');
  const treeData = ref<TreeItem[]>([]); // 左侧电站树数据
  const processOperation = ref(0);

  const userStore = useUserStore();
  const getUserInfo = toRaw(userStore.getUserInfo);

  // 编辑权限
  const editAuthority = (item) => {
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
      if (currentNodeData.value[0] && editAuthority(currentNodeData.value[0])) {
        activeKey.value = '1';
      } else {
        activeKey.value = '2';
      }
    },
  );

  const trackTabRef = ref();
  const approvalTabRef = ref();

  const processInstanceId = ref(null);

  const activeKey = ref('1');

  const emit = defineEmits([
    'agree',
    'reject',
    'save',
    'end',
    'transfer',
    'notice',
    'collect',
    'before',
  ]);

  // 更多
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const { key } = e;
    const { innerFlowData } = trackTabRef.value;
    switch (key) {
      case '1':
        // 终止
        // emit('end', innerFlowData);
        abortFlow();
        break;
      case '2':
        // 转办
        // emit('transfer', innerFlowData);
        handleProcessOperation(2);
        break;
      case '3':
        // 知会
        // emit('notice', innerFlowData);
        handleProcessOperation(3);
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
    if (props.mode === 'default') {
      emit('agree', innerFlowData);
    } else if (props.mode === 'before') {
      emit('before', currentNodeData.value[0], 'beforeAgree');
    }
  }

  // 驳回
  function handleReject() {
    const { innerFlowData } = trackTabRef.value;
    if (props.mode === 'default') {
      emit('reject', innerFlowData);
    } else if (props.mode === 'before') {
      emit('before', currentNodeData.value[0], 'beforeReject');
    }
  }

  // 保存
  // function handleFlowSave() {
  //   const { innerFlowData } = trackTabRef.value;
  //   emit('save', innerFlowData);
  // }

  function abortFlow() {
    const { innerFlowData } = trackTabRef.value;
    const myTask = getMyTask(innerFlowData);
    console.log('myTask', myTask);

    if (Object.keys(myTask).length === 0) {
      message.warning('没有权限操作。');
      return;
    }
    if (myTask.result == 2) {
      message.warning('此任务已处理。');
      return;
    }
    const params = {
      id: myTask.id,
      reason: '测试终止流程。',
    };

    Modal.confirm({
      title: () => '确认操作',
      icon: () => createVNode(ExclamationCircleOutlined),
      content: () => createVNode('div', { style: 'color:red;' }, '确定要终止当前任务吗？'),
      onOk() {
        // ProcessInstanceApi.abortProcessInstance(params).then(() => {
        //   processOperation.value = 0;
        //   emit('onReload');
        //   message.success('操作成功。');
        // });
        if (props.mode === 'default') {
          emit('end', innerFlowData);
          ProcessInstanceApi.abortProcessInstance(params).then(() => {
            processOperation.value = 0;
            emit('onReload');
            message.success('操作成功。');
          });
        } else if (props.mode === 'before') {
          emit('before', currentNodeData.value[0], 'beforeEnd');
        }
      },
      class: 'test',
    });
  }

  watch(
    () => props.businessStatus,
    (newValue) => {
      if (newValue === 'end') {
        ProcessInstanceApi.abortProcessInstance(params).then(() => {
          processOperation.value = 0;
          emit('onReload');
          message.success('操作成功。');
        });
      }
    },
  );

  // 处理流程操作
  function handleProcessOperation(operation) {
    processOperation.value = operation;
    const { innerFlowData } = trackTabRef.value;
    const myTask = getMyTask(innerFlowData);

    if (myTask.result == 2) {
      message.warning('此任务已处理。');
      return;
    }

    organVisible.value = true;
    // 重新加载TreeData
    reloadTreeData(treeData, 100);
  }

  // 查询左侧电站树数据
  async function queryDeptTreeList() {
    OrgApi.getListTree({
      showPosition: false,
      fullId: '/HZ93a0bf6ab8dd83016ab8deaca70009.ogn',
    }).then((res) => {
      const list = res as unknown as TreeItem[];
      treeData.value = list;
    });
  }

  const getPersonId = (personMemberId) => {
    return personMemberId.split('@')[0];
  };

  const handleOrganConfirm = (nodeList) => {
    // const message = nodeList.length > 0 ? JSON.stringify(nodeList) : '';
    // organConfirm.value = '组织人员选择Dialog确定，返回结果：' + message;
    // console.info('组织人员选择Dialog确定，返回结果：' + message);
    // console.log('processOperation.value', processOperation.value);

    const { innerFlowData } = trackTabRef.value;
    const myTask = getMyTask(innerFlowData);
    console.log('myTask', myTask);

    if (myTask.result == 2) {
      message.warning('此任务已处理。');
      return false;
    }
    if (nodeList.length == 0) {
      message.warning('请选择人员。');
      return false;
    }
    if (processOperation.value == 2) {
      if (nodeList.length > 1) {
        message.warning('只能选择一个人员。');
        return false;
      }
      const params = {
        id: myTask.id,
        assigneeUserId: getPersonId(nodeList[0].id),
      };
      TaskApi.updateTaskAssignee(params).then(() => {
        processOperation.value = 0;
        emit('onReload');
        message.success('操作成功。');
      });
    } else if (processOperation.value == 3) {
      const ccToVos = [];
      for (const node of nodeList) {
        ccToVos.push({ userId: getPersonId(node.id) });
      }
      const params = {
        id: myTask.id,
        ccToVos: ccToVos,
      };
      TaskApi.addCcTo(params).then(() => {
        processOperation.value = 0;
        emit('onReload');
        message.success('操作成功。');
      });
    }
  };

  const cancelOrganDialog = () => {
    processOperation.value = 0;
  };

  //获取未处理任务节点
  const getMyTask = (flowData) => {
    const obj = {};
    flowData.forEach((item) => {
      if (item.assigneeUser.id === getUserInfo.userId) {
        assign(obj, item);
      }
    });
    return obj;
  };

  // 当drawer组件弹开时
  const handleChange = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0 });
    }, 0);
  };

  /** 初始化 **/
  onMounted(() => {
    queryDeptTreeList();
  });
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
