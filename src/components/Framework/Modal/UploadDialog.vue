<template>
  <Dialog
    :title="title"
    :visible="modalVisible"
    @update:visible="updateVisible"
    :width="props.width"
    :height="props.height"
    :pheight="100"
    @cancel="cancel"
    @confirm="confirm"
    @close="close"
  >
    <div class="dialog-content" :style="`height: calc(${props.height}px - 90px)`">
      <div class="top-content">
        <!-- 温馨提示区域 -->
      </div>
      <div class="main-content">
        <!-- 附件列表区域 -->
        <a-upload
          :file-list="fileList"
          :multiple="true"
          :before-upload="beforeUpload"
          @remove="handleRemove"
        >
          <a-button :id="buttonID" class="upload-button" style="display: none" />
        </a-upload>
      </div>
    </div>
    <template #footer>
      <a-button @click="handleFileSelect">
        <Icon icon="ant-design:select-outlined" />
        选择文件
      </a-button>
      <a-button
        type="primary"
        :disabled="fileList.length === 0"
        :loading="uploading"
        style="margin-top: 16px"
        @click="handleUpload"
      >
        <Icon icon="material-symbols-light:upload" />
        {{ uploading ? '上传中...' : '开始上传' }}
      </a-button>
      <a-button @click="handleClose">
        <Icon icon="carbon:close-outline" />
        关闭
      </a-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
  import Dialog from '@/components/Framework/Modal/Dialog.vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { ref, defineProps, defineEmits, onMounted, watch, unref } from 'vue';
  import { message } from 'ant-design-vue';
  import { UploadOutlined } from '@ant-design/icons-vue';
  import type { UploadProps } from 'ant-design-vue';

  const modalVisible = ref(false);
  const fileList = ref<UploadProps['fileList']>([]);
  const uploading = ref<boolean>(false);
  const buttonID = 'upload-button-' + (Math.random() * 10000).toFixed(0);

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

  const handleRemove: UploadProps['onRemove'] = (file) => {
    const index = fileList.value.indexOf(file);
    const newFileList = fileList.value.slice();
    newFileList.splice(index, 1);
    fileList.value = newFileList;
  };

  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    fileList.value = [...fileList.value, file];
    return false;
  };

  const handleUpload = () => {
    const formData = new FormData();
    fileList.value.forEach((file: UploadProps['fileList'][number]) => {
      formData.append('files[]', file as any);
    });
    uploading.value = true;
    setTimeout(() => {
      fileList.value.forEach((file) => {
        file.percent = 30;
      });
    }, 1000);
    setTimeout(() => {
      uploading.value = false;
      message.success('upload successfully.');
    }, 3000);
  };

  const handleFileSelect = () => {
    const button = document.querySelector('#' + buttonID + '.upload-button');
    button.click();
  };

  const handleClose = () => {
    modalVisible.value = false;
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
    (newValue) => {},
  );

  onMounted(() => {
    modalVisible.value = props.visible;
  });
</script>

<style lang="less" scoped>
  .dialog-content {
    display: flex;
    flex-direction: column;
    height: 100%;

    .top-content {
      height: 100px;
      border: 0px solid #f0f0f0;
      margin-bottom: 5px;
    }
  
    .main-content {
      flex: 3;
      border: 1px solid #f0f0f0;
    }
  }

  :deep(.modal-footer) {
    height: 60px;
    padding: 5px 0px 10px 0px;
    line-height: 60px;
    text-align: right;
  }
  :deep(.modal-footer .footer-button) {
    position: absolute;
    top: 2px;
    right: 5px;
    margin-top: -5px;
  }

  :deep(.modal-footer .footer-button button) {
    padding: 0px 12px 0px 12px;
    margin: 0px 12px 0px 0px;
  }

  :deep(.ant-upload-list-text .ant-upload-list-item-name, .ant-upload-list-picture .ant-upload-list-item-name) {
    flex: auto;
    margin: 0;
    padding: 0 8px;
    text-align: left;
  }
</style>
