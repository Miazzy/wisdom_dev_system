<template>
  <Button
    v-bind="getBindValue"
    v-auth="tPermissionCode"
    :class="getButtonClass"
    :disabled="isDisabled"
    @click="handleClick"
  >
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
  import { useAttrs, onMountedOrActivated } from '@vben/hooks';
  import { MsgManager } from '/@/message/MsgManager';
  import { urlToPath } from '/@/utils/route';

  defineOptions({
    name: 'AButton',
    extends: Button,
    inheritAttrs: false,
  });

  const props = defineProps(buttonProps);
  const tDisabled = ref();
  const tPermissionCode = ref();
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

  // 注入全局的disable状态
  const appDisabled = ref(false);

  // 根据disable状态计算出组件的disable状态
  const isDisabled = computed(() => {
    const status = tDisabled.value || appDisabled.value;
    return status;
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

  watch(
    () => props.permissionCode,
    () => {
      tPermissionCode.value = props.permissionCode;
    },
  );

  onMountedOrActivated(() => {
    // const { params } = urlToPath();
    // const flag = params['global_disabled'] == 'true' || params['page_readonly'] == 'true';
    // appDisabled.value = flag;
    tPermissionCode.value = props.permissionCode;
    tDisabled.value = props.disabled;
  });
</script>
