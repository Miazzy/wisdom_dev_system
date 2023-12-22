<template>
  <header class="app-header">
    <!-- 公司 Logo -->
    <div class="logo anticon vben-app-logo light vben-layout-header-logo" style="width: 220px">
    </div>
    <div class="module-info">
      <a-menu v-model:selectedKeys="current" mode="horizontal">
        <template v-for="element in topModuleList" :key="element.id">
          <a-menu-item :iconvalue="element.icon" :name="element.name">
            <template #icon>
              <Icon :icon="element.icon" />
            </template>
            {{ element.name }}
          </a-menu-item>
        </template>
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
  import { onMounted, ref } from 'vue';
  import { useUserStore } from '/@/store/modules/user';
  import Icon from '@/components/Icon/Icon.vue';

  const topModuleList = ref([]);
  const userStore = useUserStore();

  onMounted(() => {
    topModuleList.value = userStore.getMenuList;
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
