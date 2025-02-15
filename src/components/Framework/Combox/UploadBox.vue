<template>
  <div class="upload-box">
    <Button
      v-if="props.vmode == 'edit' || props.vmode == 'box'"
      @click="handleOpenUpDialog"
      :disabled="isDisabled"
      style="margin: 0 10px 0 0"
      :size="btnSize"
    >
      <Icon icon="material-symbols-light:upload" />
      {{ props.tname }}
    </Button>
    <div
      v-if="props.vmode != 'edit' || props.vmode == 'box' || props.vmode == 'view'"
      class="ant-upload-list ant-upload-list-text"
    >
      <template v-for="file in filelist" :key="`${file.id}`">
        <div class="ant-upload-list-item">
          <div class="ant-upload-list-item-info">
            <span class="ant-upload-span">
              <span role="img" aria-label="paper-clip" class="anticon anticon-paper-clip">
                <Icon icon="ph:file-light" />
              </span>
              <a
                target="_blank"
                class="ant-upload-list-item-name"
                :size="file?.size"
                :title="file?.name"
                :href="FileApi.attachmentPreview(file?.url,file?.name)"
              >
                {{ file?.name }}
              </a>
            </span>
          </div>
        </div>
      </template>
    </div>
    <UploadDialog
      v-if="props.vmode == 'edit' || props.vmode == 'box'"
      v-model:visible="uploadVisible"
      v-model:value="filelist"
      :title="props.title"
      :width="props.width"
      :height="props.height"
      :maxCount="props.maxCount"
      :maxSize="props.maxSize"
      :application="props.application"
      :module="props.module"
      :format="tFormat"
      :bizId="bizFileId"
      :fileKindId="tFileKindId"
      :tmessage="tMessage"
      @change="handleUploadOver"
      @cancel="handleUploadCancel"
      @confirm="handleUploadConfirm"
    />
  </div>
