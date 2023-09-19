<template>
  <Dialog
    ref="comboDialog"
    :title="title"
    :visible="modalVisible"
    @update:visible="updateVisible"
    :width="props.width"
    :height="props.height"
    @cancel="cancel"
    @confirm="confirm"
  >
    <div class="dialog-content dialog" :style="`height: calc(${props.height}px - 90px)`">
      <!-- 左侧分类树 -->
      <div class="category-tree">
        <div class="category-title">
          <span class="title-value">分类</span>
        </div>
        <div class="tree-content">
          <div class="tree-value" :style="`margin: 10px 0px 0px 0px; height: calc(${props.height}px - 140px); overflow-y: scroll;`"> 
            <!-- 基础Tree组件 -->
            <a-tree :tree-data="treeData" show-icon default-expand-all >
              <template #switcherIcon="{ switcherCls }">
                <Icon :icon="props.ticons.parent" color="#333" size="14" :class="switcherCls" />
              </template>
              <template #icon="{ key, isLeaf }">
                <Icon v-if="isLeaf" :icon="props.ticons.leaf" color="#333" size="14" />
              </template>
            </a-tree>
          </div>
        </div>
      </div>

      <!-- 右侧表格 -->
      <div class="category-table">
        <div class="category-title">
          <span class="title-value">列表</span>
        </div>
        <div class="category-table-content">
          <div class="search-content">
            <div class="search-key">
              关键字：
            </div>
            <div class="search-input">
              <a-input placeholder="请输入搜索关键字..." />
            </div>
            <div class="search-button">
              <a-button size="middle" preIcon="ant-design:search" type="primary" style="width: 80px; border-radius: 4px;">搜索</a-button>
            </div>
          </div>
          <div id="combo-dialog-table" class="table-content" >
            <a-table size="small" :columns="props.gcolumns" :data-source="gdata" :scroll="{ y: theight }"  >
            </a-table>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
  import Dialog from '@/components/Framework/Modal/Dialog.vue';
  import { ref, defineProps, defineEmits, computed, onMounted, watch, unref } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { TreeItem } from '../../Tree';

  const modalVisible = ref(false);
  const treeData = ref([]);
  const theight = ref(300);
  const comboDialog = ref<any>(null);
  type fieldType = { key: String; title: String };
  type tIconsType = { parent: String, leaf: String };

  const props = defineProps({
    visible: Boolean, // 是否显示弹框
    title: String, // 弹框标题
    width: { type: Number, default: 700 }, // 弹框宽度
    height: { type: Number, default: 500 }, // 弹框高度
    tdata: { type: Array }, // Tree数据
    tfields: {
      type: Object,
      default: { key: 'id', title: 'title' } as fieldType,
    }, // Tree数据的对应字段解析
    ticons: {
      type: Object,
      default: { parent: 'ant-design:down-outlined', leaf: 'gridicons:multiple-users' } as tIconsType,
    },
    gdata: { type: Array, default: <any>[] }, // 表格数据
    gcolumns: { type: Array, default: <any>[] },
  });

  const emit = defineEmits(['update:visible', 'cancel', 'confirm']); // 定义事件

  const cancel = () => {
    emit('cancel'); // 发送取消事件
  };

  const confirm = () => {
    emit('confirm'); // 发送确定事件
  };

  const updateVisible = ($event) => {
    modalVisible.value = $event;
    emit('update:visible', false); // 关闭弹框
  };

  // 按tfields生成转换规则
  const reverseRule = (rule) => {
    const reversedRule = {};
    for (const key in rule) {
      reversedRule[rule[key]] = key;
    }
    return reversedRule;
  };

  // 按tfields的设置转换tree的数据
  const transformData = (data, rule) => {
    const rules = reverseRule(rule);
    return data.map((item) => {
      const newItem = {};
      for (const key in item) {
        if (key in rules) {
          newItem[rules[key]] = item[key];
        } else {
          newItem[key] = item[key];
        }
      }
      if (item.children && item.children.length > 0) {
        newItem.children = transformData(item.children, rule);
      }
      return newItem;
    });
  };

  const setTableHeight = (height) => {
    const comboTableBody = document.querySelector('#combo-dialog-table .ant-table-body');
    if (comboTableBody && comboTableBody.style) {
      comboTableBody.style.minHeight = `${height}px`;
    }
  }

  watch(
    () => props.visible,
    (newValue) => {
      modalVisible.value = newValue;
    },
  );

  watch(
    () => props.height,
    (newValue) => {
      theight.value = newValue - 260;
    },
  );

  watch(
    () => props.tdata,
    (newValue) => {
      const rule = props?.tfields as fieldType;
      const data = unref(props.tdata as unknown[] as TreeItem[]);
      treeData.value = transformData(data, rule);
    },
  );

  onMounted(() => {
    theight.value = props.height - 260;
    modalVisible.value = props.visible; // 根据传入参数控制Dialog显示  
  });
</script>

<style lang="less" scoped>
  .dialog-content {
    display: flex; /* 使用 flex 布局 */
    align-items: stretch; /* 垂直方向拉伸填充 */
    justify-content: flex-start; /* 左对齐，左侧占据1/4 */
  }

  .category-tree {
    flex: 3;
    padding: 10px;
    border-right: 1px solid #ebebeb; /* 右侧加上分割线 */
    text-align: left;

    div.category-title {
      display: block;
      position: inherit;
      width: calc(100% + 30px);
      margin-bottom: 0;
      margin-left: -20px;
      padding-bottom: 5px;
      border-bottom: 1px solid #f0f0f0;

      span.title-value {
        margin: 0 0 0 20px;
      }
    }

    div.tree-content {
      .tree-value {

      }
    }
  }

  .category-table {
    flex: 7;
    padding: 10px;
    text-align: left;

    div.category-title {
      width: calc(100% + 20px);
      margin-bottom: 0;
      margin-left: -10px;
      padding-bottom: 5px;
      border-bottom: 1px solid #f0f0f0;

      span.title-value {
        margin: 0 0 0 15px;
      }
    }

    div.category-table-content {
      width: 100%;
      height: 100%;

      div.search-content {
        display: flex; /* 使用 flex 布局 */
        align-items: stretch; /* 垂直方向拉伸填充 */
        justify-content: flex-start; /* 左对齐，左侧占据1/4 */
        height: 50px;
        border-bottom: 1px solid #fafafa;

        div.search-key {
          flex: 2;
          margin: 15px 15px 0 0;
          text-align: right;
        }

        div.search-input {
          flex: 6;
          margin: 10px 0 0;
          text-align: left;

          .app-iconify.anticon {
            margin-left: -3px;
          }
        }

        div.search-button {
          flex: 5;
          margin: 10px 10px 0;
        }
      }

      div.table-content {
        :deep(.ant-table-pagination.ant-pagination) {
          margin: 10px 0 0;
        }

        :deep(.ant-table-body) {
          height: 100vh;
        }
      }
    }
  }
</style>
