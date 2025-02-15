<template>
  <Dialog :title="title" :visible="modalVisible" @update:visible="updateVisible" :width="props.width" :height="props.height" @close="handleClose">
    <template #default>
      <div class="dialog-content" :style="`height: calc(${props.height}px - 90px)`">
        <!-- 左侧分类树 -->
        <div class="category-tree">
          <div class="category-content" :style="`height: calc(${props.height}px - 130px)`">
            <div class="category-search-box" style="position: relative">
              <span class="search-title" style="">搜索</span>
              <a-input-search v-model:value="searchText" class="search-input" placeholder="请输入搜索内容" enter-button @change="handleSearch" @search="handleSearch" @keydown.prevent.enter="preventEnter" />
              <span class="search-icon" style="left: 300px">
                <Icon icon="mdi:arrow-up" size="22" class="rotate-left" @click="handleNode" />
              </span>
              <span class="search-icon" style="left: 340px">
                <Icon icon="material-symbols:delete-outline" size="22" @click="handleDelete" />
              </span>
            </div>
            <div class="tree-value" :style="`height: calc(${props.height}px - 180px);`">
              <!-- 基础Tree组件 -->
              <a-tree v-if="searchText.length <= 0" :tree-data="treeData" show-icon :default-expand-all="false" checkable checkStrictly :selectable="false" v-model:checkedKeys="checkedKeys"
                @check="handleCheck">
                <template #switcherIcon="{ switcherCls }">
                  <Icon :icon="props.ticons.parent" size="14" :class="switcherCls" />
                </template>
                <template #icon="{ key, isLeaf }">
                  <Icon v-if="isLeaf && !isTopNode(key)" :icon="props.ticons.leaf" size="14" />
                  <Icon v-if="!isLeaf && !isTopNode(key)" :icon="props.ticons.middle" size="14" />
                </template>
              </a-tree>

              <a-table v-if="searchText.length > 0" size="small" :columns="scolumns" :data-source="xdataList" :pagination="false" :scroll="{ x: (props.width - 30) / 2, y: props.height - 220 }"
                style="overflow-x: hidden" :customRow="handleTableClick" />
            </div>
          </div>
        </div>

        <!-- 右侧表格 -->
        <div class="employee-table">
          <div class="employee-content">
            <div position="center" class="layout-content" :style="`height: calc(${props.height}px - 120px);`">
              <div class="component-wrap">
                <a-table size="small" :columns="selectedDataColumns" :data-source="allNodes" :pagination="false" :scroll="{ y: props.height - 170 }"
                  :style="`height: calc(${props.height}px - 130px);overflow-x: hidden;`">
                  <template #bodyCell="{ record, index, column}">
                    <template v-if="column.dataIndex === 'index'">
                      <span>{{index + 1}}</span>
                    </template>
                    <template v-else-if="column.dataIndex === 'sort'">
                      
                      <div class="sort-cell">
                        <div v-if="sortIndex[record[props.tfields.key]]" class="editable-cell-input-wrapper">
                          <a-input-number v-model:value="sortIndex[record[props.tfields.key]].index" :min="1" :max="allNodes.length" size="small" :controls="false" />
                          <Icon icon="ant-design:check-outlined" size="12" style="margin-left: 4px;" @click="save(record,index)" />
                        </div>
                        <Icon v-else icon="ant-design:drag-outlined" size="12" @click="edit(record,index)" />
                      </div>
                    </template>
                    <template v-else-if="column.dataIndex === 'action'">
                      <a>
                        <Icon icon="ant-design:delete-filled" size="12" color="#ED6F6F" @click="handleDeleteNode(record, index)" />
                      </a>
                    </template>
                  </template>
                </a-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <a-button v-if="extraFooterBtn" class="btn-margin" type="primary" @click="handleExtra">{{extraFooterBtn}}</a-button>
      <a-button class="btn-margin" @click="cancel">取消</a-button>
      <a-button class="btn-margin" type="primary" @click="confirm">确定</a-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
  import Dialog from '@/components/Framework/Modal/Dialog.vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { ref, defineProps, defineEmits, onMounted, watch, unref, reactive } from 'vue';
  import { TreeItem } from '@/components/Tree';
  import { Modal } from 'ant-design-vue';
  import { SysMessage } from '/@/hooks/web/useMessage';
  import { getOrganTree } from '/@/api/sys/user';
  import { message } from 'ant-design-vue';
  import type { Ref, UnwrapRef } from 'vue';
  import { cloneDeep } from 'lodash-es';

  const modalVisible = ref(false);
  const treeData = ref([]);
  const searchText = ref('');
  const selectedNode = ref(null);
  const checkedKeys = ref({});
  const checkedNodes = ref([]);
  const allNodes = ref<any>([]);
  const treeMap = ref<any>();
  const tdataList = ref<any>([]);
  const xdataList = ref<any>([]);
  const searchTableRef = ref<HTMLElement>();
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
        none: '当前没有被选数据，无法删除！',
        double: '该节点已经被选中！',
        delete: '请您确认是否删除所有勾选节点？',
      } as messageType,
    },
    extraFooterBtn: {
      type: String,
      default: '',
    }, // 自定义的其他操作按钮
    max: { type: Number, default: 99 }, // 最多可选的数据个数
    scolumns: {
      type: Array,
      default: [
        { title: '名称', dataIndex: 'title', key: 'title', fixed: true, width: 80 },
        { title: '公司', dataIndex: 'company', key: 'company', fixed: false, width: 200 },
        { title: '部门', dataIndex: 'dept', key: 'dept', fixed: false, width: 150 },
        { title: '岗位', dataIndex: 'postion', key: 'postion', fixed: false, width: 150 },
      ],
    },
  });

  const emit = defineEmits(['update:visible', 'update:value', 'cancel', 'confirm', 'close', 'extra']); // 定义事件

  const cancel = () => {
    emit('cancel'); // 发送取消事件
  };

  const confirm = () => {
    if (props.max && allNodes.value?.length > props.max) {
      message.warning(`最多选择${props.max}个！`);
      return;
    }
    const rule = props?.tfields as fieldType;
    const data = transformRespData(allNodes.value, rule);
    emit('confirm', data, allNodes.value); // 发送确定事件
  };

  const handleClose = () => {
    emit('cancel'); // 发送取消事件
  };

  const handleExtra = () => {
    emit('extra');
  }; // 自定义其他操作按钮事件

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

  // const handleNode = () => {
  //   const snode = selectedNode.value || {};
  //   console.log('snode', snode);
  //   if (typeof allNodes.value == 'undefined' || allNodes.value == null) {
  //     allNodes.value = [];
  //   }
  //   const findex = allNodes.value
  //     ? allNodes.value.findIndex((x) => {
  //         return (
  //           x[props.tfields.key] === snode[props.tfields.key] &&
  //           x[props.tfields.title] === snode[props.tfields.title]
  //         );
  //       })
  //     : -1;
  //   if (findex < 0) {
  //     // 将选中节点推入allNodes节点中
  //     allNodes.value.push(selectedNode.value);
  //     // 去除掉nodeId相同的节点
  //     const list = allNodes.value.filter((node, index, list) => {
  //       const findIndexValue = list.findIndex((x) => {
  //         return (
  //           x[props.tfields.key] === node[props.tfields.key] &&
  //           x[props.tfields.title] === node[props.tfields.title]
  //         );
  //       });
  //       return findIndexValue === index;
  //     });
  //     allNodes.value = list;
  //   } else {
  //     // message.warning(props.message.double);
  //     SysMessage.getInstance().warning(props.message.double);
  //   }
  //   emit('update:value', allNodes.value);
  // };

  const handleDelete = () => {
    if (allNodes.value && allNodes.value.length > 0) {
      Modal.confirm({
        title: props.message.delete,
        wrapClassName: 'dialog-modal-confirm',
        zIndex: 10010,
        onOk() {
          allNodes.value = [];
          checkedKeys.value.checked = [];
          checkedNodes.value = [];
        },
      });
    } else {
      Modal.warning({
        wrapClassName: 'dialog-modal-warning',
        zIndex: 10010,
        title: props.message.none,
      });
    }
  };

  const handleDeleteNode = (item, index) => {
    allNodes.value = allNodes.value.filter((node, tindex) => tindex !== index);
    let deletedNode = getCheckedNodesByValues(treeData.value, item[[props.tfields.key]])[0];
    checkedKeys.value.checked = checkedKeys.value.checked.filter((node, tindex) => node !== deletedNode.key);
    checkedNodes.value = checkedNodes.value.filter((node, tindex) => node.key !== deletedNode.key);
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
      return !node.disabled && node[props.tfields.title].includes(text);
    });
    xdataList.value = list;
    if(text.length===0) {
      selectedNode.value = null;
    }
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

  const handleCheck = (checkedKeys, e) => {
    checkedNodes.value = e.checkedNodes;
  };
  const handleNode = () => {
    if (selectedNode.value?.key) {
      let flag = true;
      allNodes.value.forEach((i) => {
        if (selectedNode.value[props.tfields.key] === i[props.tfields.key]) {
          flag = false;
          message.warning(props.message.double);
        }
      });
      if (flag) {
        let selectedNodeInTree = getCheckedNodesByValues(treeData.value, [
          selectedNode.value[props.tfields.key],
        ])[0];
        checkedKeys.value.checked.push(selectedNodeInTree.key);
        checkedNodes.value.push(selectedNodeInTree);
      }
    }
    allNodes.value = checkedNodes.value; 
  };

  // 右侧表格
  const selectedDataColumns = ref([
    { title: '序号', dataIndex: 'index', key: 'index', width: 60 },
    { title: '名称', dataIndex: props.tfields.title, key: props.tfields.title },
    { title: '排序', dataIndex: 'sort', key: 'sort', width: 80 },
    { title: '操作', dataIndex: 'action', key: 'action', width: 80 },
  ]);
  const selectedDataList = ref<any>([]);

  function getValueArr(data) {
    let valueArr = [];
    if (data?.length) {
      data.forEach((item) => {
        valueArr.push(item[props.tfields.key]);
      });
    }

    return valueArr;
  };
  function getCheckedKeysByValues(treeData, valueArr) {
    let keyArr = [];
    if (valueArr?.length) {
      treeData.forEach((item) => {
        if (valueArr.includes(item[props.tfields.key])) {
          keyArr.push(item.key);
        }
        if (item.children?.length) {
          keyArr.push(...getCheckedKeysByValues(item.children, valueArr));
        }
      });
    }
    return keyArr;
  }
  function getCheckedNodesByValues(treeData, valueArr) {
    let nodeArr = [];
    if (valueArr?.length) {
      treeData.forEach((item) => {
        if (valueArr.includes(item[props.tfields.key])) {
          nodeArr.push(item);
        }
        if (item.children?.length) {
          nodeArr.push(...getCheckedNodesByValues(item.children, valueArr));
        }
      });
    }
    return nodeArr;
  }
  function getCheckedNodesByKeys(treeData, keyArr) {
    let nodeArr = [];
    if (keyArr?.length) {
      treeData.forEach((item) => {
        if (keyArr.includes(item.key)) {
          nodeArr.push(item);
        }
        if (item.children?.length) {
          nodeArr.push(...getCheckedNodesByKeys(item.children, keyArr));
        }
      });
    }
    return nodeArr;
  }

  // 排序
  const sortIndex = reactive({});

  const edit = (record, index) => {
    sortIndex[record[props.tfields.key]] = { index:index + 1 };
  };
  const save = (record, index) => {
    let arr = [...allNodes.value];
    arr.splice(sortIndex[record[props.tfields.key]].index - 1, 0, arr.splice(index, 1)[0]);
    allNodes.value = arr;
    delete sortIndex[record[props.tfields.key]];
  };

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
      let checkedValues = getValueArr(props.value);
      checkedKeys.value.checked = getCheckedKeysByValues(treeData.value, checkedValues);
      checkedNodes.value = getCheckedNodesByValues(treeData.value, checkedValues);
    },
  );

  onMounted(() => {
    modalVisible.value = props.visible;
    allNodes.value = props.value;
  });
</script>
<style lang="less">
  .ant-modal-root {
    display: flex;
    z-index: 10010;
  }
</style>
<style lang="less" scoped>
  .dialog-content {
    display: flex; /* 使用 flex 布局 */
    align-items: stretch; /* 垂直方向拉伸填充 */
    justify-content: flex-start; /* 左对齐 */
  }

  .category-tree {
    width: 50%;
    padding: 10px;

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
          background: #00427d;
        }
        :deep(.ant-table-body .ant-table-row.selected td) {
          background: #00427d;
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

  .btn-margin {
    margin: 1px 0 1px 10px;
  }

  .editable-cell-input-wrapper {
    display: flex;
    align-items: center;
  }
</style>
