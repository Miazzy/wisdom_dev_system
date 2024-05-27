<template>
  <a-cascader
    v-if="props.vmode == 'edit' || props.disabled"
    v-model:value="selectedValue"
    :style="`width: ${typeof props.twidth == 'number' ? props.twidth + 'px' : props.twidth}`"
    allow-clear
    placeholder="请选择..."
    :dropdown-style="props.dstyle"
    :disabled="isDisabled"
    :options="cascaderData"
    :show-search="{ filter }"
    :multiple="modeValue"
    :field-names="newTfields"
    :max-tag-count="props.maxTagCount"
    :max-tag-text-length="props.maxTagTextLength"
    @change="handleChange"
    @search="handleSearch"
  />
  <span v-if="props.vmode == 'view'">{{ findOption(props.value) }}</span>
</template>
<script lang="ts" setup>
  import { ref, onMounted, defineProps, defineEmits, watch, unref, reactive, computed } from 'vue';
  import { getCustomCompOptions } from '@/utils/cache';
  import type { ShowSearchType } from 'ant-design-vue/es/cascader';
  import { MsgManager } from '/@/message/MsgManager';

  const selectedValue = ref<any>();
  const props = defineProps({
    vmode: { type: String, default: 'edit' },
    opkey: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    twidth: { type: [Number, String], default: '100%' },
    type: { type: String, default: '' },
    dstyle: { type: Object, default: { maxHeight: '400px', overflow: 'auto' } as Object },
    value: { type: [String, Array], default: null },
    data: { type: Array, default: [] as Array<any> },
    multiple: { type: [String, Boolean], default: false },
    maxTagTextLength: { type: [Number], default: 10 },
    maxTagCount: { type: [String, Number], default: 'responsive' },
    loadData: { type: Function, default: null },
    tfields: { type: Object, default: { label: 'label', value: 'value' } as Object },
    callback: { type: Function, default: null },
  });

  const newTfields = ref({});
  const tdata = ref([]);
  const cascaderData = reactive([]);

  // 注入全局的disable状态
  const appDisabled = ref(false);

  // 根据disable状态计算出组件的disable状态
  const isDisabled = computed(() => {
    return props.disabled || appDisabled.value;
  });

  // 定义emits
  const emit = defineEmits(['update:value', 'change', 'search']);

  // 计算mode值
  const modeValue = computed(() =>
    typeof props.multiple == 'string'
      ? props.multiple == 'multiple'
        ? true
        : false
      : props.multiple,
  );

  // 查找选项
  const findOption = (value) => {
    try {
      const item = findNodeByValue(cascaderData, value);
      return item ? Reflect.get(item, newTfields.value.label) : value;
    } catch (error) {
      return value;
    }
  };

  // 判断是否相等
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

  // 查询元素
  const findNodeByValue = (dataList: Array<any>, value: string): any => {
    if (dataList == null || typeof dataList == 'undefined') {
      return null;
    }
    try {
      for (let i = 0; i < dataList.length; i++) {
        const element = dataList[i];
        if (isNodeEqual(element, value, newTfields.value)) {
          return element;
        }
      }
    } catch (error) {
      return null;
    }
    return null;
  };

  // 处理change函数
  const handleChange = (value, options) => {
    if (typeof value == 'object' && Reflect.has(value, 'value')) {
      emit('update:value', value.value);
    } else if (typeof value == 'string' || typeof value == 'number' || typeof value == 'boolean') {
      emit('update:value', value);
    }
    emit('change', value, options);
    if (props.callback != null) {
      props.callback(value, options);
    }
  };

  // 处理search函数
  const handleSearch = (value, options) => {
    emit('search', value, options);
  };

  // 重新加载
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
      cascaderData.splice(0, cascaderData.length);
      cascaderData.push(...tdata.value);
    } catch (error) {
      //
    }
  };

  // 过滤函数
  const filter: ShowSearchType['filter'] = (inputValue, path) => {
    return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
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
      // MsgManager.getInstance().listen('global-disabled', (message) => { appDisabled.value = message; });
    } catch (error) {
      //
    }
  });
</script>
