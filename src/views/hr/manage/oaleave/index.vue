<script lang="ts" setup>
  import { columns, searchFormSchema } from './oaLeave.data';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useGo } from '@/hooks/web/usePage';
  import { useMessage } from '@/hooks/web/useMessage';
  import { IconEnum } from '@/enums/appEnum';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { deleteOaLeave, exportOaLeave, getOaLeavePage } from '@/api/hr/oaleave';

  defineOptions({ name: 'OaLeave' });

  const { t } = useI18n();
  const go = useGo();
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
    go({ name: 'OALeaveCreate' });
  }

  function handleEdit(record: Recordable) {
    go({
      name: 'OALeaveCreate',
      query: {
        id: record.id,
      },
    });
  }

  async function handleExport() {
    createConfirm({
      title: t('common.exportTitle'),
      iconType: 'warning',
      content: t('common.message.exportMessage'),
      async onOk() {
        await exportOaLeave(getForm().getFieldsValue()).then((res) => {
          //这里res.data是返回的blob对象
          var blob = new Blob([res.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
          }); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
          var downloadElement = document.createElement('a');
          var href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download = 'OA 请假申请.xls'; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        });
        createMessage.success(t('common.exportSuccessText'));
      },
    });
  }

  async function handleDelete(record: Recordable) {
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
