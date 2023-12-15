<template>
  <a-select
    v-if="props.vmode == 'edit' || props.disabled"
    v-model:value="selectedValue"
    show-search
    :mode="props.multiple"
    :disabled="props.disabled"
    placeholder="请选择数据..."
    :style="`width: ${typeof props.width == 'number' ? props.width + 'px' : props.width}`"
    :options="options"
    :filter-option="filterOption"
    @change="handleChange"
  />
  <span v-if="props.vmode == 'view'">{{ findOption(props.value) }}</span>
</template>
<script lang="ts" setup>
  import type { SelectProps } from 'ant-design-vue';
  import { ref, onMounted, defineProps, defineEmits, watch } from 'vue';
  import { useDictStoreWithOut } from '@/store/modules/dict';
  import { createLocalStorage } from '@/utils/cache';
  import { DICT_DATA__KEY } from '@/enums/cacheEnum';

  const ls = createLocalStorage();

  const dictStore = useDictStoreWithOut();
  const selectedValue = ref<any>();
  const options = ref<SelectProps['options']>([]);

  const props = defineProps({
    vmode: { type: String, default: 'edit' },
    disabled: { type: Boolean, default: false },
    mode: { type: String, default: 'group' }, // 如果mode为group模式，则统一加载数据
    width: { type: [Number, String], default: '100%' },
    type: { type: String, default: '' },
    filter: { type: Function, default: null },
    value: { type: [String, Array], default: null }, // 搜索框文本
    delaytimes: { type: Number, default: 900 },
    multiple: { type: String, default: 'combobox' },
    callback: { type: Function, default: null },
  });

  // 选中下拉框选项事件函数
  const handleChange = (value: string, node) => {
    emit('update:value', value);
    emit('change', value, node, options.value);
    if (props.callback != null) {
      props.callback(value, node, options.value);
    }
  };

  // 设置value
  const setupValue = () => {
    if (props.multiple == 'multiple') {
      selectedValue.value = props.value == null ? [] : (props.value as string[]);
    } else {
      selectedValue.value = props.value as string;
    }
  };

  // 选项过滤函数
  const filterOption = (input: string, option: any) => {
    if (props.filter == null) {
      return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    } else {
      return props.filter(input, option);
    }
  };

  const findOption = (value) => {
    const item = options.value.find((item) => {
      return item.value == value;
    });
    return item ? item?.label : value;
  };

  // 定义emits
  const emit = defineEmits(['update:value', 'change']);

  watch(
    () => props.value,
    () => {
      setupValue();
    },
  );

  // 启动加载
  onMounted(async () => {
    // 在组件挂载后，通过后端接口获取数据字段的数据
    try {
      const { type } = props;
      if (props.multiple == 'multiple' || props.multiple == 'tags') {
        selectedValue.value = [];
      }
      let cache = ls.get(DICT_DATA__KEY + type);
      if (!cache) {
        if (props.mode !== 'group') {
          // 调用后端接口获取数据
          const response = await dictStore.fetchBackendData('', props);
          // 格式化后端数据，将数据转换为适用于下拉框的格式
          options.value = response;
          setupValue();
        } else {
          // 数据字典的多个组件示例，初始化时间需要通过此timestamp错开，否则会同时发送多个request请求，当初始化时间错开后，后续的request请求将通过缓存获取返回结果
          const timestamp =
            (props.delaytimes * (Math.random() + Math.random() + Math.random())) / 2;
          dictStore.setDictKey(props.type);
          setTimeout(async () => {
            const typeList = dictStore.getDictKey.join(',');
            cache = ls.get(DICT_DATA__KEY + type);
            if (!cache) {
              // 调用后端接口获取数据
              const response = await dictStore.fetchBackendData(typeList, props);
              // 格式化后端数据，将数据转换为适用于下拉框的格式
              options.value = response;
            } else {
              options.value = cache;
            }
            setupValue();
          }, timestamp);
        }
      } else {
        options.value = cache;
        setupValue();
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  });
</script>
