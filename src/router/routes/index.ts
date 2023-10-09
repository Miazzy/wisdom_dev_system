import type { AppRouteRecordRaw, AppRouteModule } from '/@/router/types';
import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '/@/router/routes/basic';
import { mainOutRoutes } from './mainOut';
import { PageEnum } from '/@/enums/pageEnum';
import { t } from '/@/hooks/web/useI18n';
import { getAuthCache } from '/@/utils/auth';
import { MENU_LIST_KEY } from '/@/enums/cacheEnum';
import { DefaultMenuInfo } from '/@/utils/constants';
import {
  FrameBlank,
  Workflow,
  TaskAssignRule,
  Definition,
  ProcessEditor,
  DevPage,
  routePageMap,
} from '@/router/constant';

// 路由转换函数 这个函数用于将后端的菜单数据转换为前端的路由配置
function transformMenusToRoutes(menus) {
  const routes = [];
  menus.forEach((menu) => {
    const route: AppRouteModule = {
      path: menu.url.startsWith('/') ? menu.url : `/${menu.url}`,
      name: menu.name,
      component: () => {
        const response =
          menu.component == 'LAYOUT' || menu.parentId == '1'
            ? import('/@/layouts/default/index.vue')
            : routePageMap.get(menu.component);
        return response;
      },
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

// 假设后端传递的菜单数据存储在一个名为menus的数组中
const backendMenus = queryUserMenus();
// 获取转换后的菜单路由
const dynamicRoutes = transformMenusToRoutes(backendMenus);
// 暴露动态路由
export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...dynamicRoutes];

// 根路由
export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: queryBaseHomeRoute(),
  meta: {
    title: 'Root',
  },
  children: [
    {
      path: '/hidden/frameblank',
      name: 'FrameBlank',
      component: FrameBlank,
      meta: {
        title: 'FrameBlank',
        hideMenu: true,
      },
    },
    {
      path: '/hidden/workflow',
      name: 'Workflow',
      component: Workflow,
      meta: {
        title: 'Workflow',
        hideMenu: true,
      },
    },
    {
      path: '/hidden/taskassignrule',
      name: 'TaskAssignRule',
      component: TaskAssignRule,
      meta: {
        title: 'TaskAssignRule',
        hideMenu: true,
      },
    },
    {
      path: '/hidden/definition',
      name: 'Definition',
      component: Definition,
      meta: {
        title: 'Definition',
        hideMenu: true,
      },
    },
    {
      path: '/hidden/processeditor',
      name: 'ProcessEditor',
      component: ProcessEditor,
      meta: {
        title: 'ProcessEditor',
        hideMenu: true,
      },
    },
    {
      path: '/hidden/devpage',
      name: 'DevPage',
      component: DevPage,
      meta: {
        title: 'DevPage',
        hideMenu: true,
      },
    },
  ],
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
