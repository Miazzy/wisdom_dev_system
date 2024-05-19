<template>
  <Modal v-modal:visible="tVisible" :title="tTitle" @cancel="handleCancel" @ok="handleOk">
    <slot></slot>
  </Modal>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch } from 'vue';
  import { Modal } from 'ant-design-vue';
  import { MsgManager } from '/@/message/MsgManager';
  import { dialogMaskOpen, dialogMaskClose } from '@/utils/mask';

  defineOptions({
    name: 'AModal',
    extends: Modal,
  });

  const props = defineProps({
    visible: { type: Boolean, default: false },
    title: { type: String, default: '' },
  });

  const tVisible = ref(false);
  const tTitle = ref('');

  const emit = defineEmits(['cancel', 'ok']); // 定义事件

  const handleCancel = () => {
    emit('cancel');
    dialogMaskClose();
  };

  const handleOk = () => {
    emit('ok');
    dialogMaskClose();
  };

  watch(
    () => props.visible,
    () => {
      tVisible.value = props.visible;
    },
  );

  watch(
    () => props.title,
    () => {
      tTitle.value = props.title;
    },
  );

  onMounted(() => {
    //
    tVisible.value = props.visible;
    tTitle.value = props.title;
  });
</script>
