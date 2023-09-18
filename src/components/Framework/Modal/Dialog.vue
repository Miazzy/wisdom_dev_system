<template>
  <div class="modal-mask" v-if="visible">
    <div class="modal-container">
      <div class="modal-header">
        <h2>{{ title }}</h2>
        <button class="modal-close" @click="closeModal">×</button>
      </div>
      <div class="modal-body">
        <!-- 插槽：用于自定义弹框内容 -->
        <slot></slot>
      </div>
      <div class="modal-footer">
        <!-- 底部按钮插槽：可以包含“取消”、“确定”按钮 -->
        <slot name="footer">
          <button @click="cancel">取消</button>
          <button @click="confirm">确定</button>
        </slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, defineProps, defineEmits } from 'vue';

  const props = defineProps({
    visible: Boolean, // 是否显示弹框
    title: String, // 弹框标题
  });

  const emit = defineEmits(['update:visible', 'cancel', 'confirm']); // 定义事件

  const closeModal = () => {
    emit('update:visible', false); // 关闭弹框
  };

  const cancel = () => {
    closeModal(); // 触发取消事件，关闭弹框
    emit('cancel'); // 发送取消事件
  };

  const confirm = () => {
    closeModal(); // 触发确定事件，关闭弹框
    emit('confirm'); // 发送确定事件
  };
</script>

<style scoped>
  .modal-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-container {
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    max-width: 80%;
    width: 400px;
    text-align: center;
  }

  .modal-header {
    padding: 12px;
    border-bottom: 1px solid #ebebeb;
    position: relative;
  }

  .modal-title {
    font-size: 18px;
    font-weight: bold;
  }

  .modal-close {
    position: absolute;
    top: 2px;
    right: 4px;
    font-size: 16px;
    cursor: pointer;
  }

  .modal-body {
    padding: 20px;
  }

  .modal-footer {
    padding: 12px;
    border-top: 1px solid #ebebeb;
    text-align: right;
  }

  button.modal-close {
    margin-left: 10px;
    padding: 2px 10px;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    background-color: transparent;
    color: #999;

    &:hover {
      background-color: #f0f0f0;
    }
  }

</style>
