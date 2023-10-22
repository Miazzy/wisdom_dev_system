import type { AppRouteRecordRaw, AppRouteModule } from '/@/router/types';
import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '/@/router/routes/basic';
import { mainOutRoutes } from './mainOut';
import { PageEnum } from '/@/enums/pageEnum';
import { t } from '/@/hooks/web/useI18n';
import { getAuthCache } from '/@/utils/auth';
import { MENU_LIST_KEY } from '/@/enums/cacheEnum';
import { DefaultMenuInfo } from '/@/utils/constants';
import { getComponentRoutes } from '/@/router/component';

// 路由转换函数 这个函数用于将后端的菜单数据转换为前端的路由配置
function transformMenusToRoutes(menus) {
  const routes: AppRouteModule[] = [];
  menus.forEach((menu) => {
    const route: AppRouteModule = {
      path: queryMenuUrl(menu.url),
      name: menu.name,
      component: getComponentRoutes(menu),
      meta: {
        title: menu.title || menu.name,
        icon: menu.icon,
        hideMenu: menu.openWindowModel == 'hidden' ? true : false,
      },
    };
    if (menu.children && menu.children.length > 0) {
      route.children = transformMenusToRoutes(menu.children);
    }
    routes.push(route);
  });
  return routes;
}

// 获取菜单URL
function queryMenuUrl(url = '') {
  if (url == null || typeof url == 'undefined') {
    return '/';
  } else if (typeof url == 'string') {
    return url.startsWith('/') ? url : `/${url}`;
  }
  return url;
}

// 获取用户菜单函数
function queryUserMenus() {
  const defaultMenuList = [DefaultMenuInfo];
  const list = getAuthCache(MENU_LIST_KEY) as [];
  return list && list.length > 0 ? list : defaultMenuList;
}

// 获取基础路由
function queryBaseHomeRoute() {
  // TODO 调用后端接口获取设置的基础路由
  return PageEnum.BASE_HOME;
}

// 暴露动态路由
export const asyncRoutes = () => {
  const backendMenus = queryUserMenus(); // 假设后端传递的菜单数据存储在一个名为menus的数组中
  const dynamicRoutes = transformMenusToRoutes(backendMenus); // 获取转换后的菜单路由
  return [PAGE_NOT_FOUND_ROUTE, ...dynamicRoutes];
};

// 根路由
export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: queryBaseHomeRoute(),
  meta: {
    title: 'Root',
  },
};

// 登录路由
export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('/@/views/sys/login/Login.vue'),
  meta: {
    title: t('routes.basic.login'),
  },
};

// 暴露基础路由
export const basicRoutes = [
  LoginRoute,
  RootRoute,
  ...mainOutRoutes,
  REDIRECT_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
];
