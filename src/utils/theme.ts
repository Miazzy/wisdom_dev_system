import { MsgManager } from '/@/message/MsgManager';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import { ThemeEnum } from '/@/enums/appEnum';
import { updateDarkTheme } from '/@/logics/theme/dark';
import { useUserStoreWithOut } from '/@/store/modules/user';

const THEME_MESSAGE = 'theme-message';
const THEME_MODE = 'theme-mode';
const { setDarkMode } = useRootSetting();
const userStore = useUserStoreWithOut();

// 刷新指定TabPage页面函数（iframe模式）
export const reloadTheme = (attr, className) => {
  try {
    const dom = document.getElementsByTagName('body')[0];
    dom.setAttribute(attr, className);
  } catch {
    //
  }
};

// 推送主题模式消息
export const sendDarkModeMsg = (mode: ThemeEnum) => {
  MsgManager.getInstance().sendMsg(THEME_MODE, { mode });
};

// 推送刷新主题信息
export const sendThemeMessage = (attr, className) => {
  reloadTheme(attr, className);
  MsgManager.getInstance().sendMsg(THEME_MESSAGE, { attr, className });
};

// 监听刷新主题信息
export const listenThemeMessage = () => {
  MsgManager.getInstance().listen(THEME_MESSAGE, (message) => {
    const { attr, className } = message;
    reloadTheme(attr, className);
    userStore.setTheme(className);
  });
  MsgManager.getInstance().listen(THEME_MODE, (message) => {
    const { mode } = message;
    setDarkMode(mode as ThemeEnum);
    updateDarkTheme(mode as ThemeEnum);
  });
};
