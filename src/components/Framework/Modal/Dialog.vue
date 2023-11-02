<template>
  <div class="modal-mask" v-if="visible">
    <div class="modal-container" :style="{ width: width + 'px', height: height + 'px' }">
      <div class="modal-header">
        <span :style="`font-size: ${tsize}px;`">{{ title }}</span>
        <button class="modal-close" @click="closeModal">×</button>
      </div>

      <div
        class="modal-body"
        :style="{ height: bodyHeight + 'px', overflowY: overflowY, overflowX: overflowX }"
      >
        <!-- 插槽：用于自定义弹框内容 -->
        <slot v-if="props.mode !== 'iframe'"></slot>
        <iframe v-else :src="props.url" frameborder="0" width="100%" height="100%"></iframe>
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
    mode: { type: String, default: '' },
    url: { type: String, default: '' },
    overflowY: { type: String, default: 'hidden' },
    overflowX: { type: String, default: 'hidden' },
  });

  const emit = defineEmits(['update:visible', 'cancel', 'confirm', 'close']); // 定义事件

  const closeModal = () => {
    emit('update:visible', false); // 关闭弹框
    emit('close');
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
    display: flex;
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgb(0 0 0 / 50%);
  }

  .modal-container {
    width: 400px;
    max-width: 80%;    
    border-radius: 4px;
    box-shadow: 0 2px 4px rgb(0 0 0 / 20%);
    text-align: center;
  }

  .modal-header {    
    position: relative;
    height: 45px;
    padding: 0 5px 0 10px;
    line-height: 45px;

    span {
      position: absolute;
      top: 0;
      left: 20px;
    }
  }

  .modal-title {
    font-size: 18px;
    font-weight: bold;
  }

  .modal-body {
    padding: 0 10px 10px;
  }

  .modal-footer {
    height: 35px;
    padding: 12px;
    line-height: 35px;    
    text-align: right;

    .footer-button {
      position: absolute;
      top: 2px;
      right: 5px;

      button {
        width: 60px;
        height: 35px;
        margin: 1px 0 1px 10px;
        border: 1px solid #f0f0f0;
        border-radius: 4px;
        background: #f0f0f0;
        line-height: 32px;

        &:hover {
          background: #e9e9e9;
          cursor: pointer;
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
    margin-left: 10px;
    padding: 0 10px;
    border: none;
    border-radius: 4px;
    background-color: transparent;
    line-height: 30px;
    cursor: pointer;
  }
</style>
