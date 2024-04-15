<template>
  <a-card title="待办任务" :bordered="false">
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
            <BasicTable
              @register="tableList[index]"
              @row-db-click="(record) => handleCheck(record)"
              :scroll="{ y: 248 }"
            />
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-card>
  <Schedule ref="schedule" />
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { assign } from 'lodash-es';
  import { BasicTable, useTable, TableAction, BasicColumn } from '/@/components/Table';
  import * as TaskApi from '@/api/bpm/task';
  import * as ProcessInstanceApi from '@/api/bpm/processInstance';
  import { useUserStore } from '/@/store/modules/user';
  import { addTabPage } from '@/utils/route';
  import { MsgManager } from '/@/message/MsgManager';
  import { DateTools } from '/@/utils/dateUtil';
  import Schedule from '../oa/schedule/Schedule.vue';
  import moment from 'moment';
    import * as CommonUtil from '/@/utils/common';

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
    {
      key: '5',
      tab: '日程提醒',
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
    } else if (item === '5') {
      doSchedule();
    }
  };

  const toMorePage = () => {
    if (activeKey.value == '1') {
      // router.push(`/bpm/task/todo`);
      addTabPage(`/bpm/task/todo`, '待办任务');
    } else if (activeKey.value == '2') {
      // router.push(`/bpm/task/todo`);
      addTabPage(`/bpm/task/todo`, '待办任务');
    } else if (activeKey.value == '3') {
      // router.push(`/bpm/task/processInstance`);
      addTabPage(`/bpm/task/processInstance`, '我的流程');
    } else if (activeKey.value == '4') {
      // router.push(`/bpm/task/done`);
      addTabPage(`/bpm/task/done`, '已办任务');
    } else if (activeKey.value == '5') {
      // router.push(`/bpm/task/done`);
      addTabPage(`/oa/schedule/index`, '日程提醒');
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
      width: 80,
    },
    {
      title: '申请时间',
      dataIndex: 'time',
      width: 120,
    },
  ];

  const tableColumns5: BasicColumn[] = [
    {
      title: '提醒',
      dataIndex: 'content',
      width: 330,
      align: 'left',
      customHeaderCell: (column) => {
        return {
          class: 'text-center',
        };
      },
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      width: 100,
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      width: 120,
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
    // actionColumn: {
    //   width: 140,
    //   title: '操作',
    //   dataIndex: 'action',
    // },
  };
  const tableDataSource1 = ref([]);
  const tableDataSource2 = ref([]);
  const tableDataSource3 = ref([]);
  const tableDataSource4 = ref([]);
  const tableDataSource5 = ref([]);
  const [registerApprovalTable1, tInstance1] = useTable(
    assign(
      {
        dataSource: tableDataSource1,
        columns: tableColumns,
      },
      detailTableProps,
    ),
  );
  const [registerApprovalTable2, tInstance2] = useTable(
    assign(
      {
        dataSource: tableDataSource2,
        columns: tableColumns,
      },
      detailTableProps,
    ),
  );
  const [registerApprovalTable3, tInstance3] = useTable(
    assign(
      {
        dataSource: tableDataSource3,
        columns: tableColumns,
      },
      detailTableProps,
    ),
  );
  const [registerApprovalTable4, tInstance4] = useTable(
    assign(
      {
        dataSource: tableDataSource4,
        columns: tableColumns,
      },
      detailTableProps,
    ),
  );

  const [registerApprovalTable5, tInstance5] = useTable(
    assign(
      {
        dataSource: tableDataSource5,
        columns: tableColumns5,
      },
      detailTableProps,
    ),
  );

  const tableList = ref([
    registerApprovalTable1,
    registerApprovalTable2,
    registerApprovalTable3,
    registerApprovalTable4,
    registerApprovalTable5,
  ]);

  // 查看
  const schedule = ref();
  const handleCheck = (record) => {
    if (activeKey.value == '2') {
      TaskApi.updateCcTo(record.processInstanceId).then((res) => {
        if (res.result) {
          doCC();
          CommonUtil.toFlowPage(record.businessKey);
        }
      });
    } else if (activeKey.value == '5') {
      schedule.value.handleView({ id: record.id, type: record.type });
    } else {
      // addTabPage(
      //   `${record.viewPath}?processInstanceId=${record.processInstanceId}`,
      //   record.flowName,
      // );
      CommonUtil.toFlowPage(record.businessKey);
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
          title: element.description,
          flowName: element.processInstance.name,
          dept: element.processInstance.deptName,
          person: element.processInstance.startUserNickname,
          time: DateTools.format(element.createTime, 'YYYY-MM-DD hh:mm'),
          viewPath: element.bpmProcessDefinitionRespVO.formCustomCreatePath,
          processInstanceId: element.processInstance.id,
          businessKey: element.businessKey
        });
      });
    }
    if (tInstance1) {
      tInstance1?.setTableData(tableDataSource1.value);
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
          title: element.description,
          flowName: element.processInstance.name,
          dept: element.processInstance.deptName,
          person: element.processInstance.startUserNickname,
          time: DateTools.format(element.createTime, 'YYYY-MM-DD hh:mm'),
          viewPath: element.bpmProcessDefinitionRespVO.formCustomCreatePath,
          processInstanceId: element.processInstance.id,
          businessKey: element.businessKey
        });
      });
    }
    if (tInstance2) {
      tInstance2?.setTableData(tableDataSource2.value);
    }
  };

  const doMy = async () => {
    //我发起
    const getMyProcessInstancePage = await ProcessInstanceApi.getMyProcessInstancePage();
    tableDataSource3.value.splice(0, tableDataSource3.value.length);
    if (getMyProcessInstancePage) {
      getMyProcessInstancePage.list.forEach((element) => {
        tableDataSource3.value.push({
          title: element.description,
          flowName: element.name,
          dept: element.deptName,
          person: getUserInfo.username,
          time: DateTools.format(element.createTime, 'YYYY-MM-DD hh:mm'),
          viewPath: element.bpmProcessDefinitionRespVO.formCustomCreatePath,
          processInstanceId: element.id,
          businessKey: element.businessKey
        });
      });
    }
    if (tInstance3) {
      tInstance3?.setTableData(tableDataSource3.value);
    }
  };

  const doDone = async () => {
    //已处理
    const getDoneTaskPage = await TaskApi.getDoneTaskPage();
    tableDataSource4.value.splice(0, tableDataSource4.value.length);
    if (getDoneTaskPage) {
      getDoneTaskPage.list.forEach((element) => {
        tableDataSource4.value.push({
          title: element.description,
          flowName: element.processInstance.name,
          dept: element.processInstance.deptName,
          person: element.processInstance.startUserNickname,
          time: DateTools.format(element.createTime, 'YYYY-MM-DD hh:mm'),
          viewPath: element.bpmProcessDefinitionRespVO.formCustomCreatePath,
          processInstanceId: element.processInstance.id,
          businessKey: element.businessKey
        });
      });
    }
    if (tInstance4) {
      tInstance4?.setTableData(tableDataSource4.value);
    }
  };

  const doSchedule = async () => {
    //日程
    const getSchedulePage = await TaskApi.getSchedulePage();
    tableDataSource5.value = [];

    if (getSchedulePage) {
      getSchedulePage.forEach((element) => {
        let item = {
          content: element.content,
          id: element.id,
          type: element.type,
          startTime: DateTools.format(element.startTime, 'YYYY-MM-DD HH:mm'),
          creator: element.creator,
        };

        if (element.type == 'schedule') {
          let week = new Date().getDay();
          let startWeek = new Date(element.startTime).getDay();
          let notificationTime = moment(new Date(element.startTime)).format('HH:mm');
          let nowTime = moment(new Date()).format('HH:mm');
          let needNotice = nowTime >= notificationTime;
          switch (element.notificationRules) {
            case 'not': //不重复
              if (
                moment(new Date()).format('YYYY-MM-DD') ==
                  moment(new Date(element.startTime)).format('YYYY-MM-DD') &&
                needNotice
              ) {
                tableDataSource5.value.push(item);
              }
              break;
            case 'day': //每日
              if (needNotice) {
                tableDataSource5.value.push(item);
              }

              break;
            case 'workday': //工作日
              if (week >= 1 && week <= 5 && needNotice) {
                tableDataSource5.value.push(item);
              }
              break;
            case 'weekday': //每周
              if (week == startWeek && needNotice) {
                tableDataSource5.value.push(item);
              }
              break;
            case 'monthly': //每月
              let number1 = Math.ceil(new Date().getDate() / 7);
              let number2 = Math.ceil(new Date(element.startTime).getDate() / 7);
              if (week == startWeek && number1 == number2 && needNotice) {
                tableDataSource5.value.push(item);
              }
              break;
            case 'monthly2': //每月当日
              if (new Date(element.startTime).getDate() == new Date().getDate() && needNotice) {
                tableDataSource5.value.push(item);
              }
              break;
          }
        } else {
          let now = new Date().getTime();
          let startTime = new Date(element.startTime).getTime();
          if (startTime - now <= notificationRulesTime[element.notificationRules]) {
            tableDataSource5.value.push(item);
          }
        }
      });
      tabList.value[4].count = tableDataSource5.value.length;
    }
    if (tInstance5) {
      tInstance5?.setTableData(tableDataSource5.value);
    }
  };
  const notificationRulesTime = {
    start: 0,
    '5min': 5 * 60 * 1000,
    '15min': 15 * 60 * 1000,
    '30min': 30 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '2h': 2 * 60 * 60 * 1000,
    '4h': 4 * 60 * 60 * 1000,
    '8h': 8 * 60 * 60 * 1000,
  };

  const reloadAll = async () => {
    // 后续需要一段时间处理后才能查询到最新数据，建议延时查询
    setTimeout(() => {
      doTodo();
      doCC();
      doMy();
      doDone();
      doSchedule();
    }, 1500);
  };

  /** 初始化 */
  onMounted(async () => {
    doTodo();
    doCC();
    doSchedule();
    MsgManager.getInstance().listen('workbench-approval', reloadAll);
    MsgManager.getInstance().listen('setMeeting', doSchedule);
  });
</script>

<style lang="less" scoped>
  .card-content {
    height: 360px;

    :deep(.ant-tabs-tab) {
      padding-right: 0;
      padding-left: 0;
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
