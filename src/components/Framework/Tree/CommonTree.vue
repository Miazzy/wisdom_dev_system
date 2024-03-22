<!--
 * @Description: commonTree组件
 * @Date: 2023-09-22 08:46:00
 * @LastEditTime: 2023-11-13 11:12:36
 * @FilePath: \ygwl-framework\src\components\Framework\Tree\CommonTree.vue
-->
<template>
  <div class="overflow-hidden bg-white" :class="$attrs.class" :style="props.treeStyle">
    <BasicTree
      :title="title"
      :toolbar="toolbar"
      :search="search"
      :canEdit="canEdit"
      :canAdd="canAdd"
      :canDelete="canDelete"
      :treeWrapperClassName="`${treeWrapperHeightClass} overflow-auto`"
      :clickRowToExpand="false"
      :treeData="treeData"
      :fieldNames="fieldNames"
      @select="handleSelect"
      :isShowOperationBtns="isShowOperationBtns"
      ref="basicTreeRef"
      class="fit-basic-tree"
      :checkable="checkable"
      @check="handleCheck"
      :expandedKeys="curExpandedKeys"
      :selectedKeys="curSelectedKeys"
      :expandOnSearch="true"
    >
      <template #headerTitle>
        <span class="vben-basic-title" :title="title">{{ title }}</span>
      </template>
      <template #title="nodeItem">
        <a-tooltip v-if="nodeItem[fieldNames.title || 'title'].length > 9">
          <template #title>{{ nodeItem[fieldNames.title || 'title'] }}</template>
          <span class="common-tree-node-text">{{ nodeItem[fieldNames.title || 'title'] }}</span>
        </a-tooltip>
        <template v-else>{{ nodeItem[fieldNames.title || 'title'] }}</template>
      </template>
    </BasicTree>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, watch, provide, unref, computed, isProxy, toRaw } from 'vue';
  import { BasicTree, TreeItem, TreeActionType } from '/@/components/Tree';
  import { type Nullable } from '@vben/types';
  import type { PropType } from 'vue';

  const treeData = ref<TreeItem[]>([]);
  const props = defineProps({
    title: { type: String }, // 树标题
    value: { type: Array }, // 树的数据
    className: { type: String }, // 组件的样式class名
    isShowOperationBtns: { type: Boolean, default: false }, // 是否在头部显示新增、编辑、删除、刷新的按钮
    toolbar: { type: Boolean, default: true }, // 是否需要头部工具栏
    search: { type: Boolean, default: true }, // 是否需要搜索栏
    canEdit: { type: Boolean, default: true }, // 能否编辑操作
    canAdd: { type: Boolean, default: true }, // 能否新增操作
    canDelete: { type: Boolean, default: true }, // 能否删除操作
    checkable: { type: Boolean, default: false }, // 树节点前是否有复选框
    fieldNames: {
      type: Object,
      default: new Object(),
    }, // 配置树的key和title取值字段名，例如{ key: 'nodeId', title: 'nodeName' }
    expandedKeys: { type: Array as PropType<string[]>, default: [] }, // 选中的树节点
    selectedKeys: { type: Array as PropType<string[]>, default: [] }, // 选中的树节点
    treeStyle: { type: String, default: 'margin: 10px 0 10px 10px' },
  });
  const emit = defineEmits(['select', 'selected', 'edit', 'add', 'delete', 'refresh', 'check']);

  const selectedNode = ref('');
  const curSelectedKeys = ref<any[]>([]);
  const curExpandedKeys = ref<any[]>([]);

  const basicTreeRef = ref<Nullable<TreeActionType>>(null);

  function getTree() {
    const tree = unref(basicTreeRef);
    if (!tree) {
      throw new Error('tree is null!');
    }
    return tree;
  }

  // 获取选中树节点
  function getSelectedTreeNode() {
    return getTree().getSelectedNode(selectedNode.value);
  }

  // 获取
  function getPlainObj(obj) {
    if (obj) {
      return isProxy(obj) ? toRaw(obj.__v_raw) : obj;
    } else {
      return null;
    }
  }

  // 选择
  function handleSelect(keys) {
    if (keys && keys.length > 0) {
      selectedNode.value = keys[0];
      const node = getTree().getSelectedNode(selectedNode.value);
      const rawNode = getPlainObj(node);
      emit('select', rawNode);
    }
  }

  // 复选框勾选
  function handleCheck(keys, e) {
    emit('check', e.checkedNodes);
  }

  // 编辑
  function handleTreeEdit() {
    const node = getTree().getSelectedNode(selectedNode.value) || null;
    emit('edit', node);
  }
  provide('handleTreeEdit', handleTreeEdit);

  // 新增
  function handleTreeAdd() {
    const node = getTree().getSelectedNode(selectedNode.value) || null;
    emit('add', node);
  }
  provide('handleTreeAdd', handleTreeAdd);

  // 删除
  function handleTreeDelete() {
    const node = getTree().getSelectedNode(selectedNode.value) || null;
    emit('delete', node);
  }
  provide('handleTreeDelete', handleTreeDelete);

  // 刷新
  function handleTreeRefresh() {
    emit('refresh');
  }
  provide('handleTreeRefresh', handleTreeRefresh);

  // 使用 watch 监听 value 的变化，并在变化时更新 treeData
  watch(
    () => props.value,
    (newValue) => {
      if (newValue) {
        // 当监听到的数据为null时，不能进行设置，否则存在null时报错导致后续无法渲染
        treeData.value = newValue as unknown as TreeItem[];
      }
    },
  );

  // 计算tree高度
  const treeWrapperHeightClass = computed(() => {
    // return props.search?'h-[calc(100vh-120px-68px)]' : 'h-[calc(100vh-120px-36px)]';
    return props.search ? 'h-[calc(100%-82px)]' : 'h-[calc(100%-48px)]';
  });

  // 勾选所有
  function checkAll() {
    getTree().checkAll(true);
  }
  // 取消勾选
  function cancelCheck() {
    getTree().checkAll(false);
  }

  // 勾选所有
  function loadBadge() {
    getTree().handleBadge();
  }

  // 获取勾选节点
  function getCheckedKeys() {
    let checkedKeys = getTree().getCheckedKeys();
    let checkedNodes = [];
    checkedKeys.forEach((item) => {
      checkedNodes.push(getTree().getSelectedNode(item));
    });
    return checkedNodes;
  }

  watch(
    () => props.selectedKeys,
    (newValue) => {
      selectedNode.value = newValue[0];
      curSelectedKeys.value = props.selectedKeys;
    },
    {
      deep: true,
    },
  );

  watch(
    () => props.expandedKeys,
    () => {
      curExpandedKeys.value = props.expandedKeys;
    },
    {
      deep: true,
    },
  );

  onMounted(() => {
    treeData.value = props.value as unknown as TreeItem[];
    curSelectedKeys.value = props.selectedKeys;
    curExpandedKeys.value = props.expandedKeys;
  });

  defineExpose({ getSelectedTreeNode, checkAll, getCheckedKeys, loadBadge, cancelCheck });
</script>
<style lang="less" scoped>
  .fit-basic-tree {
    :deep(.ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected) {
      background: none;
      color: #1890ff;
    }

    .common-tree-node-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    :deep(.ant-tree-switcher) {
      width: 18px;
      line-height: 28px;
    }
    :deep(.ant-tree .ant-tree-node-content-wrapper) {
      min-height: 28px;
      line-height: 28px;
    }
    :deep(.ant-tree .ant-tree-treenode) {
      padding-left: 9px;
    }
    :deep(.ant-tree) {
      padding-top: 3px;
    }
    :deep(.vben-tree__title) {
      padding-left: 4px;
    }
    :deep(.vben-basic-title) {
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    }
    :deep(.vben-tree-header .ant-btn-sm) {
      padding: 0 6px;
    }
    :deep(.vben-tree-header .ant-input-group-addon) {
      display: none;
    }
    .vben-basic-title {
      padding-left: 7px;
      cursor: pointer;
    }
  }
</style>
