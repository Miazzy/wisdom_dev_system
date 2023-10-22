<script lang="ts" setup>
  import { columns, searchFormSchema } from './todo.data';
  import { useI18n } from '@/hooks/web/useI18n';
  import { IconEnum } from '@/enums/appEnum';
  import { BasicTable, useTable, TableAction } from '@/components/Table';

  import * as TaskApi from '@/api/bpm/task';
  import { useRouter } from 'vue-router';

  defineOptions({ name: 'BpmToDoTask' });

  const { t } = useI18n();
  const router = useRouter();

  const [registerTable] = useTable({
    title: '待办任务',
    api: TaskApi.getTodoTaskPage,
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

  /** 处理审批按钮 */
  const handleAudit = (row) => {
    // router.push({
    //   name: 'BpmProcessInstanceDetail',
    //   query: {
    //     id: row.processInstance.id,
    //   },
    // });
    router.push(`/hr/manage/OALeaveDetail?processInstanceId=${row.processInstance.id}`);
  };
</script>
<template>
  <div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: IconEnum.EDIT,
                label: '审批进度',
                onClick: handleAudit.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </div>
</template>
