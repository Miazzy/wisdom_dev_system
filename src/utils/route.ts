import { useMultipleTabStore } from '/@/store/modules/multipleTab';
import { useRouter } from 'vue-router';

// 解析路由路径参数
export const parseRoutePath = (path: string): Record<string, string> => {
  const segments = path.split('/');
  const lastSegment = segments[segments.length - 1];
  const replacedEquals = lastSegment.replace(/__/g, '='); // 替换 __ 为 =
  const replacedAmpersand = replacedEquals.replace(/!!/g, '&'); // 替换 !! 为 &
  const replacedUnderscore = replacedAmpersand.replace(/_aa_/g, '&'); // 替换 _aa_ 为 &
  const queryParams: Record<string, string> = {}; // 解析为对象
  const pairs = replacedUnderscore.split('&');
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    queryParams[key] = value;
  }
  return queryParams;
};

// 跳转路由不带缓存
export const pushAndRefresh = (path: string) => {
  const router = useRouter();
  const useTab = useMultipleTabStore();
  useTab.setRefreshList(path); // 设置刷新时效300ms, 在此1000ms内，打开此path路由对应页面，都重新渲染，不加载缓存
  router.push(path);
};

// 新增TabPage页面函数（iframe模式）
export const addTabPage = (path: string, name: string) => {
  const message = { type: 'addTabPage', data: { path, name } };
  sendMessage(message);
};

// 新增Tab页签并关闭原页面（iframe模式）
export const addTabAndClose = (
  path: string,
  name: string,
  closePath: string,
  refresh: boolean = true,
) => {
  const message = { type: 'addTabAndClose', data: { path, name, closePath, refresh } };
  sendMessage(message);
};

// 关闭TabPage页面函数（iframe模式）
export const closeTabPage = (path: string) => {
  const message = { type: 'closeTabPage', data: { path } };
  sendMessage(message);
};

// 刷新TabPage页面函数（iframe模式）
export const refreshTabPage = () => {
  const message = { type: 'refreshTabPage', data: {} };
  sendMessage(message);
};

// 推送消息至框架
const sendMessage = (message) => {
  let context: any = window;
  if (window?.top) {
    context = window?.top;
  } else if (window?.parent) {
    context = window?.parent;
  }
  context.postMessage(message, '*');
};
