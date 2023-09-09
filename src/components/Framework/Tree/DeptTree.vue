<template>
  <div class="m-4 mr-0 overflow-hidden bg-white">
    <BasicTree
      :title="title"
      toolbar
      search
      treeWrapperClassName="h-[calc(100%-35px)] overflow-auto"
      :clickRowToExpand="false"
      :treeData="treeData"
      :fieldNames="{ key: 'id', title: 'deptName' }"
      @select="handleSelect"
    />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue';
  import { BasicTree, TreeItem } from '/@/components/Tree';

  const treeData = ref<TreeItem[]>([]);
  const props = defineProps({
    title: { type: String },
    value: { type: Array },
    className: { type: String },
  });

  const emit = defineEmits(['select']);

  // 树结构，选中触发事件
  function handleSelect(keys, element) {
    emit('select', element.selectedNodes, element);
  }

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
