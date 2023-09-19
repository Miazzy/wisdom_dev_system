<template>
  <div class="tree-box" ref="treeBox">
    <!-- 输入框区域 -->
    <a-input v-model="realText" class="tree-text" @click="toggleDropdown($event)" placeholder="" />
    <!-- 下拉表格弹框区域 -->
    <div v-show="showDropdown" class="tree-content" :style="`width: ${twidth}; z-index:10000;`">
      <!-- 输入框、搜索按钮和关闭按钮区域 -->
      <div class="search-panel">
        <div class="search-popup-subcontent">
          <input class="search-input" v-model="searchTreeText" placeholder="" />
          <button class="close-button" @click="clearData">清除</button>
          <button class="search-button" @click="searchData">搜索</button>
        </div>
      </div>
      <!-- 基础Tree组件 -->
      <a-tree :tree-data="treeData" show-icon default-expand-all>
        <template #switcherIcon="{ switcherCls }">
          <Icon icon="ant-design:down-outlined" color="#333" size="14" :class="switcherCls" />
        </template>
        <template #icon="{ key, isLeaf }">
          <Icon v-if="isLeaf" icon="gridicons:multiple-users" color="#333" size="14" />
        </template>
      </a-tree>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onUnmounted, defineProps, defineEmits, watch, unref } from 'vue';
  import { TreeItem } from '../../Tree';
  import Icon from '@/components/Icon/Icon.vue';

  const showDropdown = ref(false);
  const realText = ref('');
  const searchTreeText = ref('');
  const treeBox = ref<any>(null);
  const loading = ref(false);
  const treeData = ref([]);
  type fieldType = { key: String; title: String };

  const props = defineProps({
    columns: Array, // 列定义
    data: { type: Array }, // 表格数据
    twidth: { type: String, default: '100%' },
    searchText: String, // 搜索框文本
    className: { type: String },
    fieldNames: {
      type: Object,
      default: { key: 'id', title: 'title' },
    },
  });

  const emit = defineEmits(['update:searchText', 'searchData']); // 允许双向绑定searchText

  const searchData = () => {
    loading.value = true;
    treeData.value = [];
    emit('searchData', searchTreeText.value); // 向父组件传递搜索文本的更新
    setTimeout(() => {
      treeData.value = props.data as never[];
      loading.value = false;
    }, 2000);
  };

  const toggleDropdown = (event) => {
    event.stopPropagation(); // 阻止事件冒泡
    showDropdown.value = true;
  };

  const clearData = () => {
    searchTreeText.value = '';
  };

  const handleClickOutside = (event) => {
    if (treeBox.value && !treeBox.value.contains(event.target)) {
      showDropdown.value = false;
    }
  };

  const reverseRule = (rule) => {
    const reversedRule = {};
    for (const key in rule) {
      reversedRule[rule[key]] = key;
    }
    return reversedRule;
  };

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
      if (item.children && item.children.length > 0) {
        newItem.children = transformData(item.children, rule);
      }
      return newItem;
    });
  };

  watch(
    () => props.data,
    (newValue) => {
      const rule = props?.fieldNames as fieldType;
      const data = unref(props.data as unknown[] as TreeItem[]);
      treeData.value = transformData(data, rule);
    },
  );

  onMounted(() => {
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
    margin-top: 5px;
    position: relative;

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
    background: #fefefe;
    border-bottom: 0px solid #cecece;
    .search-popup-subcontent {
      margin: 0px 5px 1px 5px;
      & input.search-text {
        width: 100%;
        padding: 5px;
      }
    }
    .search-button {
      color: #cecece;
      background: #fefefe;
      position: absolute;
      top: 5px;
      right: 0;
    }
    .close-button {
      color: #cecece;
      background: #fefefe;
      position: absolute;
      top: 5px;
      right: 40px;
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
