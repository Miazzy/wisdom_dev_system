<template>
  <div>
    <Button @click="handleOpenUpDialog" style="margin: 0px 10px 0px 0px;">
      <Icon icon="material-symbols-light:upload" />
      上传
    </Button>
    <UploadDialog
      v-model:visible="uploadVisible"
      v-model:value="filelist"
      :title="props.title"
      :width="props.width"
      :height="props.height"
      :maxCount="props.maxCount"
      :application="props.application"
      :module="props.upmodule"
      :bizId="props.bizId"
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

  const props = defineProps({
    vmode: { type: String, default: 'edit' },
    title: { type: String, default: '上传控件' },
    disabled: { type: Boolean, default: false },
    width: { type: [Number], default: 800 },
    height: { type: [Number], default: 600 },
    twidth: { type: [Boolean, Number], default: true },
    type: { type: String, default: '' },
    value: { type: [String, Array], default: null },
    maxCount: { type: [Number], default: 10 },
    application: { type: String, default: '' },
    upmodule: { type: String, default: '' },
    bizId: { type: String, default: '' },
    multiple: { type: [String, Boolean], default: false },
  });

  const uploadVisible = ref(false);
  const filelist = ref([]);

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
  };

  // 上传确认函数
  const handleUploadConfirm = () => {
    uploadVisible.value = false;
    emit('confirm', false);
  };

  // 处理上传完毕函数
  const handleUploadOver = (list) => {
    filelist.value = list;
    debugger;
  };

  watch(
    () => props.value,
    () => {

    },
  );

  watch(
    () => props.data,
    () => {

    },
  );

  // 启动加载
  onMounted(async () => {
    try {

    } catch (error) {
      console.error(error);
    }
  });
</script>
