<template>
  <div class="modal-mask" v-if="visible">
    <div class="modal-container" :style="{ width: width + 'px', height: height + 'px' }">
      <div class="modal-header">
        <span :style="`font-size: ${tsize}px;`">{{ title }}</span>
        <button class="modal-close" @click="closeModal">×</button>
      </div>

      <div class="modal-body" :style="{ height: bodyHeight + 'px' }">
        <!-- 插槽：用于自定义弹框内容 -->
        <slot></slot>
      </div>
      <div v-if="props.showBtm" class="modal-footer" style="position: relative">
        <!-- 底部按钮插槽：可以包含“取消”、“确定”按钮 -->
        <div class="footer-button" style="">
          <slot name="footer">
            <button @click="cancel">取消</button>
            <button @click="confirm">确定</button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, defineProps, defineEmits, computed } from 'vue';

  const props = defineProps({
    visible: Boolean, // 是否显示弹框
    title: String, // 弹框标题
    tsize: { type: String, default: '16' }, // 标题大小
    width: { type: Number, default: 800 }, // 弹框宽度
    height: { type: Number, default: 600 }, // 弹框高度
    showBtm: { type: Boolean, default: true },
  });

  const emit = defineEmits(['update:visible', 'cancel', 'confirm']); // 定义事件

  const closeModal = () => {
    emit('update:visible', false); // 关闭弹框
  };

  const cancel = () => {
    emit('cancel'); // 发送取消事件
  };

  const confirm = () => {
    emit('confirm'); // 发送确定事件
  };

  // 计算 modal-body 的高度，减去 header 和 footer 的高度
  const bodyHeight = computed(() => {
    return props.height - 90; // 64 是 header 和 footer 的高度之和
  });
</script>

<style lang="less" scoped>
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
    height: 45px;
    line-height: 45px;
    padding: 0px 5px 0px 10px;
    border-bottom: 1px solid #ebebeb;
    position: relative;

    span {
      position: absolute;
      left: 20px;
      top: 0px;
    }
  }

  .modal-title {
    font-size: 18px;
    font-weight: bold;
  }

  .modal-body {
    padding: 0px 10px 10px 10px;
  }

  .modal-footer {
    line-height: 35px;
    height: 35px;
    padding: 12px;
    border-top: 1px solid #ebebeb;
    text-align: right;

    .footer-button {
      position: absolute;
      top: 2px;
      right: 5px;

      button {
        margin: 1px 0px 1px 10px;
        line-height: 32px;
        height: 35px;
        width: 60px;
        border: 1px solid #f0f0f0;
        border-radius: 4px;
        background: #f0f0f0;
        &:hover {
          cursor: pointer;
          background: #e9e9e9;
        }
      }
    }
  }

  .modal-close {
    position: absolute;
    top: 7px;
    right: 7px;
    font-size: 16px;
    cursor: pointer;
  }

  button.modal-close {
    width: 30px;
    height: 30px;
    line-height: 30px;
    margin-left: 10px;
    padding: 0px 10px;
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
