<template>
  <a-radio-group
    v-if="props.vmode == 'edit'"
    v-model:value="radioValue"
    name="radioGroup"
    @change="change"
  >
    <template v-if="props.rtype != 'button'">
      <a-radio
        :style="props.rtype == 'vertical' ? verticalStyle : ''"
        v-for="dict in options"
        :key="dict.value"
        :value="dict.value"
        :label="dict.value"
      >
        {{ dict.label }}
      </a-radio>
    </template>
    <template v-if="props.rtype == 'button'">
      <a-radio-button
        :style="props.rtype == 'vertical' ? verticalStyle : ''"
        v-for="dict in options"
        :key="dict.value"
        :value="dict.value"
        :label="dict.value"
      >
        {{ dict.label }}
      </a-radio-button>
    </template>
  </a-radio-group>
  <span v-if="props.vmode == 'view'">{{ findOption(props.value) }}</span>
</template>
<script lang="ts" setup>
  import type { SelectProps } from 'ant-design-vue';
  import { ref, reactive, onMounted, defineProps, defineEmits, watch } from 'vue';
  import { useDictStoreWithOut } from '@/store/modules/dict';
  import { createLocalStorage } from '@/utils/cache';
  import { DICT_DATA__KEY } from '@/enums/cacheEnum';

  const ls = createLocalStorage();

  const dictStore = useDictStoreWithOut();
  const options = ref<SelectProps['options']>([]);
  const radioValue = ref('');

  const props = defineProps({
    vmode: { type: String, default: 'edit' },
    mode: { type: String, default: 'group' }, // 如果mode为group模式，则统一加载数据
    type: { type: String, default: '' },
    value: { type: String, default: null },
    delaytimes: { type: Number, default: 900 },
    rtype: { type: String, default: 'radio' }, // radio vertical button
  });

  const verticalStyle = reactive({
    display: 'flex',
    height: '30px',
    lineHeight: '30px',
  });

  // 设置value
  const setupValue = () => {
    radioValue.value = props.value as string;
  };

  // 获取change事件
  const change = () => {
    emit('update:value', radioValue.value);
    emit('change', radioValue.value);
  };

  const findOption = (value) => {
    const item = options.value.find((item) => {
      return item.value == value;
    });
    return item ? item?.label : '';
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
