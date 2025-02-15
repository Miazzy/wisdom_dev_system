<template>
  <Dialog
    :title="title"
    :tweight="props.tweight"
    :visible="modalVisible"
    @update:visible="updateVisible"
    :width="props.width"
    :height="props.height"
    @cancel="cancel"
    @confirm="confirm"
    @close="close"
  >
    <div :id="uid" class="dialog-content">
      <!-- 温馨提示区域 -->
      <div class="top-content">
        <a-alert
          message="温馨提示"
          :description="props.tmessage"
          type="info"
          style="color: #1890FF"
        />
      </div>
      <!-- 附件列表区域 -->
      <div class="main-content">
        <div style="overflow-y: scroll;height: 100%;max-height: 100%;">
          <a-upload
            ref="antUpload"
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
      <div class="footer-container">
        <a-button @click="handleFileSelect">
          <Icon icon="ant-design:select-outlined" />
          选择文件
        </a-button>
        <a-button
          type="primary"
          :disabled="uploadBtnFlag"
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
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
  import Dialog from '@/components/Framework/Modal/Dialog.vue';
  import Icon from '@/components/Icon/Icon.vue';
  import {
    ref,
    defineProps,
    defineEmits,
    onMounted,
    watch,
    unref,
    computed,
    getCurrentInstance,
  } from 'vue';
  import { Modal } from 'ant-design-vue';
  import type { UploadProps } from 'ant-design-vue';
  import * as FileApi from '@/api/infra/file';
  import { SysMessage } from '/@/hooks/web/useMessage';
  import { MsgManager } from '/@/message/MsgManager';
  import { buildUUID } from '/@/utils/uuid';
  import { dialogMaskOpen, dialogMaskClose } from '@/utils/mask';

  const modalVisible = ref(false);
  const fileList = ref<UploadProps['fileList']>([]);
  const uploading = ref<boolean>(false);
  const buttonID = 'upload-button-' + (Math.random() * 10000).toFixed(0);
  const antUpload = ref();
  const uid = ref(buildUUID());

  const props = defineProps({
    visible: Boolean, // 是否显示弹框
    title: String, // 弹框标题
    value: { type: Array<String>, default: [] },
    tweight: { type: Number, default: 500 },
    width: { type: Number, default: 700 }, // 弹框宽度
    height: { type: Number, default: 500 }, // 弹框高度
    tdata: { type: Array }, // 附件数据
    maxCount: { type: Number, default: 10 },
    maxSize: { type: Number, default: 104857600 }, // 100M
    application: { type: String, default: '' },
    module: { type: String, default: '' },
    bizId: { type: String, default: '' },
    fileKindId: { type: String, default: '' },
    tmessage: { type: String, default: '' },
    format: {
      type: String,
      default: 'png,jpg,jpeg,bmp,wps,pdf,txt,doc,docx,xls,xlsx,ppt,pptx,zip,rar,mp3,mp4',
    },
  });

  const emit = defineEmits([
    'update:visible',
    'update:value',
    'change',
    'cancel',
    'confirm',
    'close',
  ]); // 定义事件

  const uploadBtnFlag = computed(() => {
    let valid = false;
    try {
      fileList.value.forEach((file: UploadProps['fileList'][number]) => {
        if (!file.id) {
          valid = true;
        }
      });
    } catch (error) {
      //
    }
    return !valid;
  });

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
    emit('update:visible', $event); // 关闭弹框
  };

  // 获取附件列表
  const getFiles = async (bizId, fileKindId = '') => {
    if (typeof bizId == 'undefined' || bizId == null || bizId == '') {
      return [];
    }
    const filelist = await FileApi.getFiles({ bizId, fileKindId });
    if (typeof filelist === 'string') {
      return JSON.parse(filelist);
    }
    return filelist;
  };

  const handleRemove: UploadProps['onRemove'] = async (file): Boolean => {
    const callback = new Promise((resolve, reject) => {
      Modal.confirm({
        title: '确认操作',
        content: '请确认是否删除此附件？',
        onOk: async () => {
          try {
            let index = fileList.value.indexOf(file);
            fileList.value.splice(index, 1);
            if (Reflect.has(file, 'id')) {
              await FileApi.deleteFile(file.id);
              emit('change', fileList.value);
              emit('update:value', fileList.value);
            } else {
              const selector = `.dialog-content > .main-content .ant-upload-list`;
              const selectorElement = `.dialog-content > .main-content .ant-upload-list .ant-upload-list-text-container:nth-child(${++index})`;
              const parentNode = document.querySelector(selector);
              const node = document.querySelector(selectorElement);
              parentNode.removeChild(node);
            }
          } catch (error) {
            //
          }
          resolve(true);
        },
        onCancel() {
          emit('update:value', fileList.value);
          emit('change', fileList.value);
          reject(false);
        },
      });
    });
    const result = await callback;
    return result;
  };

  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    // 检查文件数量是否超限
    if (fileList.value.length + 1 > props.maxCount) {
      SysMessage.getInstance().warning('超过文件上传数量限制，最大上传文件数：' + props.maxCount);
      return false;
    }
    // 检查上传的文件大小是否超限
    if (file.size > props.maxSize) {
      SysMessage.getInstance().warning(
        `文件大小超过最大限度${Math.floor(props.maxSize / 1048576)}MB`,
      );
      return false;
    }
    // 上传文件不能为空
    if (file.size === 0) {
      SysMessage.getInstance().warning('不能上传空文件或目录，请重新选择');
      return false;
    }
    // 不允许上传同名文件
    for (let i = 0; i < fileList.value.length; i++) {
      const item = fileList.value[i];
      if (item.name === file.name) {
        SysMessage.getInstance().warning('不允许上传重复文件');
        return false;
      }
    }
    // 控制上传文件的类型 arr是上传类型的白名单
    const type = file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase();
    const arr = `,${props.format},`;
    if (!arr.includes(`,${type},`)) {
      SysMessage.getInstance().warning(`不支持${type}类型的文件上传`);
      return false;
    }
    fileList.value = [...fileList.value, file];
    return false;
  };

  const handleUpload = () => {
    let valid = false;
    const formData = new FormData();
    formData.append('application', props.application); //附件上传必须携带参数：应用
    formData.append('module', props.module); //附件上传必须携带参数：模块
    formData.append('bizId', props.bizId); //附件上传必须携带参数：业务ID
    formData.append('fileKindId', props.fileKindId); //文件配置类型编码(表格配置附件必须携带)
    if (!props.bizId) {
      SysMessage.getInstance().warning(`bizId不能为空`);
      return false;
    }
    fileList?.value?.forEach((file: UploadProps['fileList'][number]) => {
      if (!file.id) {
        // 未上传前file.id为空
        formData.append('files[]', file as any);
        valid = true;
      }
    });

    // 校验是否存在新选择的待上传附件
    if (!valid) {
      return SysMessage.getInstance().error('请选择文件后再进行上传操作！');
    }

    uploading.value = true;
    FileApi.uploadFile(formData)
      .then(async () => {
        uploading.value = false;
        fileList.value = await getFiles(props.bizId, props.fileKindId);
        emit('update:value', fileList.value);
        emit('change', fileList.value);
        SysMessage.getInstance().success('操作成功');
      })
      .catch(() => {
        uploading.value = false;
        SysMessage.getInstance().error('操作失败');
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
    dialogMaskClose();
  };

  watch(
    () => props.visible,
    async (newValue, oldValue) => {
      modalVisible.value = newValue;
      if (newValue != oldValue && newValue == true) {
        if (props.value != null && props.value.length > 0) {
          fileList.value = props.value;
        } else {
          fileList.value = await getFiles(props.bizId, props.fileKindId);
        }
      }
    },
  );

  watch(
    () => props.tdata,
    () => {},
  );

  watch(
    () => props.bizId,
    async () => {
      if (props.bizId && props.fileKindId) {
        fileList.value = await getFiles(props.bizId, props.fileKindId);
      }
    },
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
      margin-bottom: 5px;
      border: 0 solid #f0f0f0;
      color: #0960bd;
    }

    .main-content {
      flex: 1;
      height: auto;
      border: 1px solid #f0f0f0;
    }
  }

  .theme1 {
    .dialog-content {
      .main-content {
        flex: 1;
        height: auto;
        border: 1px solid rgb(217 217 217 / 16%);
      }
    }
  }

  .footer-container {
    :deep(.ant-btn) {
      margin-right: 10px;
      &:last-child {
        margin-right: 0;
      }
    }
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
    color: #1890FF;
  }
</style>
