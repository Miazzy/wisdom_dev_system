<template>
  <a-select
    v-if="props.vmode == 'edit' || props.disabled"
    v-model:value="selectedValue"
    show-search
    allow-clear
    :mode="props.multiple"
    :disabled="isDisabled"
    :maxTagCount="props.maxTagCount"
    :style="`width: ${typeof props.width == 'number' ? props.width + 'px' : props.width}`"
    :options="options"
    :filter-option="filterOption"
    placeholder="请选择数据..."
    @mouseenter="handleFocus"
    @inputKeyDown="handleFocus"
    @change="handleChange"
  />
  <span v-if="props.vmode == 'view'">{{ findOption(props.value) }}</span>
</template>
<script lang="ts" setup>
  import type { SelectProps } from 'ant-design-vue';
  import { ref, onMounted, defineProps, defineEmits, watch, onActivated, computed } from 'vue';
  import { useDictStoreWithOut } from '@/store/modules/dict';
  import { createLocalStorage } from '@/utils/cache';
  import { DICT_DATA__KEY } from '@/enums/cacheEnum';
  import { MsgManager } from '/@/message/MsgManager';

  const ls = createLocalStorage();

  const dictStore = useDictStoreWithOut();
  const selectedValue = ref<any>();
  const options = ref<SelectProps['options']>([]);

  // 注入全局的disable状态
  const appDisabled = ref(false);

  // 根据disable状态计算出组件的disable状态
  const isDisabled = computed(() => {
    return props.disabled || appDisabled.value;
  });

  const props = defineProps({
    vmode: { type: String, default: 'edit' },
    disabled: { type: Boolean, default: false },
    mode: { type: String, default: 'group' }, // 如果mode为group模式，则统一加载数据
    width: { type: [Number, String], default: '100%' },
    type: { type: String, default: '' },
    subtype: { type: String, default: '' },
    filter: { type: Function, default: null },
    value: { type: [String, Number, Array], default: null }, // 搜索框文本
    delaytimes: { type: Number, default: 900 },
    multiple: { type: String, default: 'combobox' },
    callback: { type: Function, default: null },
    maxTagCount: { type: Number, default: 10 },
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
      selectedValue.value = props.value == null ? [] : (props.value as any[]);
    } else if (typeof props.value == 'string') {
      selectedValue.value = props.value as string;
    } else if (typeof props.value == 'number') {
      selectedValue.value = props.value as number;
    } else {
      selectedValue.value = props.value;
    }

    try {
      if (props.multiple !== 'multiple') {
        const flag =
          options.value &&
          props.value != null &&
          options.value.length > 0 &&
          typeof options.value[0]?.value == 'string';
        if (flag) {
          selectedValue.value = String(props.value);
        } else if (props.value == null) {
          selectedValue.value = null;
        }
      }

      if (props.subtype != '') {
        options.value = options?.value.filter((value) => {
          if (Reflect.has(value, 'relationDict')) {
            return value.relationDict === props.subtype;
          } else {
            return false;
          }
        });
      }
    } catch (error) {
      //
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

  // 处理Focus、keydown等函数
  const handleFocus = () => {
    const { type } = props;
    const list = options.value;
    if (!list || list?.length == 0) {
      console.warn('dict select box of type:', type, ' has not loaded, and load this data again.');
      handleInitData();
    }
  };

  // 处理初始化操作函数
  const handleInitData = async () => {
    // 在组件挂载后，通过后端接口获取数据字段的数据
    try {
      const { type } = props;
      if (props.multiple == 'multiple' || props.multiple == 'tags') {
        selectedValue.value = [];
      }
      let cache = await ls.fget(DICT_DATA__KEY + type);
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
            cache = await ls.fget(DICT_DATA__KEY + type);
            if (!cache) {
              // 调用后端接口获取数据
              let response = await dictStore.fetchBackendData(typeList, props);
              options.value = response;
              if (!response || response.length == 0) {
                // 未获取到数据，则再次加载
                response = await dictStore.fetchBackendData(type, props);
                options.value = response;
              }
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
  };

  watch(
    () => props.value,
    () => {
      setupValue();
    },
  );

  // 处于激活状态时，检查选项是否正常加载，如果未加载则再次加载
  onActivated(async () => {
    setTimeout(() => {
      handleFocus();
    }, 1500);
  });

  // 启动加载
  onMounted(async () => {
    handleInitData();
    MsgManager.getInstance().listen('global-disabled', (message) => { appDisabled.value = message; });
    setTimeout(() => {
      handleFocus();
    }, 1500);
  });
</script>
