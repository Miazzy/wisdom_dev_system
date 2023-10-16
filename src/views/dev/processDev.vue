<template>
  <div class="process-box">
    <!-- 标题 -->
    <BillTitle :options="billTitleOptions" />
    <!-- 表单内容 -->
    <div class="content">
      <div class="left-panel">
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
          <a-form-item label="Field C">
            <a-input v-model:value="formState.fieldC" placeholder="input placeholder" />
          </a-form-item>
          <a-form-item label="Field D">
            <a-input v-model:value="formState.fieldD" placeholder="input placeholder" />
          </a-form-item>
          <a-form-item label="Field E">
            <a-input v-model:value="formState.fieldE" placeholder="input placeholder" />
          </a-form-item>
          <a-form-item label="Field F">
            <a-input v-model:value="formState.fieldF" placeholder="input placeholder" />
          </a-form-item>
          <a-form-item :wrapper-col="buttonItemLayout.wrapperCol" style="display: none">
            <a-button type="primary">Submit</a-button>
          </a-form-item>
        </a-form>
      </div>
      <div class="right-panel">
        <!-- 审批按钮 -->
        <div class="button-content" style="">
          <Button @click="handleSave" type="primary">保存</Button>
          <Button @click="handleSubmit" type="primary">提交</Button>
          <Button @click="handleCollect">收藏</Button>
          <Button @click="handleOpenApprovalDrawer">审批</Button>
        </div>

        <!-- 流程审批抽屉组件 -->
        <ApprovalDrawer
          @register="approvalDrawerRegister"
          :flowData="flowData"
          @agree="handleAgree"
          @reject="handleReject"
          @save="handleSave"
          @end="handleEnd"
          @transfer="handleTransfer"
          @notice="handleNotice"
          @collect="handleCollect"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, onMounted, reactive, ref, unref, UnwrapRef } from 'vue';
  import BillTitle from '/@/components/Framework/BillTitle/BillTitle.vue';
  import { formSchema, getTypeObj, getTypeOption } from './oaLeave.data';
  import { BasicForm, useForm } from '@/components/Form';
  import { useDrawer } from '/@/components/Drawer';
  import { createOaLeave, getOaLeave, updateOaLeave } from '@/api/hr/oaleave';
  import { Button } from 'ant-design-vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useRouter } from 'vue-router';
  import ApprovalDrawer from '/@/components/Framework/ApprovalDrawer/ApprovalDrawer.vue';

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
    fieldC: string;
    fieldD: string;
    fieldE: string;
    fieldF: string;
  }
  const formState: UnwrapRef<FormState> = reactive({
    layout: 'horizontal',
    fieldA: '',
    fieldB: '',
    fieldC: '',
    fieldD: '',
    fieldE: '',
    fieldF: '',
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

  const [approvalDrawerRegister, { openDrawer: openApprovalDrawer }] = useDrawer();

  const flowData = ref([]);
  // 获取流程节点数据
  async function queryFlowNodeList() {
    const flowNodeList = JSON.parse(
      '[{"id":"fa4b117c-5395-11ee-b5c1-480fcf57f666","name":"总经理审批","claimTime":null,"createTime":"2023-09-15 15:03:31","suspensionState":null,"processInstance":{"id":"0e1ab04c-5390-11ee-b5c1-480fcf57f666","name":"业务报销","startUserId":129,"startUserNickname":"宋彪","processDefinitionId":"BMProc:1:c38d2a4b-4886-11ee-8c22-480fcf57f666"},"endTime":null,"durationInMillis":null,"result":1,"reason":null,"definitionKey":"Activity_1ge9o3y","assigneeUser":{"id":128,"nickname":"饶勇","deptId":138,"deptName":"总经办"}},{"id":"6186a3a5-5395-11ee-b5c1-480fcf57f666","name":"财务部负责人审批","claimTime":null,"createTime":"2023-09-15 14:59:15","suspensionState":null,"processInstance":{"id":"0e1ab04c-5390-11ee-b5c1-480fcf57f666","name":"业务报销","startUserId":129,"startUserNickname":"宋彪","processDefinitionId":"BMProc:1:c38d2a4b-4886-11ee-8c22-480fcf57f666"},"endTime":"2023-09-15 15:03:31","durationInMillis":256225,"result":2,"reason":"同意。","definitionKey":"Activity_12fthtb","assigneeUser":{"id":130,"nickname":"曾宁若","deptId":139,"deptName":"财务部"}},{"id":"63d8cdd0-5391-11ee-b5c1-480fcf57f666","name":"部门领导审批","claimTime":null,"createTime":"2023-09-15 14:30:41","suspensionState":null,"processInstance":{"id":"0e1ab04c-5390-11ee-b5c1-480fcf57f666","name":"业务报销","startUserId":129,"startUserNickname":"宋彪","processDefinitionId":"BMProc:1:c38d2a4b-4886-11ee-8c22-480fcf57f666"},"endTime":"2023-09-15 14:59:15","durationInMillis":1714085,"result":2,"reason":"同意。","definitionKey":"Activity_0zvw3s2","assigneeUser":{"id":126,"nickname":"刘超","deptId":136,"deptName":"技术中心"}},{"id":"4b70bf0b-5390-11ee-b5c1-480fcf57f666","name":"财务部负责人审批","claimTime":null,"createTime":"2023-09-15 14:22:50","suspensionState":null,"processInstance":{"id":"0e1ab04c-5390-11ee-b5c1-480fcf57f 666","name":"业务报销","startUserId":129,"startUserNickname":"宋彪","processDefinitionId":"BMProc:1:c38d2a4b-4886-11ee-8c22-480fcf57f666"},"endTime":"2023-09-15 14:30:41","durationInMillis":470436,"result":4,"reason":"Change activity to Activity_0zvw3s2","definitionKey":"Activity_12fthtb","assigneeUser":{"id":130,"nickname":"曾宁若","deptId":139,"deptName":"财务部"}},{"id":"0e202e9c-5390-11ee-b5c1-480fcf57f666","name":"部门领导审批","claimTime":null,"createTime":"2023-09-15 14:21:07","suspensionState":null,"processInstance":{"id":"0e1ab04c-5390-11ee-b5c1-480fcf57f666","name":"业务报销","startUserId":129,"startUserNickname":"宋彪","processDefinitionId":"BMProc:1:c38d2a4b-4886-11ee-8c22-480fcf57f666"},"endTime":"2023-09-15 14:22:50","durationInMillis":102859,"result":2,"reason":"测试打回。","definitionKey":"Activity_0zvw3s2","assigneeUser":{"id":126,"nickname":"刘超","deptId":136,"deptName":"技术中心"}}]',
    );
    flowData.value = flowNodeList;
  }

  // 打开流程审批抽屉
  function handleOpenApprovalDrawer() {
    openApprovalDrawer(true);
    queryFlowNodeList();
  }

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

  const handleAgree = (flowData) => {
    console.log('同意', flowData);
  };

  const handleReject = (flowData) => {
    console.log('驳回', flowData);
  };

  const handleSave = (flowData) => {
    console.log('保存', flowData);
  };

  const handleEnd = (flowData) => {
    console.log('终止', flowData);
  };

  const handleTransfer = (flowData) => {
    console.log('转办', flowData);
  };

  const handleNotice = (flowData) => {
    console.log('知会', flowData);
  };

  const handleCollect = (flowData) => {
    console.log('收藏', flowData);
  };

  onMounted(async () => {
    if (query.id) {
      await getRecordable();
    } else {
      resetFields();
    }
  });
</script>
<style lang="less" scoped>
  .process-box {
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    margin: 10px;

    .content {
      background: #fefefe;
      .left-panel {
        width: 77.5%;
        float: left;
        background: #fefefe;
        border: 1px solid #f0f0f0;
        margin: 5px 0px;
        padding: 10px 0px 5px 0px;
        height: calc(100vh - 200px);
      }
      .right-panel {
        width: 22.25%;
        float: right;
        background: #fefefe;
        border: 1px solid #f0f0f0;
        margin: 5px 0px;
        padding: 10px 0px 5px 0px;
        height: calc(100vh - 200px);

        .button-content {
          margin: 16px 0 0 16px;
          .ant-btn {
            margin: 0px 10px 0px 0px;
          }
        }
      }
    }
  }
</style>
