<template>
  <Dropdown placement="bottom">
    <span :class="[prefixCls, `${prefixCls}--${theme}`]" class="flex">
      <img :class="`${prefixCls}__header`" :src="avatarURL ? avatarURL : defaultAvatar" />
      <span :class="`${prefixCls}__info hidden md:block`">
        <span :class="`${prefixCls}__name  `" class="truncate">
          {{ truncateName(getUserInfo.realName) }}
        </span>
      </span>
    </span>

    <template #overlay>
      <Menu @click="handleMenuClick">
        <MenuItem key="user" :text="truncateName(getUserInfo.realName)" icon="ph:user-thin" />
        <MenuItem
          key="logout"
          :text="t('layout.header.dropdownItemLoginOut')"
          icon="ion:power-outline"
        />
      </Menu>
    </template>
  </Dropdown>
  <LockAction @register="register" />
</template>
<script lang="ts">
  import { Menu } from 'ant-design-vue';
  import Dropdown from '@/components/Framework/Dropdown/Dropdown.vue';
  import type { MenuInfo } from 'ant-design-vue/lib/menu/src/interface';
  import { defineComponent, computed, onMounted, ref } from 'vue';
  import { DOC_URL } from '/@/settings/siteSetting';
  import { useUserStore } from '/@/store/modules/user';
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useModal } from '/@/components/Modal';
  import headerImg from '/@/assets/images/header.jpg';
  import { propTypes } from '/@/utils/propTypes';
  import { openWindow } from '/@/utils';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { addTabPage } from '@/utils/route';
  import { MsgManager } from '/@/message/MsgManager';
  import defaultAvatar from '@/assets/images/default-avatar-s.png';

  type MenuEvent = 'logout' | 'doc' | 'lock' | 'user';

  export default defineComponent({
    name: 'UserDropdown',
    components: {
      Dropdown,
      Menu,
      MenuItem: createAsyncComponent(() => import('./DropMenuItem.vue')),
      MenuDivider: Menu.Divider,
      LockAction: createAsyncComponent(() => import('../lock/LockModal.vue')),
    },
    props: {
      theme: propTypes.oneOf(['dark', 'light']),
    },
    setup() {
      const { prefixCls } = useDesign('header-user-dropdown');
      const { t } = useI18n();
      const { getShowDoc, getUseLockPage } = useHeaderSetting();
      const userStore = useUserStore();
      const avatarURL = ref('');

      const truncateName = (name, maxLength = 10) => {
        if (name != null && typeof name != 'undefined') {
          if (typeof name == 'string' && name.length <= maxLength) {
            return name;
          } else {
            return name.slice(0, maxLength) + '...';
          }
        } else {
          return '';
        }
      };

      const getUserInfo = computed(() => {
        const {
          realName = '',
          username = '',
          avatar,
          desc,
          user,
          roles = [],
        } = userStore.getUserInfo || {};
        avatarURL.value = avatar;
        return { realName: realName || username || user?.id, avatar: avatar || headerImg, desc };
      });

      const [register, { openModal }] = useModal();

      function handleLock() {
        openModal(true);
      }

      function handleContainer() {
        return document.querySelector('div#app .main-layout .app-header .user-info');
      }

      //  login out
      function handleLoginOut() {
        userStore.confirmLoginOut();
      }

      // open doc
      function openDoc() {
        openWindow(DOC_URL);
      }

      // 跳转到用户页面
      function handleUser() {
        addTabPage('/system/rbac/org/userProfile', '个人信息');
      }

      function handleMenuClick(e: MenuInfo) {
        switch (e.key as MenuEvent) {
          case 'logout':
            handleLoginOut();
            break;
          case 'lock':
            handleLock();
            break;
          case 'doc':
            openDoc();
            break;
          case 'user':
            handleUser();
            break;
        }
      }

      onMounted(() => {
        MsgManager.getInstance().listen('avatar-update-message', (message) => {
          avatarURL.value = message.path;
        });
      });

      return {
        prefixCls,
        t,
        truncateName,
        getUserInfo,
        handleMenuClick,
        getShowDoc,
        register,
        handleLock,
        handleContainer,
        avatarURL,
        getUseLockPage,
        defaultAvatar,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-user-dropdown';

  .@{prefix-cls} {
    align-items: center;
    height: @header-height;
    padding: 0 0 0 10px;
    padding-right: 10px;
    overflow: hidden;
    font-size: 12px;
    cursor: pointer;

    img {
      width: 24px;
      height: 24px;
      margin-right: 12px;
    }

    &__header {
      border-radius: 50%;
    }

    &__name {
      font-size: 14px;
    }

    &--dark {
      &:hover {
        background-color: @header-dark-bg-hover-color;
      }
    }

    &--light {
      &:hover {
        background-color: @header-light-bg-hover-color;
      }

      .@{prefix-cls}__name {
        color: @text-color-base;
      }

      .@{prefix-cls}__desc {
        color: @header-light-desc-color;
      }
    }

    &-dropdown-overlay {
      .ant-dropdown-menu-item {
        min-width: 160px;
      }
    }
  }
</style>
