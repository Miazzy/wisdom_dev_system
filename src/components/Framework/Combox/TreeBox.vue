<template>
  <div class="tree-box" ref="treeBox">
    <a-dropdown
      v-if="(props.vmode == 'edit' || props.vmode == 'label') && !props.disabled"
      :trigger="['click']"
      :disabled="isDisabled"
      @visible-change="handleVisibleChange"
      v-model:visible="showDropdown"
    >
      <!-- 输入框区域 -->
      <template v-if="props.vmode == 'label'">
        <a-input
          v-model:value="searchLabelText"
          class="tree-text"
          :allow-clear="showDropdown"
          :disabled="isDisabled"
          placeholder="请选择下拉树中数据..."
          @change="handleLabelChange"
          @click="toggleDropdown($event)"
          @clear="handleLabelChange"
        />
      </template>
      <template v-else>
        <a-input
          v-model:value="searchRealText"
          class="tree-text"
          :allow-clear="showDropdown"
          :disabled="isDisabled"
          placeholder="请选择下拉树中数据..."
          @focus="handlePreventEvent"
          @keydown="handlePreventEvent"
          @click="toggleDropdown($event)"
          @clear="handleLabelChange"
        />
      </template>

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
                <input
                  class="search-input"
                  v-model="search.text"
                  @keyup="searchData"
                  placeholder="请输入搜索关键字..."
                />
                <button class="close-button" @click="clearData">清除</button>
                <button class="search-button" @click="searchData">搜索</button>
              </div>
            </div>
            <!-- 基础Tree组件 -->
            <div class="tree-compoment" :style="`max-height: ${theight}px;`">
              <template v-if="props.multiple">
                <a-tree
                  key="multiple-tree"
                  :tree-data="treeData"
                  show-icon
                  checkable
                  checkStrictly
                  :height="theight"
                  :fieldNames="newTfields"
                  :show-line="props.treeLine"
                  :default-expand-all="props.expandAll"
                  :virtual="false"
                  @check="handleCheck"
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
              </template>
              <template v-else>
                <a-tree
                  key="single-tree"
                  :checkedKeys="selectedRealKeys"
                  :selectedKeys="selectedRealKeys"
                  :tree-data="treeData"
                  show-icon
                  selectable
                  :height="theight"
                  :fieldNames="newTfields"
                  :show-line="props.treeLine"
                  :default-expand-all="props.expandAll"
                  :virtual="false"
                  @select="handleSelect"
                  @check="handleCheck"
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
              </template>
            </div>
          </div>
        </a-menu>
      </template>
    </a-dropdown>
    <span v-else-if="props.vmode == 'view'">{{ props.value }}</span>
    <span v-else>
      <template v-if="props.vmode == 'label'">
        <a-input :value="searchLabelText" class="search-text" :disabled="true" />
      </template>
      <template v-else>
        <a-input :value="searchRealText" class="search-text" :disabled="true" />
      </template>
    </span>
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
    computed,
  } from 'vue';
  import { TreeItem } from '../../Tree';
  import { getCustomCompOptions } from '@/utils/cache';
  import Icon from '@/components/Icon/Icon.vue';
  import { MsgManager } from '/@/message/MsgManager';

  const showDropdown = ref(false);
  const searchRealText = ref<string>('');
  const searchLabelText = ref<string>('');
  const search = reactive({ text: '' });
  const treeBox = ref<any>(null);
  const loading = ref(false);
  const treeData = reactive([]);
  const treeMap = ref<any>();
  const treeEntry = ref<any>(new Map());
  const selectedValue = ref<any>(null);
  const selectedKeys = ref<any[]>([]);
  const selectedRealKeys = ref<any[]>([]);
  const checkedKeys = ref<any[]>([]);
  const reloadKey = ref(0);
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
    skeys: { type: Array, default: [] },
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

  // 注入全局的disable状态
  const appDisabled = ref(false);

  // 根据disable状态计算出组件的disable状态
  const isDisabled = computed(() => {
    return props.disabled || appDisabled.value;
  });

  const emit = defineEmits(['update:value', 'update:skeys', 'select', 'change', 'clear']); // 允许双向绑定value

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

      handleLoadKeys();
    } catch (error) {
      //
    }
  };

  const handleVisibleChange = () => {
    reloadKey.value += 1;
    setTimeout(() => {
      searchData();
    }, 300);
  };

  const handleLabelChange = () => {
    if (props.vmode === 'label' && searchLabelText.value == '') {
      emit('update:value', '');
      emit('update:skeys', []);
      emit('clear', '');
    } else if (props.vmode !== 'label' && searchRealText.value == '') {
      emit('update:value', '');
      emit('update:skeys', []);
      emit('clear', '');
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

  // 禁用事件
  const handlePreventEvent = (event) => {
    event.preventDefault();
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
        try {
          treeEntry.value.set(
            newItem[props.tfields.value] || newItem[props.tfields.title],
            newItem[props.tfields.title],
          );
        } catch {
          //
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
      if (Reflect.has(props.tfields, 'value')) {
        if (props.multiple) {
          searchRealText.value = selectedValue.value = event.selectedNodes.map(
            (element) => element[props.tfields.value] || element[props.tfields.title],
          );
          searchLabelText.value = event.selectedNodes.map(
            (element) => element[props.tfields.title],
          );
        } else {
          searchRealText.value = selectedValue.value =
            event.node[props.tfields.value] || event.node[props.tfields.title];
          searchLabelText.value = event.node[props.tfields.title];
        }
        emit('update:value', selectedValue.value);
        emit('update:skeys', selectedRealKeys.value);
      } else {
        if (props.multiple) {
          searchRealText.value = selectedValue.value = event.selectedNodes.map(
            (element) => element[props.tfields.title],
          );
        } else {
          searchRealText.value = selectedValue.value = event.node[props.tfields.title];
        }
        searchLabelText.value = selectedValue.value as unknown as string;
        emit('update:value', selectedValue.value);
        emit('update:skeys', selectedRealKeys.value);
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

      handleLoadKeys();
    } catch {
      //
    }
  };

  const handleLoadKeys = () => {
    selectedRealKeys.value = [];
    if (typeof props.skeys == 'string') {
      selectedRealKeys.value = props.skeys == '' ? [] : (props.skeys as string).split(',');
    } else {
      selectedRealKeys.value = props.skeys;
    }
  };

  const handleCheck = (checkedKeys, event) => {
    checkedKeys.value = checkedKeys.checked;
    searchRealText.value = selectedValue.value = event.checkedNodes.map(
      (element) => element[props.tfields.title],
    );
    emit('update:value', selectedValue.value);
    emit('update:skeys', checkedKeys.checked);
  };

  watch(
    () => props.multiple,
    (newValue) => {
      selectedValue.value = props.multiple ? [] : '';
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
        if (newValue) {
          searchRealText.value = newValue;
        } else {
          searchRealText.value = '';
          searchLabelText.value = '';
          if (props.multiple) {
            emit('update:value', '');
            emit('update:skeys', []);
          }
        }
      } catch {
        //
      }
    },
  );

  watch(
    () => props.skeys,
    () => {
      //
    },
  );

  onMounted(() => {
    try {
      reload();
      searchRealText.value = props.value;
      selectedValue.value = props.multiple ? [] : '';
      searchLabelText.value = treeEntry.value.get(props.value);
      // MsgManager.getInstance().listen('global-disabled', (message) => { appDisabled.value = message; });
    } catch {
      //
    }
  });

  onUnmounted(() => {
    
  });

  defineExpose({ reload });
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
    /* border-right: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    border-left: 1px solid #f0f0f0;
    background: #fefefe; */

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
      background: transparent;
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
      background: transparent;
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
