<script lang="ts" setup>
  import { ElMessageBox } from 'element-plus';
  import { columns, searchFormSchema } from './processInstance.data';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useMessage } from '@/hooks/web/useMessage';
  import { IconEnum } from '@/enums/appEnum';
  import { BasicTable, useTable, TableAction } from '@/components/Table';

  import * as ProcessInstanceApi from '@/api/bpm/processInstance';
  import { useRouter } from 'vue-router';

  defineOptions({ name: 'BpmProcessInstance' });

  const { t } = useI18n();
  const router = useRouter();
  const { createMessage } = useMessage();

  const [registerTable, { reload }] = useTable({
    title: '我的流程',
    api: ProcessInstanceApi.getMyProcessInstancePage,
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
    // router.push({
    //   name: 'BpmProcessInstanceDetail',
    //   query: {
    //     id: row.id,
    //   },
    // });
    router.push(`${row.bpmProcessDefinitionRespVO.formCustomViewPath}?processInstanceId=${row.id}`);
  };

  /** 取消按钮操作 */
  const handleCancel = async (row) => {
    // 二次确认
    const { value } = await ElMessageBox.prompt('请输入取消原因', '取消流程', {
      confirmButtonText: t('common.ok'),
      cancelButtonText: t('common.cancel'),
      inputPattern: /^[\s\S]*.*\S[\s\S]*$/, // 判断非空，且非空格
      inputErrorMessage: '取消原因不能为空',
    });
    // 发起取消
    await ProcessInstanceApi.cancelProcessInstance(row.id, value);
    createMessage.success('取消成功');
    // 刷新列表
    await reload();
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
                icon: IconEnum.VIEW,
                label: '详情',
                onClick: handleDetail.bind(null, record),
              },
              {
                icon: IconEnum.DELETE,
                danger: true,
                label: '取消',
                ifShow: () => {
                  return record.result === 1;
                },
                popConfirm: {
                  title: t('common.message.delMessage'),
                  placement: 'left',
                  confirm: handleCancel.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </div>
</template>
