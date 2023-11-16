<template>
  <div class="search-box" ref="searchBox">
    <a-dropdown v-if="props.vmode == 'edit'" :trigger="['click']" @click="handleButtonClick">
      <!-- 输入框区域 -->
      <a-input
        v-model:value="searchRealText"
        class="search-text"
        @click="toggleDropdown($event)"
        placeholder=""
      />
      <template #overlay>
        <a-menu>
          <!-- 下拉表格弹框区域 -->
          <div
            v-show="showDropdown"
            class="search-content"
            :style="`width: ${twidth}; display: ${showDropdown ? 'block' : 'none'}`"
          >
            <!-- 输入框、搜索按钮和关闭按钮区域 -->
            <div class="search-panel">
              <div class="search-popup-subcontent">
                <input class="search-input" v-model="searchTableText" placeholder="" />
                <button class="close-button" @click="clearData">清除</button>
                <button class="search-button" @click="searchData">搜索</button>
              </div>
            </div>
            <div class="search-table">
              <a-table
                :columns="tcolumns"
                :data-source="tableData"
                size="small"
                :pagination="props.pagination"
                :loading="loading"
                :bordered="true"
                :scroll="{ y: theight }"
                :customRow="handleClick"
              />
            </div>
          </div>
        </a-menu>
      </template>
    </a-dropdown>
    <span v-if="props.vmode == 'view'">{{ props.value }}</span>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onUnmounted, defineProps, defineEmits, unref, watch } from 'vue';
  import { getCustomCompOptions } from '@/utils/cache';

  const showDropdown = ref(false);
  const searchRealText = ref('');
  const searchTableText = ref('');
  const searchBox = ref<any>(null);
  const loading = ref(false);
  const tableData = ref([]);
  const theight = ref(260);

  const props = defineProps({
    vmode: { type: String, default: 'edit' },
    opkey: { type: String, default: null },
    columns: Array, // 列定义
    data: Array, // 表格数据
    twidth: { type: String, default: '100%' },
    value: { type: String, default: '' }, // 搜索框文本
    tfields: {
      type: Object,
      default: { key: 'id' }, // table必须含有key字段，此处是只将数组对象的那个字段转化为key字段
    },
    vfield: { type: String, default: '' },
    pagination: { type: Boolean, default: false },
  });

  const tcolumns = ref([]);
  const tvfield = ref('');
  const tdata = ref([]);

  const emit = defineEmits(['update:value', 'searchData', 'clearData', 'select']); // 允许双向绑定value

  const searchData = () => {
    loading.value = true;
    tableData.value = [];
    emit('searchData', searchTableText.value); // 向父组件传递搜索文本的更新
    setTimeout(() => {
      const rule = props?.tfields;
      const data = unref(tdata.value as unknown[]);
      const resultData = JSON.parse(JSON.stringify(data));
      const result = findNodes(resultData, searchTableText.value);
      tableData.value = transformData(result, rule);
      loading.value = false;
    }, 500);
  };

  const toggleDropdown = (event) => {
    event.stopPropagation(); // 阻止事件冒泡
    showDropdown.value = true;
  };

  const clearData = () => {
    searchTableText.value = '';
    searchData();
  };

  // 按tfields生成转换规则
  const reverseRule = (rule) => {
    const reversedRule = {};
    for (const key in rule) {
      reversedRule[rule[key]] = key;
    }
    return reversedRule;
  };

  // 按tfields的设置转换table的数据
  const transformData = (data, rule) => {
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
  };

  // 查找节点
  const findNodes = (data, searchValue) => {
    if (searchValue == '' || searchValue == null || typeof searchValue == 'undefined') {
      return data;
    }
    const result = [];
    // 递归函数
    function recursiveSearch(node) {
      const temp = JSON.parse(JSON.stringify(node));
      if (JSON.stringify(temp).includes(searchValue)) {
        result.push(temp);
      }
    }
    // 开始遍历
    for (const item of data) {
      recursiveSearch(item);
    }
    return result;
  };

  const handleClickOutside = (event) => {
    if (searchBox.value && !searchBox.value.contains(event.target)) {
      showDropdown.value = false;
    }
  };

  const handleButtonClick = (e: Event) => {
    showDropdown.value = true;
  };

  const handleClick = (record, index) => {
    const clickFunc = (event) => {
      console.log(record, index);
      searchRealText.value = record[tvfield.value];
      emit('update:value', record[tvfield.value]);
      emit('select', { record, index }, event);
      showDropdown.value = false;
    };
    return {
      onclick: clickFunc,
    };
  };

  const reloadData = () => {
    if (props.opkey != null && props.opkey != '') {
      const options = getCustomCompOptions(props.opkey);
      tcolumns.value = options.columns;
      tvfield.value = options.vfield;
      tdata.value = options.data;
    } else {
      tcolumns.value = props.columns as never[];
      tvfield.value = props.vfield;
      tdata.value = props.data as never[];
    }
    const rule = props?.tfields;
    const data = unref(tdata.value as unknown[]);
    const resultData = JSON.parse(JSON.stringify(data));
    tableData.value = transformData(resultData, rule);
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
      searchRealText.value = props.value;
    },
  );

  onMounted(() => {
    reloadData();
    searchRealText.value = props.value;
    window.addEventListener('click', handleClickOutside);
  });

  onUnmounted(() => {
    window.removeEventListener('click', handleClickOutside);
  });
</script>

<style lang="less" scoped>
  .search-box {
    position: relative;
  }

  .search-content {
    margin-top: 5px;
    position: relative;
    height: 100%;
    border: 1px solid #f0f0f0;
    z-index: 100000 !important; // 设置一个较大的值

    &:deep(.ant-table-wrapper) {
      z-index: 10000 !important;
    }

    &:deep(.ant-table-wrapper .ant-spin-nested-loading .ant-spin-container) {
      z-index: 1000 !important;
    }

    .search-panel {
      position: absolute;
      background: #fefefe;
      border-bottom: 0px solid #cecece;
      width: 100%;
      z-index: 1000 !important;
      .search-popup-subcontent {
        margin: 0px 5px 1px 5px;
        & input.search-text {
          width: 100%;
          padding: 5px;
          z-index: 1000 !important;
        }
      }
      .search-button {
        color: #cecece;
        background: #fefefe;
        position: absolute;
        top: 5px;
        right: 0;

        &:hover {
          color: #c0c0c0;
          cursor: pointer;
        }
      }
      .close-button {
        color: #cecece;
        background: #fefefe;
        position: absolute;
        top: 5px;
        right: 40px;

        &:hover {
          color: #c0c0c0;
          cursor: pointer;
        }
      }
    }

    .search-table {
      position: absolute;
      background: #fefefe;
      border-bottom: 0px solid #cecece;
      width: 100%;
      z-index: 1000 !important;
      top: 36px;
      border-top: 1px solid #f0f0f0;

      .ant-table-wrapper {
        border-top: 1px solid #e9e9e9;
        border-right: 1px solid #e9e9e9;
        border-left: 1px solid #e9e9e9;
        border-bottom: 1px solid #e9e9e9;
      }
    }
  }

  input.search-input {
    width: 100%;
    line-height: 35px;
    height: 35px;
    &:focus {
      outline: none;
      border: 0px solid #fefefe;
      border-bottom: 1px solid #3793f5;
      border-radius: 0px;
    }
  }
</style>
