<template>
  <a-button
    :type="tType"
    :class="tClassName"
    :loading="tLoading"
    :disabled="tDisabled"
    :danger="tDanger"
    :size="tSize"
    @click="handleClick"
  >
    <template v-if="tIcon" #icon>
      <Icon :icon="tIcon" :size="props.iconSize" />
    </template>
    {{ tText }}
  </a-button>
</template>
<script lang="ts" setup>
  import { onMounted, ref, watch, defineProps, defineEmits } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';

  const props = defineProps({
    type: { type: String, default: 'default' }, // primary | ghost | dashed | link | text | default
    className: { type: String, default: '' },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    danger: { type: Boolean, default: false },
    size: { type: String, default: 'middle' },
    icon: { type: String, default: '' },
    iconSize: { type: Number, default: 15 },
    time: { type: Number, default: 1000 },
    text: { type: String, default: '' },
  });

  const tType = ref('default');
  const tClassName = ref('');
  const tLoading = ref(false);
  const tDisabled = ref(false);
  const tDanger = ref(false);
  const tSize = ref('middle');
  const tText = ref('');
  const tIcon = ref('');

  // 定义emits
  const emit = defineEmits(['click']);

  const handleClick = () => {
    emit('click');
    handleDisableToggle();
  };

  const handleDisableToggle = () => {
    if (!props.disabled) {
      tDisabled.value = true;
      setTimeout(() => {
        tDisabled.value = false;
      }, props.time);
    }
  };

  const initProps = () => {
    tType.value = props.type;
    tClassName.value = props.className;
    tLoading.value = props.loading;
    tDisabled.value = props.disabled;
    tDanger.value = props.danger;
    tSize.value = props.size;
    tIcon.value = props.icon;
    tText.value = props.text;
  };

  watch(
    () => props.type,
    () => {
      tType.value = props.type;
    },
  );

  watch(
    () => props.className,
    () => {
      tClassName.value = props.className;
    },
  );

  watch(
    () => props.loading,
    () => {
      tLoading.value = props.loading;
    },
  );

  watch(
    () => props.disabled,
    () => {
      tDisabled.value = props.disabled;
    },
  );

  watch(
    () => props.danger,
    () => {
      tDanger.value = props.danger;
    },
  );

  watch(
    () => props.text,
    () => {
      tText.value = props.text;
    },
  );

  watch(
    () => props.size,
    () => {
      tSize.value = props.size;
    },
  );

  watch(
    () => props.size,
    () => {
      tIcon.value = props.icon;
    },
  );

  onMounted(() => {
    initProps();
  });
</script>
<style lang="less" scoped></style>
