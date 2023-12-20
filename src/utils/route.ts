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
