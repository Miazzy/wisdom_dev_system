<template>
  <div class="dropdown" @mouseover="openDropdown">
    <slot></slot>
    <template v-if="isOpen">
      <div
        class="dropdown-menu"
        @mouseover="keepDropdownOpen"
        @mouseleave="closeDropdownOpen"
        @click="closeDropdownOpen"
      >
        <slot name="overlay"></slot>
      </div>
    </template>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  const isOpen = ref(false);

  const openDropdown = () => {
    isOpen.value = true;
  };

  const keepDropdownOpen = () => {
    isOpen.value = true;
  };

  const closeDropdownOpen = () => {
    setTimeout(() => {
      isOpen.value = false;
    }, 10);
  };
</script>
<style lang="less">
  [data-theme='dark'] .theme1.my-layout .dropdown .dropdown-menu ul.ant-menu {
    background: rgba(10, 36, 74, 0.99);
    color: #c9d1d9;

    > li.ant-menu-item {
      border-border: 1px solid #0e73e733 !important;
    }
  }

  [data-theme='light'] .theme3.my-layout .dropdown .dropdown-menu ul.ant-menu {
    background: #fefefe;
    color: #333;
  }
</style>
<style lang="less" scoped>
  .dropdown {
    display: inline-block;
    position: relative;
    cursor: pointer;

    .dropdown-menu {
      display: none;
      position: absolute;
      z-index: 19999;
      top: 100%;
      left: 0;
      cursor: pointer;
    }

    &:hover .dropdown-menu {
      display: block;
      z-index: 19999;
      cursor: pointer;
    }

    :deep(.ant-menu-item) {
      margin: 0 !important;
      cursor: pointer;

      &:first-child {
        border-bottom: 1px solid #cecece10;
      }
    }
  }
</style>
