<template>
  <div class="workflow-approve-box">
    <!-- 审批按钮 -->
    <div class="button-content" style="">
      <Button @click="handleSave" type="primary">保存</Button>
      <Button @click="handleSubmit" type="primary">提交</Button>
      <Button @click="handleCollect">收藏</Button>
      <Button @click="handleOpenApprovalDrawer">审批</Button>
    </div>
    <!-- 流程审批抽屉组件 -->
    <ApprovalDrawer
      @register="approvalDrawerRegister"
      :flowData="approveDataList"
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
  import { onMounted, watch, reactive, ref } from 'vue';
  import { useDrawer } from '/@/components/Drawer';
  import { Button } from 'ant-design-vue';
  import ApprovalDrawer from '/@/components/Framework/ApprovalDrawer/ApprovalDrawer.vue';

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
    data: { type: Array },
  });

  const [approvalDrawerRegister, { openDrawer: openApprovalDrawer }] = useDrawer();
  const approveDataList = ref([]);

  // 打开流程审批抽屉
  function handleOpenApprovalDrawer() {
    openApprovalDrawer(true);
  }

  const handleAgree = (flowData) => {
    emit('agree', flowData);
  };

  const handleReject = (flowData) => {
    emit('reject', flowData);
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

  watch(
    () => props.data,
    (newValue) => {
      approveDataList.value = props.data as never[];
    },
  );

  onMounted(() => {
    approveDataList.value = props.data as never[];
  });
</script>
<style lang="less" scoped>
  .workflow-approve-box {
    .button-content {
      margin: 16px 0 0 16px;
      .ant-btn {
        margin: 0px 10px 0px 0px;
      }
    }
  }
</style>