<template>
  <header class="app-header">
    <!-- 公司 Logo -->
    <div class="logo anticon vben-app-logo light vben-layout-header-logo" style="width: 220px">
    </div>
    <div class="module-info">
      <a-menu v-model:selectedKeys="currentKey" mode="horizontal">
        <a-menu-item
          v-for="element in topModuleList"
          :key="element.id"
          :iconvalue="element.icon"
          :name="element.name"
          :class="`id__${element.id}`"
          @click="handleModuleClick(element)"
        >
          <template #icon>
            <Icon :icon="element.icon" />
          </template>
          {{ element.name }}
        </a-menu-item>
      </a-menu>
    </div>
    <!-- 用户信息 -->
    <div class="user-info">
      <div class="icon-element">
        <Icon :icon="'fe:search'" color="#333" size="22" />
      </div>
      <div class="icon-element">
        <Icon :icon="'mdi:message-processing-outline'" color="#333" size="22" />
      </div>
      <div class="icon-element">
        <Icon :icon="'bx:fullscreen'" color="#333" size="22" />
      </div>
      <div class="icon-element avatar-element">
        <div class="avatar">
          <a-avatar class="avatar-item" :size="24" style="">
            <template #icon>
              <Icon :icon="'ant-design:user-outlined'" color="#fff" size="16" />
            </template>
          </a-avatar>
        </div>
        <span class="text">张哲瑞</span>
      </div>
      <div class="icon-element">
        <Icon :icon="'icon-park-outline:setting-two'" color="#333" size="22" />
      </div>
    </div>
  </header>
</template>
<script lang="ts" setup>
  import { onMounted, ref, watch, nextTick } from 'vue';
  import { useUserStore } from '/@/store/modules/user';
  import Icon from '@/components/Icon/Icon.vue';

  const topModuleList = ref([]);
  const userStore = useUserStore();
  const currentKey = ref('');

  const props = defineProps({
    current: { type: String, default: null },
    modules: { type: Array, default: null },
  });

  const emit = defineEmits(['click', 'change', 'menuclick']);

  watch(
    () => props.modules,
    () => {
      handleLoadModules();
    },
  );

  // 顶部模块
  const handleModuleClick = (element) => {
    emit('click', element, element.children);
  };

  // 加载模块数据
  const handleLoadModules = () => {
    try {
      // 如果传入modules参数为空，则使用默认menulist作为顶部展示modules内容
      if (props.modules == null || props?.modules?.length == 0) {
        topModuleList.value = userStore.getMenuList;
      } else {
        topModuleList.value = props.modules;
      }
      // 打开顶部模块第默认菜单
      if (topModuleList.value && topModuleList.value.length > 0) {
        currentKey.value = [topModuleList.value[0].id];
        nextTick(() => {
          const selector = `.id__${topModuleList.value[0].id}`;
          const defaultModule = document.querySelector(selector);
          defaultModule.click();
        });
      }
    } catch (error) {
      //
    }
  };

  onMounted(() => {
    handleLoadModules();
  });
</script>
<style scoped>
  .app-header {
    display: flex;
    align-items: left;
    justify-content: left;
    padding: 0 0 0 0;
    background-color: transparent;
    color: #fff;
    height: 3.25rem;
    line-height: 3.25rem;
    border-bottom: 1px solid #f0f0f0;
  }

  .logo {
    width: 260px;
    height: 100%;
    margin: 0.22rem 0.05rem 0rem 0rem;
    background: url(../../assets/images/my-logo-light.png) no-repeat 24px 6px/104px auto;
  }

  .module-info {
    width: calc(100% - 220px - 280px);
  }

  .user-info {
    width: 280px;

    display: flex;
    flex-direction: row;
    align-items: right;
    justify-content: right;

    .icon-element {
      padding: 0.15rem 0 0 0;
      width: 40px;
      cursor: pointer;
    }
    .avatar-element {
      padding: 0.15rem 0 0 0;
      width: 100px;
      cursor: pointer;
      .avatar {
        float: left;
        .avatar-item {
          background-color: #87d068;
          margin: -0.5rem 0 0 0;
        }
      }
      .text {
        float: left;
        margin: -0.15rem 0.5rem 0 0.5rem;
        color: #333;
      }
    }
  }
</style>
