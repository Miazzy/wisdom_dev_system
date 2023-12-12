<template>
  <div>
    <Button
      v-if="props.vmode == 'edit' || props.vmode == 'box'"
      @click="handleOpenUpDialog"
      style="margin: 0px 10px 0px 0px"
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
                :href="attachmentPreview(file?.url)"
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
      :bizId="bizFileId"
      :tmessage="tmessage"
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
  import { ref, onMounted, defineProps, defineEmits, watch, unref, reactive } from 'vue';
  import * as FileApi from '@/api/infra/file';

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
    maxSize: { type: [Number], default: 100 * 1024 * 1024 },
    application: { type: String, default: '' },
    module: { type: String, default: '' },
    bizId: { type: [String, Function, Object], default: '' },
    tmessage: {
      type: String,
      default:
        '文件只能上传png,jpg,jpeg,bmp,wps,pdf,txt,doc,docx,xls,xlsx,ppt,pptx,zip,rar,mp3,mp4类型文件。',
    },
    multiple: { type: [String, Boolean], default: false },
    callback: { type: Function, default: null },
    tfields: { type: Object, default: { label: 'label', value: 'value' } as Object },
  });

  const uploadVisible = ref(false);
  const filelist = ref([]);
  const bizFileId = ref('');

  // 定义emits
  const emit = defineEmits(['update:value', 'change', 'cancel', 'confirm']);

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
        return props.bizId;
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
    filelist.value = await FileApi.getFiles({ bizId });
    emit('update:value', filelist.value);
    emit('change', filelist.value);
    if (props.callback != null) {
      props.callback(filelist.value);
    }
  };

  // 获取附件列表
  const getFiles = async (bizId) => {
    const filelist = await FileApi.getFiles({ bizId });
    return filelist;
  };

  const attachmentPreview = (url) => {
    let localdomain = 'http://ecs-e1aa-0001'; //当前页面域名
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
      localdomain = 'http://10.8.111.203';
    }
    let previewdomain = localdomain + ':8012'; //预览域名
    let downloaddomain = localdomain + ':48080'; //下载域名
    return (
      previewdomain +
      '/onlinePreview?url=' +
      encodeURIComponent(btoa(encodeURI(downloaddomain + url)))
    );
  };

  watch(
    () => props.bizId,
    async () => {
      const bizId = getBizId();
      filelist.value = await getFiles(bizId);
      bizFileId.value = bizId;
      emit('update:value', filelist.value);
    },
  );

  watch(
    () => props.value,
    () => {},
  );

  watch(
    () => props.data,
    () => {},
  );

  // 启动加载
  onMounted(async () => {
    try {
      const bizId = getBizId();
      filelist.value = await getFiles(bizId);
      bizFileId.value = bizId;
      emit('update:value', filelist.value);
      if (props.callback != null) {
        props.callback(filelist.value);
      }
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
