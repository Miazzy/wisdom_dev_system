<template>
  <Dialog
    :title="title"
    :tweight="props.tweight"
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
      <!-- 温馨提示区域 -->
      <div class="top-content">
        <a-alert
          message="温馨提示"
          :description="props.tmessage"
          type="info"
          style="margin-top: 10px; color: #0960bd"
        />
      </div>
      <!-- 附件列表区域 -->
      <div class="main-content">
        <div :style="`height: calc(${props.height + 10}px - 220px); overflow-y: scroll;`">
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
  import type { UploadProps } from 'ant-design-vue';
  import * as FileApi from '@/api/infra/file';

  const modalVisible = ref(false);
  const fileList = ref<UploadProps['fileList']>([]);
  const uploading = ref<boolean>(false);
  const buttonID = 'upload-button-' + (Math.random() * 10000).toFixed(0);

  const props = defineProps({
    visible: Boolean, // 是否显示弹框
    title: String, // 弹框标题
    value: { type: Array<String>, default: [] },
    tweight: { type: Number, default: 500 },
    width: { type: Number, default: 700 }, // 弹框宽度
    height: { type: Number, default: 500 }, // 弹框高度
    tdata: { type: Array }, // 附件数据
    maxCount: { type: Number, default: 10 },
    maxSize: { type: Number, default: 1024 * 1024 * 20 },
    application: { type: String, default: '' },
    module: { type: String, default: '' },
    bizId: { type: String, default: '' },
    tmessage: { type: String, default: '' },
  });

  const emit = defineEmits([
    'update:visible',
    'update:value',
    'change',
    'cancel',
    'confirm',
    'close',
  ]); // 定义事件

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

  const getFiles = async (bizId) => {
    const filelist = await FileApi.getFiles({ bizId });
    return filelist;
  };

  const handleRemove: UploadProps['onRemove'] = (file) => {
    const index = fileList.value.indexOf(file);
    const newFileList = fileList.value.slice();
    newFileList.splice(index, 1);
    fileList.value = newFileList;
  };

  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    // 检查文件数量是否超限
    if (fileList.value.length + 1 > props.maxCount) {
      message.warning('超过文件上传数量限制，最大上传文件数：' + props.maxCount);
      return false;
    }
    // 检查上传的文件大小是否超限
    if (file.size > props.maxSize) {
      message.warning(`文件大小超过最大限度${Math.floor(props.maxSize / 1048576)}MB`);
      return false;
    }
    // 上传文件不能为空
    if (file.size === 0) {
      message.warning('不能上传空文件或目录，请重新选择');
      return false;
    }
    // 不允许上传同名文件
    for (let i = 0; i < fileList.value.length; i++) {
      const item = fileList.value[i];
      if (item.name === file.name) {
        message.warning('不允许上传重复文件');
        return false;
      }
    }
    // 控制上传文件的类型 arr是上传类型的白名单
    const type = file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase();
    const arr = ',png,jpg,jpeg,bmp,wps,pdf,txt,doc,docx,xls,xlsx,ppt,pptx,zip,rar,mp3,mp4,';
    if (!arr.includes(`,${type},`)) {
      message.warning(`不支持${type}类型的文件上传`);
      return false;
    }
    fileList.value = [...fileList.value, file];
    return false;
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('application', props.application); //附件上传必须携带参数：应用
    formData.append('module', props.module); //附件上传必须携带参数：模块
    formData.append('bizId', props.bizId); //附件上传必须携带参数：业务ID
    if (!props.bizId) {
      message.warning(`bizId不能为空`);
      return false;
    }
    fileList.value.forEach((file: UploadProps['fileList'][number]) => {
      if (!file.id) {
        // 未上传前file.id为空
        formData.append('files[]', file as any);
      }
    });
    uploading.value = true;
    FileApi.uploadFile(formData)
      .then(async () => {
        uploading.value = false;
        fileList.value = await getFiles(props.bizId);
        emit('update:value', fileList.value);
        emit('change', fileList.value);
        message.success('操作成功');
      })
      .catch(() => {
        uploading.value = false;
        message.error('操作失败');
      });
  };

  const handleFileSelect = () => {
    try {
      const button = document.querySelector('#' + buttonID + '.upload-button');
      button.click();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    modalVisible.value = false;
    emit('update:visible', false); // 关闭弹框
  };

  watch(
    () => props.visible,
    (newValue, oldValue) => {
      modalVisible.value = newValue;
      if (newValue != oldValue && newValue == true) {
        fileList.value = [];
      }
    },
  );

  watch(
    () => props.tdata,
    () => {},
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
      color: #0960bd;
    }

    .main-content {
      flex: 1;
      height: auto;
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

  :deep(
      .ant-upload-list-text .ant-upload-list-item-name,
      .ant-upload-list-picture .ant-upload-list-item-name
    ) {
    flex: auto;
    margin: 0;
    padding: 0 8px;
    text-align: left;
  }

  :deep(.ant-alert-content) {
    text-align: left;
  }
  :deep(.ant-upload-list) {
    margin-top: -15px;
  }
  :deep(.ant-alert-with-description .ant-alert-message) {
    color: #0960bd;
  }
</style>
