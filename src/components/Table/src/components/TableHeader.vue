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
      <div id="vben-btable-toolbar">
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
  import { ref, toRefs } from 'vue';
  import { Divider } from 'ant-design-vue';
  import TableSettingComponent from './settings/index.vue';
  import TableTitle from './TableTitle.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import type { TableSetting, ColumnChangeParam } from '../types/table';
  import type { PropType } from 'vue';

  // Props
  const props = defineProps({
    title: {
      type: [Function, String] as PropType<string | ((data) => string)>,
    },
    tableSetting: {
      type: Object as PropType<TableSetting>,
    },
    showTableSetting: {
      type: Boolean,
    },
    titleHelpMessage: {
      type: [String, Array] as PropType<string | string[]>,
      default: '',
    },
    target: {
      type: [String],
      default: '',
    },
  });

  // Emit
  const emit = defineEmits(['columns-change']);

  // Use Design Hook
  const { prefixCls } = useDesign('basic-table-header');

  // Handle Column Change
  function handleColumnChange(data: ColumnChangeParam[]) {
    emit('columns-change', data);
  }

  // Expose Refs to Template
  const { title, tableSetting, showTableSetting, titleHelpMessage, target } = toRefs(props);
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-basic-table-header';

  #vben-btable-toolbar {
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
