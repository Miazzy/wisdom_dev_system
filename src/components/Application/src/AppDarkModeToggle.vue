<template>
  <div :class="getClass" @click="toggleDarkMode">
    <div :class="`${prefixCls}-inner`"></div>
    <SvgIcon size="14" name="sun" />
    <SvgIcon size="14" name="moon" />
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted, nextTick, defineEmits } from 'vue';
  import { SvgIcon } from '/@/components/Icon';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { updateHeaderBgColor, updateSidebarBgColor } from '/@/logics/theme/updateBackground';
  import { updateDarkTheme } from '/@/logics/theme/dark';
  import { ThemeEnum } from '/@/enums/appEnum';
  import { sendDarkModeMsg, sendThemeMessage } from '@/utils/theme';
  import { useAppStore } from '/@/store/modules/app';

  const { prefixCls } = useDesign('dark-switch');
  const appStore = useAppStore();
  const { setDarkMode } = useRootSetting();
  const getClass = ref('');
  const themeMode = ref(appStore.getDarkMode);

  const emit = defineEmits(['change']); // 定义事件

  const clacThemeClassName = (darkMode) => {
    return darkMode === ThemeEnum.DARK ? `${prefixCls} ${prefixCls}--dark` : prefixCls;
  };

  function toggleDarkMode() {
    const darkMode = themeMode.value === ThemeEnum.DARK ? ThemeEnum.LIGHT : ThemeEnum.DARK;
    getClass.value = clacThemeClassName(darkMode);
    themeMode.value = darkMode;
    emit('change', darkMode, true);
    const callback = async () => {
      setDarkMode(darkMode);
      updateDarkTheme(darkMode);
      updateHeaderBgColor();
      updateSidebarBgColor();
      sendDarkModeMsg(darkMode);
      let themeName = darkMode === ThemeEnum.DARK ? 'theme1' : 'theme3';
      localStorage.setItem('THEME', themeName);
      sendThemeMessage('class', `${themeName} my-layout`);

      setTimeout(() => {
        emit('change', darkMode, false);
      }, 300);
    };

    nextTick(() => {
      setTimeout(() => {
        callback();
      }, 0);
    });
  }

  onMounted(() => {
    getClass.value = clacThemeClassName(themeMode.value);
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-dark-switch';

  html[data-theme='dark'] {
    .@{prefix-cls} {
      border: 1px solid rgb(196 188 188);
    }
  }

  .@{prefix-cls} {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: space-between;
    width: 50px;
    height: 26px;
    margin-left: auto;
    padding: 0 6px;
    border-radius: 30px;
    background-color: #151515;
    cursor: pointer;

    &-inner {
      position: absolute;
      z-index: 1;
      width: 18px;
      height: 18px;
      transition:
        transform 0.5s,
        background-color 0.5s;
      border-radius: 50%;
      background-color: #fff;
      will-change: transform;
      cursor: pointer;
    }

    &--dark {
      .@{prefix-cls}-inner {
        transform: translateX(calc(100% + 2px));
      }
    }
  }
</style>
