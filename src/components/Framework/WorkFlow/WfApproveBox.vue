<template>
  <div class="workflow-approve-box">
    <!-- 审批按钮 -->
    <div class="button-content" style="" v-show="isShowBtns">
      <Button @click="handleSubmit" v-if="isNewProcessType && !isReadOnly" type="primary"
        >提交</Button
      >
      <Button @click="handleSave" v-if="isNewProcessType && !isReadOnly">保存</Button>

      <!-- <Button @click="handleCollect" v-if="processStatus != 0">收藏</Button> -->
      <Button
        @click="handleOpenApprovalDrawer"
        v-if="!isNewProcessType && processStatus && processStatus !== 0"
        type="primary"
        >审批</Button
      >
    </div>
    <!-- 流程审批抽屉组件 -->
    <ApprovalDrawer
      @register="approvalDrawerRegister"
      :flowData="approveDataList"
      :processInstanceId="processInstanceId"
      :isHandle="isHandle"
      :mode="props.mode"
      :businessStatus="props.businessStatus"
      @agree="handleAgree"
      @reject="handleReject"
      @save="handleFlowSave"
      @end="handleEnd"
      @transfer="handleTransfer"
      @notice="handleNotice"
      @collect="handleCollect"
      @on-reload="onReload"
      @before="handleBefore"
    />
  </div>
