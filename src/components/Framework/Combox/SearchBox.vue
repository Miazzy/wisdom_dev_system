<template>
  <div class="search-box" ref="searchBox">
    <!-- 输入框区域 -->
    <a-input
      v-model="searchRealText"
      class="search-text"
      @click="toggleDropdown($event)"
      placeholder=""
    />
    <!-- 下拉表格弹框区域 -->
    <div v-show="showDropdown" class="search-content" :style="`width: ${twidth}`">
      <!-- 输入框、搜索按钮和关闭按钮区域 -->
      <div class="search-panel">
        <div class="search-popup-subcontent">
          <input class="search-input" v-model="searchTableText" placeholder="" />
          <button class="close-button" @click="clearData">清除</button>
          <button class="search-button" @click="searchData">搜索</button>
        </div>
      </div>
      <a-table :columns="columns" :data-source="data" size="small" :pagination="false" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onUnmounted, defineProps, defineEmits, computed } from 'vue';

  const showDropdown = ref(false);
  const searchRealText = ref('');
  const searchTableText = ref('');
  const searchBox = ref<any>(null);

  const props = defineProps({
    columns: Array, // 列定义
    data: Array, // 表格数据
    twidth: { type: String, default: '100%' },
    searchText: String, // 搜索框文本
  });

  const emit = defineEmits(['update:searchText']); // 允许双向绑定searchText

  // 使用计算属性将searchText和searchRealText关联
  const computedSearchText = computed({
    get: () => searchRealText.value,
    set: (value) => {
      searchRealText.value = value;
      emit('update:searchText', value);
    },
  });

  const searchData = () => {
    emit('update:searchText', searchTableText.value); // 向父组件传递搜索文本的更新
  };

  const toggleDropdown = (event) => {
    event.stopPropagation(); // 阻止事件冒泡
    showDropdown.value = true;
  };

  const clearData = () => {
    searchTableText.value = '';
  };

  const handleClickOutside = (event) => {
    if (searchBox.value && !searchBox.value.contains(event.target)) {
      showDropdown.value = false;
    }
  };

  onMounted(() => {
    window.addEventListener('click', handleClickOutside);
  });

  onUnmounted(() => {
    window.removeEventListener('click', handleClickOutside);
  });
</script>

<style scoped>
  .search-box {
    position: relative;
  }

  .search-content {
    margin-top: 5px;

    &:deep(.ant-table-wrapper .ant-spin-nested-loading .ant-spin-container) {
      z-index: 1000 !important;
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
      top: 5px; /* 控制按钮固定在顶部 */
      right: 0; /* 控制按钮固定在右侧 */
    }
    .close-button {
      color: #cecece;
      background: #fefefe;
      position: absolute;
      top: 5px; /* 控制按钮固定在顶部 */
      right: 40px; /* 控制按钮与搜索按钮的距离 */
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
