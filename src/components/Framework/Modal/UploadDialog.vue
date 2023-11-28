<template>
  <Dialog
    :title="title"
    :visible="modalVisible"
    @update:visible="updateVisible"
    :width="props.width"
    :height="props.height"
    @cancel="cancel"
    @confirm="confirm"
    @close="close"
  >
    <div class="dialog-content" :style="`height: calc(${props.height}px - 90px)`">

    </div>
  </Dialog>
</template>

<script lang="ts" setup>
  import Dialog from '@/components/Framework/Modal/Dialog.vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { ref, defineProps, defineEmits, onMounted, watch, unref } from 'vue';
  import { message, Modal } from 'ant-design-vue';

  const modalVisible = ref(false);

  const props = defineProps({
    visible: Boolean, // 是否显示弹框
    title: String, // 弹框标题
    width: { type: Number, default: 700 }, // 弹框宽度
    height: { type: Number, default: 500 }, // 弹框高度
    tdata: { type: Array }, // 附件数据
  });

  const emit = defineEmits(['update:visible', 'cancel', 'confirm', 'close']); // 定义事件

  const cancel = () => {
    emit('cancel'); // 发送取消事件
  };

  const confirm = () => {
    emit('confirm', []); // 发送确定事件
  };

  const close = () => {
    emit('close', []); // 发送确定事件
  };

  const updateVisible = ($event) => {
    modalVisible.value = $event;
    emit('update:visible', false); // 关闭弹框
  };

  watch(
    () => props.visible,
    (newValue) => {
      modalVisible.value = newValue;
    },
  );

  watch(
    () => props.tdata,
    (newValue) => {

    },
  );

  onMounted(() => {
    modalVisible.value = props.visible;
  });
</script>

<style lang="less" scoped>
  .dialog-content {
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
  }
</style>
