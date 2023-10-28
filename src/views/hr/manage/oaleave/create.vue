<template>
  <div class="load">
    <a-spin :spinning="formState.spinning" tip="Loading...">
      <div class="process-box">
        <!-- 标题 -->
        <BillTitle :options="billTitleOptions" />
        <!-- 表单内容 -->
        <div class="content">
          <div class="left-panel">
            <a-card title="基本信息">
              <a-form
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                ref="formRef"
                :model="formState"
                :rules="rules"
              >
                <a-form-item label="请假类型" name="type">
                  <a-select
                    v-model:value="formState.type"
                    allowClear
                    :options="typeData"
                    placeholder="请选择请假类型"
                    :disabled="formState.status != 0"
                  >
                    <!-- <a-select-option value="1">病假</a-select-option>
                    <a-select-option value="2">事假</a-select-option>
                    <a-select-option value="3">婚假</a-select-option> -->
                  </a-select>
                </a-form-item>

                <a-form-item label="开始时间" name="startTime">
                  <a-date-picker
                    v-model:value="formState.startTime"
                    :show-time="{ format: 'HH:mm:mm' }"
                    valueFormat="YYYY-MM-DD HH:mm:mm"
                    placeholder="请选择"
                    :disabled="formState.status != 0"
                  />
                </a-form-item>
                <a-form-item label="结束时间" name="endTime">
                  <a-date-picker
                    v-model:value="formState.endTime"
                    :show-time="{ format: 'HH:mm:mm' }"
                    valueFormat="YYYY-MM-DD HH:mm:mm"
                    placeholder="请选择"
                    :disabled="formState.status != 0"
                  />
                </a-form-item>
                <a-form-item label="请假事由" name="reason">
                  <a-textarea v-model:value="formState.reason" :disabled="formState.status != 0" />
                </a-form-item>
              </a-form>
            </a-card>
          </div>
          <div class="right-panel">
            <WfApproveBox
              @save="onSave"
              @submit="onSubmit"
              :processStatus="formState.status"
              :processInstanceId="processInstanceId"
            />
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>
<script lang="ts" setup>
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import { Moment } from 'moment';
  import { reactive, ref, toRaw, UnwrapRef, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import { useRouter, useRoute } from 'vue-router';

  import BillTitle from '/@/components/Framework/BillTitle/BillTitle.vue';
  import WfApproveBox from '/@/components/Framework/WorkFlow/WfApproveBox.vue';
  import { createOaLeave, getOaLeave } from '@/api/hr/oaleave';
  import * as ProcessInstanceApi from '@/api/bpm/processInstance';

  defineOptions({ name: 'OALeaveCreate' });

  const router = useRouter();
  const { query } = useRoute();
  const labelCol = { span: 2 };
  const wrapperCol = { span: 12 };
  const billTitleOptions = reactive<any>({});
  billTitleOptions.title = '请假申请';
  billTitleOptions.infoItems = [];

  const typeData: any = ref([]);
  const processInstanceId = ref(null);

  interface FormState {
    type: string | undefined;
    startTime: Moment | undefined;
    endTime: Moment | undefined;
    reason: string | undefined;
    status: number | 0;
    spinning: boolean;
  }

  const formRef = ref();
  const formState: UnwrapRef<FormState> = reactive({
    id: '',
    type: '',
    startTime: undefined,
    endTime: undefined,
    reason: '',
    status: 0,
    spinning: false,
  });
  const rules = {
    type: [{ required: true, message: '请选择请假类型', trigger: 'change' }],
    startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
    endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
    reason: [{ required: true, message: '请输入请假事由', trigger: 'blur' }],
  };

  const onSave = () => {
    doSave(0);
  };

  const onSubmit = () => {
    formRef.value
      .validate()
      .then(() => {
        const formData = toRaw(formState);
        const isCompare = compareDate(formData.endTime, formData.startTime);
        if (!isCompare) {
          warning('请确认开始时间和结束时间。');
          return;
        }
        doSave(1);
      })
      .catch((error: ValidateErrorEntity<FormState>) => {
        console.log('onSubmit=》error', error);
      });
  };

  const doSave = async (status) => {
    formState.spinning = true;
    try {
      const formData = toRaw(formState);
      formData['status'] = status;
      console.log('formData', formData);
      await createOaLeave(formData);
      success(status == 1 ? '提交成功。' : '保存成功');
      router.push('/hr/manage/oaleave');
    } catch (error) {
      console.log('error', error);
    } finally {
      formState.spinning = false;
    }
  };

  const getInfo = async () => {
    getOaLeave(formState.id).then((res) => {
      formState.type = res['type'] + '';
      formState.startTime = res['startTime'];
      formState.endTime = res['endTime'];
      formState.reason = res['reason'];
      formState.status = res.status;

      if (formState.status > 0) {
        billTitleOptions.infoItems.push({
          key: 'billCode',
          label: '单据编号',
          value: res.billCode,
          position: 'left',
        });
        billTitleOptions.infoItems.push({
          key: 'fillinDate',
          label: '制单日期',
          value: res.fillinDate,
          position: 'center',
        });
        billTitleOptions.infoItems.push({
          key: 'createPerson',
          label: '创建人',
          value: res.deptName + '.' + res.personMemberName,
          position: 'right',
        });
      }
    });
  };

  /** 初始化 */
  onMounted(async () => {
    typeData.value.push({ label: '病假', value: '1' });
    typeData.value.push({ label: '事假', value: '2' });
    typeData.value.push({ label: '婚假', value: '3' });

    if (query.processInstanceId) {
      processInstanceId.value = query.processInstanceId as unknown as string;
      ProcessInstanceApi.getProcessInstance(processInstanceId.value).then((res) => {
        formState.id = res.businessKey;
        getInfo();
      });
    }
  });

  const compareDate = (d1, d2) => {
    let date1 = new Date(Date.parse(d1));
    let date2 = new Date(Date.parse(d2));
    return date1 > date2;
  };

  const warning = (content) => {
    message.warning(content);
  };

  const success = (content) => {
    message.success(content);
  };
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
