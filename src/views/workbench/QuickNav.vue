<template>
  <a-card style="height: 326px" title="快捷导航" :bordered="false">
    <template #extra>
      <Icon icon="ion:settings-outline" :size="17" @click="handleOpenDialog()" />
    </template>
    <div class="card-content">
      <a-carousel :after-change="onChange" dotsClass="carousel-dots">
        <div class="nav-page" v-for="(pageItem, pageIndex) in formState.menuBoard" :key="pageIndex">
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

  <DataSelectDialog
    title="快捷导航设置"
    v-model:visible="openDialog"
    :value="formState.menuBoardDetail"
    :tdata="menuTreeData"
    :tfields="{ key: 'value', title: 'label' }"
    :width="800"
    :height="600"
    @cancel="receiverCancel"
    @confirm="receiverConfirm"
  />
</template>
<script lang="ts" setup>
  import Icon from '@/components/Icon/Icon.vue';
  import { ref, reactive, onMounted } from 'vue';
  import DataSelectDialog from '@/components/Framework/Modal/DataSelectDialog.vue';
  // import { useRouter } from 'vue-router';
  import { TreeSelectProps, message } from 'ant-design-vue';
  import { addTabPage } from '@/utils/route';
  import { getMenuTreeData, saveMenuBoard, getMenuBoard } from './data';

  // const router = useRouter();
  const openDialog = ref(false);
  const menuTreeData = ref<TreeSelectProps['treeData']>();
  const formState: any = reactive({
    menuBoard: [],
    menuBoardDetail: [],
  });

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
  // const navList = ref([
  //   [
  //     {
  //       label: '电站运营',
  //       icon: 'ion:tv',
  //       url: '/da/stationOperation',
  //     },
  //     {
  //       label: '分区总览',
  //       icon: 'ion:layers',
  //       url: '/monitor/PVArea/subareaOverview',
  //     },
  //     {
  //       label: '组串总览',
  //       icon: 'ion:easel',
  //       url: '/monitor/PVArea/groupSeriesOverview',
  //     },
  //     {
  //       label: '告警总览',
  //       icon: 'ion:notifications',
  //       url: '/monitor/faultWarning',
  //     },
  //     {
  //       label: '生产管理',
  //       icon: 'ion:speedometer',
  //       url: '/po/elec/produce/index',
  //     },
  //     {
  //       label: '电气一票',
  //       icon: 'ion:scale-sharp',
  //       url: '/po/ticket/firstworkticket/index',
  //     },
  //     {
  //       label: '隐患管理',
  //       icon: 'ion:warning',
  //       url: '/po/danger/index',
  //     },
  //     {
  //       label: '巡检执行',
  //       icon: 'ion:map',
  //       url: '/po/inspection/inspectionexecution',
  //     },
  //     {
  //       label: '缺陷管理',
  //       icon: 'ion:build',
  //       url: '/po/fault/index',
  //     },
  //     {
  //       label: '工单管理',
  //       icon: 'ion:document-attach',
  //       url: '/po/workorder/index',
  //     },
  //   ],
  //   [
  //     {
  //       label: '物资台账',
  //       icon: 'ion:receipt',
  //       url: '/po/equipment/index',
  //     },
  //     {
  //       label: '计划电量统计',
  //       icon: 'ion:bar-chart',
  //       url: '/bi/elec/planned',
  //     },
  //     {
  //       label: '隐患统计',
  //       icon: 'ion:shield-checkmark',
  //       url: '/bi/hidden/index',
  //     },
  //     {
  //       label: '缺陷统计',
  //       icon: 'ion:pie-chart',
  //       url: '/bi/fault/index',
  //     },
  //   ],
  // ]);

  onMounted(async () => {
    queryMenuBoardByUserId();
  });

  //当前登录人的数据设置
  const queryMenuBoardByUserId = async () => {
    await getMenuBoard({}).then((rsp) => {
      if (rsp) {
        formState.menuBoardDetail = [];
        rsp.forEach((e) => {
          formState.menuBoardDetail.push({
            value: e.parentId,
            label: e.name,
            parentId: e.parentId,
            name: e.name,
            icon: e.icon,
            url: e.url,
          });
        });
        formState.menuBoard.push(formState.menuBoardDetail);
      }
    });
  };

  //查询树
  const queryIndexTreeData = async () => {
    const typeSubList = await getMenuTreeData({});
    menuTreeData.value = dig(typeSubList.result, true);
  };

  function dig(data, selectIndex) {
    const list: TreeSelectProps['treeData'] = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      const treeNode: TreeSelectProps['treeData'][number] = {
        label: item.name,
        value: item.id,
        parentId: item.parentId,
        disabled: selectIndex ? item.nodeKindId != 'fun' : false,
      };

      if (item.children && item.children.length > 0) {
        treeNode.children = dig(item.children, selectIndex);
      }
      list.push(treeNode);
    }
    return list;
  }

  //打开
  const handleOpenDialog = () => {
    openDialog.value = true;
    queryIndexTreeData();
  };

  //清空
  const receiverCancel = () => {
    openDialog.value = false; // 关闭弹框
  };

  //保存
  const receiverConfirm = (nodeList, allList) => {
    openDialog.value = false;
    let dataList: any = [];
    if (nodeList && nodeList.length > 0) {
      nodeList.forEach((e) => {
        dataList.push({
          menuId: e.value,
        });
      });
      saveMenuBoard(dataList).then(() => {
        message.success('操作成功');
        queryMenuBoardByUserId();
      });
    }
  };

  const onChange = (current: number) => {
    console.log(current);
  };

  const toPath = (item) => {
    addTabPage(item.url, item.label);
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
      display: flex;
      flex-wrap: wrap;
      width: 100%;
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
        margin: 0 auto;
        padding: 13px 0;
        border-radius: 16px;
        text-align: center;
        cursor: pointer;
      }

      .nav-label {
        width: 100%;
        padding-top: 16px;
        overflow: hidden;
        font-size: 14px;
        line-height: 1;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
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
