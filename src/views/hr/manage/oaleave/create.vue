<script lang="ts" setup>
  import { onMounted, unref } from 'vue';

  import { formSchema, getTypeObj, getTypeOption } from './oaLeave.data';
  import { BasicForm, useForm } from '@/components/Form';
  import { PageWrapper } from '@/components/Page';
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

  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 140,
    baseColProps: { span: 24 },
    schemas: formSchema,
    showResetButton: false,
    submitButtonOptions: { text: t('common.saveText') },
    actionColOptions: { span: 23 },
  });

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
          const obj: Recordable = {};
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

<template>
  <PageWrapper>
    <BasicForm class="mt-10 h-120 w-200" @register="registerForm" @submit="handleSubmit" />
  </PageWrapper>
</template>
