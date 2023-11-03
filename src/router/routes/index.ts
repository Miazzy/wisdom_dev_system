import type { AppRouteRecordRaw, AppRouteModule } from '/@/router/types';
import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '/@/router/routes/basic';
import { mainOutRoutes } from './mainOut';
import { PageEnum } from '/@/enums/pageEnum';
import { t } from '/@/hooks/web/useI18n';
import { getAuthCache } from '/@/utils/auth';
import { MENU_LIST_KEY } from '/@/enums/cacheEnum';
import { DefaultMenuInfo } from '/@/utils/constants';
import { asyncImportComponent, checkImportComponent } from '/@/router/helper/routeHelper';

// 路由转换函数 这个函数用于将后端的菜单数据转换为前端的路由配置
function transformMenusToRoutes(menus) {
  const routes: AppRouteModule[] = [];
  menus.forEach((menu) => {
    transformMenuItem(menu, routes);
  });
  return routes;
}

// 转换单个菜单
const transformMenuItem = (menu, routes) => {
  const route: AppRouteModule = {
    path: queryMenuUrl(menu.url),
    name: menu.name,
    component: () => {
      try {
        // 此处不能通过 import(menu.component) 进行动态加载，会导致vite打包分析问题
        menu.component = menu.component == '' ? 'LAYOUT' : menu.component;
        if (menu.component == 'LAYOUT' || menu.parentId == '1') {
          return import('/@/layouts/default/index.vue');
        } else if (checkImportComponent('/@/views/sys/iframe/FrameBlank.vue', menu.component)) {
          return import('/@/views/sys/iframe/FrameBlank.vue');
        } else if (
          checkImportComponent('/@/views/bpm/manage/workflow/workflow.vue', menu.component)
        ) {
          return import('/@/views/bpm/manage/workflow/workflow.vue');
        } else if (
          checkImportComponent('/@/views/bpm/manage/taskAssignRule/index.vue', menu.component)
        ) {
          return import('/@/views/bpm/manage/taskAssignRule/index.vue');
        } else if (
          checkImportComponent('/@/views/bpm/manage/definition/index.vue', menu.component)
        ) {
          return import('/@/views/bpm/manage/definition/index.vue');
        } else if (
          checkImportComponent('/@/views/bpm/manage/workflow/processEditor.vue', menu.component)
        ) {
          return import('/@/views/bpm/manage/workflow/processEditor.vue');
        } else if (checkImportComponent('/@/views/dev/dev.vue', menu.component)) {
          return import('/@/views/dev/dev.vue');
        }
        // baseset/demo
        else if (checkImportComponent('/@/views/hr/manage/oaleave/index.vue', menu.component)) {
          return import('/@/views/hr/manage/oaleave/index.vue');
        } else if (checkImportComponent('/@/views/hr/manage/oaleave/create.vue', menu.component)) {
          return import('/@/views/hr/manage/oaleave/create.vue');
        } else if (checkImportComponent('/@/views/hr/manage/oaleave/detail.vue', menu.component)) {
          return import('/@/views/hr/manage/oaleave/detail.vue');
        }
        // bpm/processInstance、todo、done
        else if (
          checkImportComponent('/@/views/bpm/manage/processInstance/index.vue', menu.component)
        ) {
          return import('/@/views/bpm/manage/processInstance/index.vue');
        } else if (
          checkImportComponent('/@/views/bpm/manage/task/todo/index.vue', menu.component)
        ) {
          return import('/@/views/bpm/manage/task/todo/index.vue');
        } else if (
          checkImportComponent('/@/views/bpm/manage/task/done/index.vue', menu.component)
        ) {
          return import('/@/views/bpm/manage/task/done/index.vue');
        }
        //sys/code-build-rule
        else if (checkImportComponent('/@/views/sys/codeBuildRule/index.vue', menu.component)) {
          return import('/@/views/sys/codeBuildRule/index.vue');
        }
        // baseset/monitor
        else if (
          checkImportComponent('/@/views/baseset/monitor/area/areaSet.vue', menu.component)
        ) {
          return import('/@/views/baseset/monitor/area/areaSet.vue');
        } else if (
          checkImportComponent('/@/views/baseset/monitor/model/modelSet.vue', menu.component)
        ) {
          return import('/@/views/baseset/monitor/model/modelSet.vue');
        } else if (
          checkImportComponent('/@/views/baseset/monitor/device/deviceSet.vue', menu.component)
        ) {
          return import('/@/views/baseset/monitor/device/deviceSet.vue');
        } else if (
          checkImportComponent(
            '/@/views/baseset/monitor/deviceinfo/deviceInfoSet.vue',
            menu.component,
          )
        ) {
          return import('/@/views/baseset/monitor/deviceinfo/deviceInfoSet.vue');
        } else if (
          checkImportComponent('/@/views/baseset/monitor/sunrise/sunriseSet.vue', menu.component)
        ) {
          return import('/@/views/baseset/monitor/sunrise/sunriseSet.vue');
        } else if (
          checkImportComponent('/@/views/baseset/monitor/modelinfo/modelInfo.vue', menu.component)
        ) {
          return import('/@/views/baseset/monitor/modelinfo/modelInfo.vue');
        }
        // baseset/operation
        else if (
          checkImportComponent('/@/views/baseset/operation/powerstation/index.vue', menu.component)
        ) {
          return import('/@/views/baseset/operation/powerstation/index.vue');
        } else if (
          checkImportComponent(
            '/@/views/baseset/operation/safecheck/safeCheckSet.vue',
            menu.component,
          )
        ) {
          return import('/@/views/baseset/operation/safecheck/safeCheckSet.vue');
        } else if (
          checkImportComponent('/@/views/baseset/operation/material/material.vue', menu.component)
        ) {
          return import('/@/views/baseset/operation/material/material.vue');
        } else if (
          checkImportComponent('/@/views/baseset/operation/warehouse/warehouse.vue', menu.component)
        ) {
          return import('/@/views/baseset/operation/warehouse/warehouse.vue');
        } else if (
          checkImportComponent(
            '/@/views/baseset/operation/assessrule/assessRule.vue',
            menu.component,
          )
        ) {
          return import('/@/views/baseset/operation/assessrule/assessRule.vue');
        } else if (
          checkImportComponent(
            '/@/views/baseset/operation/relatedparty/relatedParty.vue',
            menu.component,
          )
        ) {
          return import('/@/views/baseset/operation/relatedparty/relatedParty.vue');
        } else if (
          checkImportComponent('/@/views/baseset/operation/settlement/index.vue', menu.component)
        ) {
          return import('/@/views/baseset/operation/settlement/index.vue');
        } else if (
          checkImportComponent(
            '/@/views/baseset/operation/personnelqualifications/index.vue',
            menu.component,
          )
        ) {
          return import('/@/views/baseset/operation/personnelqualifications/index.vue');
        } else if (
          checkImportComponent(
            '/@/views/baseset/operation/linelossrate/lineLossRateSet.vue',
            menu.component,
          )
        ) {
          return import('/@/views/baseset/operation/linelossrate/lineLossRateSet.vue');
        }
        // po/ticket
        else if (
          checkImportComponent('/@/views/po/ticket/operationticket/index.vue', menu.component)
        ) {
          return import('/@/views/po/ticket/operationticket/index.vue');
        } else if (
          checkImportComponent('/@/views/po/ticket/operationticket/create.vue', menu.component)
        ) {
          return import('/@/views/po/ticket/operationticket/create.vue');
        } else if (
          checkImportComponent('/@/views/po/ticket/firstworkticket/index.vue', menu.component)
        ) {
          return import('/@/views/po/ticket/firstworkticket/index.vue');
        } else if (
          checkImportComponent('/@/views/po/ticket/firstworkticket/create.vue', menu.component)
        ) {
          return import('/@/views/po/ticket/firstworkticket/create.vue');
        } else if (
          checkImportComponent('/@/views/po/ticket/secondworkticket/index.vue', menu.component)
        ) {
          return import('/@/views/po/ticket/secondworkticket/index.vue');
        } else if (
          checkImportComponent('/@/views/po/ticket/secondworkticket/create.vue', menu.component)
        ) {
          return import('/@/views/po/ticket/secondworkticket/create.vue');
        }
        // po/safety
        else if (menu.component == '/@/views/po/safety/safechecktemplate/index.vue') {
          return import('/@/views/po/safety/safechecktemplate/index.vue');
        } else if (menu.component == '/@/views/po/safety/safechecktemplate/createOrUpdate.vue') {
          return import('/@/views/po/safety/safechecktemplate/createOrUpdate.vue');
        } else if (menu.component == '/@/views/po/safety/safecheckissue/index.vue') {
          return import('/@/views/po/safety/safecheckissue/index.vue');
        } else if (menu.component == '/@/views/po/safety/safecheckissue/createOrUpdate.vue') {
          return import('/@/views/po/safety/safecheckissue/createOrUpdate.vue');
        } else if (menu.component.startsWith('/@/views/po/safety/safecheckexecution/index.vue')) {
          return import('/@/views/po/safety/safecheckexecution/index.vue');
        } else if (menu.component == '/@/views/po/safety/safecheckexecution/createOrUpdate.vue') {
          return import('/@/views/po/safety/safecheckexecution/createOrUpdate.vue');
        } else if (menu.component == '/@/views/po/safety/vehicleexecution/index.vue') {
          return import('/@/views/po/safety/vehicleexecution/index.vue');
        } else if (menu.component == '/@/views/po/safety/vehicleexecution/createOrUpdate.vue') {
          return import('/@/views/po/safety/vehicleexecution/createOrUpdate.vue');
        }
        // po/integrated
        else if (menu.component == '/@/views/po/integrated/personcertificate/index.vue') {
          return import('/@/views/po/integrated/personcertificate/index.vue');
        } else if (menu.component == '/@/views/po/integrated/infoarchive/index.vue') {
          return import('/@/views/po/integrated/infoarchive/index.vue');
        } else if (menu.component == '/@/views/po/integrated/infoarchive/infoarchiveCreate.vue') {
          return import('/@/views/po/integrated/infoarchive/infoarchiveCreate.vue');
        } else if (menu.component == '/@/views/po/integrated/training/index.vue') {
          return import('/@/views/po/integrated/training/index.vue');
        } else if (menu.component == '/@/views/po/integrated/training/trainingCreate.vue') {
          return import('/@/views/po/integrated/training/trainingCreate.vue');
        }
        // po/elec
        else if (menu.component == '/@/views/po/elec/produce/index.vue') {
          return import('/@/views/po/elec/produce/index.vue');
        } else if (menu.component == '/@/views/po/elec/produce/dayReportCreate.vue') {
          return import('/@/views/po/elec/produce/dayReportCreate.vue');
        } else if (menu.component == '/@/views/po/elec/produce/weekReportCreate.vue') {
          return import('/@/views/po/elec/produce/weekReportCreate.vue');
        } else if (menu.component == '/@/views/po/elec/produce/monthReportCreate.vue') {
          return import('/@/views/po/elec/produce/monthReportCreate.vue');
        } else if (menu.component == '/@/views/po/elec/produce/yearReportCreate.vue') {
          return import('/@/views/po/elec/produce/yearReportCreate.vue');
        } else if (
          checkImportComponent(
            '/@/views/po/elec/settlementelec/settlementElectricity.vue',
            menu.component,
          )
        ) {
          return import('/@/views/po/elec/settlementelec/settlementElectricity.vue');
        } else if (
          checkImportComponent(
            '/@/views/po/elec/settlementelec/settlemenElecModal.vue',
            menu.component,
          )
        ) {
          return import('/@/views/po/elec/settlementelec/settlemenElecModal.vue');
        } else if (
          checkImportComponent(
            '/@/views/po/elec/plannedelectricity/plannedElectricity.vue',
            menu.component,
          )
        ) {
          return import('/@/views/po/elec/plannedelectricity/plannedElectricity.vue');
        } else if (
          checkImportComponent(
            '/@/views/po/elec/plannedelectricity/plannedElecModal.vue',
            menu.component,
          )
        ) {
          return import('/@/views/po/elec/plannedelectricity/plannedElecModal.vue');
        }
        // da/cockpit
        else if (
          checkImportComponent('/@/views/da/cockpit/overview/Overview.vue', menu.component)
        ) {
          return import('/@/views/da/cockpit/overview/Overview.vue');
        } else if (
          checkImportComponent('/@/views/da/cockpit/operation/Operation.vue', menu.component)
        ) {
          return import('/@/views/da/cockpit/operation/Operation.vue');
        } else if (
          checkImportComponent('/@/views/da/cockpit/composition/Composition.vue', menu.component)
        ) {
          return import('/@/views/da/cockpit/composition/Composition.vue');
        } else if (checkImportComponent('/@/views/cockpit/da/power/Power.vue', menu.component)) {
          return import('/@/views/da/cockpit/power/Power.vue');
        } else if (
          checkImportComponent('/@/views/da/cockpit/property/Property.vue', menu.component)
        ) {
          return import('/@/views/da/cockpit/property/Property.vue');
        } else if (
          checkImportComponent('/@/views/da/cockpit/security/Security.vue', menu.component)
        ) {
          return import('/@/views/da/cockpit/security/Security.vue');
        }
        // monitor/PVArea
        else if (
          checkImportComponent(
            '/@/views/monitor/PVArea/subareaOverview/subareaOverview.vue',
            menu.component,
          )
        ) {
          return import('/@/views/monitor/PVArea/subareaOverview/subareaOverview.vue');
        } else if (
          checkImportComponent(
            '/@/views/monitor/PVArea/inverterOverview/inverterOverview.vue',
            menu.component,
          )
        ) {
          return import('/@/views/monitor/PVArea/inverterOverview/inverterOverview.vue');
        } else if (
          checkImportComponent(
            '/@/views/monitor/PVArea/boxTransformerSubstationOverview/boxTransformerSubstationOverview.vue',
            menu.component,
          )
        ) {
          return import(
            '/@/views/monitor/PVArea/boxTransformerSubstationOverview/boxTransformerSubstationOverview.vue'
          );
        } else if (
          checkImportComponent(
            '/@/views/monitor/PVArea/groupSeriesOverview/groupSeriesOverview.vue',
            menu.component,
          )
        ) {
          return import('/@/views/monitor/PVArea/groupSeriesOverview/groupSeriesOverview.vue');
        }
        // monitor/boosterStation
        else if (
          checkImportComponent(
            '/@/views/monitor/boosterStation/boosterStationOverview/boosterStationOverview.vue',
            menu.component,
          )
        ) {
          return import(
            '/@/views/monitor/boosterStation/boosterStationOverview/boosterStationOverview.vue'
          );
        }
        // monitor/energyStorage
        else if (
          checkImportComponent(
            '/@/views/monitor/energyStorage/energyStorageMonitor.vue',
            menu.component,
          )
        ) {
          return import('/@/views/monitor/energyStorage/energyStorageMonitor.vue');
        }
        // monitor/realTimeAnalysis
        else if (
          checkImportComponent(
            '/@/views/monitor/realTimeAnalysis/areaRealTimeAnalysis.vue',
            menu.component,
          )
        ) {
          return import('/@/views/monitor/realTimeAnalysis/areaRealTimeAnalysis.vue');
        } else if (
          checkImportComponent(
            '/@/views/monitor/realTimeAnalysis/inverterRealTimeAnalysis.vue',
            menu.component,
          )
        ) {
          return import('/@/views/monitor/realTimeAnalysis/inverterRealTimeAnalysis.vue');
        } else if (
          checkImportComponent(
            '/@/views/monitor/realTimeAnalysis/dispersionRatioRealTimeAnalysis.vue',
            menu.component,
          )
        ) {
          return import('/@/views/monitor/realTimeAnalysis/dispersionRatioRealTimeAnalysis.vue');
        } else if (
          checkImportComponent(
            '/@/views/monitor/realTimeAnalysis/groupSeriesRealTimeAnalysis.vue',
            menu.component,
          )
        ) {
          return import('/@/views/monitor/realTimeAnalysis/groupSeriesRealTimeAnalysis.vue');
        }
        // monitor/faultWarning
        else if (
          checkImportComponent('/@/views/monitor/faultWarning/faultWarning.vue', menu.component)
        ) {
          return import('/@/views/monitor/faultWarning/faultWarning.vue');
        } else {
          return asyncImportComponent(menu.component);
        }
      } catch (e) {
        return import('/@/views/sys/exception/Exception.vue');
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
};

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

// 总览驾驶舱路由
export const CockpitOverviewRoute: AppRouteRecordRaw = {
  path: '/cockpit/overview',
  name: 'CockpitOverview',
  component: () => import('/@/views/da/cockpit/overview/Overview.vue'),
  meta: {
    title: t('routes.basic.cockpit.overview'),
  },
};

// 暴露基础路由
export const basicRoutes = [
  LoginRoute,
  CockpitOverviewRoute,
  RootRoute,
  ...mainOutRoutes,
  REDIRECT_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
];
