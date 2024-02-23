<template>
  <a-card title="数据看板" :bordered="false" @click="handleOpenDialog()">
    <template #extra>
      <Icon icon="ion:settings-outline" :size="17" />
    </template>
    <div class="card-content">
      <!-- <div class="data-board-item">
        <div class="label-text">并网容量(MWp)</div>
        <div class="value-text">563.33161</div>
      </div> -->
      <div class="data-board-item" v-for="(n, index) in formState.dataBoard" :key="index">
        <div class="label-text">{{ n.fullName }}</div>
        <div class="value-text">{{ 11111 }}</div>
      </div>
    </div>
  </a-card>

  <DataSelectDialog
    title="指标库"
    v-model:visible="openDialog"
    :value="formState.dataBoard"
    :tdata="indexTreeData"
    :tfields="{ key: 'value', title: 'label' }"
    :width="800"
    :height="600"
    @cancel="receiverCancel"
    @confirm="receiverConfirm"
  />
</template>
<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import DataSelectDialog from '@/components/Framework/Modal/DataSelectDialog.vue';
  import { TreeSelectProps, message } from 'ant-design-vue';
  import { getIndexTreeData, saveDataBoard, getDataBoard } from './data';

  const openDialog = ref(false);
  const indexTreeData = ref<TreeSelectProps['treeData']>();
  const formState: any = reactive({
    dataBoard: [],
  });

  onMounted(async () => {
    queryDataBoardByUserId();
  });

  //当前登录人的数据看板设置
  const queryDataBoardByUserId = async () => {
    await getDataBoard({}).then((rsp) => {
      if (rsp) {
        formState.dataBoard = [];
        rsp.forEach((e) => {
          formState.dataBoard.push({
            value: e.id,
            label: e.name,
            parentId: e.parentId,
            name: e.name,
            fullName: e.fullName,
          });
        });
      }
    });
  };

  //查询树
  const queryIndexTreeData = async () => {
    const typeSubList = await getIndexTreeData({});
    indexTreeData.value = dig(typeSubList.result, true);
  };

  function dig(data, selectIndex) {
    const list: TreeSelectProps['treeData'] = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      const treeNode: TreeSelectProps['treeData'][number] = {
        label: item.name,
        value: item.id,
        parentId: item.parentId,
        disabled: selectIndex ? item.type !== 'index' : false,
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
          indexStorehouseId: e.value,
        });
      });
      saveDataBoard(dataList).then(() => {
        message.success('操作成功');
        queryDataBoardByUserId();
      });
    }
  };
</script>

<style lang="less" scoped>
  .card-content {
    height: 278px;
    margin-right: -13px;
    padding-top: 16px;

    .data-board-item {
      width: 170px;
      height: 100px;
      margin: 0 12px 16px 0;
      padding-top: 14px;
      padding-left: 20px;
      float: left;
      border-radius: 2px;
      line-height: 1;

      .label-text {
        margin-bottom: 8px;
        font-size: 13px;
      }

      .value-text {
        margin-bottom: 12px;
        font-size: 24px;
        font-weight: 500;
      }

      .percentage-box {
        display: flex;
        align-items: center;
        font-size: 12px;
      }

      .pLabel-text {
        margin-right: 11px;
      }

      .pValue-text {
        &.up {
          color: #ff4d4f;
        }

        &.up::before {
          content: '▲';
          display: inline-block;
          transform: scale(0.6);
          color: #ff4d4f;
        }

        &.down {
          color: #52c41a;
        }

        &.down::before {
          content: '▼';
          display: inline-block;
          transform: scale(0.6);
          color: #52c41a;
        }
      }
    }
  }
</style>
