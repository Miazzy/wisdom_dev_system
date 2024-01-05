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
        <AppSearch :class="`${prefixCls}-action__item `" class="search-icon" />
      </div>
      <div class="icon-element">
        <Notify :class="`${prefixCls}-action__item notify-item notify-icon`" />
      </div>
      <div class="icon-element">
        <Icon
          v-if="!isFullscreen"
          :icon="'ant-design:fullscreen-outlined'"
          size="20"
          class="fullscreen-icon"
          @click="toggle"
        />
        <Icon
          v-if="isFullscreen"
          :icon="'ant-design:fullscreen-exit-outlined'"
          size="20"
          class="fullscreen-icon"
          @click="toggle"
        />
      </div>
      <div class="icon-element avatar-element">
        <UserDropDown :theme="getHeaderTheme" />
      </div>
      <div class="icon-element">
        <SettingDrawer :class="`${prefixCls}-action__item drawer-icon`" />
      </div>
    </div>
  </header>
</template>
<script lang="ts" setup>
  import { onMounted, ref, watch, nextTick } from 'vue';
  import { useUserStore } from '/@/store/modules/user';
  import Icon from '@/components/Icon/Icon.vue';
  import { AppSearch } from '/@/components/Application';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { UserDropDown, Notify } from '@/layouts/default/header/components';
  import { useFullscreen } from '@vueuse/core';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import * as TaskApi from '/@/api/bpm/task';
  import { TaskExecutor } from '/@/executor/taskExecutor';
  import { TimeInterval } from '@/constant/constant';
  import { PageVisibleHandler } from '/@/utils/handler/pageVisibleHandler';
  import { checkToken, getOrganTree } from '/@/api/sys/user';

  const SettingDrawer = createAsyncComponent(() => import('/@/layouts/default/setting/index.vue'), {
    loading: true,
  });
  const topModuleList = ref([]);
  const userStore = useUserStore();
  const currentKey = ref('');
  const todoTaskList = ref();
  const executor = ref<TaskExecutor>();
  const menuNameMap = new Map();

  const props = defineProps({
    current: { type: String, default: null },
    modules: { type: Array, default: null },
  });

  const { getHeaderTheme } = useHeaderSetting();

  const { toggle, isFullscreen } = useFullscreen();
  // 重新检查全屏状态
  isFullscreen.value = !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );

  const { prefixCls } = useDesign('layout-header');
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
          // 生成菜单名称
          generateNameMap(topModuleList.value);
          userStore.setMenuNameMap(menuNameMap);
        });
      }
    } catch (error) {
      //
    }
  };

  // 获取节点名称
  const generateNameMap = (tree = []) => {
    try {
      for (const node of tree) {
        const path = node?.url.includes('?') ? node?.url.split('?')[0] : node?.url;
        menuNameMap.set(path, node?.name);
        if (node?.children && node?.children.length > 0) {
          generateNameMap(node?.children);
        }
      }
    } catch (error) {
      //
    }
  };

  const handleTodoTask = () => {
    todoTaskList.value = TaskApi.getTodoTaskPage({});
  };

  onMounted(() => {
    handleLoadModules();
    executor.value = TaskExecutor.getInstance(TimeInterval.ONE_SECOND);
    executor.value.pushListTask('execTodoTaskList', handleTodoTask, TimeInterval.ONE_HOUR);
    executor.value.start();
    PageVisibleHandler.getInstance().start();
    PageVisibleHandler.getInstance().setCallback(async () => {
      const resp = await checkToken('');
      console.info('browser visibility: ', resp.user_id);
    });
    nextTick(async () => {
      const orgKindIds = 'ogn,dpt,pos,psm';
      const showPosition = true;
      const resp = await getOrganTree({ orgKindIds, showPosition, status: 1 });
      userStore.setOgranTree(resp);
    });
  });
</script>
<style lang="less">
  // 深色主题
  [data-theme='dark'] .theme1 {
    .module-info {
      .ant-menu {
        background: transparent;
      }

      .ant-menu-horizontal {
        border-bottom-color: transparent;
      }
    }

    .user-info {
      .ant-badge {
        color: #fff;
      }
    }
  }

  .theme1 {
    .app-header {
      border-bottom: 1px solid rgb(255 255 255 / 16%);
      background-color: rgb(10 36 74 / 70%);
    }

    .logo {
      background: url('../../assets/images/my-logo-dark.png') no-repeat 24px 6px/104px auto;
    }

    .user-info {
      .icon-element {
        .search-icon,
        .notify-icon,
        .fullscreen-icon,
        .drawer-icon {
          color: #fff;
        }
      }
    }

    .avatar-element {
      .text {
        color: #fff;
      }
    }
  }

  // 浅色主题
  .theme3 {
    .app-header {
      border-bottom: 1px solid #f0f0f0;
      background-color: #fff;
    }

    .logo {
      background: url('../../assets/images/my-logo-light.png') no-repeat 24px 6px/104px auto;
    }

    .user-info {
      .icon-element {
        .search-icon,
        .notify-icon,
        .fullscreen-icon,
        .drawer-icon {
          color: #333;
        }
      }
    }

    .avatar-element {
      .text {
        color: #333;
      }
    }
  }
</style>
<style lang="less" scoped>
  .app-header {
    display: flex;
    align-items: left;
    justify-content: left;
    height: 3.25rem;
    padding: 0;
    line-height: 3.25rem;
  }

  .logo {
    width: 260px;
    height: 100%;
    margin: 0.22rem 0.05rem 0 0;
  }

  .module-info {
    width: calc(100% - 220px - 280px);
  }

  .user-info {
    display: flex;
    flex-direction: row;
    align-items: right;
    justify-content: right;
    width: 280px;

    .icon-element {
      width: 40px;
      padding: 0.15rem 0 0;
      cursor: pointer;

      .search-icon {
        z-index: 1000;
        margin-top: -0.45rem;
        transform: scale(1.2);
      }

      .notify-icon {
        z-index: 1000;
        width: 1rem;
        height: 1rem;
        margin-top: 0.85rem;
      }

      .fullscreen-icon {
        z-index: 1000;
      }

      .drawer-icon {
        z-index: 1000;
        width: 1.2rem;
        height: 1.2rem;
        margin-top: -0.15rem;
        transform: scale(1.1);
        transform-origin: 0% 0%;
      }

      :deep(.vben-header-user-dropdown) {
        padding: 0 !important;
      }
    }

    .avatar-element {
      width: 100px;
      padding: 0.15rem 0 0;
      cursor: pointer;

      .avatar {
        float: left;

        .avatar-item {
          margin: -0.5rem 0 0;
          background-color: #87d068;
        }
      }

      .text {
        margin: -0.15rem 0.5rem 0;
        float: left;
      }
    }
  }
</style>
