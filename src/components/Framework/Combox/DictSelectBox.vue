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

  const selectedValue = ref<string | undefined>('');
  const options = ref<SelectProps['options']>([]);

  const props = defineProps({
    width: { type: String, default: '220' },
    type: { type: String, default: '' },
    value: { type: String, default: '' }, // 搜索框文本
  });

  const handleChange = (value: string, node) => {
    emit('update:value', value);
    emit('change', value, node, options.value);
  };

  const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  const emit = defineEmits(['update:value', 'change']); // 允许双向绑定searchText

  onMounted(async () => {
    // 在组件挂载后，通过后端接口获取数据字段的数据
    try {
      const response = await fetchBackendData(); // 调用后端接口获取数据
      // 格式化后端数据，将数据转换为适用于下拉框的格式
      options.value = response;
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  });

  // 替换下面的 fetchBackendData 函数为实际的后端接口调用函数
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
