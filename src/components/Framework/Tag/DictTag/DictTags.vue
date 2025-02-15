<template>
  <a-tag :color="props.color" :value="dictData?.value">{{ dictData?.label }}</a-tag>
</template>
<script lang="ts" setup>
  import { onMounted, watch, ref } from 'vue';
  import { useDictStoreWithOut } from '@/store/modules/dict';
  import { createLocalForage } from '@/utils/cache';
  import { DICT_DATA__KEY } from '@/enums/cacheEnum';

  const ls = createLocalForage();
  const dictData = ref<any>();
  const dictStore = useDictStoreWithOut();

  const props = defineProps({
    color: { type: String },
    type: { type: String },
    value: { type: String },
    dict: { type: Map },
    mode: { type: String, default: 'group' }, // 如果mode为group模式，则统一加载数据
    delaytimes: { type: Number, default: 1000 },
  });

  const getDictData = async (type: string, value: string | number | boolean) => {
    let cache = await ls.fget(DICT_DATA__KEY + type);
    if (!cache) {
      if (props.mode !== 'group') {
        const response = await dictStore.fetchBackendData('', { type });
        const node = response.find((item) => item.value == value);
        dictData.value = node;
        ls.set(type, response, 60 * 60 * 24);
      } else {
        const timestamp = (props.delaytimes * (Math.random() + Math.random() + Math.random())) / 2;
        dictStore.setDictKey(props.type as string);
        setTimeout(async () => {
          const typeList = dictStore.getDictKey.join(',');
          cache = await ls.fget(DICT_DATA__KEY + type);
          if (!cache) {
            const response = await dictStore.fetchBackendData(typeList, props); // 调用后端接口获取数据
            const node = response.find((item) => item.value == value);
            dictData.value = node;
            ls.set(DICT_DATA__KEY + type, response, 60 * 60 * 24);
          } else {
            const node = cache.find((item) => item.value == value);
            dictData.value = node;
          }
        }, timestamp);
      }
    } else {
      const node = cache.find((item) => item.value == value);
      dictData.value = node;
    }
  };

  watch(
    () => props.type,
    () => {
      const type = props.type as string;
      const value = props.value as string | number | boolean;
      getDictData(type, value);
    },
  );

  onMounted(() => {
    const type = props.type as string;
    const value = props.value as string | number | boolean;
    getDictData(type, value);
  });
</script>
<style lang="less" scoped>
  .workflow-approve-box {
    .button-content {
      margin: 16px 0 0 16px;
      .ant-btn {
        margin: 0px 10px 0px 0px;
      }
    }
  }
</style>
