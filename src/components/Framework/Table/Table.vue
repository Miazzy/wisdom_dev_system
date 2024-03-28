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
        <th
          v-show="toperable"
          :style="{ width: tactioncolumn.width, textAlign: tactioncolumn.halign }"
          >操作</th
        >
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in tdata" :key="item.key">
        <td
          v-for="column in tcolumns"
          :key="column.key"
          :style="{ width: column.width, textAlign: column.talign }"
        >
          <template v-if="column.dataIndex === 'filelist'">
            <template v-for="file in item.filelist" :key="`${file.id}`">
              <div class="ant-upload-list-item">
                <span role="img" aria-label="paper-clip" class="anticon anticon-paper-clip">
                  <Icon icon="ph:file-light" />
                </span>
                <span class="file-text" @click="preview(file?.url)">
                  <a
                    target="_blank"
                    class="ant-upload-list-item-name"
                    :size="file?.size"
                    :title="file?.name"
                  >
                    {{ file?.name }}
                  </a>
                </span>
              </div>
            </template>
            <template
              v-if="
                item['required'] && item.showReqTips && item.filelist && item.filelist.length == 0
              "
            >
              <span class="file-alert">
                <a-alert message="请上传本行附件信息" type="error" show-icon />
              </span>
            </template>
          </template>
          <template v-else-if="column.dataIndex === 'filetype'">
            <span class="file-type">
              <span class="required"> {{ item['required'] ? '*' : ' ' }}</span>
              <span class="text">{{ item[column.dataIndex] }}</span>
            </span>
          </template>
          <template v-else-if="column.dataIndex !== 'filelist'">
            <span>{{ item[column.dataIndex] }}</span>
          </template>
        </td>
        <td
          v-show="toperable"
          :style="{ width: tactioncolumn.width, textAlign: tactioncolumn.halign }"
        >
          <slot name="actions" :item="item">
            <UploadBox
              v-show="!item.readonly"
              v-model:value="item.filelist"
              @loaded="
                (list) => {
                  handleFileItemLoaded(item, list);
                }
              "
              @change="
                (list) => {
                  handleFileItemLoaded(item, list);
                }
              "
              :vmode="'edit'"
              :width="800"
              :height="550"
              :maxCount="item.maxCount"
              :maxSize="item.maxSize"
              :application="tapplication"
              :module="tmodule"
              :mode="tmode"
              :bizId="item.bizId"
              :fileKindId="item.fileKindId"
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
  import * as FileApi from '@/api/infra/file';

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
    mode: { type: String, default: 'normal' },
    format: {
      type: String,
      default: 'png,jpg,jpeg,bmp,wps,pdf,txt,doc,docx,xls,xlsx,ppt,pptx,zip,rar,mp3,mp4',
    },
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
  const tmode = ref('normal');

  const handleFileItemLoaded = (item, list) => {
    emit('change', item, list);
    if (item?.filelist?.length > 0) {
      delete item.showReqTips;
    }
  };

  const preview = (url) => {
    // props.viewFunction(url);
    // FileApi.attachmentDownloadUrl(url);
    const previewURL = FileApi.attachmentPreview(url);
    window.open(previewURL);
  };

  const validate = () => {
    for (const item of tdata.value) {
      if (item.filelist && item.filelist.length == 0) {
        item.showReqTips = true;
      }
    }
  };

  const handleClearTips = () => {
    for (const item of tdata.value) {
      delete item.showReqTips;
    }
  };

  watch(
    () => props.data,
    () => {
      tdata.value = props.data as any[];
    },
    { deep: true },
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

  watch(
    () => props.mode,
    (val) => {
      tmode.value = props.mode;
      if (val == 'view') {
        toperable.value = false;
      } else if (val == 'normal') {
        toperable.value = true;
      }
    },
  );

  defineExpose({
    validate,
    handleClearTips,
  });

  onMounted(() => {
    tdata.value = props.data;
    tcolumns.value = props.columns;
    toperable.value = props.operable;
    tactioncolumn.value = props.actioncolumn;

    tapplication.value = props.application;
    tmodule.value = props.module;
    tmessage.value = props.message;
    tformat.value = props.format;
    tmode.value = props.mode;
  });
</script>

<style lang="less" scoped>
  [data-theme='dark'] {
    .theme1 {
      .table {
        th {
          border: 1px solid rgba(255, 255, 255, 0.15);
          background-color: transparent;
        }

        td {
          border: 1px solid rgba(255, 255, 255, 0.15);
          background-color: transparent;
        }
      }
    }
  }

  .table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
      height: 38px;
      padding: 4px 2px;
      border: 1px solid #ddd;
      text-align: left;

      .file-type {
        display: block;
        position: relative;
        height: 35px;
        line-height: 35px;
        text-align: left;

        .required {
          position: absolute;
          left: 0;
          color: red;
        }

        .text {
          position: absolute;
          left: 10px;
        }
      }

      .file-alert {
        :deep(.ant-alert-message) {
          color: rgb(230 68 68);
          text-align: left;
        }
      }
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
      top: 2px;
      left: 5px;
      cursor: pointer;
    }

    span.file-text {
      position: absolute;
      top: 0;
      left: 8px;
      cursor: pointer;
    }
  }
</style>
