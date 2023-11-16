<template>
  <div class="tree-box" ref="treeBox">
    <a-dropdown v-if="props.vmode == 'edit'" :trigger="['click']" @click="handleButtonClick">
      <!-- 输入框区域 -->
      <a-input
        v-model:value="realText"
        class="tree-text"
        @click="toggleDropdown($event)"
        placeholder=""
      />
      <template #overlay>
        <a-menu>
          <!-- 下拉表格弹框区域 -->
          <div
            v-show="showDropdown"
            class="tree-content"
            :style="`width: ${twidth}; display: ${showDropdown ? 'block' : 'none'}; z-index:10000;`"
          >
            <!-- 输入框、搜索按钮和关闭按钮区域 -->
            <div class="search-panel">
              <div class="search-popup-subcontent">
                <input class="search-input" v-model="searchTreeText" placeholder="" />
                <button class="close-button" @click="clearData">清除</button>
                <button class="search-button" @click="searchData">搜索</button>
              </div>
            </div>
            <!-- 基础Tree组件 -->
            <div class="tree-compoment" :style="`max-height: ${theight}px; overflow-y: hidden;`">
              <a-tree
                :tree-data="treeData"
                show-icon
                default-expand-all
                @select="handleSelect"
                :height="theight"
              >
                <template #switcherIcon="{ switcherCls }">
                  <Icon :icon="props.ticons.parent" color="#333" size="14" :class="switcherCls" />
                </template>
                <template #icon="{ key, isLeaf }">
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
    <span v-if="props.vmode == 'view'">{{ props.value }}</span>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onUnmounted, defineProps, defineEmits, watch, unref } from 'vue';
  import { TreeItem } from '../../Tree';
  import { getCustomCompOptions } from '@/utils/cache';
  import Icon from '@/components/Icon/Icon.vue';

  const showDropdown = ref(false);
  const realText = ref<string>('');
  const searchTreeText = ref('');
  const treeBox = ref<any>(null);
  const loading = ref(false);
  const treeData = ref([]);
  const treeMap = ref<any>();
  type fieldType = { key: String; title: String };
  type tIconsType = { parent: String; leaf: String };

  const props = defineProps({
    vmode: { type: String, default: 'edit' },
    opkey: { type: String, default: null },
    columns: Array, // 列定义
    data: { type: Array }, // 表格数据
    twidth: { type: String, default: '100%' },
    theight: { type: Number, default: 240 },
    value: String, // 搜索框文本
    className: { type: String },
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
        title: 'title',
      } as fieldType,
    },
  });

  const newTfields = ref({});
  const tdata = ref([]);

  const emit = defineEmits(['update:value', 'searchData', 'clearData', 'select']); // 允许双向绑定value

  const searchData = () => {
    loading.value = true;
    const text = searchTreeText.value;
    emit('searchData', searchTreeText.value); // 向父组件传递搜索文本的更新
    setTimeout(() => {
      const rule = newTfields.value as fieldType;
      const data = unref(tdata.value as unknown[] as TreeItem[]);
      const resultData = JSON.parse(JSON.stringify(data));
      const result = findNodes(resultData, text);
      treeData.value = transformData(result, rule);
    }, 100);
  };

  const toggleDropdown = (event) => {
    event.stopPropagation(); // 阻止事件冒泡
    showDropdown.value = true;
  };

  // 清空
  const clearData = () => {
    searchTreeText.value = '';
    loading.value = true;
    emit('clearData', searchTreeText.value); // 向父组件传递搜索文本的更新
    setTimeout(() => {
      const rule = newTfields.value as fieldType;
      const data = unref(tdata.value as unknown[] as TreeItem[]);
      const resultData = JSON.parse(JSON.stringify(data));
      treeData.value = transformData(resultData, rule);
    }, 100);
  };

  // 点击组件外的区域，关闭弹框
  const handleClickOutside = (event) => {
    if (treeBox.value && !treeBox.value.contains(event.target)) {
      showDropdown.value = false;
    }
  };

  const handleButtonClick = (e: Event) => {
    showDropdown.value = true;
  };

  // 按tfields生成转换规则
  const reverseRule = (rule) => {
    const reversedRule = {};
    for (const key in rule) {
      reversedRule[rule[key]] = key;
    }
    return reversedRule;
  };

  // 按tfields的设置转换tree的数据
  const transformData = (data, rule) => {
    const rules = reverseRule(rule);
    return data.map((item) => {
      const newItem = {};
      for (const key in item) {
        if (key in rules) {
          if (rules[key] == 'title') {
            newItem[rules[key]] = item[key];
            newItem[key] = item[key];
          } else if (rules[key] == 'id') {
            newItem[rules[key]] = parseInt(Math.random() * 100) + '@' + item[key].slice(0, 5);
            newItem[key] = item[key];
          }
        } else {
          newItem[key] = item[key];
        }
      }
      if (item.children && item.children.length > 0) {
        newItem.children = transformData(item.children, rule);
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
      delete temp.children;
      if (JSON.stringify(temp).includes(searchValue)) {
        result.push(temp);
      }
      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          recursiveSearch(child);
        }
      }
    }
    // 开始遍历
    for (const item of data) {
      recursiveSearch(item);
    }
    return result;
  };

  // 判断是否为顶层节点
  const isTopNode = (key) => {
    return !!treeMap.value.get(key);
  };

  // 将数据节点转换为Map
  const transformMap = (data, rule) => {
    const treeMap = new Map();
    data.forEach((item) => {
      const key = item[rule['key']];
      treeMap.set(key, item);
    });
    return treeMap;
  };

  // 树节点选中事件
  const handleSelect = (node, event) => {
    realText.value = event.node.title;
    emit('update:value', event.node.title);
    emit('select', event.node, event);
    showDropdown.value = false;
  };

  // 重新加载组件数据
  const reload = () => {
    const rule = newTfields.value as fieldType;
    const data = unref(tdata.value as unknown[] as TreeItem[]);
    const resultData = JSON.parse(JSON.stringify(data));
    treeMap.value = transformMap(data, rule);
    treeData.value = transformData(resultData, rule);
  };

  watch(
    () => props.data,
    () => {
      reload();
    },
  );

  watch(
    () => props.value,
    (newValue) => {
      realText.value = props.value;
    },
  );

  defineExpose({ reload });

  onMounted(() => {
    realText.value = props.value;
    if (props.opkey != null && props.opkey != '') {
      const options = getCustomCompOptions(props.opkey);
      newTfields.value = options?.newTfields;
      tdata.value = options?.data;
    } else {
      newTfields.value = props?.tfields;
      tdata.value = props?.data as never[];
    }
    reload();
    window.addEventListener('click', handleClickOutside);
  });

  onUnmounted(() => {
    window.removeEventListener('click', handleClickOutside);
  });
</script>

<style scoped>
  .tree-box {
    position: relative;
  }

  .tree-content {
    position: relative;
    margin-top: 5px;
    height: 100%;
    border: 1px solid #f0f0f0;
    z-index: 10000 !important;

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
    border-bottom: 0 solid #cecece;
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
