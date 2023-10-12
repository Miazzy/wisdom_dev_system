import type { AppRouteRecordRaw, AppRouteModule } from '/@/router/types';
import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '/@/router/routes/basic';
import { mainOutRoutes } from './mainOut';
import { PageEnum } from '/@/enums/pageEnum';
import { t } from '/@/hooks/web/useI18n';
import { getAuthCache } from '/@/utils/auth';
import { MENU_LIST_KEY } from '/@/enums/cacheEnum';
import { DefaultMenuInfo } from '/@/utils/constants';

// 路由转换函数 这个函数用于将后端的菜单数据转换为前端的路由配置
function transformMenusToRoutes(menus) {
  const routes = [];
  menus.forEach((menu) => {
    const route: AppRouteModule = {
      path: queryMenuUrl(menu.url),
      name: menu.name,
      component: () => {
        // 此处不能通过 import(menu.component) 进行动态加载，会导致vite打包分析问题
        if (menu.component == 'LAYOUT' || menu.parentId == '1') {
          return import('/@/layouts/default/index.vue');
        } else if (menu.component == '/@/views/sys/iframe/FrameBlank.vue') {
          return import('/@/views/sys/iframe/FrameBlank.vue');
        } else if (menu.component == '/@/views/bpm/manage/workflow/workflow.vue') {
          return import('/@/views/bpm/manage/workflow/workflow.vue');
        } else if (menu.component == '/@/views/bpm/manage/taskAssignRule/index.vue') {
          return import('/@/views/bpm/manage/taskAssignRule/index.vue');
        } else if (menu.component == '/@/views/bpm/manage/definition/index.vue') {
          return import('/@/views/bpm/manage/definition/index.vue');
        } else if (menu.component == '/@/views/bpm/manage/workflow/processEditor.vue') {
          return import('/@/views/bpm/manage/workflow/processEditor.vue');
        } else if (menu.component == '/@/views/dev/dev.vue') {
          return import('/@/views/dev/dev.vue');
        }
        // baseset/monitor
        else if (menu.component == '/@/views/baseset/monitor/area/areaSet.vue') {
          return import('/@/views/baseset/monitor/area/areaSet.vue');
        }
        else if (menu.component == '/@/views/baseset/monitor/model/modelSet.vue') {
          return import('/@/views/baseset/monitor/model/modelSet.vue');
        }
        else if (menu.component == '/@/views/baseset/monitor/device/deviceSet.vue') {
          return import('/@/views/baseset/monitor/device/deviceSet.vue');
        }
        else if (menu.component == '/@/views/baseset/monitor/deviceinfo/deviceInfoSet.vue') {
          return import('/@/views/baseset/monitor/deviceinfo/deviceInfoSet.vue');
        }
        else if (menu.component == '/@/views/baseset/monitor/sunrise/sunriseSet.vue') {
          return import('/@/views/baseset/monitor/sunrise/sunriseSet.vue');
        }
        // baseset/operation
        else if (menu.component == '/@/views/baseset/operation/powerstation/index.vue') {
          return import('/@/views/baseset/operation/powerstation/index.vue');
        }
        else if (menu.component == '/@/views/baseset/operation/material/material.vue') {
          return import('/@/views/baseset/operation/material/material.vue');
        }
        else if (menu.component == '/@/views/baseset/operation/assessRule/assessRule.vue') {
          return import('/@/views/baseset/operation/assessRule/assessRule.vue');
        }
        else if (menu.component == '/@/views/baseset/safeCheckSet/safeCheckSet.vue') {
          return import('/@/views/baseset/safeCheckSet/safeCheckSet.vue');
        }

        else {
          return import('/@/layouts/default/index.vue');
        }
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
