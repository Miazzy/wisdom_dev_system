<template>
  <div class="workflow-approve-box">
    <!-- 审批按钮 -->
    <div class="button-content" style="">
      <Button @click="handleSave" v-if="processStatus == 0" type="primary">保存</Button>
      <Button @click="handleSubmit" v-if="processStatus == 0" type="primary">提交</Button>
      <Button @click="handleCollect" v-if="processStatus != 0">收藏</Button>
      <Button @click="handleOpenApprovalDrawer" v-if="processStatus != 0">审批</Button>
    </div>
    <!-- 流程审批抽屉组件 -->
    <ApprovalDrawer
      @register="approvalDrawerRegister"
      :flowData="approveDataList"
      :processInstanceId="processInstanceId"
      :isHandle="isHandle"
      @agree="handleAgree"
      @reject="handleReject"
      @save="handleSave"
      @end="handleEnd"
      @transfer="handleTransfer"
      @notice="handleNotice"
      @collect="handleCollect"
    />
  </div>
</template>
<script lang="ts" setup>
  import { assign, forEach } from 'min-dash';
  import { watch, toRaw, ref, onMounted } from 'vue';
  import { message, Button } from 'ant-design-vue';
  import { useDrawer } from '/@/components/Drawer';
  import { propTypes } from '@/utils/propTypes';
  import ApprovalDrawer from '/@/components/Framework/ApprovalDrawer/ApprovalDrawer.vue';
  import * as TaskApi from '@/api/bpm/task';
  import * as ProcessInstanceApi from '@/api/bpm/processInstance';

  const emit = defineEmits([
    'agree',
    'reject',
    'save',
    'end',
    'transfer',
    'notice',
    'collect',
    'submit',
  ]);

  const props = defineProps({
    processInstanceId: propTypes.string.def(''),
    processStatus: propTypes.number.def(undefined),
  });

  const [approvalDrawerRegister, { openDrawer: openApprovalDrawer }] = useDrawer();
  const approveDataList = ref([]);
  const processInstanceId = ref(null);
  const processStatus = ref(0);

  // 打开流程审批抽屉
  function handleOpenApprovalDrawer() {
    openApprovalDrawer(true);
  }

  const handleAgree = async (flowData) => {
    // emit('agree', flowData);
    const curflowobj = getuntreated(toRaw(flowData));
    await TaskApi.approveTask({ id: curflowobj.id, reason: curflowobj.reason });
    message.success('操作成功。');
    isHandle.value = 2;
    getTaskListByProcessInstanceId();
  };

  const getTaskListByProcessInstanceId = async () => {
    const data = await TaskApi.getTaskListByProcessInstanceId(processInstanceId.value);
    if (!data) {
      message.error('查询不到流程信息！');
      return;
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
  };

  const handleSave = (flowData) => {
    emit('save', flowData);
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

  const isHandle = ref(1);
  const getProcessInstance = async () => {
    const data = await ProcessInstanceApi.getProcessInstance(processInstanceId.value);
    if (!data) {
      message.error('查询不到流程信息！');
      return;
    }
    isHandle.value = data['status'];
  };

  watch(
    () => props.processStatus,
    (newValue) => {
      processStatus.value = props.processStatus;
    },
  );

  watch(
    () => props.processInstanceId,
    (newValue) => {
      processInstanceId.value = props.processInstanceId;
      if (processInstanceId.value.length != 0) {
        getTaskListByProcessInstanceId();
        getProcessInstance();
      }
    },
  );
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
