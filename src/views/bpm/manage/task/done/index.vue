<script lang="ts" setup>
  import { columns, searchFormSchema } from './done.data';
  import { useI18n } from '@/hooks/web/useI18n';
  import { IconEnum } from '@/enums/appEnum';
  import { BasicTable, useTable, TableAction } from '@/components/Table';

  import * as TaskApi from '@/api/bpm/task';
  import { useRouter } from 'vue-router';

  defineOptions({ name: 'BpmDoneTask' });

  const { t } = useI18n();
  const router = useRouter();

  const [registerTable] = useTable({
    title: '已办任务',
    api: TaskApi.getDoneTaskPage,
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

  /** 查看详情 */
  const handleDetail = (row) => {
    router.push({
      name: 'BpmProcessInstanceDetail',
      query: {
        id: row.id,
      },
    });
  };

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
                label: '详情',
                onClick: handleDetail.bind(null, record),
              },
              {
                icon: IconEnum.EDIT,
                label: '流程',
                onClick: handleAudit.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </div>
</template>
