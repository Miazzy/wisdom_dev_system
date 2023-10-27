<!--
 * @Description: 
 * @Date: 2023-09-22 08:46:00
 * @LastEditTime: 2023-10-27 15:16:57
 * @FilePath: \ygwl-framework\src\components\Framework\Tree\CommonTree.vue
-->
<template>
  <div class="m-4 mr-0 overflow-hidden bg-white" :class="$attrs.class" style="border: 1px solid #d9d9d9">
    <BasicTree
      :title="title"
      :toolbar="toolbar"
      :search="search"
      :canEdit="canEdit" :canAdd="canAdd" :canDelete="canDelete"
      treeWrapperClassName="h-[calc(100%-35px)] overflow-auto"
      :clickRowToExpand="false"
      :treeData="treeData"
      :fieldNames="fieldNames"
      @select="handleSelect"
      :isShowOperationBtns="isShowOperationBtns"
      ref="basicTreeRef"
      class="fit-basic-tree"
      :checkable="checkable"
      @check="handleCheck"
    />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, watch, provide, unref } from 'vue';
  import { BasicTree, TreeItem, TreeActionType } from '/@/components/Tree';
  import { type Nullable } from '@vben/types';

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
  });
  const emit = defineEmits(['select', 'edit', 'add', 'delete', 'refresh']);

  const selectedNode = ref('');

  const basicTreeRef = ref<Nullable<TreeActionType>>(null);
  function getTree() {
    const tree = unref(basicTreeRef);
    if (!tree) {
      throw new Error('tree is null!');
    }
    return tree;
  }

  // 选择
  function handleSelect(keys) {
    selectedNode.value = keys[0];
    const node = getTree().getSelectedNode(selectedNode.value);  
    emit('select', node);
  }

  // 复选框勾选
  function handleCheck(keys,e) {
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
      treeData.value = newValue as unknown as TreeItem[];
    },
  );

  onMounted(() => {
    treeData.value = props.value as unknown as TreeItem[];
  });
</script>
<style lang="less" scoped>
  .fit-basic-tree {
    :deep(.ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected) {
      background: none;
      color: #2a7dc9;
    }
  }
</style>
