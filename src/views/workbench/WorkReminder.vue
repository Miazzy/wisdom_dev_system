<template>
  <a-card title="工作安排" :bordered="false">
    <template #extra>
      <span @click="handleRecordView">更多 &gt;</span>
    </template>
    <div class="card-content">
      <div class="table-box">
        <BasicTable @register="registerWorkReminderTable">
          <template #bodyCell="{ text, column, record }">
            <template v-if="column.dataIndex === 'content'">
              <a v-if="record.url" @click="handleView(record)" :title="text">
                {{ text }}
              </a>
              <span v-else :title="text">{{ text }}</span>
            </template>
            <template v-if="column.dataIndex === 'status'">
              <span
                v-if="record.type === 'site_work'"
                :class="statusColors[record.status]"
                style="cursor: pointer"
                @click="handleClick(record)"
                >{{ record.statusText }}</span
              >
              <span v-else :class="statusColors[record.status]">{{ record.statusText }}</span>
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
  </a-card>

  <Dialog
    v-model:visible="modal.open"
    title="工作安排"
    smode="default"
    @ok="handleSuccess"
    @cancel="handleCancel"
    :width="520"
    :height="360"
  >
    <a-form ref="modalFormRef" :model="formState" name="recordForm" autocomplete="off">
      <a-row>
        <a-col v-show="true" :span="24">
          <a-form-item
            label="类型"
            name="typeText"
            :labelCol="{ style: { width: '124px' } }"
            :rules="[{ required: false }]"
          >
            <a-input v-model:value="formState.typeText" :disabled="true" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col v-show="true" :span="24">
          <a-form-item
            label="内容"
            name="content"
            :labelCol="{ style: { width: '124px' } }"
            :rules="[{ required: false }]"
          >
            <a-input v-model:value="formState.content" :disabled="true" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col v-show="true" :span="24">
          <a-form-item
            label="执行时间"
            name="executionTime"
            :labelCol="{ style: { width: '124px' } }"
            :rules="[{ required: true }]"
          >
            <a-time-picker
              v-model:value="formState.executionTime"
              style="width: 100%"
              format="HH:mm"
              value-format="HH:mm"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col v-show="true" :span="24">
          <a-form-item
            label="状态"
            name="status"
            :labelCol="{ style: { width: '124px' } }"
            :rules="[{ required: true, message: '请选择状态！' }]"
          >
            <DictRadioGroup v-model:value="formState.status" :type="`work_record_status`" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </Dialog>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue';
  import dayjs from 'dayjs';
  import { assign } from 'lodash-es';
  import { FormInstance } from 'ant-design-vue';
  import Dialog from '@/components/Framework/Modal/Dialog.vue';
  import { BasicTable, useTable, BasicColumn } from '@/components/Table';
  import DictRadioGroup from '@/components/Framework/Radio/DictRadioGroup.vue';
  import { addTabPage } from '@/utils/route';
  import { SysMessage } from '@/hooks/web/useMessage';
  import { getWorkRecord, getWorkRecordPage, saveWorkRecord } from './data';
  import { MsgManager } from '/@/message/MsgManager';

  const modal = reactive({
    open: ref<boolean>(false),
  });
  const loadingFlag = ref<boolean>(false);
  const modalFormRef = ref<FormInstance>();
  const formState = reactive<any>({});
  const statusColors = {
    '0': 'red-text',
    '1': 'blue-text',
  };

  const tableColumns: BasicColumn[] = [
    {
      title: '类型',
      dataIndex: 'type',
      width: 80,
      customRender: ({ record }) => {
        return record.typeText;
      },
    },
    {
      title: '内容',
      dataIndex: 'content',
      headAlign: 'center',
      align: 'left',
      width: 220,
    },
    {
      title: '时间',
      dataIndex: 'reminderTime',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 60,
    },
  ];

  const getListByParam = async () => {
    const workDate = dayjs().format('YYYY-MM-DD');
    return await getWorkRecordPage({ workDate: workDate });
  };

  const [registerWorkReminderTable, { reload }] = useTable({
    api: getListByParam,
    columns: tableColumns,
    pagination: false,
    striped: false,
    useSearchForm: false,
    showTableSetting: false,
    bordered: false,
    showIndexColumn: true,
    canResize: false,
  });

  const handleSuccess = async () => {
    const value = modalFormRef.value;
    if (value) {
      value.validateFields().then(async () => {
        loadingFlag.value = true;
        await saveWorkRecord(formState)
          .then(() => {
            SysMessage.getInstance().success('保存成功');
            reload();
            modal.open = false;
            loadingFlag.value = false;
          })
          .catch(() => {
            loadingFlag.value = false;
          });
      });
    }
  };

  const handleCancel = () => {
    modal.open = false;
  };

  const handleClick = async (record) => {
    const data = await getWorkRecord(record.workScheduleId, record.stationId);
    if (data.id) {
      assign(formState, data);
      formState.type = record.type;
      formState.typeText = record.typeText;
      formState.content = record.content;
    } else {
      assign(formState, record);
    }
    formState.status = data.status ? String(data.status) : null;
    modal.open = true;
  };

  const handleView = (record) => {
    addTabPage(record.url);
  };

  const handleRecordView = () => {
    addTabPage('/oa/schedule/work/record/index');
  };

  onMounted(() => {
    MsgManager.getInstance().listen('home-page-work-schedule', () => {
      reload();
    });
  });
</script>

<style lang="less" scoped>
  .set-class {
    margin-right: 8px;
    font-size: 17px !important;
  }

  .card-content {
    height: 318px;
    padding: 16px 0;

    :deep(.vben-basic-table .ant-table-wrapper) {
      padding: 0;
    }

    :deep(.ant-table-thead th.text-center) {
      text-align: center !important;
    }

    .table-box {
      height: 286px;
      overflow: hidden;

      .blue-text {
        color: rgb(24 144 255 / 85%);
      }

      .red-text {
        color: rgb(240 3 31 / 85%);
      }

      :deep(.ant-table-body) {
        height: 248px;
      }
    }
  }
</style>
