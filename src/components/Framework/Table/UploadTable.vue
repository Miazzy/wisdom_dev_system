<template>
  <div style="position: relative" :style="csstyle">
    <Table
      ref="uploadTable"
      :operable="true"
      :data="trows"
      :columns="tcolumns.slice(0, tcolumns.length - 1)"
      :actioncolumn="tcolumns[tcolumns.length - 1]"
      :application="tapplication"
      :module="tmodule"
      :message="tmessage"
      :format="tformat"
      :mode="tmode"
      :operate="props.operate"
      :fixed="tFixed"
    />
    <Icon
      v-if="tFixed === 'bottom'"
      icon="ri:skip-up-line"
      :size="20"
      style="position: absolute; top: 1px; right: 0"
      @click="handleDrawerOpen"
    />
  </div>
  <template v-show="tFixed === 'bottom'">
    <a-drawer
      :height="450"
      title="附件列表"
      :placement="`bottom`"
      :visible="visible"
      @close="handleDrawerClose"
    >
      <Table
        ref="uploadTable"
        :operable="true"
        :data="trows"
        :columns="tcolumns.slice(0, tcolumns.length - 1)"
        :actioncolumn="tcolumns[tcolumns.length - 1]"
        :application="tapplication"
        :module="tmodule"
        :message="tmessage"
        :format="tformat"
        :mode="tmode"
        :operate="props.operate"
      />
    </a-drawer>
  </template>
</template>

<script lang="ts" setup>
  import { defineProps, onMounted, ref, watch } from 'vue';
  import Table from '@/components/Framework/Table/Table.vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { MsgManager } from '/@/message/MsgManager';

  const props = defineProps({
    multiple: { type: Boolean, default: true },
    width: { type: String, default: '100%' }, // 弹框宽度
    height: { type: String, default: 'auto' }, // 弹框高度
    rows: { type: Array }, // 附件行数据
    colwidths: { type: Array }, // 附件字段列宽数据
    viewFunction: { type: Function, default: () => {} },
    application: { type: String, default: '' },
    module: { type: String, default: '' },
    message: { type: String, default: '' },
    mode: { type: String, default: 'normal' },
    fixed: { type: String, default: '' },
    operate: { type: String, default: 'download,preview' },
    format: {
      type: String,
      default: 'png,jpg,jpeg,bmp,wps,pdf,txt,doc,docx,xls,xlsx,ppt,pptx,zip,rar,mp3,mp4',
    },
  });

  const trows = ref<any[]>([]);
  const tcolumns = ref<any[]>([]);
  const tapplication = ref('');
  const tmodule = ref('');
  const tmode = ref('normal');
  const tmessage = ref('');
  const tformat = ref('');
  const tHeight = ref('auto');
  const tFixed = ref('');
  const csstyle = ref({ width: props.width, height: props.height });
  const uploadTable = ref();
  const visible = ref(false);

  tcolumns.value = [
    {
      title: '附件类别',
      dataIndex: 'filetype',
      key: 'filetype',
      width: props.colwidths[0] ?? '30%',
      halign: 'center',
      talign: 'center',
    },
    {
      title: '附件信息',
      dataIndex: 'filelist',
      key: 'filelist',
      width: props.colwidths[1] ?? '45%',
      halign: 'center',
      talign: 'center',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: props.colwidths[2] ?? '25%',
      halign: 'center',
      talign: 'center',
    },
  ];

  watch(
    () => props.message,
    () => {
      tmessage.value = props.message;
    },
  );

  watch(
    () => props.module,
    () => {
      tmodule.value = props.module;
    },
  );

  watch(
    () => props.application,
    () => {
      tapplication.value = props.application;
    },
  );

  watch(
    () => props.rows,
    () => {
      trows.value = props.rows as any[];
    },
    { deep: true },
  );

  watch(
    () => props.format,
    () => {
      tformat.value = props.format;
    },
  );

  watch(
    () => props.mode,
    () => {
      tmode.value = props.mode;
    },
  );

  watch(
    () => props.height,
    () => {
      tHeight.value = props.height;
    },
  );

  watch(
    () => props.fixed,
    () => {
      tFixed.value = props.fixed;
    },
  );

  const validate = () => {
    uploadTable.value?.validate();
  };

  const handleClearTips = () => {
    uploadTable.value?.handleClearTips();
  };

  const handleDrawerClose = () => {
    visible.value = false;
    MsgManager.getInstance().sendMsg('drawer-open', { type: 'remove' });
  };

  const handleDrawerOpen = () => {
    visible.value = true;
    MsgManager.getInstance().sendMsg('drawer-open', { type: 'open' });
  };

  defineExpose({
    validate,
    handleClearTips,
  });

  onMounted(() => {
    trows.value = props.rows as any[];
    tapplication.value = props.application;
    tmodule.value = props.module;
    tmessage.value = props.message;
    tformat.value = props.format;
    tmode.value = props.mode;
    tHeight.value = props.height;
    tFixed.value = props.fixed;
  });
</script>

<style></style>
