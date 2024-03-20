<template>
  <div class="header">
    <div class="title"> {{ props.title }} </div>
    <div class="info">
      <button class="settings">
        <Icon
          v-if="screenIconFlag"
          icon="octicon:screen-full-24"
          color="#32afff"
          style="font-size: 0.28rem; cursor: pointer"
          @click="handleScreen"
        />
      </button>
      <span class="time">
        <DigitalClock />
      </span>
      <span class="weather">
        <WeatherDisplay />
      </span>
      <button class="settings">
        <Icon
          icon="arcticons:settings"
          color="#32afff"
          style="font-size: 0.28rem; cursor: pointer"
          @click="handleSettings"
        />
      </button>
    </div>
    <a-drawer
      :width="drawerWidth"
      :placement="placement"
      :visible="visible"
      :closable="closable"
      :drawerStyle="drawerStyle"
      :contentWrapperStyle="contentWrapperStyle"
      :maskStyle="maskStyle"
      @close="handleSetupClose"
    >
      <div class="screen-drawer-content">
        <div class="right-panel-slot">
          <h2 class="search-h2">统计条件</h2>
          <div class="search-choice-tips"
            >已选择: <span>{{ dateType }}</span></div
          >
          <div class="search-choice">
            <div class="search-choice-t">
              <Icon
                icon="material-symbols-light:date-range-outline-rounded"
                color="#0866e0"
                style="font-size: 0.22rem"
              />
              <span class="search-choice-title">日期</span>
            </div>
            <div class="search-choice-b">
              <div class="iframe-search-daterange">
                <div class="button-content radio-group">
                  <a-radio-group
                    v-model:value="dateType"
                    size="small"
                    @change="handleDateTypeChange"
                  >
                    <a-radio-button value="上月">上月</a-radio-button>
                    <a-radio-button value="本月">本月</a-radio-button>
                    <a-radio-button value="本年">本年</a-radio-button>
                  </a-radio-group>
                </div>
                <div class="button-content range-group">
                  <a-range-picker
                    v-model:value="dateRange"
                    style="width: 200px"
                    picker="month"
                    size="small"
                    @change="handleDateRangeChange"
                  >
                    <template #suffixIcon>
                      <Icon
                        icon="material-symbols-light:date-range-outline-rounded"
                        color="#fefefe"
                        style="font-size: 0.22rem"
                      />
                    </template>
                  </a-range-picker>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { ref, onMounted, defineProps, watch } from 'vue';
  import DigitalClock from '/@/components/Framework/Chart/DigitalClock.vue';
  import WeatherDisplay from '/@/components/Framework/Chart/WeatherDisplay.vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { MsgManager } from '/@/message/MsgManager';

  const props = defineProps({
    title: { type: String, default: '' }, // 列定义
    date: { type: String, default: '' }, // 表格数据
  });

  // 定义emits
  const emit = defineEmits(['dateChange']);

  const drawerWidth = ref(450);
  const placement = ref('right');
  const visible = ref(false);
  const closable = ref(false);
  const screenIconFlag = ref(false);
  const drawerStyle = ref();
  const contentWrapperStyle = ref();
  const maskStyle = ref();
  const dateType = ref('');
  const dateRange = ref();
  const colorOptions = {
    blue: {
      background: '#003775f0',
    },
    transparent: {
      background: 'transparent',
    },
  };

  const handleScreen = () => {
    MsgManager.getInstance().sendMsg('iframe-screen-emit', {});
  };

  const handleSettings = () => {
    visible.value = true;
  };

  const handleSetupClose = () => {
    visible.value = false;
  };

  const handleDateTypeChange = () => {
    if (dateType.value == '上月') {
      const date = dayjs().subtract(1, 'month');
      dateRange.value = [date, date];
    } else if (dateType.value == '本月') {
      const date = dayjs();
      dateRange.value = [date, date];
    } else if (dateType.value == '本年') {
      const startDate = dayjs().startOf('year');
      const endDate = dayjs().endOf('year');
      dateRange.value = [startDate, endDate];
    }
    handleDateRangeChange();
  };

  const handleDateRangeChange = () => {
    const startDate = dateRange.value[0].format('YYYY-MM');
    const endDate = dateRange.value[1].format('YYYY-MM');
    emit('dateChange', [startDate, endDate], dateType.value);
    sessionStorage.setItem('screen-date-set', JSON.stringify({startDate, endDate, dateType: 'month'}));
  };

  onMounted(() => {
    drawerStyle.value = colorOptions.blue;
    contentWrapperStyle.value = colorOptions.transparent;
    maskStyle.value = colorOptions.transparent;
    dateType.value = '上月';
    handleDateTypeChange();
  });
