<template>
  <BasicTable @register="registerTable">
    <template #toolbar>
      <a-button type="primary" @click="openForm('create')"> 新建流程 </a-button>
      <a-button type="primary" @click="importForm"> 导入流程 </a-button>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <TableAction
          :actions="[
            {
              label: '修改流程',
              onClick: openForm.bind(null, 'update', record.id),
            },
            {
              label: '设计流程',
              onClick: handleDesign.bind(null, record),
            },
            {
              label: '分配规则',
              onClick: handleAssignRule.bind(null, record),
            },
            {
              label: '发布流程',
              onClick: handleDeploy.bind(null, record),
            },
            {
              label: '流程定义',
              onClick: handleDefinitionList.bind(null, record),
            },
            {
              label: '删除',
              onClick: handleDelete.bind(null, record.id),
            },
          ]"
        />
      </template>
      <template v-else-if="column.dataIndex === 'name'">
        <a-button type="link" @click="handleBpmnDetail(record)">{{ record.name }}</a-button>
      </template>

      <template v-else-if="column.dataIndex === 'category'">
        <a-tag v-if="record.processDefinition" color="processing">{{
          record.category === '1' ? '默认' : 'OA'
        }}</a-tag>
      </template>

      <template v-else-if="column.dataIndex === 'formCustomCreatePath'">
        <a-button v-if="record.formType === 10" type="link" @click="handleFormDetail(record)">{{
          record.formName
        }}</a-button>
        <a-button
          v-else-if="record.formType === 20"
          type="link"
          @click="handleFormDetail(record)"
          >{{ record.formCustomCreatePath }}</a-button
        >
        <label v-else>暂无表单</label>
      </template>

      <template v-else-if="column.dataIndex === 'suspensionState'">
        <a-switch
          v-if="record.processDefinition"
          :checked="getChecked(record)"
          @change="handleChangeState(record)"
        />
      </template>

      <template v-else-if="column.dataIndex === 'version'">
        <a-tag v-if="record.processDefinition" color="processing"
          >v{{ record.processDefinition.version }}</a-tag
        >
        <a-tag v-else color="warning">未部署</a-tag>
      </template>
    </template>
  </BasicTable>

  <!-- 表单弹窗：添加/修改流程 -->
  <FormDialog ref="formDialogRef" @success="reload" v-model:visible="formDialogVisible" />

  <!-- 表单弹窗：导入流程 -->
  <ImportDialog ref="importDialogRef" @success="reload" v-model:visible="importDialogVisible" />

  <!-- 弹窗：表单详情 -->
  <Dialog
    title="表单详情"
    v-model:visible="formDetailVisible"
    :width="800"
    :height="800"
    :overflowY="'scroll'"
    :showBtm="false"
  >
    <form-create :rule="formDetailPreview.rule" :option="formDetailPreview.option" />
  </Dialog>

  <!-- 弹窗：流程模型图的预览 -->
  <Dialog
    title="流程图"
    v-model:visible="bpmnDetailVisible"
    :width="800"
    :height="800"
    :overflowY="'scroll'"
    :overflowX="'scroll'"
    :showBtm="false"
  >
    <MyProcessViewer
      key="designer"
      v-model="bpmnXML"
      :value="bpmnXML"
      v-bind="bpmnControlForm"
      :prefix="bpmnControlForm.prefix"
    />
  </Dialog>
</template>
<script lang="ts" setup>
  import { reactive, ref, toRaw, onMounted } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { useRouter } from 'vue-router';
  import { columns, searchFormSchema } from './workflow';
  import * as ModelApi from '@/api/bpm/model';

  import Dialog from '@/components/Framework/Modal/Dialog.vue';
  import FormDialog from './formDialog.vue';
  import ImportDialog from './importDialog.vue';
  import { MyProcessViewer } from '@/components/Bpm/package';

  const { t } = useI18n();
  const router = useRouter();
  const message = useMessage(); // 消息弹窗

  const [registerTable, { reload }] = useTable({
    title: '流程模型',
    api: ModelApi.getModelPage,
    columns,
    formConfig: { labelWidth: 120, schemas: searchFormSchema },
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    actionColumn: {
      width: 400,
      title: t('common.operate'),
      dataIndex: 'action',
      fixed: 'right',
    },
  });

  const getChecked = (record) => {
    if (record.processDefinition.suspensionState === 1) {
      return true;
    }
    return false;
  };

  /** 流程图的详情按钮操作 */
  const bpmnDetailVisible = ref(false);
  const bpmnXML = ref('');
  const bpmnControlForm = ref({
    prefix: 'flowable',
  });

  /** 流程表单的详情按钮操作 */
  const formDetailVisible = ref(false);
  const formDetailPreview = ref({
    rule: [],
    option: {},
  });

  const importDialogVisible = ref(false);
  /** 导入流程操作 */
  const importDialogRef = ref();
  const importForm = () => {
    importDialogVisible.value = true;
    importDialogRef.value.open();
  };

  const formDialogVisible = ref(false);
  /** 添加/修改操作 */
  const formDialogRef = ref();
  const openForm = (type: string, id?: number) => {
    formDialogVisible.value = true;
    formDialogRef.value.open(type, id);
  };

  // 执行删除流程记录操作
  const handleDelete = async (id) => {
    try {
      // 删除的二次确认
      await message.delConfirm(`请确认是否删除此流程数据项？`);
      // 调用集维后端接口，删除流程相应数据 TODO
      ModelApi.deleteModel(id).then(() => {
        // 刷新列表
        reload();
      });
    } catch (e) {
      console.error(e);
    }
  };

  //  设置流程激活状态
  const handleChangeState = async (row) => {
    const state = row.processDefinition.suspensionState;
    try {
      // 修改状态的二次确认
      const id = row.id;
      const statusState = state === 1 ? '激活' : '挂起';
      const content = '请确认是否' + statusState + '流程名字为"' + row.name + '"的数据项?';
      // 确认是否更新流程激活状态
      await message.confirm(content);
      // 调用集维后端接口，激活该流程状态 TODO
      // 刷新列表
      await reload();
    } catch {
      // 取消后，进行恢复按钮
      row.processDefinition.suspensionState = state === 1 ? 2 : 1;
    }
  };

  // 执行部署流程/发布流程操作
  const handleDeploy = async (row) => {
    try {
      // 删除的二次确认
      await message.confirm('请确认是否部署该流程？');
      ModelApi.deployModel(row.id).then(() => {
        // 刷新列表
        reload();
      });
    } catch (e) {
      console.error(e);
    }
  };

  /** 设计流程 */
  const handleDesign = (row) => {
    router.push(`/bpm/manage/wfeditor?modelId=${row.id}`);
  };

  /** 点击任务分配按钮 */
  const handleAssignRule = (row) => {
    router.push(`/bpm/manage/wftaskAssignRule?modelId=${row.id}`);
  };

  /** 跳转到指定流程定义列表 */
  const handleDefinitionList = (row) => {
    router.push(`/bpm/manage/wftaskDefinition?key=${row.key}&modelId=${row.id}`);
  };

  const handleFormDetail = async (row) => {
    if (row.formType == 10) {
      // 设置表单
      const data = {};
      // 弹窗打开
      formDetailVisible.value = true;
    } else {
      router.push({
        path: row.formCustomCreatePath,
      });
    }
  };

  const handleBpmnDetail = async (row) => {
    bpmnDetailVisible.value = true;
    ModelApi.getModel(row.id).then((data) => {
      bpmnXML.value = data.bpmnXml;
    });
  };
</script>
