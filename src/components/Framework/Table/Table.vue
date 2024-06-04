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
          :style="{
            width: tactioncolumn.width,
            textAlign: tactioncolumn.halign,
            display: handleTdOperateStyle(),
          }"
          >操作</th
        >
      </tr>
    </thead>
    <tbody>
      <template v-for="item in tdata" :key="item.key">
        <tr :style="trStyle">
          <td
            v-for="column in tcolumns"
            :key="column.key"
            :style="{
              width: column.width,
              textAlign: column.talign,
              height: handleTdHeightStyle(column),
              display: handleTdDisplayStyle(column),
              border: handleTdBorderStyle(column),
            }"
          >
            <template v-if="column.dataIndex === 'filelist'">
              <template v-for="file in item.filelist" :key="`${file.id}`">
                <div class="ant-upload-list-item">
                  <span role="img" aria-label="paper-clip" class="anticon anticon-paper-clip">
                    <Icon icon="ph:file-light" />
                  </span>
                  <span class="file-text" @click="preview(file?.url, file?.name)">
                    <a-popover v-if="handleBtnAccess('preview') || handleBtnAccess('download')">
                      <template #content>
                        <div class="file-title-content">
                          <span>{{ file?.name }}</span>
                        </div>
                        <div class="file-button-content">
                          <a-button
                            v-if="handleBtnAccess('preview')"
                            preIcon="ic:baseline-pageview"
                            @click="preview(file?.url, file?.name)"
                            :iconSize="16"
                            >预览</a-button
                          >
                          <a-button
                            v-if="handleBtnAccess('download')"
                            preIcon="foundation:download"
                            @click="download(file?.url)"
                            :iconSize="16"
                            >下载</a-button
                          >
                        </div>
                      </template>
                      <template #title>
                        <span>附件详情</span>
                      </template>
                      <a
                        target="_blank"
                        class="ant-upload-list-item-name"
                        :size="file?.size"
                        :title="file?.name"
                      >
                        {{ file?.name }}
                      </a>
                    </a-popover>
                    <a
                      v-else
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
            :style="{
              width: tactioncolumn.width,
              textAlign: tactioncolumn.halign,
              display: handleTdOperateStyle(),
            }"
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
                :format="item.format"
                :fileKindId="item.fileKindId"
              />
            </slot>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
  import { defineProps, onMounted, ref, watch, computed } from 'vue';
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
    fixed: { type: String, default: '' },
    operate: { type: String, default: '' },
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
  const tFixed = ref('');
  const tOperate = ref('');

  const trStyle = computed(() => {
    return tFixed.value == 'bottom' ? 'border-right: 1px solid #ddd' : '';
  });

  const handleFileItemLoaded = (item, list) => {
    emit('change', item, list);
    if (item?.filelist?.length > 0) {
      delete item.showReqTips;
    }
  };

  const preview = (url, name) => {
    if (tOperate.value.includes('preview')) {
      const previewURL = FileApi.attachmentPreview(url, name);
      window.open(previewURL);
    }
  };

  const download = (url) => {
    const previewURL = FileApi.attachmentDownloadUrl(url);
    window.open(previewURL);
  };

  const validate = () => {
    let count = 0;
    for (const item of tdata.value) {
      if (item.filelist && item.filelist.length == 0) {
        item.showReqTips = true;
        count++;
      }
    }
    const valid = count === 0;
    return { count, valid };
  };

  const handleBtnAccess = (type: String = '') => {
    const flag = tOperate.value.includes(type as string);
    return flag;
  };

  const handleClearTips = () => {
    for (const item of tdata.value) {
      delete item.showReqTips;
    }
  };

  const handleTdHeightStyle = (column) => {
    return column.key == 'filelist' && tFixed.value == 'bottom' ? '40px' : '';
  };

  const handleTdDisplayStyle = (column) => {
    return column.key == 'filelist' && tFixed.value == 'bottom' ? 'block' : '';
  };

  const handleTdBorderStyle = (column) => {
    return column.key == 'filelist' && tFixed.value == 'bottom' ? '0px' : '';
  };

  const handleTdOperateStyle = () => {
    return props.mode == 'view' ? 'none' : '';
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
    () => props.fixed,
    () => {
      tFixed.value = props.fixed;
    },
  );

  watch(
    () => props.operate,
    () => {
      tOperate.value = props.operate;
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
    tFixed.value = props.fixed;
    tOperate.value = props.operate;
  });
</script>

<style lang="less" scoped>
  [data-theme='dark'] {
    .theme1 {
      .table {
        th {
          border: 1px solid rgb(255 255 255 / 15%);
          background-color: transparent;
        }

        td {
          border: 1px solid rgb(255 255 255 / 15%);
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

  .file-title-content {
    margin: 3px 0 15px;
    font-size: 14px;
  }

  .file-button-content {
    button:first-child {
      margin-right: 10px;
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
