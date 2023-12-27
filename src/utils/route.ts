import { useMultipleTabStore } from '/@/store/modules/multipleTab';
import { useRouter } from 'vue-router';
import { buildUUID } from '/@/utils/uuid';

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

// 将路径转为带参数url
export const pathToUrl = (path, params) => {
  const hasQuery = path.includes('?');
  const paramString = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
    .join('&');
  const result = hasQuery ? `${path}&${paramString}` : `${path}?${paramString}`;
  return result;
};

// 获取当前页面信息
export const getCurrentPageInfo = () => {
  return { id: '', path: '', params: '' };
};

// 新增TabPage页面函数（iframe模式）
export const addTabPage = (path: string, name: string, params: Object | null = null) => {
  const id = buildUUID();
  path = params == null || typeof params == 'undefined' ? path : pathToUrl(path, params);
  const message = { type: 'addTabPage', data: { id, path, name, params } };
  sendMessage(message);
  return id;
};

// 新增Tab页签并关闭原页面（iframe模式）
export const addTabAndClose = (
  path: string,
  name: string,
  params: Object | null = null,
  closeID: string = '',
  refresh: boolean = true,
) => {
  const id = buildUUID();
  path = params == null || typeof params == 'undefined' ? path : pathToUrl(path, params);
  const message = { type: 'addTabAndClose', data: { id, path, name, params, closeID, refresh } };
  sendMessage(message);
  return id;
};

// 关闭TabPage页面函数（iframe模式）
export const closeTabPage = (path: string) => {
  const message = { type: 'closeTabPage', data: { path } };
  sendMessage(message);
};

// 关闭当前Tab页签函数（iframe模式）
export const closeCurrentTab = () => {
  const message = { type: 'closeCurrentTab', data: {} };
  sendMessage(message);
};

// 关闭当前Tab页签函数（iframe模式）
export const closeTabById = (id) => {
  const message = { type: 'closeTabById', data: { id } };
  sendMessage(message);
};

// 刷新TabPage页面函数（iframe模式）
export const reloadCurrrentTab = () => {
  const message = { type: 'refreshTabPage', data: {} };
  sendMessage(message);
};

// 刷新指定TabPage页面函数（iframe模式）
export const reloadTabById = (id) => {
  const message = { type: 'reloadTabById', data: { id } };
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
