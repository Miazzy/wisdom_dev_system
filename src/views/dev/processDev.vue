<template>
  <div class="search-box" style="width: calc(100% - 20px); height: calc(100% - 20px); margin: 10px">
    <!-- 标题 -->
    <BillTitle :options="billTitleOptions" />
    <br />
    <!-- 表单内容 -->
    <!-- <BasicForm class="mt-10 h-120 w-200" @register="registerForm" @submit="handleSubmit" /> -->

    <div style="width: 75%; float: left; border: 1px solid #c0c0c0; padding: 5px 0px">
      <a-form :layout="formState.layout" :model="formState" v-bind="formItemLayout">
        <a-form-item label="Form Layout">
          <a-radio-group v-model:value="formState.layout">
            <a-radio-button value="horizontal">Horizontal</a-radio-button>
            <a-radio-button value="vertical">Vertical</a-radio-button>
            <a-radio-button value="inline">Inline</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="Field A">
          <a-input v-model:value="formState.fieldA" placeholder="input placeholder" />
        </a-form-item>
        <a-form-item label="Field B">
          <a-input v-model:value="formState.fieldB" placeholder="input placeholder" />
        </a-form-item>
        <a-form-item :wrapper-col="buttonItemLayout.wrapperCol" style="display:none">
          <a-button type="primary">Submit</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, onMounted, reactive, unref, UnwrapRef } from 'vue';
  import BillTitle from '/@/components/Framework/BillTitle/BillTitle.vue';
  import { formSchema, getTypeObj, getTypeOption } from './oaLeave.data';
  import { BasicForm, useForm } from '@/components/Form';
  import { createOaLeave, getOaLeave, updateOaLeave } from '@/api/hr/oaleave';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useRouter } from 'vue-router';

  defineOptions({ name: 'LeaveCreate' });
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const router = useRouter();
  const { currentRoute } = router;
  const route = unref(currentRoute);
  const query = route.query;

  interface FormState {
    layout: 'horizontal' | 'vertical' | 'inline';
    fieldA: string;
    fieldB: string;
  }
  const formState: UnwrapRef<FormState> = reactive({
    layout: 'horizontal',
    fieldA: '',
    fieldB: '',
  });
  const formItemLayout = computed(() => {
    const { layout } = formState;
    return layout === 'horizontal'
      ? {
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
        }
      : {};
  });
  const buttonItemLayout = computed(() => {
    const { layout } = formState;
    return layout === 'horizontal'
      ? {
          wrapperCol: { span: 14, offset: 4 },
        }
      : {};
  });

  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 140,
    baseColProps: { span: 24 },
    schemas: formSchema,
    showResetButton: false,
    submitButtonOptions: { text: t('common.saveText') },
    actionColOptions: { span: 23 },
  });

  const billTitleOptions = reactive<any>({});
  billTitleOptions.title = '请假申请';
  billTitleOptions.infoItems = [
    {
      key: 'billCode',
      label: '单据编号',
      value: 'DZSSDL-202308110001',
      position: 'left',
    },
    {
      key: 'fillinDate',
      label: '制单日期',
      value: '2023-08-11 13:38',
      position: 'center',
    },
    {
      key: 'createPerson',
      label: '创建人',
      value: '软件部.管理员',
      position: 'right',
    },
  ];

  async function handleSubmit() {
    try {
      const values = await validate();
      const typeObj = getTypeOption(values.type);
      values['type'] = typeObj['value'];
      if (query.id) {
        values.id = query.id;
        await updateOaLeave(values);
      } else {
        await createOaLeave(values);
      }
    } finally {
      createMessage.success(t('common.saveSuccessText'));
      router.push('/hr/manage/oaleave');
    }
  }

  const getRecordable = async () => {
    if (query.id) {
      await getOaLeave(query.id)
        .then((res) => {
          const obj: any = {};
          formSchema.forEach((item) => {
            obj[item.field] = res.result[item.field];
          });
          const typeObj = getTypeObj(obj.type);

          obj['type'] = typeObj['label'];
          setFieldsValue(obj);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  onMounted(async () => {
    if (query.id) {
      await getRecordable();
    } else {
      resetFields();
    }
  });
</script>
