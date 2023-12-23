<template>
  <a-card title="工作提醒" :bordered="false">
    <template #extra>
      <span>更多 &gt;</span>
    </template>
    <div class="card-content">
      <div class="table-box">
        <BasicTable @register="registerWorkReminderTable" :scroll="{ y: 248 }">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'status'">
              <span :class="statusColors[record.status]">{{ record.statusText }}</span>
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { BasicTable, useTable, TableAction, BasicColumn } from '/@/components/Table';
  import { assign } from 'lodash-es';
  import { columns } from 'element-plus/es/components/table-v2/src/common';

  // table
  const tableColumns: BasicColumn[] = [
    {
      title: '类型',
      dataIndex: 'workType',
      width: 60,
      customHeaderCell: (column) => {
        return {
          class: 'text-center',
        };
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      align: 'left',
      customHeaderCell: (column) => {
        return {
          class: 'text-center',
        };
      },
    },
    {
      title: '提醒时间',
      dataIndex: 'time',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 60,
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
  };
  const tableDataSource = [
    // {
    //   workType: '日报',
    //   description: '你今日日报尚未未完成',
    //   time: '2023-06-28 10:44:06',
    //   status: '1',
    //   statusText: '执行中'
    // },
    // {
    //   workType: '日报',
    //   description: '你今日日报尚未未完成',
    //   time: '2023-06-28 10:44:06',
    //   status: '2',
    //   statusText: '已超期'
    // },
  ];
  const statusColors = {
    '1': 'blue-text',
    '2': 'yellow-text',
  };
  const [registerWorkReminderTable] = useTable(
    assign(
      {
        dataSource: tableDataSource,
        columns: tableColumns,
      },
      detailTableProps,
    ),
  );
</script>

<style lang="less" scoped>
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
      height: 100%;
      .blue-text {
        color: rgba(24, 144, 255, 0.85);
      }
      .yellow-text {
        color: rgba(239, 189, 71, 0.85);
      }
    }
  }
</style>
