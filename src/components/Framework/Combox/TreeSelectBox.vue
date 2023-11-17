<template>
  <a-tree-select
    v-if="props.vmode == 'edit' || props.disabled"
    v-model:value="selectedValue"
    show-search
    :style="`width: ${typeof props.width == 'number' ? props.width + 'px' : props.width}`"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    placeholder="请选择..."
    allow-clear
    :disabled="props.disabled"
    :tree-default-expand-all="treeDefaultExpandAll"
    :multiple="props.multiple"
    :tree-data="props.treeData"
    :field-names="props.fieldNames"
    :tree-node-filter-prop="props.treeNodeFilterProp"
    :treeLine="props.treeLine"
    :tree-checkable="props.treeCheckable"
    :load-data="props.loadData"
    @change="handleChange"
    @select="handleSelect"
    @search="handleSearch"
    @tree-expand="handleExpand"
  />
  <span v-if="props.vmode == 'view'">{{ findOption(props.value) }}</span>
</template>
<script lang="ts" setup>
  import { ref, onMounted, defineProps, defineEmits, watch } from 'vue';

  const selectedValue = ref<any>();
  const props = defineProps({
    vmode: { type: String, default: 'edit' },
    disabled: { type: Boolean, default: false },
    width: { type: [Number, String], default: '100%' },
    type: { type: String, default: '' },
    treeCheckable: { type: Boolean, default: false },
    treeDefaultExpandAll: { type: Boolean, default: true },
    value: { type: [String, Array], default: null },
    treeData: { type: Array, default: [] },
    multiple: { type: [String, Boolean], default: false },
    treeLine: { type: [Boolean, Object], default: false },
    fieldNames: {
      type: Object,
      default: {
        children: 'children',
        label: 'label',
        value: 'value',
      },
    },
    loadData: { type: Function, default: null },
    treeNodeFilterProp: { type: String, default: 'label' },
  });

  // 定义emits
  const emit = defineEmits(['update:value', 'change', 'select', 'search', 'expand']);

  const findOption = (value) => {
    const item = props.treeData.find((element) => {
      const elem = element as Object;
      if (Reflect.has(elem, 'value')) {
        return Reflect.get(elem, 'value') === value;
      } else if (Reflect.has(elem, props.fieldNames.value)) {
        return Reflect.get(elem, props.fieldNames.value) === value;
      } else if (Reflect.has(elem, props.fieldNames.label)) {
        return Reflect.get(elem, props.fieldNames.label) === value;
      } else {
        return false;
      }
    });
    return item ? Reflect.get(item, props.fieldNames.label) : value;
  };

  const handleChange = (value, label, extra) => {
    emit('change', value, label, extra);
  };

  const handleSelect = (value, node, extra) => {
    emit('select', value, node, extra);
  };

  const handleSearch = (value, node, extra) => {
    emit('search', value, node, extra);
  };

  const handleExpand = (expandedKeys) => {
    emit('expand', expandedKeys);
  };

  watch(
    () => props.value,
    () => {},
  );

  watch(
    () => props.treeData,
    () => {},
  );

  // 启动加载
  onMounted(async () => {});
</script>
