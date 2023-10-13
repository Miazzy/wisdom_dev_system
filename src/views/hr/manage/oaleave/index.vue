<script lang="ts" setup>
  import { columns, searchFormSchema } from './oaLeave.data';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useMessage } from '@/hooks/web/useMessage';
  import { IconEnum } from '@/enums/appEnum';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { deleteOaLeave, exportOaLeave, getOaLeavePage } from '@/api/hr/oaleave';
  import { useRouter } from 'vue-router';
  import { exportExcelFile } from '@/utils/file/download.ts';

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

  function handleCreate() {
    router.push(`/hr/manage/OALeaveCreate`);
  }

  function handleEdit(record: any) {
    router.push(`/hr/manage/OALeaveCreate?id=${record.id}`);
  }

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

  async function handleDelete(record: any) {
    await deleteOaLeave(record.id);
    createMessage.success(t('common.delSuccessText'));
    reload();
  }
</script>
<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" :preIcon="IconEnum.ADD" @click="handleCreate">
          {{ t('common.action.create') }}
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
                icon: IconEnum.EDIT,
                label: t('common.action.edit'),
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: IconEnum.DELETE,
                danger: true,
                label: t('common.delText'),
                popConfirm: {
                  title: t('common.message.delMessage'),
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </div>
</template>
