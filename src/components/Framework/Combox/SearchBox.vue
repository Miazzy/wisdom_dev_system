<template>
  <div class="search-box" ref="searchBox">
    <a-dropdown
      v-if="props.vmode == 'edit' && !props.disabled"
      :trigger="['click']"
      v-model:visible="showDropdown"
      @visibleChange="handleClickOutside"
    >
      <!-- 输入框区域 -->
      <a-input v-model:value="searchRealText" class="search-text" @click="toggleDropdown($event)" />
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
                <input class="search-input" v-model="search.text" />
                <button class="close-button" @click="clearData">清除</button>
                <button class="search-button" @click="searchData">搜索</button>
              </div>
            </div>
            <div class="search-table">
              <template v-if="multiple">
                <a-table
                  :rowKey="handleRowKey"
                  :row-selection="rowSelection"
                  :columns="tcolumns"
                  :data-source="tableData"
                  size="small"
                  :pagination="tpagination"
                  :loading="loading"
                  :bordered="true"
                  :scroll="{ y: theight }"
                  :customRow="handleClick"
                />
              </template>
              <template v-else>
                <a-table
                  :rowKey="handleRowKey"
                  :columns="tcolumns"
                  :data-source="tableData"
                  size="small"
                  :pagination="tpagination"
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
  } from 'vue';
  import { getCustomCompOptions } from '@/utils/cache';
  import clickOutside from '/@/directives/clickOutside';
  import type { TableProps } from 'ant-design-vue';
  import { defHttp } from '/@/utils/http/axios';

  const showDropdown = ref(false);
  const searchRealText = ref('');
  const search = reactive({ text: '' });
  const searchBox = ref<any>(null);
  const loading = ref(false);
  const tableData = reactive([]);
  const theight = ref(260);

  const props = defineProps({
    vmode: { type: String, default: 'edit' },
    opkey: { type: String, default: null },
    multiple: { type: Boolean, default: false },
    columns: Array, // 列定义
    data: Array, // 表格数据
    twidth: { type: String, default: '100%' },
    value: { type: String, default: '' }, // 搜索框文本
    tfields: {
      type: Object,
      default: { key: 'id' }, // table必须含有key字段，此处是只将数组对象的那个字段转化为key字段
    },
    disabled: { type: Boolean, default: false },
    api: { type: [String, Function], default: null },
    vfield: { type: String, default: '' },
    pagination: { type: Boolean, default: false },
  });

  const tcolumns = ref([]);
  const tvfield = ref('');
  const tdata = ref([]);
  const tpagination = ref(false);
  const twidths = ref('100%');

  const emit = defineEmits(['update:value', 'select', 'change']); // 允许双向绑定value

  // 获取api请求结果
  const getApiFunc = async (url, params = {}) => {
    const requestParams = { url: url, params };
    return defHttp.get<any>(requestParams, { isOnlyResult: true });
  };

  // 查询数据函数
  const searchData = async () => {
    try {
      // loading.value = true;
      tableData.splice(0, tableData.length);
      if (props.api != null && typeof props.api === 'string') {
        // 如果 api 是字符串，则说明是 URL
        const url = props.api;
        const result = await getApiFunc(url);
        let data = [];
        if (result?.data && Array.isArray(result?.data)) {
          data = result?.data;
        } else if (result?.list && Array.isArray(result?.list)) {
          data = result?.list;
        }
        const rule = props?.tfields;
        const transformedData = transformData(data, rule) as never[];
        tableData.push(...transformedData);
      } else if (props.api != null && typeof props.api === 'function') {
        // 如果 api 是函数，则调用函数获取数据
        const list = await props.api();
        const rule = props?.tfields;
        const transformedData = transformData(list, rule) as never[];
        tableData.push(...transformedData);
      } else {
        const rule = props?.tfields;
        const data = unref(tdata.value as unknown[]);
        const resultData = JSON.parse(JSON.stringify(data));
        const result = findNodes(resultData, search.text);
        const tempList = transformData(result, rule) as never[];
        tableData.push(...tempList);
      }
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
    } catch (error) {
      //
    }
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
    onChange: (keys: any[], selectedRows: any[]) => {
      const records = keys.join(',');
      searchRealText.value = records;
      emit('update:value', records);
      emit('select', { records, keys, selectedRows });
      emit('change', records, { records, keys, selectedRows });
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  // 处理RowKey
  const handleRowKey = (record) => {
    if (Reflect.has(record, tvfield.value)) {
      return record[tvfield.value];
    } else if (Reflect.has(record, props.tfields.key)) {
      return record[props.tfields.key];
    } else {
      return JSON.stringify(record);
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

  const handleChange = (pagination, filters, sorter, options) => {
    debugger;
  };

  // 重新加载数据函数
  const reloadData = async () => {
    try {
      tableData.splice(0, tableData.length);
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
      if (props.api != null && typeof props.api == 'function') {
        const list = await props.api();
        tdata.value = list;
      } else if (props.api != null && typeof props.api === 'string') {
        const result = await getApiFunc(props.api);
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
      tableData.push(...tempList);
    } catch (error) {
      //
    }
  };

  watch(
    () => props.data,
    (newValue) => {
      reloadData();
    },
  );

  watch(
    () => props.value,
    (newValue) => {
      try {
        searchRealText.value = props.value;
      } catch (error) {
        //
      }
    },
  );

  onMounted(async () => {
    try {
      debugger;
      await reloadData();
      searchRealText.value = props.value;
      withDirectives(searchBox, [[clickOutside, handleClickOutside]]); // 注册 clickOutside 指令
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
      position: absolute;
      z-index: 1000 !important;
      width: 100%;
      border-bottom: 1px solid #f0f0f0;
      background: #fefefe;

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
        background: #fefefe;
        color: #cecece;

        &:hover {
          color: #c0c0c0;
          cursor: pointer;
        }
      }

      .close-button {
        position: absolute;
        top: 5px;
        right: 40px;
        background: #fefefe;
        color: #cecece;

        &:hover {
          color: #c0c0c0;
          cursor: pointer;
        }
      }
    }

    .search-table {
      position: absolute;
      z-index: 1000 !important;
      top: 36px;
      width: 100%;
      border-top: 1px solid #f0f0f0;
      border-bottom: 0 solid #cecece;
      background: #fefefe;

      .ant-table-wrapper {
        border-top: 1px solid #e9e9e9;
        border-right: 1px solid #e9e9e9;
        border-bottom: 1px solid #e9e9e9;
        border-left: 1px solid #e9e9e9;
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
