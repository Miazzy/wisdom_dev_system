<template>
  <div class="process-box">
    <!-- 标题 -->
    <BillTitle :options="billTitleOptions" />
    <!-- 表单内容 -->
    <div class="content">
      <div class="left-panel">
        <a-card title="基本信息">
          <a-form :label-col="labelCol" :wrapper-col="wrapperCol" :model="formState">
            <a-form-item label="请假类型" name="type">
              {{ getTypeObj(formState.type)['label'] }}
            </a-form-item>

            <a-form-item label="开始时间" name="startTime">
              {{ formState.startTime }}
            </a-form-item>
            <a-form-item label="结束时间" name="endTime">
              {{ formState.endTime }}
            </a-form-item>
            <a-form-item label="请假事由" name="reason">
              {{ formState.reason }}
            </a-form-item>
          </a-form>
        </a-card>
      </div>
      <div class="right-panel">
        <WfApproveBox
          :processInstanceId="processInstanceId"
          @save="handleSave"
          @end="handleEnd"
          @transfer="handleTransfer"
          @notice="handleNotice"
          @collect="handleCollect"
          @submit="handleSubmit"
          :processStatus="formState.processStatus"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref, toRaw, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { Moment } from 'moment';

  import BillTitle from '/@/components/Framework/BillTitle/BillTitle.vue';
  import WfApproveBox from '/@/components/Framework/WorkFlow/WfApproveBox.vue';
  import { getOaLeave } from '@/api/hr/oaleave';
  import { getTypeObj } from './oaLeave.data';
  import * as ProcessInstanceApi from '@/api/bpm/processInstance';
  import * as TaskApi from '@/api/bpm/task';

  defineOptions({ name: 'OALeaveDetail' });

  const { query } = useRoute();
  const labelCol = { span: 2 };
  const wrapperCol = { span: 12 };
  const billTitleOptions = reactive<any>({});
  billTitleOptions.title = '请假申请';
  billTitleOptions.infoItems = [];

  const processInstanceId = ref([]);

  interface FormState {
    id: string | undefined;
    type: string | undefined;
    startTime: Moment | undefined;
    endTime: Moment | undefined;
    reason: string | undefined;
    processStatus: number | undefined;
  }

  const initialFormState = {
    id: '',
    type: '',
    startTime: undefined,
    endTime: undefined,
    reason: '',
    processStatus: 0,
  };

  let formState = ref<FormState>(initialFormState);

  const getInfo = async () => {
    getOaLeave(formState.value.id).then((res) => {
      formState.value = res;
      const formData = toRaw(formState);
      console.log('values', formData);

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
    });
  };

  /** 初始化 */
  onMounted(async () => {
    processInstanceId.value = query.processInstanceId as unknown as string;
    const processInstance = await ProcessInstanceApi.getProcessInstance(processInstanceId.value);
    formState.value.id = processInstance.businessKey;

    setTimeout(async () => {
      await getInfo();
    }, 10);
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
