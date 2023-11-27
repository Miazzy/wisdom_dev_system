<template>
  <div class="workflow-approve-box">
    <!-- 审批按钮 -->
    <div class="button-content" style="" v-show="isShowBtns">
      <Button @click="handleSave" v-if="processStatus == 0" type="primary">保存</Button>
      <Button @click="handleSubmit" v-if="processStatus == 0" type="primary">提交</Button>
      <!-- <Button @click="handleCollect" v-if="processStatus != 0">收藏</Button> -->
      <Button @click="handleOpenApprovalDrawer" v-if="processStatus&&processStatus !== 0">审批</Button>
    </div>
    <!-- 流程审批抽屉组件 -->
    <ApprovalDrawer
      @register="approvalDrawerRegister"
      :flowData="approveDataList"
      :processInstanceId="processInstanceId"
      :isHandle="isHandle"
      :mode="props.mode" :businessStatus="props.businessStatus"
      @agree="handleAgree"
      @reject="handleReject"
      @save="handleFlowSave"
      @end="handleEnd"
      @transfer="handleTransfer"
      @notice="handleNotice"
      @collect="handleCollect"
      @onReload="onReload"
      @before="handleBefore"
    />
  </div>
</template>
<script lang="ts" setup>
  import { assign, forEach } from 'min-dash';
  import { watch, toRaw, ref, onMounted, unref } from 'vue';
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
    'before'
  ]);

  const userStore = useUserStore();
  const getUserInfo = toRaw(userStore.getUserInfo);

  const props = defineProps({
    processInstanceId: propTypes.string.def(''),
    processStatus: propTypes.number.def(undefined),
    mode: { type: String as PropType<Modes>, default: 'default'},
    businessStatus: { type: String, default: '' }
  });

  const [approvalDrawerRegister, { openDrawer: openApprovalDrawer }] = useDrawer();
  const approveDataList = ref([]);
  const processInstanceId = ref(null);
  const processStatus = ref();

  // 打开流程审批抽屉
  function handleOpenApprovalDrawer() {
    openApprovalDrawer(true);
  }

   // 关闭当前页签
  const { closeCurrentPage } = useTabs();

  const handleAgree = async (flowData) => {
    // emit('agree', flowData);
    const curflowobj = getuntreated(toRaw(flowData));
    await TaskApi.approveTask({ id: curflowobj.id, reason: curflowobj.reason });
    message.success('操作成功。');
    isHandle.value = 2;
    getTaskListByProcessInstanceId(); 
    closeCurrentPage();
  };

  const getTaskListByProcessInstanceId = async () => {
    const data = await TaskApi.getTaskListByProcessInstanceId(processInstanceId.value);
    if (!data) {
      message.error('查询不到流程信息！');
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
    forEach(flowData, function (def) {
      var flow = toRaw(def);
      if (flow.result === 1) {
        assign(obj, flow);
      }
    });
    return obj;
  }

  const handleReject = async (flowData) => {
    // emit('reject', flowData);
    const curflowobj = getuntreated(toRaw(flowData));
    await TaskApi.rejectTask({ id: curflowobj.id, reason: curflowobj.reason });
    message.success('操作成功。');
    getTaskListByProcessInstanceId();
    closeCurrentPage();
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
  };

  const isShowBtns = ref(false); // 是否显示保存提交审批按钮
  const isHandle = ref(1);
  const getProcessInstance = async () => {
    const data = await ProcessInstanceApi.getProcessInstance(processInstanceId.value);
    if (!data) {
      message.error('查询不到流程信息！');
      return;
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
    (newValue) => {
      processStatus.value = props.processStatus;
    },
    { immediate: true }
  );

  watch(
    () => props.processInstanceId,
    (newValue, prevValue) => {
      processInstanceId.value = props.processInstanceId;
      if (processInstanceId.value.length != 0) {
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
      if(newValue==='agree') { 
        await TaskApi.approveTask({ id: currentNode.id, reason: currentNode.reason });
        message.success('操作成功。');
        isHandle.value = 2;
        getTaskListByProcessInstanceId();
        closeCurrentPage();
      } else if(newValue==='reject') {
        await TaskApi.rejectTask({ id: currentNode.id, reason: currentNode.reason });
        message.success('操作成功。');
        getTaskListByProcessInstanceId();
        closeCurrentPage();
      }
    },
  );
  onMounted(()=>{
    if(!route.query.processInstanceId) {
      isShowBtns.value = true;
    }
  })
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