</template>
<script lang="ts" setup>
  import { Button } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import UploadDialog from '@/components/Framework/Modal/UploadDialog.vue';
  import { ref, onMounted, defineProps, defineEmits, watch, unref, reactive, computed } from 'vue';
  import * as FileApi from '@/api/infra/file';
  import { MsgManager } from '/@/message/MsgManager';
  import { useThrottleFn } from '@vueuse/core';

  const props = defineProps({
    vmode: { type: String, default: 'edit' },
    title: { type: String, default: '上传附件' },
    tname: { type: String, default: '上传附件' },
    disabled: { type: Boolean, default: false },
    width: { type: [Number], default: 800 },
    height: { type: [Number], default: 600 },
    twidth: { type: [Boolean, Number], default: true },
    type: { type: String, default: '' },
    value: { type: [String, Array], default: null },
    maxCount: { type: [Number], default: 10 },
    maxSize: { type: [Number], default: 104857600 }, // 100M
    application: { type: String, default: '' },
    module: { type: String, default: '' },
    bizId: { type: [String, Function, Object], default: '-1' },
    fileKindId: { type: String, default: '' },
    format: {
      type: String,
      default: 'png,jpg,jpeg,bmp,wps,pdf,txt,doc,docx,xls,xlsx,ppt,pptx,zip,rar,mp3,mp4',
    },
    multiple: { type: [String, Boolean], default: false },
    callback: { type: Function, default: null },
    tfields: { type: Object, default: { label: 'label', value: 'value' } as Object },
    btnSize: {type: String, default: ''}
  });

  const uploadVisible = ref(false);
  const filelist = ref([]);
  const bizFileId = ref('');
  const tDisabled = ref(false);
  const lastTimeStamp = ref(0);
  const tFormat = ref('');
  const tMessage = ref('');
  const tFileKindId = ref('');

  // 注入全局的disable状态
  const appDisabled = ref(false);

  // 根据disable状态计算出组件的disable状态
  const isDisabled = computed(() => {
    return tDisabled.value || appDisabled.value;
  });

  // 定义emits
  const emit = defineEmits(['update:value', 'change', 'cancel', 'confirm', 'loaded']);

  const getFileList = async () => {
    const now = new Date().getTime();
    if (now - lastTimeStamp.value > 1000) {
      filelist.value = await getFiles(bizFileId.value, props.fileKindId);
      emit('update:value', filelist.value);
      emit('change', filelist.value);
      lastTimeStamp.value = new Date().getTime();
    }
  };

  const getFileListFunc = useThrottleFn(getFileList, 150);

  // 打开弹框函数
  const handleOpenUpDialog = () => {
    uploadVisible.value = true;
  };

  // 上传取消函数
  const handleUploadCancel = () => {
    uploadVisible.value = false;
    emit('cancel', false);
    if (props.callback != null) {
      props.callback(filelist.value);
    }
  };

  // 上传确认函数
  const handleUploadConfirm = () => {
    uploadVisible.value = false;
    emit('confirm', false);
    if (props.callback != null) {
      props.callback(filelist.value);
    }
  };

  // 获取bizId
  const getBizId = () => {
    try {
      if (typeof props.bizId == 'string') {
        return props.bizId || '-1';
      } else if (typeof props.bizId == 'function') {
        return props.bizId();
      } else if (typeof props.bizId == 'object') {
        return props.bizId[props.tfields.value];
      }
    } catch (error) {
      return props.bizId;
    }
  };

  // 处理上传完毕函数
  const handleUploadOver = async () => {
    const bizId = getBizId();
    bizFileId.value = bizId;
    getFileListFunc();
    setTimeout(() => {
      if (props.callback != null) {
        props.callback(filelist.value);
      }
    }, 300);
  };

  // 获取附件列表
  const getFiles = async (bizId, fileKindId = '') => {
    const callback = new Promise((resolve) => {
      const func = () => {
        if (typeof bizId == 'undefined' || bizId == null || bizId == '' || bizId == '-1') {
          resolve([]);
        }
        FileApi.getFiles({ bizId, fileKindId }).then((data) => {
          resolve(data);
        });
      };
      const exec = useThrottleFn(func, 1000);
      exec();
    });
    const result = await callback;
    return result as [];
  };

  watch(
    () => props.bizId,
    async () => {
      const bizId = getBizId();
      bizFileId.value = bizId;
      if (!(bizId == '-1' || bizId == '')) {
        getFileListFunc();
      }
    },
  );

  watch(
    () => props.value,
    () => {},
  );

  watch(
    () => props.fileKindId,
    (val) => {
      tFileKindId.value = val;
    },
  );

  watch(
    () => props.disabled,
    () => {
      tDisabled.value = props.disabled;
    },
  );

  watch(
    () => props.format,
    (val) => {
      tFormat.value = val;
      tMessage.value = `文件只能上传${val}类型文件！`;
    },
  );

  // 启动加载
  onMounted(async () => {
    try {
      const bizId = getBizId();
      bizFileId.value = bizId;
      if (!(bizId == '-1' || bizId == '')) {
        getFileListFunc();
      }
      tDisabled.value = props.disabled;
      tFormat.value = props.format;
      tMessage.value = `文件只能上传${props.format}类型文件！`;
      tFileKindId.value = props.fileKindId;
      if (props.callback != null) {
        props.callback(filelist.value);
      }
      // 监听是否启用全局禁用
      // MsgManager.getInstance().listen('global-disabled', (message) => { appDisabled.value = message; });
      setTimeout(() => {
        emit('loaded', filelist.value);
      }, 300);
    } catch (error) {
      console.error(error);
    }
  });
</script>
<style lang="less" scoped>
  .ant-upload-list-item {
    position: relative;
    height: 30px;
    margin-top: 4px;
    font-size: 14px;
    cursor: pointer;

    .ant-upload-list-item-name {
      cursor: pointer;
    }
  }
</style>
