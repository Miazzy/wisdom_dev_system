<template>
  <a-card title="日程安排" :bordered="false">
    <template #extra>
      <a-dropdown>
        <template #overlay>
          <a-menu @click="handleClickMenu">
            <a-menu-item key="meeting">会议提醒</a-menu-item>
            <a-menu-item key="schedule">日程提醒</a-menu-item>
          </a-menu>
        </template>
        <!-- <a-button type="primary"> 导入 </a-button> -->
        <span>新增 &gt;</span>
      </a-dropdown>
      <Schedule ref="schedule" />
    </template>
    <div class="card-content">
      <a-calendar v-model:value="value" @panelChange="onPanelChange" :fullscreen="false">
        <!-- <template #dateFullCellRender="{ current }">
          <div class="calendar-cell">
            <div class="date"> {{ current.date() }}</div>
            <div class="detail">
              <div class="lunar-date">会议</div>
              <div class="status">日程</div>
            </div>
          </div>
        </template> -->
        <template #dateCellRender="{ current }">
          <ul class="events">
            <li v-for="item in getListData(current)" :key="item.content">
              <a-badge :status="item.type" :text="item.content" />
            </li>
          </ul>
        </template>
      </a-calendar>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { Dayjs } from 'dayjs';
  import Schedule from '../oa/schedule/Schedule.vue';
  import { defHttp } from '/@/utils/http/axios';

  const schedule = ref();
  function handleClickMenu({ key }) {
    schedule.value.handleClickMenu(key);
  }
  const value = ref<Dayjs>();

  const getAlldaySchedule = (params) =>
    defHttp.get(
      {
        url: '/oa/calendar-schedule/getAlldaySchedule',
        params,
      },
      {},
    );

  const list = ref([]);
  const getListData = (value: Dayjs) => {
    let dt = value.toDate();
    let year = dt.getFullYear();
    let month = (dt.getMonth() + 1).toString().padStart(2, '0');
    let date = dt.getDate().toString().padStart(2, '0');
    let dtstr = `${year}-${month}-${date}`;
    let listData = list.value[dtstr];

    // let listData = [
    //   { type: 'warning', content: '会议(3)' },
    //   { type: 'success', content: '日程(1) ' },
    // ];
    return listData || [];
  };

  onMounted(async () => {
    let startDate = document
      .querySelector(
        '.ant-picker-calendar .ant-picker-date-panel tr:first-child .ant-picker-cell:first-child',
      )
      .getAttribute('title');
    let endDate = document
      .querySelector(
        '.ant-picker-calendar .ant-picker-date-panel tr:last-child .ant-picker-cell:last-child',
      )
      .getAttribute('title');

    let data = await getAlldaySchedule({ startDate: startDate, endDate: endDate });
    list.value = data.result;
    // .then((data) => {
    //   list.value = data.result;
    //   debugger;
    // });
  });

  const onPanelChange = (value: Dayjs, mode: string) => {
    console.log(value, mode);
  };
</script>

<style lang="less" scoped>
  .card-content {
    height: 360px;
    padding-top: 1px;
    // .calendar-cell {
    //   font-size: 12px;
    //   text-align-last: left;
    //   .detail {
    //     display: flex;
    //     justify-content: space-between;
    //     align-items: center;
    //   }
    // }
    :deep(.ant-picker-calendar .ant-picker-panel) {
      .ant-picker-body {
        padding: 0;
      }
    }

    :deep(.ant-picker-calendar-mini .ant-picker-content) {
      height: 292px;

      th {
        padding: 8px 0;
      }
    }

    :deep(
        .ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner,
        .ant-picker-cell-in-view.ant-picker-cell-range-start .ant-picker-cell-inner,
        .ant-picker-cell-in-view.ant-picker-cell-range-end .ant-picker-cell-inner
      ) {
      background-color: #1890ff;
    }

    :deep(.ant-picker-cell-in-view.ant-picker-cell-today .ant-picker-cell-inner::before) {
      border-color: #1890ff;
    }
  }

  .events {
    margin: 0;
    padding: 0;
    list-style: none;
  }
</style>
