import { MsgManager } from '/@/message/MsgManager';

const THEME_MESSAGE = 'theme-message';

// 刷新指定TabPage页面函数（iframe模式）
export const reloadTheme = (attr, className) => {
  try {
    const dom = document.getElementsByTagName('body')[0];
    dom.setAttribute(attr, className);
  } catch {
    //
  }
};

// 推送刷新主题信息
export const sendThemeMessage = (attr, className) => {
  MsgManager.getInstance().sendMsg(THEME_MESSAGE, { attr, className });
};

// 监听刷新主题信息
export const listenThemeMessage = () => {
  MsgManager.getInstance().listen(THEME_MESSAGE, (message) => {
    const { attr, className } = message;
    reloadTheme(attr, className);
  });
};