</template>
<script lang="ts" setup>
  import { assign, forEach } from 'min-dash';
  import { watch, toRaw, ref, onMounted, unref, computed } from 'vue';
  import { message, Button } from 'ant-design-vue';
  import { useDrawer } from '/@/components/Drawer';
  import { propTypes } from '@/utils/propTypes';
  import ApprovalDrawer from '/@/components/Framework/ApprovalDrawer/ApprovalDrawer.vue';
  import * as TaskApi from '@/api/bpm/task';
  import * as ProcessInstanceApi from '@/api/bpm/processInstance';
  import { useUserStore } from '/@/store/modules/user';
  import { useTabs } from '/@/hooks/web/useTabs';
  import type { PropType } from 'vue';
  import { useRouter } from 'vue-router';
  import { closeCurrentTab } from '@/utils/route';
  import { MsgManager } from '/@/message/MsgManager';
  import { SysMessage } from '/@/hooks/web/useMessage';

  const { currentRoute } = useRouter();
  const route = unref(currentRoute);

  const emit = defineEmits([
    'agree',
    'reject',
    'save',
    'end',
    'transfer',
    'notice',
    'collect',
    'submit',
    'before',
  ]);

  const isReadOnly = ref<boolean>(true);

  const userStore = useUserStore();
  const getUserInfo = toRaw(userStore.getUserInfo);

  const props = defineProps({
    processInstanceId: propTypes.string.def(''),
    processStatus: { type: [Number, String], default: '' },
    mode: { type: String as PropType<Modes>, default: 'default' },
    businessStatus: { type: String, default: '' },
    listenMessage: { type: String, default: 'workflow-task-done' },
  });

  const [
    approvalDrawerRegister,
    { openDrawer: openApprovalDrawer, closeDrawer: closeApprovalDrawer },
  ] = useDrawer();

  enum ProcessType {
    NEW = 'new',
    VIEW = 'view',
  }

  const approveDataList = ref([]);
  const processInstanceId = ref(null);
  const processStatus = ref();
  const processType = ref(ProcessType.NEW);

  // 打开流程审批抽屉
  function handleOpenApprovalDrawer() {
    openApprovalDrawer(true);
  }

  const isNewProcessType = computed(() => {
    return processType.value === ProcessType.NEW;
  });

  const handleAgree = async (flowData) => {
    // emit('agree', flowData);
    const curflowobj = getuntreated(toRaw(flowData));
    await TaskApi.approveTask({ id: curflowobj.id, reason: curflowobj.reason });
    SysMessage.getInstance().success('操作成功。');
    isHandle.value = 2;
    await getTaskListByProcessInstanceId();
    closeApprovalDrawer();
    closeCurrentTab();
    sendMsg();
  };

  const getTaskListByProcessInstanceId = async () => {
    const data = await TaskApi.getTaskListByProcessInstanceId(processInstanceId.value);
    if (!data) {
      SysMessage.getInstance().error('查询不到流程信息！');
      return;
    }
    const myTask = getMyTask(data);
    if (Object.keys(myTask).length === 0) {
      isHandle.value = 0;
    }
    approveDataList.value = data;
  };

  //获取未处理任务节点
  function getuntreated(flowData) {
    const obj = {};
    flowData.forEach((item) => {
      if (item.assigneeUser.id === getUserInfo.userId && item.result === 1) {
        assign(obj, item);
      }
    });
    return obj;
  }

  const handleReject = async (flowData) => {
    // emit('reject', flowData);
    const curflowobj = getuntreated(toRaw(flowData));
    await TaskApi.rejectTask({ id: curflowobj.id, reason: curflowobj.reason });
    SysMessage.getInstance().success('操作成功。');
    await getTaskListByProcessInstanceId();
    closeApprovalDrawer();
    closeCurrentTab();
    sendMsg();
  };

  // 流程审批保存
  const onReload = () => {
    getTaskListByProcessInstanceId();
  };

  // 流程审批保存
  const handleFlowSave = (flowData) => {
    emit('flowSave', flowData);
  };

  // 业务的保存
  const handleSave = () => {
    emit('save');
    sendMsg();
  };

  //发送通知消息
  const sendMsg = () => {
    MsgManager.getInstance().sendMsg('workbench-approval', {}); // 工作台
    MsgManager.getInstance().sendMsg(props.listenMessage, {}); // 发送消息，通知审批待办任务已办任务刷新列表
  };

  const handleEnd = (flowData) => {
    emit('end', flowData);
  };

  const handleTransfer = (flowData) => {
    emit('transfer', flowData);
  };

  const handleNotice = (flowData) => {
    emit('notice', flowData);
  };

  const handleCollect = (flowData) => {
    emit('collect', flowData);
  };

  const handleSubmit = (flowData) => {
    emit('submit', flowData);

    sendMsg();
  };

  const isShowBtns = ref(false); // 是否显示保存提交审批按钮
  const isHandle = ref(1);
  const getProcessInstance = async () => {
    const data = await ProcessInstanceApi.getProcessInstance(processInstanceId.value);
    if (!data) {
      SysMessage.getInstance().error('查询不到流程信息！');
      return;
    }
    //获取当前流程是否可操作
    const startUserId = data.startUser.id;
    if (startUserId === getUserInfo.userId && data.formVariables.status == 0) {
      isReadOnly.value = false;
    }
    isHandle.value = data['status'];
  };

  //获取未处理任务节点
  function getMyTask(flowData) {
    const obj = {};
    flowData.forEach((item) => {
      if (item.assigneeUser.id === getUserInfo.userId) {
        assign(obj, item);
      }
    });
    return obj;
  }

  watch(
    () => props.processStatus,
    (newValue, prevValue) => {
      processStatus.value = props.processStatus;
      if (newValue === 0 && prevValue === '') { // status: '' => 0, 表示在新增状态
        processType.value = ProcessType.NEW;
      } else if (newValue !== 0 && prevValue === '') { // status: '' => 1,2,3..., 表示在审批状态
        processType.value = ProcessType.VIEW;
      }
    },
    { immediate: true },
  );

  watch(
    () => props.processInstanceId,
    (newValue, prevValue) => {
      if (props.processInstanceId) {
        processInstanceId.value = props.processInstanceId;
        getTaskListByProcessInstanceId();
        getProcessInstance();
        isShowBtns.value = true;
      }
    },
  );

  const currentNode = {};
  // 流程同意/驳回/终止前
  const handleBefore = (currentNodeData, beforeOperationType) => {
    assign(currentNode, currentNodeData);
    emit('before', currentNode, beforeOperationType);
  };

  watch(
    () => props.businessStatus,
    async (newValue) => {
      if (newValue === 'agree') {
        await TaskApi.approveTask({ id: currentNode.id, reason: currentNode.reason });
        SysMessage.getInstance().success('操作成功。');
        isHandle.value = 2;
        await getTaskListByProcessInstanceId();
        closeApprovalDrawer();
        closeCurrentTab();
        MsgManager.getInstance().sendMsg(props.listenMessage, {}); // 发送消息，通知审批待办任务已办任务刷新列表
      } else if (newValue === 'reject') {
        await TaskApi.rejectTask({ id: currentNode.id, reason: currentNode.reason });
        SysMessage.getInstance().success('操作成功。');
        await getTaskListByProcessInstanceId();
        closeApprovalDrawer();
        closeCurrentTab();
        MsgManager.getInstance().sendMsg(props.listenMessage, {}); // 发送消息，通知审批待办任务已办任务刷新列表
      }
    },
  );
  onMounted(() => {
    if (!route.query.processInstanceId && !route.query.id) {
      isShowBtns.value = true;
      isReadOnly.value = false;
    }
  });
</script>
<style lang="less" scoped>
  .workflow-approve-box {
    .button-content {
      margin: 16px 0 0 16px;

      .ant-btn {
        margin: 0 10px 0 0;
      }
    }
  }
</style>
