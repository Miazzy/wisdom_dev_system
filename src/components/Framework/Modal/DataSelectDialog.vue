<template>
  <Dialog :title="title" :visible="modalVisible" @update:visible="updateVisible" :width="props.width" :height="props.height" @cancel="cancel" @confirm="confirm" @close="handleClose">
    <div class="dialog-content" :style="`height: calc(${props.height}px - 90px)`">
      <!-- 左侧分类树 -->
      <div class="category-tree">
        <!-- <span class="category-title">
          <span>组织结构</span>
        </span> -->
        <div class="category-content" :style="`height: calc(${props.height}px - 130px)`">
          <div class="category-search-box" style="position: relative">
            <span class="search-title" style="">搜索</span>
            <a-input-search v-model:value="searchText" class="search-input" placeholder="请输入搜索内容" enter-button @change="handleSearch" @search="handleSearch" @keydown.prevent.enter="preventEnter" />
            <span class="search-icon" style="left: 300px">
              <Icon icon="mdi:arrow-up" color="#333" size="22" class="rotate-left" @click="handleNode" />
            </span>
            <span class="search-icon" style="left: 340px">
              <Icon icon="material-symbols:delete-outline" color="#333" size="22" @click="handleDelete" />
            </span>
          </div>
          <div class="tree-value" :style="`height: calc(${props.height}px - 180px);`">
            <!-- 基础Tree组件 -->
            <a-tree v-if="searchText.length <= 0" :tree-data="treeData" show-icon :default-expand-all="false" @select="handleSelect">
              <template #switcherIcon="{ switcherCls }">
                <Icon :icon="props.ticons.parent" color="#333" size="14" :class="switcherCls" />
              </template>
              <template #icon="{ key, isLeaf }">
                <Icon v-if="isLeaf && !isTopNode(key)" :icon="props.ticons.leaf" color="#333" size="14" />
                <Icon v-if="!isLeaf && !isTopNode(key)" :icon="props.ticons.middle" color="#333" size="14" />
              </template>
            </a-tree>

            <a-table v-if="searchText.length > 0" size="small" :columns="scolumns" :data-source="xdataList" :pagination="false" :scroll="{ x: (props.width - 30) / 2, y: props.height - 220 }"
              style="overflow-x: hidden" :customRow="handleTableClick" />
          </div>
        </div>
      </div>

      <!-- 右侧表格 -->
      <div class="employee-table">
        <!-- <span class="employee-title">
          <span>被选人员</span>
        </span> -->
        <div class="employee-content">
          <div position="center" class="layout-content" :style="`height: calc(${props.height}px - 120px);`">
            <div class="component-wrap">
              <!-- <template :key="index" v-for="(item, index) of allNodes">
                <a class="component-item">
                  <span class="ui-component-text" :title="item[props.tfields.title]">
                    {{ item[props.tfields.title] }}
                  </span>
                  <i class="icon-close">
                    <Icon icon="typcn:delete" size="18" @click="handleDeleteNode(item, index)" />
                  </i>
                </a>
              </template> -->
              <a-table size="small" :columns="selectedDataColumns" :data-source="allNodes" :pagination="false" :scroll="{ y: props.height - 170 }"
              :style="`height: calc(${props.height}px - 130px);overflow-x: hidden;`">
                <template #bodyCell="{ record, index, column}">
                  <template v-if="column.dataIndex === 'index'">
                    <span>{{index + 1}}</span>
                  </template>
                  <template v-else-if="column.dataIndex === 'sort'">
                    <Icon icon="ant-design:drag-outlined" size="12" />
                  </template>
                  <template v-else-if="column.dataIndex === 'action'">
                    <a><Icon icon="ant-design:delete-filled" size="12" color="#ED6F6F" @click="handleDeleteNode(record, index)" /></a>
                  </template>
                </template>
              </a-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
  import Dialog from '@/components/Framework/Modal/Dialog.vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { ref, defineProps, defineEmits, onMounted, watch, unref } from 'vue';
  import { TreeItem } from '@/components/Tree';
  import { Modal } from 'ant-design-vue';
  import { SysMessage } from '/@/hooks/web/useMessage';
  import { getOrganTree } from '/@/api/sys/user';

  const modalVisible = ref(false);
  const treeData = ref([]);
  const searchText = ref('');
  const selectedNode = ref(null);
  const allNodes = ref<any>([]);
  const treeMap = ref<any>();
  const tdataList = ref<any>([]);
  const xdataList = ref<any>([]);
  type fieldType = { key: String; title: String; dept: String; postion: String };
  type tIconsType = { parent: String; leaf: String };
  type messageType = { double: String; delete: String };

  const props = defineProps({
    visible: Boolean, // 是否显示弹框
    title: String, // 弹框标题
    width: { type: Number, default: 700 }, // 弹框宽度
    height: { type: Number, default: 500 }, // 弹框高度
    value: { type: Array, default: [] },
    tdata: { type: Array }, // Tree数据
    tfields: {
      type: Object,
      default: {
        key: 'id',
        title: 'title',
        dept: 'dept',
        postion: 'postion',
      } as fieldType,
    }, // Tree数据的对应字段解析
    ticons: {
      type: Object,
      default: {
        parent: 'ant-design:down-outlined',
        middle: 'mingcute:department-line',
        leaf: 'gridicons:multiple-users',
      } as tIconsType,
    },
    message: {
      type: Object,
      default: {
        none: '当前没有被选人员，无法删除！',
        double: '该节点已经被选中，请不要重复勾选！',
        delete: '请您确认是否删除所有勾选节点？',
      } as messageType,
    },
  });

  const emit = defineEmits(['update:visible', 'update:value', 'cancel', 'confirm', 'close']); // 定义事件

  const scolumns = ref([
    { title: '名称', dataIndex: 'title', key: 'title', fixed: true, width: 80 },
    { title: '公司', dataIndex: 'company', key: 'company', fixed: false, width: 200 },
    { title: '部门', dataIndex: 'dept', key: 'dept', fixed: false, width: 150 },
    { title: '岗位', dataIndex: 'postion', key: 'postion', fixed: false, width: 150 },
  ]);

  const cancel = () => {
    emit('cancel'); // 发送取消事件
  };

  const confirm = () => {
    const rule = props?.tfields as fieldType;
    const data = transformRespData(allNodes.value, rule);
    emit('confirm', data, allNodes.value); // 发送确定事件
  };

  const handleClose = () => {
    emit('cancel'); // 发送取消事件
  };

  const updateVisible = ($event) => {
    modalVisible.value = $event;
    emit('update:visible', false); // 关闭弹框
  };

  // 判断是否为顶层节点
  const isTopNode = (key) => {
    return !!treeMap.value.get(key);
  };

  const handleSelect = (nodeKey, event) => {
    const node = event.node;
    selectedNode.value = node;
  };

  const handleNode = () => {
    const snode = selectedNode.value || {};
    console.log('snode', snode);
    if (typeof allNodes.value == 'undefined' || allNodes.value == null) {
      allNodes.value = [];
    }
    const findex = allNodes.value
      ? allNodes.value.findIndex((x) => {
          return (
            x[props.tfields.key] === snode[props.tfields.key] &&
            x[props.tfields.title] === snode[props.tfields.title]
          );
        })
      : -1;
    if (findex < 0) {
      // 将选中节点推入allNodes节点中
      allNodes.value.push(selectedNode.value);
      // 去除掉nodeId相同的节点
      const list = allNodes.value.filter((node, index, list) => {
        const findIndexValue = list.findIndex((x) => {
          return (
            x[props.tfields.key] === node[props.tfields.key] &&
            x[props.tfields.title] === node[props.tfields.title]
          );
        });
        return findIndexValue === index;
      });
      allNodes.value = list;
    } else {
      // message.warning(props.message.double);
      SysMessage.getInstance().warning(props.message.double);
    }
    emit('update:value', allNodes.value);
  };

  const handleDelete = () => {
    if (allNodes.value && allNodes.value.length > 0) {
      Modal.confirm({
        title: props.message.delete,
        onOk() {
          allNodes.value = [];
          emit('update:value', allNodes.value);
        },
      });
    } else {
      Modal.warning({
        title: props.message.none,
      });
    }
  };

  const handleDeleteNode = (item, index) => {
    allNodes.value = allNodes.value.filter((node, tindex) => tindex !== index);
    emit('update:value', allNodes.value);
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
  const transformRespData = (data, rule) => {
    const rules = reverseRule(rule);
    return data.map((item) => {
      const newItem = {};
      for (const key in item) {
        if (key in rules) {
          if (rules[key] == 'title' || rules[key] == 'dept' || rules[key] == 'postion') {
            newItem[rules[key]] = item[key];
            newItem[key] = item[key];
          } else if (rules[key] == 'key') {
            newItem[rules[key]] = parseInt(Math.random() * 100) + '@' + item[key];
            newItem[key] = item[key];
          }
        }
      }
      return newItem;
    });
  };

  // 按tfields的设置转换tree的数据
  const transformTableData = (data, rule, flag = 'top', pnode) => {
    // 获取字段规则
    const rules = reverseRule(rule);
    // 数组遍历
    data.map((item) => {
      const newObj = {};
      for (const key in item) {
        if (key in rules) {
          if (rules[key] == 'title' || rules[key] == 'dept' || rules[key] == 'postion') {
            newObj[rules[key]] = item[key];
            newObj[key] = item[key];
          } else if (rules[key] == 'id') {
            newObj[key] = parseInt(Math.random() * 100) + '@' + item[key];
            newObj[key] = item[key];
          } else if (rules[key] == 'key') {
            newObj[rules[key]] = parseInt(Math.random() * 100) + '@' + item[key];
            newObj[key] = item[key];
          }
        }
        newObj[key] = item[key];
        if (pnode) {
          newObj['parent_node'] = pnode;
        }
      }
      treeMap.value.set(item[props.tfields.key], item);
      tdataList.value.push(newObj);
      if (item.children && item.children.length > 0) {
        transformTableData(item.children, rule, 'none', item);
      }
    });
    // 顶级数组去重
    if (flag == 'top') {
      const list = tdataList.value.filter((node, index, list) => {
        const findIndexValue = list.findIndex((x) => {
          return (
            x[props.tfields.key] === node[props.tfields.key] &&
            x[props.tfields.title] === node[props.tfields.title]
          );
        });
        return findIndexValue === index;
      });
      tdataList.value = list;
    }
  };

  // 按tfields的设置转换tree的数据
  const transformData = (data, rule) => {
    const rules = reverseRule(rule);
    return data.map((item) => {
      const newItem = {};
      for (const key in item) {
        if (key in rules) {
          if (rules[key] == 'title' || rules[key] == 'dept' || rules[key] == 'postion') {
            newItem[rules[key]] = item[key];
            newItem[key] = item[key];
          } else if (rules[key] == 'id') {
            newItem[rules[key]] = parseInt(Math.random() * 100) + '@' + item[key];
            newItem[key] = item[key];
          } else if (rules[key] == 'key') {
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

  // 将数据节点转换为Map
  const transformMap = (data, rule) => {
    const treeMap = new Map();
    data.forEach((item) => {
      const key = item[rule['key']];
      treeMap.set(key, item);
    });
    return treeMap;
  };

  const handleSearch = () => {
    const text = searchText.value ? searchText.value.trim() : '';
    const list = tdataList.value.filter((node) => {
      const flag = node[props.tfields.title].includes(text);
      if (flag) {
        node['company'] = treeMap.value.get(node['orgId'])
          ? treeMap.value.get(node['orgId'])[props.tfields.title]
          : '';
        node['dept'] = treeMap.value.get(node['parent_node']['parentId'])
          ? treeMap.value.get(node['parent_node']['parentId'])[props.tfields.title]
          : '';
        node['postion'] = treeMap.value.get(node['parentId'])
          ? treeMap.value.get(node['parentId'])[props.tfields.title]
          : '';
      }
      return flag;
    });
    xdataList.value = list.map((item) => {
      const { company, dept, key, label, orgId, parentId, parent_node, postion, title, value } = item;
      return { company, dept, key, label, orgId, parentId, parent_node, postion, title, value };
    });
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
    };
    return {
      onclick: clickFunc,
    };
  };

  const preventEnter = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  // 右侧表格
  const selectedDataColumns = ref([
    { title: '序号', dataIndex: 'index', key: 'index', width: 60 },
    { title: '名称', dataIndex: 'title', key: 'title' },
    { title: '排序', dataIndex: 'sort', key: 'sort', width: 80 },
    { title: '操作', dataIndex: 'action', key: 'action', width: 80 },
  ]);
  const selectedDataList = ref<any>([]);

  watch(
    () => props.value,
    (newValue) => {
      if (allNodes.value && newValue && allNodes.value.length != newValue.length) {
        allNodes.value = newValue;
      }
    },
  );

  watch(
    () => props.visible,
    (newValue) => {
      modalVisible.value = newValue;
      if (!newValue) {
        searchText.value = '';
      } else {
        if (allNodes.value && props.value && allNodes.value.length != props.value.length) {
          allNodes.value = props.value;
        }
      }
    },
    {
      deep: true,
    },
  );

  watch(
    () => props.tdata,
    (newValue) => {
      const rule = props?.tfields as fieldType;
      const data = unref(props.tdata as unknown[] as TreeItem[]);
      treeData.value = transformData(data, rule);
      treeMap.value = transformMap(data, rule);
      transformTableData(data, rule, 'top', null);
    },
  );

  onMounted(() => {
    modalVisible.value = props.visible;
    allNodes.value = props.value;
  });
</script>

<style lang="less" scoped>
  .dialog-content {
    display: flex; /* 使用 flex 布局 */
    align-items: stretch; /* 垂直方向拉伸填充 */
    justify-content: flex-start; /* 左对齐 */
  }

  .category-tree {
    width: 50%;
    padding: 10px;
    border-right: 1px solid #ebebeb; /* 右侧加上分割线 */
    text-align: left;

    span.category-title {
      display: block;
      width: calc(100% + 25px);
      margin-left: -17.5px;
      padding-bottom: 5px;
      border-bottom: 1px solid rgb(240 240 240);
      text-align: left;

      span {
        margin-left: 20px;
      }
    }

    div.category-content {
      width: calc(100% + 25px);
      margin-left: -17.5px;

      div.category-search-box {
        width: 100%;
        height: 45px;
        border-bottom: 1px solid #f0f0f0;

        .search-title {
          height: 45px;
          margin: 0 10px 0 20px;
          line-height: 45px;
        }

        .search-input {
          width: 220px;
          height: 45px;
          margin: 5px 0 0;
          line-height: 45px;
        }

        .search-icon {
          display: block;
          position: absolute;
          top: 4px;
          width: 36px;
          height: 35px;
          margin: 0 3px;
          padding-top: 2px;
          border: 1px solid rgb(240 240 240);
          border-radius: 4px;
          line-height: 35px;
          text-align: center;
          cursor: pointer;

          .app-iconify.anticon.rotate-left {
            transform: rotate(90deg);
            transform: rotate(90deg);
          }
        }
      }

      div.tree-value {
        margin: 10px 0 0;
        overflow-y: scroll;
        :deep(.ant-table-pagination.ant-pagination) {
          margin: 10px 0 0;
        }
        :deep(.ant-table-body) {
          height: 100vh;
        }
        :deep(.ant-table-body .ant-table-row.selected) {
          background: var(--el-color-primary-light-8);
        }
        :deep(.ant-table-body .ant-table-row.selected td) {
          background: var(--el-color-primary-light-8);
        }
        :deep(.ant-table-body) {
          overflow-x: hidden;
        }
      }

      :deep(.ant-btn .anticon) {
        margin-top: 7.5px;
      }
    }
  }

  .employee-table {
    width: 50%;
    padding: 10px;
    text-align: left;

    span.employee-title {
      display: block;
      width: calc(100% + 25px);
      margin-left: -17.5px;
      padding-bottom: 5px;
      border-bottom: 1px solid rgb(240 240 240);
      text-align: left;

      span {
        margin-left: 30px;
      }
    }

    div.employee-content {
      .layout-content {
        width: 100%;
        height: auto;
        padding-right: 5px;
        padding-left: 5px;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;

        .component-wrap {
          width: auto;
          padding: 5px;
          float: none;
          overflow: hidden;

          a.component-item {
            display: inline-block;
            height: 30px;
            margin: 5px 4px 0;
            padding: 0 15px;
            float: left;
            border: 1px dashed #cdcdcd;
            background-color: #fff;
            color: #303030;
            line-height: 30px;
            text-decoration: none;
            white-space: nowrap;
            cursor: pointer;

            span.ui-component-text {
              margin: 0 8px 0 0;
            }

            i.icon-close {
              position: absolute;
              margin: 0 2px 0 -5px;
              cursor: pointer;

              span.anticon {
                position: relative;
                top: 2px;
                color: #303030;

                &:hover {
                  position: relative;
                  top: 1px;
                  box-shadow: 0 0 1px 0 rgb(0 0 0 / 10%);
                  color: #6f6f6f;
                }
              }
            }
          }
        }

        :deep(.ant-table-container) {
          height: 100%;
          .ant-table-body {
            height: calc(100% - 40px);
          }
        }
      }
    }
  }
</style>
