<template>
  <div style="width: 100%" class="table-header-content">
    <div v-if="$slots.headerTop" style="margin: 5px">
      <slot name="headerTop"></slot>
    </div>
    <div class="flex items-center">
      <slot name="tableTitle" v-if="$slots.tableTitle"></slot>
      <TableTitle
        :helpMessage="titleHelpMessage"
        :title="title"
        v-if="!$slots.tableTitle && title"
      />
      <div :id="randomID" class="vben-btable-toolbar">
        <div :class="`${prefixCls}__toolbar`">
          <slot name="toolbar"></slot>
          <Divider type="vertical" v-if="$slots.toolbar && showTableSetting" />
          <TableSettingComponent
            :setting="tableSetting"
            v-if="showTableSetting"
            @columns-change="handleColumnChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, toRefs, onMounted, nextTick, watch } from 'vue';
  import { Divider } from 'ant-design-vue';
  import TableSettingComponent from './settings/index.vue';
  import TableTitle from './TableTitle.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import type { TableSetting, ColumnChangeParam } from '../types/table';
  import type { PropType } from 'vue';

  // Props
  const props = defineProps({
    title: { type: [Function, String] as PropType<string | ((data) => string)> },
    tableSetting: { type: Object as PropType<TableSetting> },
    showTableSetting: { type: Boolean },
    titleHelpMessage: { type: [String, Array] as PropType<string | string[]>, default: '' },
    target: { type: [String], default: '' },
    targetTabKey: { type: [String, Number], default: '' },
    targetTabValue: { type: [String, Number], default: '' },
  });

  // Emit
  const emit = defineEmits(['columns-change']);

  // Use Design Hook
  const { prefixCls } = useDesign('basic-table-header');

  // Expose Refs to Template
  const {
    title,
    tableSetting,
    showTableSetting,
    titleHelpMessage,
    target,
    targetTabKey,
    targetTabValue,
  } = toRefs(props);
  const domElement = ref();

  const randomID = ref('vben-btable-toolbar-' + Math.floor(Math.random() * 10000000));

  // Handle Column Change
  function handleColumnChange(data: ColumnChangeParam[]) {
    emit('columns-change', data);
  }

  watch(
    () => props.targetTabValue,
    () => {
      nextTick(() => {
        handleTargetToggle();
      });
    },
  );

  // 执行 dom 迁移操作
  const handleTargetToggle = () => {
    try {
      const toolbar = document.querySelector('div#' + randomID.value);
      domElement.value = toolbar ? toolbar : domElement.value;
      if (targetTabValue.value == targetTabKey.value) {
        domElement.value.style.display = 'block';
      } else {
        domElement.value.style.display = 'none';
      }
    } catch {
      //
    }
  };

  // 执行 dom 迁移操作
  const handleTargetTransfer = () => {
    try {
      const targetElement = document.querySelector(target.value + ' .ant-tabs-nav-wrap');
      const toolbar = document.querySelector(target.value + ' div#' + randomID.value);
      const title = document.querySelector(target.value + ' div.ant-table-title');
      domElement.value = toolbar;
      if (target.value) {
        targetElement?.appendChild(domElement.value);
        title?.remove();
      }
      if (targetTabValue.value == targetTabKey.value) {
        domElement.value.style.display = 'block';
      } else {
        domElement.value.style.display = 'none';
      }
    } catch {
      //
    }
  };

  onMounted(() => {
    nextTick(() => {
      handleTargetTransfer();
    });
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-basic-table-header';

  :deep(.vben-basic-table-header__toolbar) {
    margin-top: 0.5rem;
  }

  .vben-btable-toolbar {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-end;

    .@{prefix-cls} {
      &__toolbar {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: flex-end;

        > * {
          margin-right: 8px;
        }
      }
    }
  }
</style>
