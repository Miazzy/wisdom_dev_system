<template>
  <a-select
    v-model:value="selectedValue"
    show-search
    :mode="props.multiple"
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
  import { useDictStoreWithOut } from '@/store/modules/dict';

  const dictStore = useDictStoreWithOut();
  const selectedValue = ref<string | string[] | undefined>('');
  const options = ref<SelectProps['options']>([]);

  const props = defineProps({
    mode: { type: String, default: 'group' }, // 如果mode为group模式，则统一加载数据
    width: { type: Number, default: 220 },
    type: { type: String, default: '' },
    filter: { type: Function, default: null },
    value: { type: [String, Array], default: null }, // 搜索框文本
    delaytimes: { type: Number, default: 900 },
    multiple: { type: String, default: 'combobox' },
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
      if (props.multiple == 'multiple') {
        selectedValue.value = [];
      }
      if (props.mode !== 'group') {
        const response = await dictStore.fetchBackendData('', props); // 调用后端接口获取数据
        // 格式化后端数据，将数据转换为适用于下拉框的格式
        options.value = response;
      } else {
        const timestamp = (props.delaytimes * (Math.random() + Math.random() + Math.random())) / 2; // 数据字典的多个组件示例，初始化时间需要通过此timestamp错开，否则会同时发送多个request请求，当初始化时间错开后，后续的request请求将通过缓存获取返回结果
        dictStore.setDictKey(props.type);
        setTimeout(async () => {
          const typeList = dictStore.getDictKey.join(',');
          const response = await dictStore.fetchBackendData(typeList, props); // 调用后端接口获取数据
          options.value = response; // 格式化后端数据，将数据转换为适用于下拉框的格式
        }, timestamp);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  });
</script>
