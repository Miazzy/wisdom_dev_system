<template>
  <a-card title="日程安排" :bordered="false">
    <template #extra>
      <a-dropdown v-model:visible="dropdownVisible" :trigger="['click']">
        <template #overlay>
          <a-menu @click="handleClickMenu">
            <a-menu-item key="meeting">会议提醒</a-menu-item>
            <a-menu-item key="schedule">日程提醒</a-menu-item>
          </a-menu>
        </template>
        <!-- <a-button type="primary"> 导入 </a-button> -->
        <span @click.prevent>新增 &gt;</span>
      </a-dropdown>
      <Schedule ref="schedule" />
    </template>
    <div class="card-content" style="height: 360px; overflow-y: auto">
      <a-calendar
        v-model:value="value"
        @panel-change="onPanelChange"
        @select="select"
        :fullscreen="false"
      >
        <template #dateCellRender="{ current }">
          <a-popover title="日程会议" trigger="click">
            <template #content>
              <p style="white-space: pre-wrap">{{ Content }}</p>
            </template>
            <ul class="events">
              <li v-for="item in getListData(current)" :key="item.content">
                <a-badge :status="item.type" :text="item.content" />
              </li>
            </ul>
          </a-popover>
        </template>
      </a-calendar>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
  import { ref, onMounted, nextTick } from 'vue';
  import { Dayjs } from 'dayjs';
  import Schedule from '../oa/schedule/Schedule.vue';
  import { defHttp } from '/@/utils/http/axios';
  import { MsgManager } from '/@/message/MsgManager';
  import { forEach } from '/@/utils/helper/treeHelper';
  import moment from 'moment';

  const schedule = ref();
  const dropdownVisible = ref(false);
  function handleClickMenu({ key }) {
    dropdownVisible.value = false;
    setTimeout(() => {
      schedule.value.handleClickMenu(key);
    }, 300);
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
  const visible = ref<boolean>(false);
  const list = ref([]);
  const Content = ref<string>();
  const getListData = (value: Dayjs) => {
    let dt = value.toDate();
    let year = dt.getFullYear();
    let month = (dt.getMonth() + 1).toString().padStart(2, '0');
    let date = dt.getDate().toString().padStart(2, '0');
    let dtstr = `${year}-${month}-${date}`;
    let listData = list.value[dtstr];
    const resultData = [];
    const scheduleData = [];
    let scheduleItem = {};
    if (listData != null) {
      forEach(listData, (item) => {
        if (item.dataType == 'schedule') {
          let week = new Date(item.today).getDay();
          let startWeek = new Date(item.startTime).getDay();
          scheduleItem = item;
          switch (item.notificationRules) {
            case 'not': //不重复
              if (item.today == moment(new Date(item.startTime)).format('YYYY-MM-DD')) {
                scheduleData.push(item);
              }
              break;
            case 'day': //每日
              scheduleData.push(item);
              break;
            case 'workday': //工作日
              if (week >= 1 && week <= 5) {
                scheduleData.push(item);
              }
              break;
            case 'weekday': //每周
              if (week == startWeek) {
                scheduleData.push(item);
              }
              break;
            case 'monthly': //每月
              let number1 = Math.ceil(new Date(item.today).getDate() / 7);
              let number2 = Math.ceil(new Date(item.startTime).getDate() / 7);
              if (week == startWeek && number1 == number2) {
                scheduleData.push(item);
              }
              break;
            case 'monthly2': //每月当日
              if (new Date(item.startTime).getDate() == new Date(item.today).getDate()) {
                scheduleData.push(item);
              }
              break;
          }
        } else {
          resultData.push(item);
        }
      });
      if (scheduleData.length > 0) {
        scheduleItem.content = '日程(' + scheduleData.length + ')';
        resultData.push(scheduleItem);
      }
    }
    return resultData || [];
  };

  async function readData() {
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
  }

  onMounted(async () => {
    readData();
    MsgManager.getInstance().listen('setMeeting', function () {
      setTimeout(() => {
        readData();
      }, 100);
    });
  });

  const onPanelChange = (value: Dayjs, mode: string) => {
    console.log(value, mode);
  };

  const getSchedule = (params) =>
    defHttp.get(
      {
        url: '/oa/calendar-schedule/getTodaySchedule',
        params,
      },
      {},
    );

  const select = (value: Dayjs) => {
    let listData = list.value[moment(value.toDate()).format('YYYY-MM-DD')];
    let contentData = '';
    debugger;
    if (listData != null) {
      forEach(listData, (item) => {
        if (item.dataType == 'schedule') {
          let week = new Date(item.today).getDay();
          let startWeek = new Date(item.startTime).getDay();
          switch (item.notificationRules) {
            case 'not': //不重复
              if (item.today == moment(new Date(item.startTime)).format('YYYY-MM-DD')) {
                contentData += item.contentData;
              }
              break;
            case 'day': //每日
              contentData += item.contentData;
              break;
            case 'workday': //工作日
              if (week >= 1 && week <= 5) {
                contentData += item.contentData;
              }
              break;
            case 'weekday': //每周
              if (week == startWeek) {
                contentData += item.contentData;
              }
              break;
            case 'monthly': //每月
              let number1 = Math.ceil(new Date(item.today).getDate() / 7);
              let number2 = Math.ceil(new Date(item.startTime).getDate() / 7);
              if (week == startWeek && number1 == number2) {
                contentData += item.contentData;
              }
              break;
            case 'monthly2': //每月当日
              if (new Date(item.startTime).getDate() == new Date(item.today).getDate()) {
                contentData += item.contentData;
              }
              break;
          }
        } else {
          contentData += item.contentData + '\n';
        }
      });
    }
    Content.value = contentData;
    visible.value = true;
    // getSchedule({ date: value.toDate().toDateString() })
    //   .then((data) => {
    //     Content.value = data.result;
    //     visible.value = true;
    //   })
    //   .catch(() => {});
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
