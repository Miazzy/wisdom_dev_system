<template>
  <a-select
    v-model:value="selectedValue"
    show-search
    placeholder="请选择数据..."
    :style="`width: ${props.width}px`"
    :options="options"
    :filter-option="filterOption"
    @change="handleChange"
  />
</template>
<script lang="ts" setup>
  import type { SelectProps } from 'ant-design-vue';
  import { ref, onMounted, defineProps, defineEmits } from 'vue';
  import { getDictDataMap } from '/@/api/system/dict/data';
  import { useDictStoreWithOut } from '@/store/modules/dict';

  const dictStore = useDictStoreWithOut();
  const selectedValue = ref<string | undefined>('');
  const options = ref<SelectProps['options']>([]);

  const props = defineProps({
    mode: { type: String, default: 'group' }, // 如果mode为group模式，则统一加载数据
    width: { type: Number, default: 220 },
    type: { type: String, default: '' },
    filter: { type: Function, default: null },
    value: { type: String, default: '' }, // 搜索框文本
  });

  // 选中下拉框选项事件函数
  const handleChange = (value: string, node) => {
    emit('update:value', value);
    emit('change', value, node, options.value);
  };

  // 选项过滤函数
  const filterOption = (input: string, option: any) => {
    if (props.filter == null) {
      return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    } else {
      return props.filter(input, option);
    }
  };

  // 定义emits
  const emit = defineEmits(['update:value', 'change']);

  // 启动加载
  onMounted(async () => {
    // 在组件挂载后，通过后端接口获取数据字段的数据
    try {
      if (props.mode !== 'group') {
        const response = await fetchBackendData(); // 调用后端接口获取数据
        // 格式化后端数据，将数据转换为适用于下拉框的格式
        options.value = response;
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  });

  // 获取后端数据
  async function fetchBackendData() {
    // 调用后端接口获取数据的逻辑，返回数据数组
    const response = await getDictDataMap({ dictTypeList: props.type });
    // 返回查询结果
    if (Reflect.has(response, 'result') && Reflect.has(response.result, props.type)) {
      return response.result[props.type];
    }
    return [];
  }
</script>
