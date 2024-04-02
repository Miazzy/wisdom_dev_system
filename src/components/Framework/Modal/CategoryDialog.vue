<template>
  <Dialog ref="comboDialog" :title="title" :visible="modalVisible" @update:visible="updateVisible" :width="props.width" :height="props.height" @cancel="cancel" @confirm="confirm">
    <div class="dialog-content dialog" :style="`height: calc(${props.height}px - 90px)`">
      <!-- 左侧分类树 -->
      <div class="category-tree">
        <div class="category-title">
          <span class="title-value">分类</span>
        </div>
        <div class="tree-content">
          <div class="tree-value" :style="`height: calc(${props.height}px - 140px);`">
            <!-- 基础Tree组件 -->
            <a-tree :tree-data="treeData" show-icon default-expand-all @select="handleSelect">
              <template #switcherIcon="{ switcherCls }">
                <Icon :icon="props.ticons.parent" size="14" :class="switcherCls" />
              </template>
              <template #icon="{ key, isLeaf }">
                <Icon v-if="isLeaf && !isTopNode(key)" :icon="props.ticons.leaf" size="14" />
                <Icon v-if="!isLeaf && !isTopNode(key)" :icon="props.ticons.middle" size="14" />
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
              <a-input v-model:value="searchText" placeholder="请输入搜索关键字..." />
            </div>
            <div class="search-button">
              <a-button size="middle" preIcon="ant-design:search" type="primary" style="width: 80px;" @click="handleSearch">搜索</a-button>
            </div>
          </div>
          <div id="combo-dialog-table" class="table-content">
            <a-table size="small" :columns="props.gcolumns" :data-source="filterGdata" :scroll="{ y: theight }" :customRow="handleTableClick"
              :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)" bordered>
            </a-table>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
  import Dialog from '@/components/Framework/Modal/Dialog.vue';
  import { ref, defineProps, defineEmits, onMounted, watch, unref } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { TreeItem } from '@/components/Tree';

  const modalVisible = ref(false);
  const treeData = ref([]);
  const theight = ref(300);
  const filterGdata = ref<any>([]);
  const comboDialog = ref<any>(null);
  const searchText = ref('');
  const selectedNode = ref(null);
  const treeMap = ref<any>();
  type fieldType = { key: String; title: String };
  type tIconsType = { parent: String; leaf: String };

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
      default: {
        parent: 'ant-design:down-outlined',
        middle: 'mingcute:department-line',
        leaf: 'gridicons:multiple-users',
      } as tIconsType,
    },
    gdata: { type: Array, default: <any>[] }, // 表格数据
    gcolumns: { type: Array, default: <any>[] },
  });

  const emit = defineEmits(['update:visible', 'cancel', 'confirm', 'tclick']); // 定义事件

  const cancel = () => {
    // modalVisible.value = false;
    // emit('update:visible', false); // 关闭弹框
    emit('cancel'); // 发送取消事件
  };

  const confirm = () => {
    // modalVisible.value = false;
    // emit('update:visible', false); // 关闭弹框
    emit('confirm', unref(selectedNode)); // 发送确定事件
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

  // 判断是否为顶层节点
  const isTopNode = (key) => {
    return !!treeMap.value.get(key);
  };

  // 按tfields的设置转换tree的数据
  const transformData = (data, rule) => {
    const rules = reverseRule(rule);
    return data.map((item) => {
      const newItem = {};
      for (const key in item) {
        if (key in rules) {
          if (rules[key] == 'title') {
            newItem[rules[key]] = item[key];
            newItem[key] = item[key];
          } else if (rules[key] == 'id') {
            newItem[rules[key]] = parseInt(Math.random() * 100) + '@' + item[key];
            newItem[key] = item[key];
          }
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

  // 列表搜索点击事件
  const handleSearch = () => {
    const selectedTitle = searchText.value;
    const dataList = props.gdata as any[];

    // 使用筛选函数，根据 selectedTitle 筛选出匹配项
    filterGdata.value = dataList.filter((item) => {
      return JSON.stringify(item).includes(selectedTitle);
    });
  };

  // 树节点选中事件
  const handleSelect = (nodeKey, event) => {
    const node = event.node;
    const selectedTitle = node.title; // 获取选中节点的标题
    const dataList = props.gdata as any[];

    // 使用筛选函数，根据 selectedTitle 筛选出匹配项
    filterGdata.value = dataList.filter((item) => {
      return JSON.stringify(item).includes(selectedTitle);
    });
  };

  // 将数据节点转换为Map
  const transformMap = (data, rule) => {
    const treeMap = new Map();
    data.forEach((item) => {
      const key = item[rule['key']];
      treeMap.set(key, item);
    });
    return treeMap;
  };

  // 表格点击事件
  const handleTableClick = (record, index) => {
    const clickFunc = (event) => {
      // 获取当前点击的行
      const currentRow = event.currentTarget;
      // 获取所有兄弟节点
      const siblingRows = currentRow.parentElement.querySelectorAll('.ant-table-row');
      // 移除兄弟节点中的 selected 类样式
      siblingRows.forEach((siblingRow) => {
        siblingRow.classList.remove('selected');
      });
      // 为当前行添加 selected 类样式
      currentRow.classList.add('selected');
      // 设置选中的节点
      selectedNode.value = record;
      // 触发tclick事件
      emit('tclick', { record, index }, event);
    };
    return {
      onclick: clickFunc,
    };
  };

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
      treeMap.value = transformMap(data, rule);
    },
  );

  onMounted(() => {
    theight.value = props.height - 260;
    modalVisible.value = props.visible; // 根据传入参数控制Dialog显示
    filterGdata.value = props.gdata as unknown[];
  });
</script>
<style lang="less">
  [data-theme='dark'] {
    .theme1 {
      .category-tree {
        div.category-content {
          div.category-search-box {
            .search-icon {
              .rotate-left {
                color: #f0f0f0 !important;
              }

              .icon-delete {
                color: #f0f0f0 !important;
              }
            }
          }
        }
      }

      .category-tree {
        border-right: 1px solid rgb(255 255 255 / 16%);

        span.category-title {
          border-bottom: 1px solid rgb(255 255 255 / 16%);
        }

        div.category-content div.category-search-box {
          border-bottom: 1px solid rgb(255 255 255 / 16%);
        }

        div.category-content div.category-search-box .search-icon {
          border: 1px solid rgb(255 255 255 / 16%);
        }
      }
      .employee-table {
        span.employee-title {
          border-bottom: 1px solid rgb(255 255 255 / 16%);
        }
      }
    }
  }

  .theme3 {
    .category-tree {
      border-right: 1px solid #ebebeb;

      span.category-title {
        border-bottom: 1px solid #f0f0f0;
      }

      div.category-content div.category-search-box {
        border-bottom: 1px solid #f0f0f0;
      }

      div.category-content div.category-search-box .search-icon {
        border: 1px solid rgb(240 240 240);
      }
    }
    .employee-table {
      span.employee-title {
        border-bottom: 1px solid rgb(240 240 240);
      }
    }
  }
</style>
<style lang="less" scoped>
  .dialog-content {
    display: flex;

    /* 使用 flex 布局 */
    align-items: stretch;

    /* 垂直方向拉伸填充 */
    justify-content: flex-start;

    /* 左对齐，左侧占据1/4 */
  }

  .category-tree {
    flex: 3;
    padding: 10px;

    /* 右侧加上分割线 */
    text-align: left;

    div.category-title {
      display: block;
      position: inherit;
      width: calc(100% + 30px);
      margin-bottom: 0;
      margin-left: -20px;
      padding-bottom: 5px;

      span.title-value {
        margin: 0 0 0 20px;
      }
    }

    div.tree-content {
      .tree-value {
        margin: 10px 0 0;
        overflow-y: scroll;
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

      span.title-value {
        margin: 0 0 0 15px;
      }
    }

    div.category-table-content {
      width: 100%;
      height: 100%;

      div.search-content {
        display: flex;

        /* 使用 flex 布局 */
        align-items: stretch;

        /* 垂直方向拉伸填充 */
        justify-content: flex-start;

        /* 左对齐，左侧占据1/4 */
        height: 50px;

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
