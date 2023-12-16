<template>
  <div class="tree-box" ref="treeBox">
    <a-dropdown
      v-if="props.vmode == 'edit' && !props.disabled"
      :trigger="['click']"
      v-model:visible="showDropdown"
    >
      <!-- 输入框区域 -->
      <a-input v-model:value="searchRealText" class="tree-text" @click="toggleDropdown($event)" />
      <template #overlay>
        <a-menu>
          <!-- 下拉表格弹框区域 -->
          <div
            @click.stop
            v-show="showDropdown"
            class="tree-content"
            :style="`width: ${twidth}; display: ${showDropdown ? 'block' : 'none'}`"
          >
            <!-- 输入框、搜索按钮和关闭按钮区域 -->
            <div class="search-panel">
              <div class="search-popup-subcontent">
                <input class="search-input" v-model="search.text" />
                <button class="close-button" @click="clearData">清除</button>
                <button class="search-button" @click="searchData">搜索</button>
              </div>
            </div>
            <!-- 基础Tree组件 -->
            <div class="tree-compoment" :style="`max-height: ${theight}px;`">
              <a-tree
                :tree-data="treeData"
                show-icon
                :default-expand-all="props.expandAll"
                @select="handleSelect"
                :height="theight"
                :multiple="props.multiple"
                :show-line="props.treeLine"
              >
                <template v-if="!props.treeLine" #switcherIcon="{ switcherCls }">
                  <Icon :icon="props.ticons.parent" color="#333" size="14" :class="switcherCls" />
                </template>
                <template v-if="!props.treeLine" #icon="{ key, isLeaf }">
                  <Icon
                    v-if="isLeaf && !isTopNode(key)"
                    :icon="props.ticons.leaf"
                    color="#333"
                    size="14"
                  />
                  <Icon
                    v-if="!isLeaf && !isTopNode(key)"
                    :icon="props.ticons.middle"
                    color="#333"
                    size="14"
                  />
                </template>
              </a-tree>
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
    watch,
    unref,
    reactive,
    withDirectives,
  } from 'vue';
  import { TreeItem } from '../../Tree';
  import { getCustomCompOptions } from '@/utils/cache';
  import Icon from '@/components/Icon/Icon.vue';
  import clickOutside from '/@/directives/clickOutside';

  const showDropdown = ref(false);
  const searchRealText = ref<string>('');
  const search = reactive({ text: '' });
  const treeBox = ref<any>(null);
  const loading = ref(false);
  const treeData = reactive([]);
  const treeMap = ref<any>();
  const selectedValue = ref(null);
  type fieldType = { key: String; title: String };
  type tIconsType = { parent: String; leaf: String };

  const props = defineProps({
    vmode: { type: String, default: 'edit' },
    opkey: { type: String, default: null },
    columns: Array, // 列定义
    data: { type: Array }, // 表格数据
    twidth: { type: String, default: '100%' },
    theight: { type: Number, default: 240 },
    disabled: { type: Boolean, default: false },
    value: { type: String, default: '' }, // 搜索框文本
    className: { type: String },
    expandAll: { type: Boolean, default: false },
    treeLine: { type: [Boolean, Object], default: true && { showLeafIcon: true } },
    callback: { type: Function, default: null },
    multiple: { type: Boolean, default: false },
    ticons: {
      type: Object,
      default: {
        parent: 'ant-design:down-outlined',
        middle: 'mingcute:department-line',
        leaf: 'gridicons:multiple-users',
      } as tIconsType,
    },
    tfields: {
      type: Object,
      default: {
        key: 'id',
        value: 'value',
        title: 'title',
      } as fieldType,
    },
  });

  const newTfields = ref({});
  const tdata = ref([]);

  const emit = defineEmits(['update:value', 'select', 'change']); // 允许双向绑定value

  const searchData = () => {
    try {
      loading.value = true;
      const text = search.text;
      treeData.splice(0, treeData.length);
      const rule = newTfields.value as fieldType;
      const data = unref(tdata.value as unknown[] as TreeItem[]);
      const resultData = JSON.parse(JSON.stringify(data));
      const result = findNodes(resultData, text);
      const tempList = transformData(result, rule) as never[];
      treeData.push(...tempList);
    } catch (error) {
      //
    }
  };

  const toggleDropdown = (event) => {
    try {
      event.stopPropagation(); // 阻止事件冒泡
      showDropdown.value = true;
    } catch (error) {
      //
    }
  };

  // 清空
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

  // 点击组件外的区域，关闭弹框
  const handleClickOutside = (event) => {
    try {
      if (treeBox.value && !treeBox.value.contains(event.target)) {
        clearData();
        showDropdown.value = false;
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

  // 按tfields的设置转换tree的数据
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
            if (rules[key] == 'title') {
              newItem[rules[key]] = item[key];
            } else if (rules[key] == 'id') {
              newItem[rules[key]] = parseInt(Math.random() * 100) + '@' + item[key].slice(0, 5);
            }
          }
          newItem[key] = item[key];
        }
        if (item.children && item.children.length > 0) {
          newItem.children = transformData(item.children, rule);
        }
        return newItem;
      });
    } catch (error) {
      //
    }
  };

  // 递归函数
  const recursiveSearch = (node, result, searchValue) => {
    try {
      const temp = JSON.parse(JSON.stringify(node));
      delete temp.children;
      if (JSON.stringify(temp).includes(searchValue)) {
        result.push(temp);
      }
      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          recursiveSearch(child, result, searchValue);
        }
      }
    } catch (error) {
      //
    }
  };

  // 查找节点
  const findNodes = (data, searchValue) => {
    const result = [];
    try {
      if (searchValue == '' || searchValue == null || typeof searchValue == 'undefined') {
        return data;
      }
      // 开始遍历
      for (const item of data) {
        recursiveSearch(item, result, searchValue);
      }
      return result;
    } catch {
      //
    }
  };

  // 判断是否为顶层节点
  const isTopNode = (key) => {
    try {
      return !!treeMap.value.get(key);
    } catch {
      return false;
    }
  };

  // 将数据节点转换为Map
  const transformMap = (data, rule) => {
    try {
      const treeMap = new Map();
      data.forEach((item) => {
        const key = item[rule['key']];
        treeMap.set(key, item);
      });
      return treeMap;
    } catch {
      //
    }
  };

  // 树节点选中事件
  const handleSelect = (node, event) => {
    try {
      debugger;
      if (Reflect.has(props.tfields, 'value')) {
        if (props.multiple) {
          searchRealText.value = selectedValue.value = event.selectedNodes.map(
            (element) => element[props.tfields.value],
          );
        } else {
          searchRealText.value = selectedValue.value = event.node[props.tfields.value];
        }
        emit('update:value', selectedValue.value);
      } else {
        if (props.multiple) {
          searchRealText.value = selectedValue.value = event.selectedNodes.map(
            (element) => element[props.tfields.title],
          );
        } else {
          searchRealText.value = selectedValue.value = event.node[props.tfields.title];
        }
        emit('update:value', selectedValue.value);
      }
      if (props.callback != null) {
        props.callback(event.node, event);
      }
      if (!props.multiple) {
        showDropdown.value = false;
      }
      try {
        emit('select', event.node, event);
        emit('change', event.node.title, event.node, event);
      } catch {
        //
      }
    } catch (e) {
      //
    }
  };

  // 重新加载组件数据
  const reload = () => {
    try {
      let options = null;
      if (props.opkey != null && props.opkey != '') {
        options = getCustomCompOptions(props.opkey);
        newTfields.value = options?.tfields;
        tdata.value = unref(options?.data);
      } else {
        newTfields.value = props?.tfields;
        tdata.value = props?.data as never[];
      }
      treeData.splice(0, treeData.length);
      const rule = newTfields.value as fieldType;
      const data = unref(tdata.value as unknown[] as TreeItem[]);
      const resultData = JSON.parse(JSON.stringify(data));
      treeMap.value = transformMap(data, rule);
      const tempList = transformData(resultData, rule) as never[];
      treeData.push(...tempList);
    } catch {
      //
    }
  };

  watch(
    () => props.multiple,
    (newValue) => {
      if (newValue) {
        selectedValue.value = [];
      } else {
        selectedValue.value = '';
      }
    },
  );

  watch(
    () => props.data,
    () => {
      reload();
    },
  );

  watch(
    () => props.value,
    (newValue) => {
      try {
        searchRealText.value = props.value;
      } catch {
        //
      }
    },
  );

  defineExpose({ reload });

  onMounted(() => {
    try {
      reload();
      searchRealText.value = props.value;
      withDirectives(treeBox, [[clickOutside, handleClickOutside]]); // 注册 clickOutside 指令

      if (props.multiple) {
        selectedValue.value = [];
      } else {
        selectedValue.value = '';
      }
    } catch {
      //
    }
  });

  onUnmounted(() => {});
</script>

<style scoped>
  .tree-box {
    position: relative;
  }

  .tree-content {
    position: relative;
    z-index: 10000 !important;
    height: 100%;
    margin-top: 5px;
    border: 0 solid #f0f0f0;

    &:deep(.ant-tree) {
      z-index: 10000 !important;
    }

    &:deep(.ant-tree .ant-tree-list .ant-tree-list-holder) {
      z-index: 10000 !important;
    }

    &:deep(.ant-tree .ant-tree-list .ant-tree-list-holder .ant-tree-list-holder-inner) {
      z-index: 10000 !important;
    }
  }

  .search-panel {
    position: relative;
    border-right: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    border-left: 1px solid #f0f0f0;
    background: #fefefe;

    .search-popup-subcontent {
      margin: 0 5px 1px;

      & input.search-text {
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
