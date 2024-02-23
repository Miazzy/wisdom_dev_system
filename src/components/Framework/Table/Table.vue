<template>
  <table class="table" :style="tableCssStyle">
    <thead>
      <tr>
        <th
          v-for="column in tcolumns"
          :key="column.key"
          :style="{ width: column.width, textAlign: column.halign }"
        >
          <span>{{ column.title }}</span>
        </th>
        <th v-if="toperable" :style="{ width: tactioncolumn.width, textAlign: tactioncolumn.halign }">操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in tdata" :key="item.key">
        <td
          v-for="column in tcolumns"
          :key="column.key"
          :style="{ width: column.width, textAlign: column.talign }"
        >
          <template v-if="column.dataIndex !== 'filelist'">
            <span>{{ item[column.dataIndex] }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'filelist'">
            <template v-for="file in item.filelist" :key="`${file.id}`">
              <div class="ant-upload-list-item">
                <span role="img" aria-label="paper-clip" class="anticon anticon-paper-clip">
                  <Icon icon="ph:file-light" />
                </span>
                <span class="file-text">
                  <a
                    target="_blank"
                    class="ant-upload-list-item-name"
                    :size="file?.size"
                    :title="file?.name"
                    :href="preview(file?.url)"
                  >
                    {{ file?.name }}
                  </a>
                </span>
              </div>
            </template>
          </template>
        </td>
        <td v-if="toperable" :style="{ width: tactioncolumn.width, textAlign: tactioncolumn.halign }">
          <slot name="actions" :item="item">
            <UploadBox
              v-model:value="item.filelist"
              @loaded="(list) => { handleFileItemLoaded(item, list) }"
              @change="(list) => { handleFileItemLoaded(item, list) }"
              :vmode="'edit'"
              :width="800"
              :height="550"
              :maxCount="item.maxCount"
              :maxSize="item.maxSize"
              :application="tapplication"
              :module="tmodule"
              :bizId="item.bizId"
            />
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
  import { defineProps, onMounted, ref, watch } from 'vue';
  import UploadBox from '@/components/Framework/Combox/UploadBox.vue';
  import Icon from '@/components/Icon/Icon.vue';

  const props = defineProps({
    tableCssStyle: { type: Object, default: {} },
    data: { type: Array, default: [] },
    columns: { type: Array, default: [] },
    actioncolumn: { type: Object, default: {} },
    operable: { type: Boolean, default: false },

    viewFunction: { type: Function, default: () => {} },
    application: { type: String, default: '' },
    module: { type: String, default: '' },
    message: { type: String, default: '' },
    format: { type: String, default: 'png,jpg,jpeg,bmp,wps,pdf,txt,doc,docx,xls,xlsx,ppt,pptx,zip,rar,mp3,mp4' },
  });

  // 定义emits
  const emit = defineEmits(['change']);

  const tdata = ref<any[]>([]);
  const tcolumns = ref<any[]>([]);
  const toperable = ref(false);
  const tactioncolumn = ref({});

  const tapplication = ref('');
  const tmodule = ref('');
  const tmessage = ref('');
  const tformat = ref('');

  const handleFileItemLoaded = (item, list) => {
    emit('change', item, list);
  };

  const preview = (url) => {
    props.viewFunction(url);
  };

  watch(
    () => props.data,
    () => {
      tdata.value = props.data as any[];
    },
  );

  watch(
    () => props.columns,
    () => {
      tcolumns.value = props.columns;
    },
  );

  watch(
    () => props.operable,
    () => {
      toperable.value = props.operable;
    },
  );

  watch(
    () => props.actioncolumn,
    () => {
      tactioncolumn.value = props.actioncolumn;
    },
  );

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
    () => props.format,
    () => {
      tformat.value = props.format;
    },
  );

  onMounted(() => {
    tdata.value = props.data;
    tcolumns.value = props.columns;
    toperable.value = props.operable;
    tactioncolumn.value = props.actioncolumn;

    tapplication.value = props.application;
    tmodule.value = props.module;
    tmessage.value = props.message;
    tformat.value = props.format;
  });
</script>

<style lang="less" scoped>
  .table {
    width: 100%;
    border-collapse: collapse;

    th, td {
      height: 38px;
      border: 1px solid #ddd;
      padding: 4px 2px;
      text-align: left;
    }

    th {
      background-color: #f2f2f2;
    }
  }

  .ant-upload-list-item {
    position: relative;
    height: 30px;
    margin-top: 4px;
    font-size: 14px;
    cursor: pointer;

    .anticon.anticon-paper-clip {
      position: absolute;
      cursor: pointer;
      left: 5px;
      top: 2px;
    }

    span.file-text {
      position: absolute;
      cursor: pointer;
      left: 8px;
      top: 0px;
    }
  }
</style>
