/**
 * Application configuration
 */
import type { ProjectConfig } from '/#/config';

import { PROJ_CFG_KEY } from '/@/enums/cacheEnum';
import projectSetting from '/@/settings/projectSetting';

import { updateHeaderBgColor, updateSidebarBgColor } from '/@/logics/theme/updateBackground';
import { updateColorWeak } from '/@/logics/theme/updateColorWeak';
import { updateGrayMode } from '/@/logics/theme/updateGrayMode';
import { updateDarkTheme } from '/@/logics/theme/dark';

import { useAppStore } from '/@/store/modules/app';
import { useLocaleStore } from '/@/store/modules/locale';

import { getCommonStoragePrefix, getStorageShortName } from '/@/utils/env';

import { Persistent } from '/@/utils/cache/persistent';
import { deepMerge } from '/@/utils';
import { ThemeEnum } from '/@/enums/appEnum';
import { sendThemeMessage } from '/@/utils/theme';

// Initial project configuration
export function initAppConfigStore() {
  const localeStore = useLocaleStore();
  const appStore = useAppStore();
  let projCfg: ProjectConfig = Persistent.getLocal(PROJ_CFG_KEY) as ProjectConfig;
  projCfg = deepMerge(projectSetting, projCfg || {});
  const darkMode = appStore.getDarkMode;
  const {
    colorWeak,
    grayMode,

    headerSetting: { bgColor: headerBgColor } = {},
    menuSetting: { bgColor } = {},
  } = projCfg;
  try {
    grayMode && updateGrayMode(grayMode);
    colorWeak && updateColorWeak(colorWeak);
  } catch (error) {
    console.log(error);
  }
  appStore.setProjectConfig(projCfg);

  // init dark mode
  updateDarkTheme(darkMode);
  if (darkMode === ThemeEnum.DARK) {
    updateHeaderBgColor();
    updateSidebarBgColor();
  } else {
    headerBgColor && updateHeaderBgColor(headerBgColor);
    bgColor && updateSidebarBgColor(bgColor);
  }
  // init store
  localeStore.initLocale();
  let themeName = localStorage.getItem('THEME') || '';
  if (!themeName) {
    themeName = darkMode === ThemeEnum.DARK ? 'theme1' : 'theme3';
    localStorage.setItem('THEME', themeName);
  }
  if (darkMode === ThemeEnum.DARK && themeName != 'theme1') {
    themeName = darkMode === ThemeEnum.DARK ? 'theme1' : 'theme3';
    localStorage.setItem('THEME', themeName);
  }
  sendThemeMessage('class', `${themeName} my-layout`);
  setTimeout(() => {
    clearObsoleteStorage();
  }, 16);
}

/**
 * As the version continues to iterate, there will be more and more cache keys stored in localStorage.
 * This method is used to delete useless keys
 */
export function clearObsoleteStorage() {
  const commonPrefix = getCommonStoragePrefix();
  const shortPrefix = getStorageShortName();

  [localStorage, sessionStorage].forEach((item: Storage) => {
    Object.keys(item).forEach((key) => {
      if (key && key.startsWith(commonPrefix) && !key.startsWith(shortPrefix)) {
        item.removeItem(key);
      }
    });
  });
}
