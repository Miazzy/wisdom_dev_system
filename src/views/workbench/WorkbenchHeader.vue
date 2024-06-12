<template>
  <a-card :bordered="false">
    <div class="workbench-header">
      <div class="user-icon-box">
        <img class="user-icon-img" :src="avatarSrc" />
      </div>
      <div class="info-box">
        <p class="black-text">上午好，{{ getLoginName() }}，开始您一天的工作吧！</p>
        <p class="grey-text">今日晴，20℃ - 32℃！</p>
      </div>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { useUserStore } from '/@/store/modules/user';
  import { MsgManager } from '/@/message/MsgManager';
  import defaultAvatar from '@/assets/images/default-avatar-s.png';
  import { CacheManager } from '/@/message/CacheManager';

  const userStore = useUserStore();
  const avatarURL = ref(defaultAvatar);

  const getUserInfo = computed(() => {
    const { username = '', avatar } = userStore.getUserInfo || {};
    setAvatarURL(avatar);
    return { username, avatar };
  });

  const avatarSrc = computed(() => {
    if (avatarURL.value === defaultAvatar) {
      const { avatar } = userStore.getUserInfo || {};
      setAvatarURL(avatar);
    }
    if (!avatarURL.value) {
      return defaultAvatar;
    }
    return avatarURL.value;
  });

  const setAvatarURL = (avatar) => {
    if (avatar) {
      avatarURL.value = avatar;
    } else {
      avatarURL.value = CacheManager.getInstance().getCache<string>('AVATAR');
    }
  };

  const getLoginName = () => {
    return getUserInfo.value.username;
  };

  onMounted(() => {
    MsgManager.getInstance().listen('avatar-update-message', (message) => {
      if (message?.path) {
        avatarURL.value = message?.path || avatarURL.value;
      }
    });
  });
</script>
<style lang="less" scoped>
  .workbench-header {
    display: flex;
    align-items: center;
    height: 72px;

    .user-icon-box {
      width: 46px;
      height: 46px;
      margin-right: 16px;
      overflow: hidden;
      border-radius: 50%;

      & > .user-icon-img {
        width: 102%;
      }
    }

    .info-box {
      line-height: 1;

      .black-text {
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 500;
      }

      .grey-text {
        margin-bottom: 0;
        font-size: 12px;
      }
    }
  }
</style>
