<template>
  <a-card title="日程安排" :bordered="false">
    <template #extra>
      <span>更多 &gt;</span>
    </template>
    <div class="card-content">
      <a-calendar v-model:value="value" @panelChange="onPanelChange" :fullscreen="false">
        <!-- <template #dateFullCellRender="{ current }">
          <div class="calendar-cell">
            <div class="date"> {{current.date()}}</div>
            <div class="detail">
              <div class="lunar-date">廿一</div>
              <div class="status">班</div>
            </div>
          </div>
        </template> -->
      </a-calendar>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Dayjs } from 'dayjs';

  const value = ref<Dayjs>();
  const onPanelChange = (value: Dayjs, mode: string) => {
    console.log(value, mode);
  };
</script>

<style lang="less" scoped>
  .card-content {
    padding-top: 1px;
    height: 360px;
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
    :deep(.ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner, .ant-picker-cell-in-view.ant-picker-cell-range-start .ant-picker-cell-inner, .ant-picker-cell-in-view.ant-picker-cell-range-end .ant-picker-cell-inner) {
      background-color: #1890FF;
    }
    :deep(.ant-picker-cell-in-view.ant-picker-cell-today .ant-picker-cell-inner::before) {
      border-color: #1890FF;
    }
  }
</style>