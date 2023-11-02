<script lang="ts" setup>
  import { reactive, ref, toRaw, UnwrapRef } from 'vue';
  import { Modal } from 'ant-design-vue';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { columns, searchFormSchema } from './codeBuildRule.data';
  import { useI18n } from '@/hooks/web/useI18n';
  // import { useMessage } from '@/hooks/web/useMessage';
  // import { useModal } from '@/components/Modal';
  import { IconEnum } from '@/enums/appEnum';

  import * as CodeBuildRuleApi from '@/api/sys/codeBuildRule';

  defineOptions({ name: 'CodeBuildRule' });

  const { t } = useI18n();
  // const { createConfirm, createMessage } = useMessage();
  // const [registerModal, { openModal }] = useModal();

  const [registerTable, { getForm, reload }] = useTable({
    title: '单据编号规则列表',
    api: CodeBuildRuleApi.getCodeBuildRulePage,
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

  const labelCol = { span: 4 };
  const wrapperCol = { span: 14 };
  const visible = ref<boolean>(false);
  const spinning = ref<boolean>(false);

  const title = ref('新增单据编号规则');

  const showModal = () => {
    visible.value = true;
  };

  const cancel = (e: MouseEvent) => {
    formState.id = '';
    formState.code = '';
    formState.name = '';
    formState.rule = '';
    formState.currentValue = '';
  };

  const handleOk = (e: MouseEvent) => {
    console.log(e);
    formRef.value
      .validate()
      .then(() => {
        // console.log('values', formState, toRaw(formState));
        const formData = toRaw(formState);
        if (formData.id) {
          CodeBuildRuleApi.updateCodeBuildRule(formData);
        } else {
          CodeBuildRuleApi.createCodeBuildRule(formData);
        }
        reload();
        visible.value = false;
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  function handleCreate() {
    title.value = '新增单据编号规则';
    showModal();
  }

  function handleEdit(record) {
    title.value = '修改单据编号规则';
    showModal();
    CodeBuildRuleApi.getCodeBuildRule(record.id).then((res) => {
      formState.id = res.id;
      formState.code = res.code;
      formState.name = res.name;
      formState.rule = res.rule;
      formState.currentValue = res.currentValue;
    });
  }

  function handleDelete(record) {
    Modal.confirm({
      title: '确认操作',
      content: '请确认是否删除此流程数据项？',
      onOk() {
        CodeBuildRuleApi.deleteCodeBuildRule(record.id).then(() => {
          reload();
        });
      },
    });
  }

  interface FormState {
    id: string;
    code: string;
    name: string;
    rule: string;
    currentValue: number;
  }
  const formRef = ref();

  const formState: UnwrapRef<FormState> = reactive({
    id: '',
    code: '',
    name: '',
    rule: '',
    currentValue: 1,
  });
  const rules = {
    code: [
      { required: true, message: '请输入编码', trigger: 'change' },
      { min: 10, max: 32, message: '长度应该在10到32个字符', trigger: 'change' },
    ],
    name: [
      { required: true, message: '请输入名称', trigger: 'change' },
      { min: 2, max: 64, message: '长度应该在2到32个字符', trigger: 'change' },
    ],
    rule: [{ max: 128, message: '长度应该在128个字符以内', trigger: 'blur' }],
  };
</script>
<template>
  <a-spin :spinning="spinning" tip="Loading...">
    <div class="process-box">
      <BasicTable @register="registerTable">
        <template #toolbar>
          <a-button type="primary" :preIcon="IconEnum.ADD" @click="handleCreate"> 添加 </a-button>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <TableAction
              :actions="[
                {
                  icon: IconEnum.EDIT,
                  label: '编辑',
                  onClick: handleEdit.bind(null, record),
                },
                {
                  icon: IconEnum.DELETE,
                  danger: true,
                  label: '删除',
                  onClick: handleDelete.bind(null, record),
                },
              ]"
            />
          </template>
        </template>
      </BasicTable>

      <!-- 单据编码规则弹窗 -->
      <a-modal v-model:visible="visible" :title="title" @ok="handleOk" @cancel="cancel">
        <a-form
          ref="formRef"
          :model="formState"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-item label="编码" name="code">
            <a-input v-model:value="formState.code" />
          </a-form-item>
          <a-form-item label="名称" name="name">
            <a-input v-model:value="formState.name" />
          </a-form-item>
          <a-form-item label="编码规则" name="rule">
            <a-input v-model:value="formState.rule" />
          </a-form-item>
          <a-form-item label="当前值" name="currentValue">
            <a-input-number v-model:value="formState.currentValue" :min="1" :max="999999" />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </a-spin>
</template>
