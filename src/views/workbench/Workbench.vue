<template>
  <div class="workbench">
    <a-row :gutter="[10, 10]">
      <a-col :span="24">
        <!-- 头部 -->
        <WorkbenchHeader />
      </a-col>
      <a-col :span="16">
        <!-- 数据看板 -->
        <DataBoard />
      </a-col>
      <a-col :span="8">
        <!-- 快捷导航 -->
        <QuickNav />
      </a-col>
      <a-col :span="16">
        <!-- 流程审批 -->
        <Approval />
      </a-col>
      <a-col :span="8">
        <!-- 日程安排 -->
        <Schedule />
      </a-col>
      <a-col :span="16">
        <!-- 通知公告 -->
        <Notice />
      </a-col>
      <a-col :span="8">
        <!-- 工作提醒 -->
        <WorkReminder />
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, reactive, ref, unref, UnwrapRef, toRaw, onActivated } from 'vue';
  import WorkbenchHeader from './WorkbenchHeader.vue';
  import DataBoard from './DataBoard.vue';
  import QuickNav from './QuickNav.vue';
  import Approval from './Approval.vue';
  import Schedule from './Schedule.vue';
  import Notice from './Notice.vue';
  import WorkReminder from './WorkReminder.vue';
  import { MsgManager } from '/@/message/MsgManager';
  import { SysMessage } from '/@/hooks/web/useMessage';

  onActivated(() => {
    //
  });

  onMounted(() => {
    if (window.self !== window.top) {
      SysMessage.isLoadover = true;
      MsgManager.getInstance().sendMsg('workbench-loadover', true);
    }
  });
</script>
<style lang="less" scoped>
  .workbench {
    width: 100%;
    padding: 10px;
    padding-right: 0;

    & > :deep(.ant-row) {
      width: 100%;
    }

    :deep(.ant-card-body) {
      padding: 0 16px;
    }

    :deep(.ant-card-head) {
      padding: 0 16px;
      font-size: 14px;
      font-weight: 600;
    }

    :deep(.ant-card-head-title) {
      padding: 12px 0;
    }

    :deep(.ant-card-extra) {
      padding: 12px 0;

      & > span {
        cursor: pointer;
      }
    }
  }
</style>
