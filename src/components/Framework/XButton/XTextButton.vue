<script lang="ts" setup>
  import { computed, PropType, useAttrs } from 'vue';
  import Icon from '@/components/Framework/Icon/Icon.vue';

  defineOptions({ name: 'XTextButton' });

  const props = defineProps({
    modelValue: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    preIcon: { type: String, default: '' },
    postIcon: { type: String, default: '' },
    title: { type: String, default: '' },
    type: { type: String, default: 'primary' },
    circle: { type: Boolean, default: false },
    round: { type: Boolean, default: false },
    plain: { type: Boolean, default: false },
    onClick: { type: Function as PropType<(...args) => any>, default: null },
  });

  const getBindValue = computed(() => {
    const delArr: string[] = ['title', 'preIcon', 'postIcon', 'onClick'];
    const attrs = useAttrs();
    const obj = { ...attrs, ...props };
    for (const key in obj) {
      if (delArr.indexOf(key) !== -1) {
        delete obj[key];
      }
    }
    return obj;
  });
</script>

<template>
  <el-button link v-bind="getBindValue" @click="onClick">
    <Icon v-if="preIcon" :icon="preIcon" class="mr-1px" />
    {{ title ? title : '' }}
    <Icon v-if="postIcon" :icon="postIcon" class="mr-1px" />
  </el-button>
</template>
<style lang="scss" scoped>
  :deep(.el-button.is-text) {
    padding: 8px 4px;
    margin-left: 0;
  }

  :deep(.el-button.is-link) {
    padding: 8px 4px;
    margin-left: 0;
  }
</style>
