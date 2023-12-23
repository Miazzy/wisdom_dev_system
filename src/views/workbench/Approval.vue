<template>
  <a-card title="流程审批" :bordered="false">
    <template #extra>
      <span @click="toMorePage">更多 &gt;</span>
    </template>
    <div class="card-content">
      <a-tabs v-model:activeKey="activeKey" @change="handleTabChange">
        <a-tab-pane v-for="(item, index) in tabList" :key="item.key">
          <template #tab>
            <a-badge
              :count="item.count"
              :offset="[16, -12]"
              :numberStyle="{ transform: 'scale(0.9)' }"
            >
              <span class="tab-text">
                {{ item.tab }}
              </span>
            </a-badge>
          </template>
          <div class="table-box">
            <BasicTable @register="tableList[index]" :scroll="{ y: 248 }">
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'action'">
                  <TableAction
                    :actions="[
                      {
                        label: '查看',
                        onClick: handleCheck.bind(null, record),
                      },
                    ]"
                  />
                </template>
              </template>
            </BasicTable>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { assign } from 'lodash-es';
  import { useRouter } from 'vue-router';
  import { BasicTable, useTable, TableAction, BasicColumn } from '/@/components/Table';
  import * as TaskApi from '@/api/bpm/task';
  import * as ProcessInstanceApi from '@/api/bpm/processInstance';
  import { useUserStore } from '/@/store/modules/user';

  const router = useRouter();
  const userStore = useUserStore();
  const getUserInfo = userStore.getUserInfo;

  // tab
  const tabList = ref([
    {
      key: '1',
      tab: '待处理',
      count: 0,
    },
    {
      key: '2',
      tab: '待阅读',
      count: 0,
    },
    {
      key: '3',
      tab: '我发起',
      count: 0,
    },
    {
      key: '4',
      tab: '已处理',
      count: 0,
    },
  ]);
  const activeKey = ref('1');
  const handleTabChange = (item) => {
    if (item === '1') {
      doTodo();
    } else if (item === '2') {
      doCC();
    } else if (item === '3') {
      doMy();
    } else if (item === '4') {
      doDone();
    }
  };

  const toMorePage = () => {
    if (activeKey.value == '1') {
      router.push(`/bpm/task/todo`);
    } else if (activeKey.value == '2') {
      router.push(`/bpm/task/todo`);
    } else if (activeKey.value == '3') {
      router.push(`/bpm/task/processInstance`);
    } else if (activeKey.value == '4') {
      router.push(`/bpm/task/done`);
    }
  };

  // table
  const tableColumns: BasicColumn[] = [
    {
      title: '标题',
      dataIndex: 'title',
      width: 220,
      align: 'left',
      customHeaderCell: (column) => {
        return {
          class: 'text-center',
        };
      },
    },
    {
      title: '流程名称',
      dataIndex: 'flowName',
      width: 100,
    },
    {
      title: '申请部门',
      dataIndex: 'dept',
      width: 120,
    },
    {
      title: '申请人',
      dataIndex: 'person',
      width: 120,
    },
    {
      title: '申请时间',
      dataIndex: 'time',
      width: 200,
    },
  ];
  const detailTableProps = {
    pagination: false,
    striped: false,
    useSearchForm: false,
    showTableSetting: false,
    bordered: false,
    showIndexColumn: true,
    canResize: false,
    actionColumn: {
      width: 140,
      title: '操作',
      dataIndex: 'action',
    },
  };
  const tableDataSource1 = ref([
    // {
    //   title: '升压站楼梯有锈迹',
    //   flowName: '待处理',
    //   dept: '江苏如东电站',
    //   person: '李木林',
    //   time: '2023-06-28 10:44:06',
    // },
  ]);
  const tableDataSource2 = ref([
    // {
    //   title: '升压站楼梯有锈迹',
    //   flowName: '待阅读',
    //   dept: '江苏如东电站',
    //   person: '李木林',
    //   time: '2023-06-28 10:44:06',
    // },
  ]);
  const tableDataSource3 = ref([
    // {
    //   title: '升压站楼梯有锈迹',
    //   flowName: '我发起',
    //   dept: '江苏如东电站',
    //   person: '李木林',
    //   time: '2023-06-28 10:44:06',
    // },
  ]);
  const tableDataSource4 = ref([
    // {
    //   title: '升压站楼梯有锈迹',
    //   flowName: '已处理',
    //   dept: '江苏如东电站',
    //   person: '李木林',
    //   time: '2023-06-28 10:44:06',
    // },
  ]);
  const [registerApprovalTable1] = useTable(
    assign(
      {
        dataSource: tableDataSource1,
        columns: tableColumns,
      },
      detailTableProps,
    ),
  );
  const [registerApprovalTable2] = useTable(
    assign(
      {
        dataSource: tableDataSource2,
        columns: tableColumns,
      },
      detailTableProps,
    ),
  );
  const [registerApprovalTable3] = useTable(
    assign(
      {
        dataSource: tableDataSource3,
        columns: tableColumns,
      },
      detailTableProps,
    ),
  );
  const [registerApprovalTable4] = useTable(
    assign(
      {
        dataSource: tableDataSource4,
        columns: tableColumns,
      },
      detailTableProps,
    ),
  );

  const tableList = ref([
    registerApprovalTable1,
    registerApprovalTable2,
    registerApprovalTable3,
    registerApprovalTable4,
  ]);
  // 查看
  const handleCheck = (record) => {
    if (activeKey.value == '2') {
      TaskApi.updateCcTo(record.processInstanceId).then((res) => {
        if (res.result) {
          doCC();
          router.push(`${record.viewPath}?processInstanceId=${record.processInstanceId}`);
        }
      });
    } else {
      router.push(`${record.viewPath}?processInstanceId=${record.processInstanceId}`);
    }
  };

  const doTodo = async () => {
    //待处理
    const getTodoTask = await TaskApi.getTodoTaskPage();
    tableDataSource1.value.splice(0, tableDataSource1.value.length);
    if (getTodoTask) {
      tabList.value[0].count = getTodoTask.total;
      getTodoTask.list.forEach((element) => {
        tableDataSource1.value.push({
          title: element.name,
          flowName: element.processInstance.name,
          dept: element.processInstance.deptName,
          person: element.processInstance.startUserNickname,
          time: element.createTime,
          viewPath: element.bpmProcessDefinitionRespVO.formCustomCreatePath,
          processInstanceId: element.processInstance.id,
        });
      });
    }
  };

  const doCC = async () => {
    //待阅读
    const getCCTaskPage = await TaskApi.getTodoCCPage();
    tableDataSource2.value.splice(0, tableDataSource2.value.length);
    if (getCCTaskPage) {
      tabList.value[1].count = getCCTaskPage.total;
      getCCTaskPage.list.forEach((element) => {
        tableDataSource2.value.push({
          title: element.name,
          flowName: element.processInstance.name,
          dept: element.processInstance.deptName,
          person: element.processInstance.startUserNickname,
          time: element.createTime,
          viewPath: element.bpmProcessDefinitionRespVO.formCustomCreatePath,
          processInstanceId: element.processInstance.id,
        });
      });
    }
  };

  const doMy = async () => {
    //我发起
    const getMyProcessInstancePage = await ProcessInstanceApi.getMyProcessInstancePage();
    if (getMyProcessInstancePage) {
      getMyProcessInstancePage.list.forEach((element) => {
        tableDataSource3.value.push({
          title: element.name,
          flowName: element.name,
          dept: element.deptName,
          person: getUserInfo.username,
          time: element.createTime,
          viewPath: element.bpmProcessDefinitionRespVO.formCustomCreatePath,
          processInstanceId: element.id,
        });
      });
    }
  };

  const doDone = async () => {
    //已处理
    const getDoneTaskPage = await TaskApi.getDoneTaskPage();
    if (getDoneTaskPage) {
      getDoneTaskPage.list.forEach((element) => {
        tableDataSource4.value.push({
          title: element.name,
          flowName: element.processInstance.name,
          dept: element.processInstance.deptName,
          person: element.processInstance.startUserNickname,
          time: element.createTime,
          viewPath: element.bpmProcessDefinitionRespVO.formCustomCreatePath,
          processInstanceId: element.processInstance.id,
        });
      });
    }
  };

  /** 初始化 */
  onMounted(async () => {
    doTodo();
    doCC();
  });
</script>

<style lang="less" scoped>
  .card-content {
    height: 360px;
    :deep(.ant-tabs-tab) {
      padding-left: 0;
      padding-right: 0;
    }
    :deep(.ant-tabs-top > .ant-tabs-nav::before) {
      border-bottom-color: transparent;
    }
    :deep(.vben-basic-table .ant-table-wrapper) {
      padding: 0;
    }
    :deep(.vben-basic-table-action .ant-btn-sm) {
      & > span {
        font-size: 12px;
      }
    }
    :deep(.ant-table-thead th.text-center) {
      text-align: center !important;
    }
    .table-box {
      height: 286px;
    }
  }
</style>
