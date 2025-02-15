<template>
  <teleport v-if="['body', '#app'].includes(props.target)" :to="props.target">
    <div class="modal-mask" v-if="visible" @mousewheel.prevent>
      <div class="modal-mask-container" @mousewheel.prevent></div>
    </div>
  </teleport>
  <teleport v-if="['body', '#app'].includes(props.target)" :to="props.target">
    <div class="modal-mask" v-if="visible">
      <div
        v-if="['body', '#app'].includes(props.target)"
        class="modal-mask-container"
        @mousewheel.prevent
      ></div>
      <div
        class="modal-container"
        :target="props.target"
        :style="{
          width: typeof width == 'number' ? width + 'px' : width,
          height: typeof height == 'number' ? height + 'px' : height,
        }"
      >
        <div class="modal-header">
          <span :style="`font-size: ${props.tsize}px; font-weight: ${props.tweight};`">{{
            title
          }}</span>
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
              <a-button @click="cancel">取消</a-button>
              <a-button type="primary" @click="confirm">确定</a-button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </teleport>
  <template v-if="!['body', '#app'].includes(props.target)">
    <div class="modal-mask" v-if="visible">
      <div
        class="modal-container"
        :target="props.target"
        :style="{
          width: typeof width == 'number' ? width + 'px' : width,
          height: typeof height == 'number' ? height + 'px' : height,
        }"
      >
        <div class="modal-header">
          <span :style="`font-size: ${props.tsize}px; font-weight: ${props.tweight};`">{{
            title
          }}</span>
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
              <a-button @click="cancel">取消</a-button>
              <a-button type="primary" @click="confirm">确定</a-button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script lang="ts" setup>
  import {
    ref,
    defineProps,
    defineEmits,
    computed,
    watch,
    nextTick,
    onMounted,
    getCurrentInstance,
    defineExpose,
  } from 'vue';
  import { MsgManager } from '/@/message/MsgManager';
  import { SysMessage } from '/@/hooks/web/useMessage';
  import { onMountedOrActivated } from '@vben/hooks';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { dialogMaskOpen, dialogMaskClose } from '@/utils/mask';

  defineOptions({
    name: 'Dialog',
  });

  const props = defineProps({
    visible: Boolean, // 是否显示弹框
    title: String, // 弹框标题
    smode: { type: String, default: 'simple' },
    tweight: { type: Number, default: 400 },
    tsize: { type: String, default: '16' }, // 标题大小
    width: { type: [Number, String], default: 800 }, // 弹框宽度
    height: { type: [Number, String], default: 600 }, // 弹框高度
    pheight: { type: Number, default: 121 }, // 弹框高度
    showBtm: { type: Boolean, default: true },
    mode: { type: String, default: '' },
    url: { type: String, default: '' },
    target: { type: String, default: 'body' },
    overflowY: { type: String, default: 'hidden' },
    overflowX: { type: String, default: 'hidden' },
  });

  const userStore = useUserStoreWithOut();
  const emit = defineEmits(['update:visible', 'cancel', 'confirm', 'ok', 'close']); // 定义事件
  const instance = ref();

  const appDom = document.querySelector('div#app');

  const closeModal = () => {
    emit('update:visible', false); // 关闭弹框
    emit('close');
    dialogMaskClose();
  };

  const cancel = () => {
    emit('cancel'); // 发送取消事件
    if (props.smode !== 'simple') {
      //
    } else {
      emit('update:visible', false); // 关闭弹框
      dialogMaskClose();
    }
  };

  const confirm = () => {
    emit('confirm'); // 发送确定事件
    emit('ok'); // 发送确定事件
    if (props.smode == 'simple') {
      emit('update:visible', false); // 关闭弹框
      dialogMaskClose();
    }
  };

  // 计算 modal-body 的高度，减去 header 和 footer 的高度
  const bodyHeight = computed(() => {
    return props.height - props.pheight; // 64 是 header 和 footer 的高度之和
  });

  // 禁用事件回调函数
  const callback = function (event) {
    event.preventDefault();
  };

  // 在 setup 中创建一个变量来保存滚动位置
  const scrollPosition = ref({ x: 0, y: 0 });

  // 在弹出对话框时保存当前滚动位置
  const saveScrollPosition = () => {
    scrollPosition.value = {
      x: window.pageXOffset || document.documentElement.scrollLeft,
      y: window.pageYOffset || document.documentElement.scrollTop,
    };
    window.scrollTo(0, 0);
  };

  // 在关闭对话框时恢复滚动位置
  const restoreScrollPosition = () => {
    window.scrollTo(scrollPosition.value.x, scrollPosition.value.y);
  };

  // 禁止页面滚动事件
  const disableScroll = () => {
    if (props.target === 'body') {
      saveScrollPosition();
      appDom.addEventListener('mousewheel', callback, { passive: false });
      nextTick(() => {
        appDom.classList.add('modal-open');
        dialogMaskOpen();
      });
    }
  };

  // 恢复页面滚动事件
  const enableScroll = () => {
    appDom.removeEventListener('mousewheel', callback, { passive: false });
    appDom.classList.remove('modal-open');
    dialogMaskClose();
    restoreScrollPosition();
  };

  // 监听当前Dialog是否显示
  watch(
    () => props.visible,
    (value) => {
      if (value) {
        disableScroll();
      } else {
        enableScroll();
      }
    },
    { deep: true },
  );

  defineExpose({
    closeModal,
  });

  onMountedOrActivated(() => {
    // 监听check-iframe-framepage消息
    instance.value = getCurrentInstance();

    MsgManager.getInstance().listen('iframe-dialog-close', () => {
      closeModal();
      enableScroll();
    });

    if (props.target === 'body' && props.visible) {
      disableScroll();
    }
  });
</script>

<style lang="less">
  .ant-modal-wrap {
    z-index: 10010;
  }
</style>
<style lang="less" scoped>
  .modal-mask {
    display: flex;
    position: fixed;
    z-index: 10000;
    top: 0;
    left: 0;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgb(0 0 0 / 15%);

    .modal-mask-container {
      display: flex;
      position: absolute;
      z-index: 10000;
      top: 0;
      left: 0;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background-color: rgb(0 0 0 / 15%);
    }
  }

  .modal-container {
    z-index: 10005;
    width: 400px;
    max-width: 80%;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgb(0 0 0 / 20%);
    text-align: center;
  }

  .modal-header {
    position: relative;
    height: 54px;
    padding: 0 5px 0 10px;
    line-height: 54px;

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
    margin: 0;
    padding: 10px 16px;

    :deep(.ant-form-item-control) {
      text-align: left;
    }
  }

  .modal-footer {
    height: 67px;
    padding: 10px 16px;
    line-height: 67px;
    text-align: right;
    .footer-button {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 100%;
      button {
        margin-right: 10px;
        &:last-child {
          margin-right: 0;
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

  :deep(.ant-form-item-control) {
    text-align: left;
  }
</style>
