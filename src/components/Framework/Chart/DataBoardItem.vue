<template>
  <div class="data-board-item">
    <div>
      <div class="title-box">
        <div class="icon-box">
          <img class="icon-img" :src="getIcon(icon)">
        </div>
        <div class="title-value-box">
          <div class="title-text">{{title}}</div>
          <div class="value-text">{{value}}</div>
          <div v-if="percentPosition==='right'&&(tRatio||tRatio===0||hRatio||hRatio===0)" class="percent-data-box">
            <div v-if="tRatio||tRatio===0" class="percent-item">
              <span class="p-value" :class="handleTextClass(tRatio)">{{tRatio}}</span>
              <span class="p-title">同比</span>
            </div>
            <div v-if="hRatio||hRatio===0" class="percent-item">
              <span class="p-value" :class="handleTextClass(hRatio)">{{hRatio}}</span>
              <span class="p-title">环比</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="percentPosition==='bottom'&&(tRatio||tRatio===0||hRatio||hRatio===0)" class="percent-data-box">
        <div v-if="tRatio||tRatio===0" class="percent-item">
          <span class="p-value" :class="handleTextClass(tRatio)">{{tRatio}}</span>
          <span class="p-title">同比</span>
        </div>
        <div v-if="hRatio||hRatio===0" class="percent-item">
          <span class="p-value" :class="handleTextClass(hRatio)">{{hRatio}}</span>
          <span class="p-title">环比</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue';

  // 传入参数
  const props = defineProps({
    title: { type: String, default: '今日发电量(万kWh)' },
    value: { type: [Number, String], default: 0 },
    tRatio: { type: [Number, String], default: '' },
    hRatio: { type: [Number, String], default: '' },
    icon: String,
    percentPosition: { type: String, default: 'bottom' },
  });

  // 图标
  const iconUrls = {
    dayGen: 'icon_day_gen.png', // 今日发电量
    earnings: 'icon_earnings.png', // 今日收益
    dayOnline: 'icon_day_online.png', // 累计上网电量
    warningCount: 'icon_warning_count.png', // 天气预警
    realGen: 'icon_real_gen.png', // 实发电量
    online: 'icon_online.png', // 上网电量
    settlement: 'icon_settlement.png', // 结算电量
    loss: 'icon_loss.png', // 结算电量
    lossRate: 'icon_loss_rate.png', // 损失率
    facRate: 'icon_fac_rate.png', // 综合厂用电率
    sysRate: 'icon_sys_rate.png', // 系统效率
    comRate: 'icon_com_rate.png', // 计划完成
    runningDays: 'icon_running_days.png', // 安全运行天数
    safeCheckCount: 'icon_safe_check_count.png', // 安全检查
    hiddenCount: 'icon_hidden_count.png', // 安全隐患
    trainingCount: 'icon_training_count.png', // 安全培训
    signRage: 'icon_sign_rage.png', // 安全责任书签订
    toolsCount: 'icon_tools_count.png', // 安全工器具
    inspectionCount: 'icon_inspection_count.png', // 巡检统计
    workOrderCount: 'icon_work_order_count.png', // 工单统计
    netIncome: 'icon_net_income.png', // 细则统计
    twoTicketCount: 'icon_two_ticket_count.png', // 两票统计
    defectCount: 'icon_defect_count.png', // 缺陷统计
    hiddenStatistics: 'icon_hidden_statistics.png', // 隐患统计
    stationTotal: 'icon_station_total.png', // 电站规模
    connectCapacity: 'icon_connect_capacity.png', // 并网容量
    fullTotal: 'icon_full_total.png', // 全容量并网电站
    equipmentTotal: 'icon_equipment_total.png', // 设备统计
    transQty: 'icon_trans_qty.png', // 备品备件
    orderTotal: 'icon_order_total.png', // 出入库单
    task: 'icon_task.png', // 任务统计
    ddzRate: 'icon_ddz_rate.png', // 调度持证率
    trainingTotal: 'icon_training_total.png', // 培训统计
    vehicleCount: 'icon_vehicle_count.png', // 车辆统计
    eval: 'icon_eval.png', // 考核评价
    contractTotal: 'icon_contract_total.png', // 合同统计
  };
  const getIcon = (icon: string) => {
    return new URL(`../../../assets/images/da/${iconUrls[icon]}`, import.meta.url).href;
  };

  // 根据数据内容判断class
  const handleTextClass = (text) => {
    if (typeof text == 'string') {
      return text.startsWith('-') ? 'arrow-negative' : 'arrow-positive';
    } else if (typeof text == 'number') {
      return text < 0 ? 'arrow-negative' : 'arrow-positive';
    }
    return 'arrow-positive';
  };

  // 根据数据内容判断是否添加%符号
  // const handleTextPercent = (text) => {
  //   if (typeof text == 'string') {
  //     return text;
  //   } else if (typeof text == 'number') {
  //     return String(text) + '%';
  //   }
  //   return text;
  // };

  onMounted(() => {});
</script>

<style lang="less" scoped>
  .data-board-item {
    display: flex;
    align-items: center;
    width: 2.24rem;
    height: 1.1rem;
    background-color: rgba(24, 144, 255, 0.1);
    border-radius: 0.04rem;
    border: 1px solid rgba(24, 144, 255, 0.3);
    padding: 0 0.15rem;
    .title-box {
      display: flex;
      align-items: center;
      .icon-box {
        width: 0.56rem;
        height: 0.62rem;
        background: url('../../../assets/images/da/icon_bg.png') no-repeat center bottom/contain;
        margin-right: 0.04rem;
        text-align: center;
        .icon-img {
          width: 0.46rem;
        }
      }
      .title-text {
        font-size: 0.14rem;
        line-height: 1;
        color: #fff;
        margin-bottom: 0.1rem;
      }
      .value-text {
        font-size: 0.22rem;
        line-height: 1;
        color: #1890ff;
      }
    }
    .percent-data-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 1;
      margin-top: 0.1rem;
      .p-value {
        font-size: 0.14rem;
        margin-right: 0.04rem;
        &::before {
          margin-right: 0.04rem;
          transform: scale(0.7);
          display: inline-block;
        }
      }
      .p-title {
        font-size: 0.12rem;
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }

  .arrow-positive {
    color: #e05b5b;
  }

  .arrow-negative {
    color: #00ba24;
  }

  .arrow-positive::before {
    content: '▲';
    color: #e05b5b;
  }

  .arrow-negative::before {
    content: '▼';
    color: #00ba24;
  }
</style>
