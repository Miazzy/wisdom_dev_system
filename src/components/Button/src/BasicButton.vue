<template>
  <Button v-bind="getBindValue" :class="getButtonClass" :disabled="tDisabled" @click="handleClick">
    <template #default="data">
      <Icon :icon="preIcon" v-if="preIcon" :size="iconSize" />
      <slot v-bind="data || {}"></slot>
      <Icon :icon="postIcon" v-if="postIcon" :size="iconSize" />
    </template>
  </Button>
</template>

<script lang="ts" setup>
  import { Button } from 'ant-design-vue';
  import { computed, ref, unref, onMounted, watch } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { buttonProps } from './props';
  import { useAttrs } from '@vben/hooks';

  defineOptions({
    name: 'AButton',
    extends: Button,
    inheritAttrs: false,
  });

  const props = defineProps(buttonProps);
  const tDisabled = ref();
  const attrs = useAttrs({ excludeDefaultKeys: false });
  const getButtonClass = computed(() => {
    const { color, disabled } = props;
    return [
      {
        [`ant-btn-${color}`]: !!color,
        [`is-disabled`]: disabled,
      },
    ];
  });

  const handleClick = () => {
    handleDisableToggle();
  };

  const handleDisableToggle = () => {
    if (!props.disabled) {
      tDisabled.value = true;
      setTimeout(() => {
        tDisabled.value = false;
      }, props.time || 1000);
    }
  };

  const getBindValue = computed(() => ({ ...unref(attrs), ...props }));

  watch(
    () => props.disabled,
    () => {
      tDisabled.value = props.disabled;
    },
  );

  onMounted(() => {
    tDisabled.value = props.disabled;
  });
</script>
