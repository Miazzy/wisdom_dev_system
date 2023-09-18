<template>
  <div :class="bem()" class="fit-tree-header" ref="treeHeaderRef">
    <div class="flex px-2 py-1.5 items-center bg-[#F5F5F5]">
      <slot name="headerTitle" v-if="slots.headerTitle"></slot>
      <BasicTitle :helpMessage="helpMessage" v-if="!slots.headerTitle && title">
      {{ title }}
      </BasicTitle>
      <div
      class="flex items-center flex-1 cursor-pointer justify-self-stretch justify-end"
      v-if="search || toolbar"
      >
        <Space v-if="toolbar&&isShowOperationBtns" :size="0">
          <Button size="small" @click="handleTreeAdd" type="text"><Icon icon="ion:add" /></Button>
          <Button size="small" @click="handleTreeEdit" type="text"><Icon icon="fluent:edit-16-regular" /></Button>
          <Button size="small" @click="handleTreeDelete" type="text"><Icon icon="ant-design:delete-outlined" /></Button>
          <Button size="small" @click="handleTreeRefresh" type="text"><Icon icon="ion:refresh" /></Button>
        </Space>
        <Dropdown @click.prevent v-if="toolbar">
          <Icon icon="ion:ellipsis-vertical" />
          <template #overlay>
            <Menu @click="handleMenuClick">
              <template v-for="item in toolbarList" :key="item.value">
                <MenuItem v-bind="{ key: item.value }">
                  {{ item.label }}
                </MenuItem>
                <MenuDivider v-if="item.divider" />
              </template>
            </Menu>
          </template>
        </Dropdown>
      </div>
    </div>
    <div :class="getInputSearchCls" v-if="search">
      <InputSearch :placeholder="t('common.inputKeyWords')" allowClear v-model:value="searchValue">
        <template #prefix>
          <Icon icon="ant-design:search-outlined" color="rgba(0, 0, 0, 0.45)" />
        </template>
        <template #enterButton>
          <Button>{{t('common.searchText')}}</Button>
        </template>
      </InputSearch>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { type PropType, computed, ref, watch, useSlots, onMounted, unref, inject } from 'vue';
  import { Dropdown, Menu, MenuItem, MenuDivider, InputSearch, Button, Space } from 'ant-design-vue';
  
  import Icon from '@/components/Icon/Icon.vue';
  import { BasicTitle } from '/@/components/Basic';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDebounceFn } from '@vueuse/core';
  import { createBEM } from '/@/utils/bem';
  import { ToolbarEnum } from '../types/tree';

  const searchValue = ref('');

  const [bem] = createBEM('tree-header');

  const props = defineProps({
    helpMessage: {
      type: [String, Array] as PropType<string | string[]>,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    toolbar: {
      type: Boolean,
      default: false,
    },
    checkable: {
      type: Boolean,
      default: false,
    },
    search: {
      type: Boolean,
      default: false,
    },
    searchText: {
      type: String,
      default: '',
    },
    checkAll: {
      type: Function,
      default: undefined,
    },
    expandAll: {
      type: Function,
      default: undefined,
    },
    isShowOperationBtns: {
      type: Boolean,
      default: false,
    }
  } as const);
  const emit = defineEmits(['strictly-change', 'search']);

  const slots = useSlots();
  const { t } = useI18n();

  const getInputSearchCls = computed(() => {
    const titleExists = slots.headerTitle || props.title;
    return [
      'mr-1',
      'w-full',
      // {
      //   ['ml-5']: titleExists,
      // },
    ];
  });

  const toolbarList = computed(() => {
    const { checkable, isShowOperationBtns } = props;
    const defaultToolbarList = [
      { label: t('component.tree.expandAll'), value: ToolbarEnum.EXPAND_ALL },
      {
        label: t('component.tree.unExpandAll'),
        value: ToolbarEnum.UN_EXPAND_ALL,
        divider: checkable,
      },
    ];

    const operationBtnList = isShowOperationBtns?[]:[
      {
        label: t('component.tree.add'), 
        value: ToolbarEnum.ADD,
      },
      { 
        label: t('component.tree.edit'), 
        value: ToolbarEnum.EDIT 
      },
      {
        label: t('component.tree.delete'),
        value: ToolbarEnum.DELETE,
      },
      {
        label: t('component.tree.refresh'),
        value: ToolbarEnum.REFRESH,
        divider: isShowOperationBtns,
      }
    ];

    return checkable
      ? [
          ...operationBtnList,
          { label: t('component.tree.selectAll'), value: ToolbarEnum.SELECT_ALL },
          {
            label: t('component.tree.unSelectAll'),
            value: ToolbarEnum.UN_SELECT_ALL,
            divider: checkable,
          },
          ...defaultToolbarList,
          { label: t('component.tree.checkStrictly'), value: ToolbarEnum.CHECK_STRICTLY },
          { label: t('component.tree.checkUnStrictly'), value: ToolbarEnum.CHECK_UN_STRICTLY },
        ]
      : [
          ...operationBtnList,
          ...defaultToolbarList
        ];
  });

  const handleTreeEdit = inject('handleTreeEdit', null);
  const handleTreeAdd = inject('handleTreeAdd', null);
  const handleTreeDelete = inject('handleTreeDelete', null);
  const handleTreeRefresh = inject('handleTreeRefresh', null);

  function handleMenuClick(e: { key: ToolbarEnum }) {
    const { key } = e;
    switch (key) {
      case ToolbarEnum.SELECT_ALL:
        props.checkAll?.(true);
        break;
      case ToolbarEnum.UN_SELECT_ALL:
        props.checkAll?.(false);
        break;
      case ToolbarEnum.EXPAND_ALL:
        props.expandAll?.(true);
        break;
      case ToolbarEnum.UN_EXPAND_ALL:
        props.expandAll?.(false);
        break;
      case ToolbarEnum.CHECK_STRICTLY:
        emit('strictly-change', false);
        break;
      case ToolbarEnum.CHECK_UN_STRICTLY:
        emit('strictly-change', true);
        break;
      case ToolbarEnum.EDIT:
        handleTreeEdit();
        break;
      case ToolbarEnum.ADD:
        handleTreeAdd();
        break;
      case ToolbarEnum.DELETE:
        handleTreeDelete();
        break;
      case ToolbarEnum.REFRESH:
        handleTreeRefresh();
    }
  }

  function emitChange(value?: string): void {
    emit('search', value);
  }

  const debounceEmitChange = useDebounceFn(emitChange, 200);

  watch(
    () => searchValue.value,
    (v) => {
      debounceEmitChange(v);
    },
  );

  watch(
    () => props.searchText,
    (v) => {
      if (v !== searchValue.value) {
        searchValue.value = v;
      }
    },
  );

  onMounted(()=>{
    
  })
</script>
<style lang="less" scoped>
.fit-tree-header.vben-tree-header {
  border-bottom: none;

  :deep(.ant-input-search .ant-input-group .ant-input-affix-wrapper:not(:last-child)) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  :deep(.ant-input-search > .ant-input-group > .ant-input-group-addon:last-child) {
    left: 0;
  }

  :deep(.ant-input-search > .ant-input-group > .ant-input-group-addon:last-child .ant-input-search-button) {
    border-right: none;
    border-left: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;

    &:hover {
      border-color: #d9d9d9;
      color: #2a7dc9;
    }
  }

  :deep(.ant-input-affix-wrapper) {
    border-left: none;

    &::after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 1px;
      height: 31px;
      transition: all 0.3s;
      background-color: transparent;
      box-shadow: none;
    }

    &:hover::after, &:focus::after, &.ant-input-affix-wrapper-focused::after {
      display: block;
      background-color: #2a7dc9;
    }
  }

  :deep(.ant-input-affix-wrapper-focused) {
    box-shadow: none;
  }
}
</style>