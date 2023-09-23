import type { AppRouteRecordRaw, AppRouteModule } from '/@/router/types';

import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '/@/router/routes/basic';

import { mainOutRoutes } from './mainOut';
import { PageEnum } from '/@/enums/pageEnum';
import { t } from '/@/hooks/web/useI18n';

// import.meta.glob() 直接引入所有的模块 Vite 独有的功能
const systemModules = import.meta.glob('./modules/**/*.ts', { eager: true }); //  生产监视菜单配置导入
const routeModuleList: AppRouteModule[] = [];

// 系统模块加入到路由集合中
Object.keys(systemModules).forEach((key) => {
  const mod = (systemModules as Recordable)[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  const keys = Object.keys(mod);

  // TODO 此处把后端 传递过来的 MENUS 进行匹配 菜单权限过滤

  if (keys && keys.length > 0) {
    routeModuleList.push(...modList);
  }
});

export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...routeModuleList];

// 根路由
export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
};

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('/@/views/sys/login/Login.vue'),
  meta: {
    title: t('routes.basic.login'),
  },
};

// Basic routing without permission
// 未经许可的基本路由
export const basicRoutes = [
  LoginRoute,
  RootRoute,
  ...mainOutRoutes,
  REDIRECT_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
];
