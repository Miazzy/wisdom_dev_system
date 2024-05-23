<template>
  <div class="search-box" ref="searchBox">
    <a-dropdown
      ref="dropdown"
      v-if="props.vmode == 'edit' && !props.disabled"
      :trigger="['click']"
      :disabled="isDisabled"
      class="search-dropdown-box"
      v-model:visible="showDropdown"
      @visibleChange="handleClickOutside"
    >
      <!-- 输入框区域 -->
      <a-input
        v-model:value="searchRealText"
        class="search-text"
        :allow-clear="showDropdown"
        :disabled="isDisabled"
        placeholder="请选择下拉列表中数据..."
        @focus="handlePreventEvent"
        @keydown="handlePreventEvent"
        @change="handleTextChange"
        @click="toggleDropdown($event)"
      />
      <template #overlay>
        <a-menu>
          <!-- 下拉表格弹框区域 -->
          <div
            @click.stop
            v-show="showDropdown"
            class="search-content"
            :style="`width: ${twidths || props.twidth}; display: ${
              showDropdown ? 'block' : 'none'
            }`"
          >
            <!-- 输入框、搜索按钮和关闭按钮区域 -->
            <div class="search-panel">
              <div class="search-popup-subcontent">
                <input
                  class="search-input"
                  v-model="search.text"
                  @keyup="searchData"
                  placeholder="  请输入搜索关键字..."
                />
                <button class="close-button" @click="clearData">清除</button>
                <button class="search-button" @click="searchData">搜索</button>
              </div>
            </div>
            <div class="search-table">
              <template v-if="multiple">
                <Table
                  :rowKey="handleRowKey"
                  :row-selection="rowSelection"
                  :columns="tcolumns"
                  :data-source="tableData"
                  size="small"
                  :pagination="xpagination"
                  :loading="loading"
                  :bordered="true"
                  :scroll="{ y: theight }"
                  @change="handleChange"
                  :customRow="handleClick"
                />
              </template>
              <template v-else>
                <Table
                  :rowKey="handleRowKey"
                  :columns="tcolumns"
                  :data-source="tableData"
                  size="small"
                  :pagination="xpagination"
                  :loading="loading"
                  :bordered="true"
                  :scroll="{ y: theight }"
                  @change="handleChange"
                  :customRow="handleClick"
                />
              </template>
            </div>
          </div>
        </a-menu>
      </template>
    </a-dropdown>
    <span v-else-if="props.vmode == 'view'">{{ props.value }}</span>
    <span v-else><a-input :value="props.value" class="search-text" :disabled="true" /></span>
  </div>
</template>

<script lang="ts" setup>
  import {
    ref,
    onMounted,
    onUnmounted,
    defineProps,
    defineEmits,
    unref,
    watch,
    reactive,
    withDirectives,
    nextTick,
    computed,
  } from 'vue';
  import { getCustomCompOptions } from '@/utils/cache';
  import clickOutside from '/@/directives/clickOutside';
  import { Table } from 'ant-design-vue';
  import type { TableProps } from 'ant-design-vue';
  import { defHttp } from '/@/utils/http/axios';
  import { MsgManager } from '/@/message/MsgManager';

  const showDropdown = ref(false);
  const searchRealText = ref<any>('');
  const search = reactive({ text: '' });
  const searchBox = ref<any>(null);
  const dropdown = ref<any>(null);
  const loading = ref(false);
  const tableData = reactive([]);
  const theight = ref(260);

  const props = defineProps({
    vmode: { type: String, default: 'edit' },
    opkey: { type: String, default: null },
    searchKey: { type: String, default: 'name' },
    multiple: { type: Boolean, default: false },
    columns: Array, // 列定义
    data: Array, // 表格数据
    twidth: { type: String, default: 'auto' },
    value: { type: String, default: '' }, // 搜索框文本
    tfields: {
      type: Object,
      default: { key: 'id' }, // table必须含有key字段，此处是只将数组对象的那个字段转化为key字段
    },
    disabled: { type: Boolean, default: false },
    api: { type: [String, Function], default: null },
    apiParamFunc: { type: Function, default: null },
    vfield: { type: String, default: 'name' },
    pagination: { type: [Boolean, Object], default: false },
    callback: { type: Function, default: null },
    validateFunc: { type: Function, default: null },
  });

  const tcolumns = ref([]);
  const tvfield = ref('');
  const tdata = ref([]);
  const tpagination = ref<any>(false);
  const twidths = ref('100%');
  const xpagination = reactive({
    size: 'small',
    total: 0,
    current: 1,
    pageSize: 10,
    hideOnSinglePage: false,
    simple: false,
    disabled: false,
  });

  // 注入全局的disable状态
  const appDisabled = ref(false);

  // 根据disable状态计算出组件的disable状态
  const isDisabled = computed(() => {
    return props.disabled || appDisabled.value;
  });

  const emit = defineEmits([
    'update:value',
    'select',
    'change',
    'search',
    'searchclick',
    'clear',
    'update:searchText',
  ]); // 允许双向绑定value

  // 获取api请求结果
  const getApiFunc = async (url, pagination, params: any = null) => {
    if ((params == null || typeof params == 'undefined') && props.apiParamFunc != null) {
      params = await props.apiParamFunc?.();
      if (params === false) {
        return { data: [], total: 0 };
      }
    }
    if (!url.includes('?')) {
      url = url + `?${props.searchKey}={name}&pageNo={current}&pageSize={pageSize}`;
    }
    url = url
      .replace('{name}', search.text)
      .replace('{current}', pagination.current)
      .replace('{pageSize}', pagination.pageSize);
    const requestParams = { url, params };
    return defHttp.get<any>(requestParams, { isOnlyResult: true });
  };

  // 查询数据函数
  const searchData = () => {
    try {
      emit('update:searchText', search.text);
      emit('search', search.text);
      emit('searchclick', search.text);
      nextTick(async () => {
        // loading.value = true;
        if (props.api != null && typeof props.api === 'string') {
          // 如果 api 是字符串，则说明是 URL
          const url = props.api;
          const pagination = { current: 1, pageSize: xpagination.pageSize };
          const result = await getApiFunc(url, pagination);
          let data = [];
          if (result?.data && Array.isArray(result?.data)) {
            data = result?.data;
          } else if (result?.list && Array.isArray(result?.list)) {
            data = result?.list;
          }
          const rule = props?.tfields;
          const transformedData = transformData(data, rule) as never[];
          tableData.splice(0, tableData.length);
          tableData.push(...transformedData);
          xpagination.total = result?.total;
          xpagination.current = pagination.current;
        } else if (props.api != null && typeof props.api === 'function') {
          // 如果 api 是函数，则调用函数获取数据
          const list = await props.api();
          const rule = props?.tfields;
          const transformedData = transformData(list, rule) as never[];
          tableData.splice(0, tableData.length);
          tableData.push(...transformedData);
        } else {
          const rule = props?.tfields;
          const data = unref(tdata.value as unknown[]);
          const resultData = JSON.parse(JSON.stringify(data));
          const result = findNodes(resultData, search.text);
          const tempList = transformData(result, rule) as never[];
          tableData.splice(0, tableData.length);
          tableData.push(...tempList);
        }
      });
      // loading.value = false;
    } catch (error) {
      //
    }
  };

  // 下拉内容隐藏函数
  const toggleDropdown = (event) => {
    try {
      event.stopPropagation(); // 阻止事件冒泡
      showDropdown.value = true;
      handleValid();
    } catch (error) {
      //
    }
  };

  // 禁用事件
  const handlePreventEvent = (event) => {
    event.preventDefault();
  };

  // 处理校验
  const handleValid = () => {
    if (props.validateFunc) {
      props.validateFunc();
    }
  };

  // 更新数据
  const handleTextChange = (e) => {
    emit('update:value', searchRealText.value);
    emit('change', searchRealText.value, {});
    handleValid();
  };

  const clearData = () => {
    try {
      search.text = '';
      searchData();
      clearInput('input.search-input');
    } catch (error) {
      //
    }
  };

  // 清空输入
  const clearInput = (selector = 'input.search-input') => {
    try {
      document.querySelector(selector).value = '';
    } catch (e) {
      //
    }
  };

  // 选中函数
  const rowSelection: TableProps['rowSelection'] = {
    hideSelectAll: true,
    preserveSelectedRowKeys: true,
    onChange: (keys: any[], selectedRows: any[]) => {},
    onSelect: (record, selected, selectedRows, nativeEvent) => {
      if (selected == true) {
        searchRealText.value += handleRowKey(record) + ',';
      } else {
        searchRealText.value = searchRealText.value.replace(handleRowKey(record) + ',', '');
      }
      emit('update:value', searchRealText.value);
      emit('select', { records: searchRealText.value, keys: searchRealText.value, selectedRows });
      emit('change', searchRealText.value, {
        records: searchRealText.value,
        keys: searchRealText.value,
        selectedRows,
      });
      handleValid();
      if (props.callback != null) {
        props.callback({ records: searchRealText.value, keys: searchRealText.value, selectedRows });
      }
    },
  };

  // 处理RowKey
  const handleRowKey = (record) => {
    try {
      if (Reflect.has(record, tvfield.value)) {
        return record[tvfield.value];
      } else if (Reflect.has(record, props.tfields.key)) {
        return record[props.tfields.key];
      } else {
        return JSON.stringify(record);
      }
    } catch (error) {
      //
    }
  };

  // 按tfields生成转换规则
  const reverseRule = (rule) => {
    const reversedRule = {};
    try {
      for (const key in rule) {
        reversedRule[rule[key]] = key;
      }
    } catch (error) {
      //
    }
    return reversedRule;
  };

  // 按tfields的设置转换table的数据
  const transformData = (data, rule) => {
    if (data == null || typeof data == 'undefined' || data.length === 0) {
      return [];
    }
    try {
      const rules = reverseRule(rule);
      return data.map((item) => {
        const newItem = {};
        for (const key in item) {
          if (key in rules) {
            newItem[rules[key]] = item[key];
          } else {
            newItem[key] = item[key];
          }
        }
        return newItem;
      });
    } catch (error) {
      return [];
    }
  };

  // 递归函数
  const recursiveSearch = (node, result, searchValue) => {
    try {
      const temp = JSON.parse(JSON.stringify(node));
      if (JSON.stringify(temp).includes(searchValue)) {
        result.push(temp);
      }
    } catch (error) {
      //
    }
  };

  // 查找节点
  const findNodes = (data, searchValue) => {
    if (searchValue == '' || searchValue == null || typeof searchValue == 'undefined') {
      return data;
    }
    const result = [];
    try {
      // 开始遍历
      for (const item of data) {
        recursiveSearch(item, result, searchValue);
      }
    } catch (error) {
      //
    }
    return result;
  };

  const handleClickOutside = (event) => {
    try {
      clearData();
      reloadData();
      if (typeof event == 'boolean') {
        return;
      }
      if (searchBox.value && !searchBox.value.contains(event.target)) {
        showDropdown.value = false;
      }
    } catch (error) {
      //
    }
  };

  // 表格点击函数
  const handleClick = (record, index) => {
    const clickFunc = (event) => {
      try {
        if (!props.multiple) {
          searchRealText.value = record[tvfield.value];
          emit('update:value', record[tvfield.value]);
          emit('select', { record, index }, event);
          emit('change', record[tvfield.value], { record, index }, event);
          if (props.callback != null) {
            props.callback({ record, index, event });
          }
          handleValid();
        }
        showDropdown.value = false;
      } catch (error) {
        //
      }
    };
    return {
      onclick: clickFunc,
    };
  };

  // 监听变化函数
  const handleChange = async (pagination, filters, sorter, options) => {
    try {
      // 重新加载数据
      if (props.api != null) {
        const result = await getApiFunc(props.api, pagination);
        if (result?.data && Array.isArray(result?.data)) {
          tdata.value = result?.data;
        } else if (result?.list && Array.isArray(result?.list)) {
          tdata.value = result?.list;
        }
        const rule = props?.tfields;
        const data = unref(tdata.value as unknown[]);
        const resultData = JSON.parse(JSON.stringify(data));
        const tempList = transformData(resultData, rule) as never[];
        tableData.splice(0, tableData.length);
        tableData.push(...tempList);
        xpagination.total = result?.total;
      }
      // 重新设置分页数据
      xpagination.current = pagination?.current;
      xpagination.pageSize = pagination?.pageSize;
    } catch (error) {
      //
    }
  };

  // 重新加载数据函数
  const reloadData = async () => {
    try {
      if (props.opkey != null && props.opkey != '') {
        const options = getCustomCompOptions(props.opkey);
        tcolumns.value = options.columns;
        tvfield.value = options.vfield;
        tdata.value = options.data;
        tpagination.value = options.pagination;
        twidths.value = options.twidth;
      } else {
        tcolumns.value = props.columns as never[];
        tvfield.value = props.vfield;
        tdata.value = props.data as never[];
        tpagination.value = props.pagination;
        twidths.value = props.twidth;
      }
      const pagination = { current: 1, pageSize: xpagination.pageSize };
      let result: any = null;
      if (props.api != null && typeof props.api == 'function') {
        result = await props.api();
        tdata.value = result?.list;
      } else if (props.api != null && typeof props.api === 'string') {
        result = await getApiFunc(props.api, pagination);
        if (result?.data && Array.isArray(result?.data)) {
          tdata.value = result?.data;
        } else if (result?.list && Array.isArray(result?.list)) {
          tdata.value = result?.list;
        }
      }
      const rule = props?.tfields;
      const data = unref(tdata.value as unknown[]);
      const resultData = JSON.parse(JSON.stringify(data));
      const tempList = transformData(resultData, rule) as never[];
      tableData.splice(0, tableData.length);
      tableData.push(...tempList);
      xpagination.disabled = !tpagination.value;
      xpagination.total = result?.total;
      xpagination.current = pagination.current;
      xpagination.pageSize = pagination?.pageSize;
    } catch (error) {
      //
    }
  };

  watch(
    () => showDropdown.value,
    async () => {
      try {
        if (props.twidth === 'auto' || props.twidth === '100%') {
          const handleWidth = () => {
            const doms = document.querySelectorAll('body .ant-dropdown');
            for (let dom of doms) {
              dom.style.width = dom.style.minWidth;
            }
          };
          await nextTick();
          await nextTick();
          await nextTick();
          await nextTick();
          await nextTick();
          handleWidth();
        }
      } catch (error) {
        //
      }
    },
  );

  watch(
    () => props.data,
    () => {
      reloadData();
    },
  );

  watch(
    () => props.value,
    () => {
      try {
        searchRealText.value = props.value;
      } catch (error) {
        //
      }
    },
  );

  watch(
    () => searchRealText.value,
    (val) => {
      if (!val) {
        emit('clear', val);
      }
    },
  );

  onMounted(async () => {
    try {
      await reloadData();
      searchRealText.value = props.value;
      withDirectives(searchBox, [[clickOutside, handleClickOutside]]); // 注册 clickOutside 指令
      // MsgManager.getInstance().listen('global-disabled', (message) => { appDisabled.value = message; });
    } catch (error) {
      //
    }
  });

  onUnmounted(() => {});
</script>

<style lang="less" scoped>
  .search-box {
    position: relative;
  }

  .vben-editable-cell__wrapper {
    .search-box {
      .search-dropdown-box {
        margin: 0;
        padding: 0 2px 0 4px;

        :deep(.ant-input) {
          height: 24px !important;
          margin: 3px 0;
        }
      }
    }
  }

  :deep(.ant-dropdown.ant-dropdown-placement-bottomLeft) {
    width: auto !important;
  }

  .search-content {
    position: relative;
    z-index: 100000 !important; // 设置一个较大的值
    height: 100%;
    margin-top: 5px;
    border: 0 solid #f0f0f0;

    &:deep(.ant-table-wrapper) {
      z-index: 10000 !important;
    }

    &:deep(.ant-table-wrapper .ant-spin-nested-loading .ant-spin-container) {
      z-index: 1000 !important;
    }

    .search-panel {
      width: 100%;

      .search-popup-subcontent {
        margin: 0 5px 1px;

        & input.search-text {
          z-index: 1000 !important;
          width: 100%;
          padding: 5px;
        }
      }

      .search-button {
        position: absolute;
        top: 5px;
        right: 0;

        &:hover {
          cursor: pointer;
        }
      }

      .close-button {
        position: absolute;
        top: 5px;
        right: 40px;

        &:hover {
          cursor: pointer;
        }
      }
    }

    .search-table {
      top: 36px;
      width: 100%;
      border-bottom: 0 solid #cecece;

      .ant-table-wrapper {
        padding: 10px;
      }
    }
  }

  input.search-input {
    width: 100%;
    height: 35px;
    line-height: 35px;

    &:focus {
      border: 0 solid #fefefe;
      border-bottom: 1px solid #3793f5;
      border-radius: 0;
      outline: none;
    }
  }
</style>
<style lang="less">
  .theme1 {
    .search-content .search-panel {
      border-bottom: 1px solid rgb(217 217 217 / 16%);
      background: #032748;

      .search-button {
        background: transparent;
        color: #fefefe;

        &:hover {
          color: #1890ff;
        }
      }

      .close-button {
        background: transparent;
        color: #fefefe;

        &:hover {
          color: #1890ff;
        }
      }
    }

    .search-popup-subcontent {
      .search-input {
        background: transparent;
      }
    }
  }

  [data-theme='dark'] .theme1 {
    .ant-dropdown-menu {
      background: #032748;
    }

    .ant-dropdown {
      background: #032748;
      box-shadow:
        0 3px 6px -4px rgb(0 0 0 / 12%),
        0 6px 16px 0 rgb(0 0 0 / 8%),
        0 9px 28px 8px rgb(0 0 0 / 5%);
    }
  }

  .theme3 {
    .search-content .search-panel {
      border-bottom: 1px solid #f0f0f0;
      background: #fefefe;

      .search-button {
        background: #fefefe;
        color: #cecece;

        &:hover {
          color: #1890ff;
        }
      }

      .close-button {
        background: #fefefe;
        color: #cecece;

        &:hover {
          color: #1890ff;
        }
      }
    }
  }
</style>
