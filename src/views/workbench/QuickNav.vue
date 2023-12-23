<template>
  <a-card style="height: 326px" title="快捷导航" :bordered="false">
    <template #extra>
      <Icon icon="ion:settings-outline" :size="17" />
    </template>
    <div class="card-content">
      <a-carousel :after-change="onChange" dotsClass="carousel-dots">
        <div class="nav-page" v-for="(pageItem, pageIndex) in navList" :key="pageIndex">
          <div class="nav-item-container">
            <div class="nav-item" v-for="(n, index) in pageItem" :key="index" @click="toPath(n)">
              <div class="nav-icon-box" :style="{ backgroundColor: colors[index] }">
                <Icon :icon="n.icon" :size="32" />
              </div>
              <div class="nav-label">{{ n.label }}</div>
            </div>
          </div>
        </div>
      </a-carousel>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
  import Icon from '@/components/Icon/Icon.vue';
  import { ref, reactive } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const colors = [
    '#FBCC5A',
    '#3FD3A6',
    '#F28E27',
    '#38BBFE',
    '#4799F5',
    '#F57C47',
    '#6880FA',
    '#58DD96',
    '#4799F5',
    '#379EFF',
  ];
  const navList = ref([
    [
      {
        label: '电站运营',
        icon: 'ion:tv',
        url: '/da/stationOperation',
      },
      {
        label: '分区总览',
        icon: 'ion:layers',
        url: '/monitor/PVArea/subareaOverview',
      },
      {
        label: '组串总览',
        icon: 'ion:easel',
        url: '/monitor/PVArea/groupSeriesOverview',
      },
      {
        label: '告警总览',
        icon: 'ion:notifications',
        url: '/monitor/faultWarning',
      },
      {
        label: '生产管理',
        icon: 'ion:speedometer',
        url: '/po/elec/produce/index',
      },
      {
        label: '电气一票',
        icon: 'ion:scale-sharp',
        url: '/po/ticket/firstworkticket/index',
      },
      {
        label: '隐患管理',
        icon: 'ion:warning',
        url: '/po/danger/index',
      },
      {
        label: '巡检执行',
        icon: 'ion:map',
        url: '/po/inspection/inspectionexecution',
      },
      {
        label: '缺陷管理',
        icon: 'ion:build',
        url: '/po/fault/index',
      },
      {
        label: '工单管理',
        icon: 'ion:document-attach',
        url: '/po/workorder/index',
      },
    ],
    [
      {
        label: '物资台账',
        icon: 'ion:receipt',
        url: '/po/equipment/index',
      },
      {
        label: '计划电量统计',
        icon: 'ion:bar-chart',
        url: '/bi/elec/planned',
      },
      {
        label: '隐患统计',
        icon: 'ion:shield-checkmark',
        url: '/bi/hidden/index',
      },
      {
        label: '缺陷统计',
        icon: 'ion:pie-chart',
        url: '/bi/fault/index',
      },
    ],
  ]);

  const onChange = (current: number) => {
    console.log(current);
  };

  const toPath = (item) => {
    router.push(item.url);
  };
</script>
<style lang="less" scoped>
  .card-content {
    height: 278px;
    .nav-page {
      height: 278px;
      padding: 16px 0;
    }
    .nav-item-container {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
    }
    .nav-item {
      width: 20%;
      height: 88px;
      &:first-child {
        margin-bottom: 45px;
      }
      .nav-icon-box {
        width: 58px;
        height: 58px;
        border-radius: 16px;
        text-align: center;
        padding: 13px 0;
        margin: 0 auto;
        cursor: pointer;
      }
      .nav-label {
        text-align: center;
        font-size: 14px;
        padding-top: 16px;
        line-height: 1;
        cursor: pointer;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    :deep(.carousel-dots) {
      bottom: 0;
    }
    :deep(.carousel-dots > li) {
      width: 32px;
      height: 4px;
      border-radius: 2px;
      button {
        background-color: transparent;
      }
      &.slick-active {
        background-color: #1890ff;
        button {
          background-color: transparent;
        }
      }
    }
  }
</style>
