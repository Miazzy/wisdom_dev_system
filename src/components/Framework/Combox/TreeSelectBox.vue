<template>
  <a-tree-select
    v-if="props.vmode == 'edit' || props.disabled"
    v-model:value="selectedValue"
    v-model:searchValue="searchValue"
    show-search
    :style="`width: ${typeof props.width == 'number' ? props.width + 'px' : props.width}`"
    :dropdown-style="{ maxHeight: '400px', width: '500px', overflow: 'auto' }"
    placeholder="请选择..."
    allow-clear
    :disabled="isDisabled"
    :tree-default-expand-all="treeDefaultExpandAll"
    :multiple="props.multiple"
    :dropdownMatchSelectWidth="props.twidth"
    :tree-data="treeData"
    :field-names="newTfields"
    :tree-node-filter-prop="props.filterName"
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
  import { ref, onMounted, defineProps, defineEmits, watch, unref, reactive, computed } from 'vue';
  import { getCustomCompOptions } from '@/utils/cache';
  import { MsgManager } from '/@/message/MsgManager';

  const selectedValue = ref<any>();
  const props = defineProps({
    vmode: { type: String, default: 'edit' },
    opkey: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    width: { type: [Number, String], default: '100%' },
    twidth: { type: [Boolean, Number], default: true },
    type: { type: String, default: '' },
    treeCheckable: { type: Boolean, default: false },
    treeDefaultExpandAll: { type: Boolean, default: true },
    value: { type: [String, Array], default: null },
    data: { type: Array, default: [] },
    multiple: { type: [String, Boolean], default: false },
    treeLine: { type: [Boolean, Object], default: true && { showLeafIcon: true } },
    tfields: {
      type: Object,
      default: {
        children: 'children',
        label: 'label',
        value: 'value',
      },
    },
    loadData: { type: Function, default: null },
    callback: { type: Function, default: null },
    filterName: { type: String, default: 'label' },
  });

  const newTfields = ref({});
  const tdata = ref([]);
  const treeData = reactive([]);
  const searchValue = ref('');

  // 注入全局的disable状态
  const appDisabled = ref(false);

  // 根据disable状态计算出组件的disable状态
  const isDisabled = computed(() => {
    return props.disabled || appDisabled.value;
  });

  // 定义emits
  const emit = defineEmits(['update:value', 'change', 'select', 'search', 'expand']);

  const findOption = (value) => {
    try {
      const item = findNodeByValue(treeData, value);
      return item ? Reflect.get(item, newTfields.value.label) : value;
    } catch (error) {
      return value;
    }
  };

  const isNodeEqual = (elem, value, tfields) => {
    try {
      if (Reflect.has(elem, tfields.value)) {
        return Reflect.get(elem, tfields.value) === value;
      } else if (Reflect.has(elem, tfields.label)) {
        return Reflect.get(elem, tfields.label) === value;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  };

  const findNodeByValue = (tree: Array<any>, value: string): any => {
    if (tree == null || typeof tree == 'undefined') {
      return null;
    }
    try {
      for (let i = 0; i < tree.length; i++) {
        const element = tree[i];
        if (isNodeEqual(element, value, newTfields.value)) {
          return element;
        }
        const result = findNodeByValue(element.children, value);
        if (result) {
          return result;
        }
      }
    } catch (error) {
      return null;
    }
    return null;
  };

  const handleChange = (value, label, extra) => {
    emit('change', value, label, extra);
  };

  const handleSelect = (value, node, extra) => {
    emit('select', value, node, extra);
    if (props.callback != null) {
      props.callback(value, node, extra);
    }
  };

  const handleSearch = (value, node, extra) => {
    emit('search', value, node, extra);
  };

  const handleExpand = (expandedKeys) => {
    emit('expand', expandedKeys);
  };

  const reloadData = () => {
    try {
      let options = null;
      if (props.opkey != null && props.opkey != '') {
        options = getCustomCompOptions(props.opkey);
        newTfields.value = options?.tfields;
        tdata.value = unref(options?.data);
      } else {
        newTfields.value = props?.tfields;
        tdata.value = props?.data as never[];
      }
      treeData.splice(0, treeData.length);
      treeData.push(...tdata.value);
    } catch (error) {
      //
    }
  };

  watch(
    () => props.value,
    () => {
      try {
        selectedValue.value = props?.value;
      } catch (error) {
        //
      }
    },
  );

  watch(
    () => props.data,
    () => {
      reloadData();
    },
  );

  // 启动加载
  onMounted(async () => {
    try {
      selectedValue.value = props?.value;
      reloadData();
      MsgManager.getInstance().listen('global-disabled', (message) => { appDisabled.value = message; });
    } catch (error) {
      //
    }
  });
</script>
