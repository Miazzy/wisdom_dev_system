<template>
  <div class="m-4 mr-0 overflow-hidden bg-white" style="border: 1px solid #d9d9d9">
    <BasicTree
      :title="title"
      toolbar
      search
      treeWrapperClassName="h-[calc(100%-35px)] overflow-auto"
      :clickRowToExpand="false"
      :treeData="treeData"
      :fieldNames="fieldNames"
      @select="handleSelect"
      :isShowOperationBtns="isShowOperationBtns"
      ref="basicTreeRef"
      class="fit-basic-tree"
    />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, watch, provide, unref } from 'vue';
  import { BasicTree, TreeItem, TreeActionType } from '/@/components/Tree';
  import { type Nullable } from '@vben/types';

  const treeData = ref<TreeItem[]>([]);
  const props = defineProps({
    title: { type: String },
    value: { type: Array },
    className: { type: String },
    isShowOperationBtns: { type: Boolean, default: false },
    fieldNames: {
      type: Object,
      default: new Object(),
    },
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

  function handleSelect(keys) {
    emit('select', keys[0]);
    selectedNode.value = keys[0];
  }

  // 编辑
  function handleTreeEdit() {
    if (!selectedNode.value) return;
    const node = getTree().getSelectedNode(selectedNode.value);
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
    if (!selectedNode.value) return;
    const node = getTree().getSelectedNode(selectedNode.value);
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
