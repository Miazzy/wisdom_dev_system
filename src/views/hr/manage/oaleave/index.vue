<script lang="ts" setup>
  import { ElMessageBox } from 'element-plus';
  import { columns, searchFormSchema } from './oaLeave.data';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useMessage } from '@/hooks/web/useMessage';
  import { IconEnum } from '@/enums/appEnum';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { exportOaLeave, getOaLeavePage } from '@/api/hr/oaleave';
  import { cancelProcessInstance } from '@/api/bpm/processInstance';
  import { useRouter } from 'vue-router';
  import { exportExcelFile } from '@/utils/file/download';

  defineOptions({ name: 'OaLeave' });

  const { t } = useI18n();
  const router = useRouter();
  const { createConfirm, createMessage } = useMessage();

  const [registerTable, { getForm, reload }] = useTable({
    title: 'OA 请假申请列表',
    api: getOaLeavePage,
    columns,
    formConfig: { labelWidth: 120, schemas: searchFormSchema },
    useSearchForm: true,
    showTableSetting: true,
    actionColumn: {
      width: 140,
      title: t('common.operate'),
      dataIndex: 'action',
      fixed: 'right',
    },
  });

  async function handleExport() {
    createConfirm({
      title: t('common.exportTitle'),
      iconType: 'warning',
      content: t('common.message.exportMessage'),
      async onOk() {
        await exportOaLeave(getForm().getFieldsValue()).then((res) => {
          exportExcelFile(res?.data, 'OA 请假申请.xls');
        });
        createMessage.success(t('common.exportSuccessText'));
      },
    });
  }

  /** 添加操作 */
  function handleCreate() {
    router.push(`/hr/manage/OALeaveCreate`);
  }

  /** 取消请假操作 */
  async function cancelLeave(row) {
    const { value } = await ElMessageBox.prompt('请输入取消原因', '取消流程', {
      confirmButtonText: t('common.ok'),
      cancelButtonText: t('common.cancel'),
      inputPattern: /^[\s\S]*.*\S[\s\S]*$/, // 判断非空，且非空格
      inputErrorMessage: '取消原因不能为空',
    });
    // 发起取消
    await cancelProcessInstance(row.processInstanceId, value);
    createMessage.success(t('common.delSuccessText'));
    reload();
  }

  /** 审批进度 */
  function handleProcessDetail(record: any) {
    router.push(`/hr/manage/OALeaveDetail?processInstanceId=${record.processInstanceId}`);
  }
</script>
<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" :pre-icon="IconEnum.ADD" @click="handleCreate">
          发起请假
        </a-button>
        <a-button type="warning" :preIcon="IconEnum.EXPORT" @click="handleExport">
          {{ t('common.action.export') }}
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: IconEnum.LOG,
                label: '进度',
                onClick: handleProcessDetail.bind(null, record),
              },
              {
                icon: IconEnum.DELETE,
                danger: true,
                label: '取消',
                ifShow: () => {
                  return record.status <= 1;
                },
                onClick: cancelLeave.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </div>
</template>