</script>
<style lang="less">
  @font-face {
    font-family: Digital;
    font-style: normal;
    font-weight: normal;
    src: url('../../../assets/fonts/DSDIGI.ttf') format('truetype');
  }

  .ant-drawer-content {
    background: transparent;
  }

  .ant-picker-dropdown {
    .ant-picker-range-wrapper {
      .ant-picker-panel-container {
        .ant-picker-panel {
          border-width: 0;
        }

        .ant-picker-month-panel {
          display: flex;
          flex-direction: column;
          width: 280px;
          background: rgba(0, 44, 90, 0.9);
        }

        .ant-picker-header {
          display: flex;
          padding: 0 8px;
          border-bottom: 1px solid #0070a055;
          color: rgba(0, 0, 0, 0.85);

          button {
            color: rgba(255, 255, 255, 0.75);
          }
        }
      }
    }
  }

  .ant-picker {
    display: inline-flex;
    position: relative;
    box-sizing: border-box;
    align-items: center;
    margin: 0;
    padding: 0;
    padding: 0 7px;
    transition:
      border 0.3s,
      box-shadow 0.3s;
    border: 1px solid #0866e0;
    border-radius: 0;
    background: transparent;
    color: rgb(255 255 255 / 85%);
    font-size: 14px;
    font-variant: tabular-nums;
    list-style: none;
    font-feature-settings: tnum;

    .ant-picker-input {
      input {
        display: inline-block;
        position: relative;
        flex: auto;
        width: 100%;
        min-width: 0;
        min-width: 1px;
        height: auto;
        padding: 4px 11px;
        padding: 0;
        transition: all 0.3s;
        border: 1px solid #d9d9d9;
        border: 0;
        border-radius: 2px;
        background: transparent;
        background-image: none;
        color: #fefefe;

        &::placeholder {
          color: #fefefef0;
        }
      }
    }
  }

  .ant-radio-group-small {
    .ant-radio-button-wrapper {
      display: inline-block;
      position: relative;
      height: 24px;
      margin: 0;
      padding: 0 8px;
      transition:
        color 0.3s,
        background 0.3s,
        border-color 0.3s,
        box-shadow 0.3s;
      border: 1px solid #0866e0;
      border-radius: 0;
      background: transparent;
      color: #a0a0a0;
      font-size: 12px;
      line-height: 22px;
      cursor: pointer;

      &:first-child,
      &:last-child {
        border-right: 1px solid #0866e0;
        border-left: 1px solid #0866e0;
      }

      &:not(:first-child)::before {
        content: '';
        display: block;
        position: absolute;
        top: -1px;
        left: -1px;
        box-sizing: content-box;
        width: 1px;
        height: 100%;
        padding: 1px 0;
        transition: background-color 0.3s;
        background-color: #0866e0;
      }

      &.ant-radio-button-wrapper-checked {
        display: inline-block;
        position: relative;
        height: 24px;
        margin: 0;
        padding: 0 8px;
        transition:
          color 0.3s,
          background 0.3s,
          border-color 0.3s,
          box-shadow 0.3s;
        border: 1px solid #0866e0;
        border-radius: 0;
        background: transparent;
        color: #fefefe;
        font-size: 12px;
        line-height: 22px;
        cursor: pointer;

        .ant-radio-button {
          color: #fefefe;
          box-shadow: 1px 1px 10px #0070a0fe;
        }

        &:not(.ant-radio-button-wrapper-disabled):focus-within {
          border: 1px solid #0866e0;
          box-shadow: none;
        }

        &:not(.ant-radio-button-wrapper-disabled):focus-within::before {
          content: '';
          display: block;
          position: absolute;
          top: -1px;
          left: -1px;
          box-sizing: content-box;
          width: 1px;
          height: 100%;
          padding: 1px 0;
          transition: background-color 0.3s;
          background-color: #0866e0;
        }
      }
    }
  }

  .ant-picker-cell {
    .ant-picker-cell-inner {
      color: #fefefe;

      &:hover {
        background: transparent;
      }
    }

    &.ant-picker-cell-in-view.ant-picker-cell-in-range {
      &::before {
        background: #0960bd;
      }
    }

    &.ant-picker-cell-in-view.ant-picker-cell-range-start {
      &:not(.ant-picker-cell-range-start-single)::before {
        background: #0960bd;
      }
    }

    &.ant-picker-cell-in-view.ant-picker-cell-range-end {
      &:not(.ant-picker-cell-range-end-single)::before {
        background: #0960bd;
      }
    }
  }

  .anticon {
    color: #fefefe;
  }

  .ant-picker-header-view {
    button {
      color: #fefefe;
    }
  }
</style>
<style lang="less" scoped>
  body {
    .screen-drawer-content {
      position: relative;
      height: 100vh;

      .right-panel-slot {
        .search-h2 {
          padding: 10px 0;
          border-bottom: 1px solid #fff;
          color: #fefefe;
          font-size: 17px;
          letter-spacing: 8px;
          text-align: center;
        }

        .search-choice-tips {
          padding: 10px 0;
          color: #fff;
          font-size: 15px;
        }

        .search-choice {
          height: auto;
          margin-bottom: 20px;
          overflow: hidden;
          color: #fff;

          .search-choice-t {
            margin-bottom: 20px;
            border-bottom: 1px transparent solid;
            line-height: 40px;
            border-image: linear-gradient(to right, #0866e0, rgb(59 183 183 / 20%)) 1 10;
          }

          .search-choice-title {
            margin: 2px 6px 0;
            font-size: 15px;
          }

          .iframe-search-daterange {
            position: relative;
            height: 40px;

            .button-content {
              position: absolute;

              &.radio-group {
                left: 0;
              }

              &.range-group {
                left: 140px;
              }
            }
          }
        }
      }
    }
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 0.8rem;
    padding: 0.1rem;
    border-bottom: 0.02rem solid #01d8ff12;
    color: white;

    .title {
      margin-left: 0.2rem;
      color: #fff;
      font-family: 'Microsoft YaHei', '微软雅黑';
      font-size: 0.24rem;
      font-weight: 400;
      line-height: 0.16rem;
    }

    .info {
      display: flex;
      align-items: center;

      .time,
      .weather,
      .settings {
        margin-left: 0.2rem;
        background: transparent;
        cursor: pointer;
      }
    }
  }
</style>
