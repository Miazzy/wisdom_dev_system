import type { AppRouteRecordRaw, AppRouteModule } from '/@/router/types';

import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '/@/router/routes/basic';
import { mainOutRoutes } from './mainOut';
import { PageEnum } from '/@/enums/pageEnum';
import { t } from '/@/hooks/web/useI18n';
import { getAuthCache } from '/@/utils/auth';
import { MENU_LIST_KEY } from '/@/enums/cacheEnum';

// 这个函数用于将后端的菜单数据转换为前端的路由配置
function transformMenusToRoutes(menus) {
  const routes = [];
  menus.forEach((menu) => {
    const route: AppRouteModule = {
      path: menu.url,
      name: menu.name,
      component: () => {
        const response =
          menu.component == 'LAYOUT' || menu.parentId == '1'
            ? import('/@/layouts/default/index.vue')
            : import(menu.component);
        return response;
      },
      meta: {
        title: menu.title || menu.name,
        icon: menu.icon,
      },
    };
    if (menu.children && menu.children.length > 0) {
      route.children = transformMenusToRoutes(menu.children);
    }
    routes.push(route);
  });
  return routes;
}

function queryUserMenus() {
  const defaultMenuList = [
    {
      id: '001000',
      parentId: '1',
      name: '系统设置',
      url: '/system/base',
      icon: 'ion:settings',
      component: 'LAYOUT',
      redirect: '/system/base',
      sequence: 1,
      children: [
        {
          id: '001001',
          name: 'FrameBlank设置',
          url: '/system/base',
          icon: 'ion:settings',
          component: '/@/views/sys/iframe/FrameBlank.vue',
          sequence: 1,
        },
      ],
    },
  ];
  const list = getAuthCache(MENU_LIST_KEY) as [];
  return list && list.length > 0 ? list : defaultMenuList;
}

// 假设后端传递的菜单数据存储在一个名为menus的数组中
const backendMenus = queryUserMenus();
const dynamicRoutes = transformMenusToRoutes(backendMenus);

export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...dynamicRoutes];

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

export const basicRoutes = [
  LoginRoute,
  RootRoute,
  ...mainOutRoutes,
  REDIRECT_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
];
