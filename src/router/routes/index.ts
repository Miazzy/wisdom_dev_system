import type { AppRouteRecordRaw, AppRouteModule } from '/@/router/types';
import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '/@/router/routes/basic';
import { mainOutRoutes } from './mainOut';
import { PageEnum } from '/@/enums/pageEnum';
import { t } from '/@/hooks/web/useI18n';
import { getAuthCache } from '/@/utils/auth';
import { MENU_LIST_KEY } from '/@/enums/cacheEnum';
import { DefaultMenuInfo } from '/@/utils/constants';
import { asyncImportComponent } from '/@/router/helper/routeHelper';

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
        menu.component = menu.component == '' ? 'LAYOUT' : menu.component;
        if (menu.component == 'LAYOUT' || menu.parentId == '1') {
          return import('/@/layouts/default/index.vue');
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
  meta: { title: 'Root', keepAlive: true },
};

// 登录路由
export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('/@/views/sys/login/Login.vue'),
  meta: { title: t('routes.basic.login'), keepAlive: false },
};

// 缓存页面
export const CachePage: AppRouteRecordRaw = {
  path: '/frame/cachepage',
  name: 'CachePage',
  component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
  meta: { keepAlive: true },
};

// 总览驾驶舱路由
export const CockpitOverviewRoute: AppRouteRecordRaw = {
  path: '/frame/cockpit/overview',
  name: 'CockpitOverview',
  component: () => import('/@/views/da/cockpit/overview/Overview.vue'),
  meta: { keepAlive: true },
};

// 运维驾驶舱路由
export const CockpitOperationRoute: AppRouteRecordRaw = {
  path: '/frame/cockpit/operation',
  component: () => import('/@/views/da/cockpit/operation/Operation.vue'),
  meta: { keepAlive: true },
};

// 资产驾驶舱路由
export const CockpitPropertyRoute: AppRouteRecordRaw = {
  path: '/frame/cockpit/property',
  component: () => import('/@/views/da/cockpit/property/Property.vue'),
  meta: { keepAlive: true },
};

// 安全驾驶舱路由
export const CockpitSecurityRoute: AppRouteRecordRaw = {
  path: '/frame/cockpit/security',
  component: () => import('/@/views/da/cockpit/security/Security.vue'),
  meta: { keepAlive: true },
};

// 综合驾驶舱路由
export const CockpitCompositionRoute: AppRouteRecordRaw = {
  path: '/frame/cockpit/composition',
  component: () => import('/@/views/da/cockpit/composition/Composition.vue'),
  meta: { keepAlive: true },
};

// 安全驾驶舱路由
export const CockpitPowerRoute: AppRouteRecordRaw = {
  path: '/frame/cockpit/power',
  component: () => import('/@/views/da/cockpit/power/Power.vue'),
  meta: { keepAlive: true },
};

// 集团运营大屏
export const GroupOperationRoute: AppRouteRecordRaw = {
  path: '/groupOperation',
  name: 'GroupOperation',
  component: () => import('/@/views/da/groupOperation/GroupOperation.vue'),
  meta: { title: '集团运营', keepAlive: true },
};

// 电站运营大屏
export const StationOperationRoute: AppRouteRecordRaw = {
  path: '/stationOperation',
  name: 'StationOperation',
  component: () => import('/@/views/da/stationOperation/StationOperation.vue'),
  meta: { title: '电站运营', keepAlive: true },
};

// 电站运营大屏
export const FrameWorkbench: AppRouteRecordRaw = {
  path: '/frame/workbench',
  name: 'FrameWorkbench',
  component: () => import('/@/views/workbench/Workbench.vue'),
  meta: { title: '工作台', keepAlive: true },
};

// 框架页面
export const Frame: AppRouteRecordRaw = {
  path: '/frame',
  name: 'Frame',
  component: () => import('/@/layouts/frame/MainLayout.vue'),
  meta: { title: '工作台', keepAlive: true },
};

// 框架页面
export const FramePage: AppRouteRecordRaw = {
  path: '/framepage',
  name: 'FramePage',
  component: () => import('/@/layouts/frame/MainLayout.vue'),
  meta: { title: '工作台', keepAlive: true },
};

export const PvSubareaOverview: AppRouteRecordRaw = {
  path: '/frame/monitor/pvarea/subareaoverview',
  component: () => import('/@/views/monitor/PVArea/subareaOverview/subareaOverview.vue'),
  meta: { keepAlive: true },
};

export const PvInverterOverview: AppRouteRecordRaw = {
  path: '/frame/monitor/PVArea/inverterOverview',
  component: () => import('/@/views/monitor/PVArea/inverterOverview/inverterOverview.vue'),
  meta: { keepAlive: true },
};

export const PvTransformerSubstationOverview: AppRouteRecordRaw = {
  path: '/frame/monitor/PVArea/boxTransformerSubstationOverview',
  component: () =>
    import(
      '/@/views/monitor/PVArea/boxTransformerSubstationOverview/boxTransformerSubstationOverview.vue'
    ),
  meta: { keepAlive: true },
};

export const PvGroupSeriesOverview: AppRouteRecordRaw = {
  path: '/frame/monitor/PVArea/groupSeriesOverview',
  component: () => import('/@/views/monitor/PVArea/groupSeriesOverview/groupSeriesOverview.vue'),
  meta: { keepAlive: true },
};

export const PvBoosterStationOverview: AppRouteRecordRaw = {
  path: '/frame/monitor/boosterStation/boosterStationOverview',
  component: () =>
    import('/@/views/monitor/boosterStation/boosterStationOverview/boosterStationOverview.vue'),
  meta: { keepAlive: true },
};

export const PvFaultWarning: AppRouteRecordRaw = {
  path: '/frame/monitor/faultWarning',
  component: () => import('/@/views/monitor/faultWarning/faultWarning.vue'),
  meta: { keepAlive: true },
};

export const PvEnergyStorage: AppRouteRecordRaw = {
  path: '/frame/monitor/energyStorage',
  component: () => import('/@/views/monitor/energyStorage/energyStorageMonitor.vue'),
  meta: { keepAlive: true },
};

export const PvAreaRealTimeAnalysis: AppRouteRecordRaw = {
  path: '/frame/monitor/realTimeAnalysis/areaRealTimeAnalysis',
  component: () => import('/@/views/monitor/realTimeAnalysis/areaRealTimeAnalysis.vue'),
  meta: { keepAlive: true },
};

export const PvInverterRealTimeAnalysis: AppRouteRecordRaw = {
  path: '/frame/monitor/realTimeAnalysis/inverterRealTimeAnalysis',
  component: () => import('/@/views/monitor/realTimeAnalysis/inverterRealTimeAnalysis.vue'),
  meta: { keepAlive: true },
};

export const PvDispersionRatioRealTimeAnalysis: AppRouteRecordRaw = {
  path: '/frame/monitor/realTimeAnalysis/dispersionRatioRealTimeAnalysis',
  component: () => import('/@/views/monitor/realTimeAnalysis/dispersionRatioRealTimeAnalysis.vue'),
  meta: { keepAlive: true },
};

export const PvGroupSeriesRealTimeAnalysis: AppRouteRecordRaw = {
  path: '/frame/monitor/realTimeAnalysis/groupSeriesRealTimeAnalysis',
  component: () => import('/@/views/monitor/realTimeAnalysis/groupSeriesRealTimeAnalysis.vue'),
  meta: { keepAlive: true },
};

export const PoElecProduceIndex: AppRouteRecordRaw = {
  path: '/frame/po/elec/produce/index',
  component: () => import('/@/views/po/elec/produce/index.vue'),
  meta: { keepAlive: true },
};

export const PoElecProduceDayReportCreate: AppRouteRecordRaw = {
  path: '/frame/po/elec/produce/dayReportCreate',
  component: () => import('/@/views/po/elec/produce/dayReportCreate.vue'),
  meta: { keepAlive: true },
};

export const PoElecProduceWeekReportCreate: AppRouteRecordRaw = {
  path: '/frame/po/elec/produce/weekReportCreate',
  component: () => import('/@/views/po/elec/produce/weekReportCreate.vue'),
  meta: { keepAlive: true },
};

export const PoElecProduceMonthReportCreate: AppRouteRecordRaw = {
  path: '/frame/po/elec/produce/monthReportCreate',
  component: () => import('/@/views/po/elec/produce/monthReportCreate.vue'),
  meta: { keepAlive: true },
};

export const PoElecProduceYearReportCreate: AppRouteRecordRaw = {
  path: '/frame/po/elec/produce/yearReportCreate',
  component: () => import('/@/views/po/elec/produce/yearReportCreate.vue'),
  meta: { keepAlive: true },
};

export const PoElecSettlementElectricity: AppRouteRecordRaw = {
  path: '/frame/po/elec/settlementelec/settlementElectricity',
  component: () => import('/@/views/po/elec/settlementelec/settlementElectricity.vue'),
  meta: { keepAlive: true },
};

export const PoElecSettlementElecModal: AppRouteRecordRaw = {
  path: '/frame/po/elec/settlementelec/setElecCreate',
  component: () => import('/@/views/po/elec/settlementelec/settlemenElecModal.vue'),
  meta: { keepAlive: true },
};

export const PoElecSettlementElecSetElecDetail: AppRouteRecordRaw = {
  path: '/frame/po/elec/settlementelec/setElecDetail',
  component: () => import('/@/views/po/elec/settlementelec/settlemenElecModal.vue'),
  meta: { keepAlive: true },
};

export const PoPlannedElectricity: AppRouteRecordRaw = {
  path: '/frame/po/elec/settlementelec/plannedElectricity',
  component: () => import('/@/views/po/elec/plannedelectricity/plannedElectricity.vue'),
  meta: { keepAlive: true },
};

export const PoPlannedElecCreate: AppRouteRecordRaw = {
  path: '/frame/po/elec/plannedelec/plannedElecCreate',
  component: () => import('/@/views/po/elec/plannedelectricity/plannedElecModal.vue'),
  meta: { keepAlive: true },
};

export const PoPlannedElecDetail: AppRouteRecordRaw = {
  path: '/frame/po/elec/plannedelec/plannedElecDetail',
  component: () => import('/@/views/po/elec/plannedelectricity/plannedElecModal.vue'),
  meta: { keepAlive: true },
};

export const PoSafechecktemplate: AppRouteRecordRaw = {
  path: '/frame/po/safety/safechecktemplate',
  component: () => import('/@/views/po/safety/safechecktemplate/index.vue'),
  meta: { keepAlive: true },
};

export const PoSafechecktemplateCreateOrUpdate: AppRouteRecordRaw = {
  path: '/frame/po/safety/safechecktemplate/create',
  component: () => import('/@/views/po/safety/safechecktemplate/createOrUpdate.vue'),
  meta: { keepAlive: true },
};

export const PoSafecheckissue: AppRouteRecordRaw = {
  path: '/frame/po/safety/safecheckissue',
  component: () => import('/@/views/po/safety/safecheckissue/index.vue'),
  meta: { keepAlive: true },
};

export const PoSafecheckissueCreateOrUpdate: AppRouteRecordRaw = {
  path: '/frame/po/safety/safecheckissue/create',
  component: () => import('/@/views/po/safety/safecheckissue/createOrUpdate.vue'),
  meta: { keepAlive: true },
};

export const PoSafecheckexecutionCheckType1: AppRouteRecordRaw = {
  path: '/frame/po/safety/safecheckexecution/checkType__1',
  component: () => import('/@/views/po/safety/safecheckexecution/index.vue'),
  meta: { keepAlive: true },
};

export const PoSafecheckexecutionCreateCheckType1: AppRouteRecordRaw = {
  path: '/frame/po/safety/safecheckexecution/create/checkType__1',
  component: () => import('/@/views/po/safety/safecheckexecution/createOrUpdate.vue'),
  meta: { keepAlive: true },
};

export const PoSafecheckexecutionCheckType2: AppRouteRecordRaw = {
  path: '/frame/po/safety/safecheckexecution/checkType__2',
  component: () => import('/@/views/po/safety/safecheckexecution/index.vue'),
  meta: { keepAlive: true },
};

export const PoSafecheckexecutionCreateCheckType2: AppRouteRecordRaw = {
  path: '/frame/po/safety/safecheckexecution/create/checkType__2',
  component: () => import('/@/views/po/safety/safecheckexecution/createOrUpdate.vue'),
  meta: { keepAlive: true },
};

export const PoSafecheckexecution: AppRouteRecordRaw = {
  path: '/frame/po/safety/safecheckexecution',
  component: () => import('/@/views/po/safety/safecheckexecution/index.vue'),
  meta: { keepAlive: true },
};

export const PoSafecheckexecutionCreate: AppRouteRecordRaw = {
  path: '/frame/po/safety/safecheckexecution/create',
  component: () => import('/@/views/po/safety/safecheckexecution/createOrUpdate.vue'),
  meta: { keepAlive: true },
};

export const PoVehicleexecution: AppRouteRecordRaw = {
  path: '/frame/po/safety/vehicleexecution',
  component: () => import('/@/views/po/safety/vehicleexecution/index.vue'),
  meta: { keepAlive: true },
};

export const PoVehicleexecutionCreate: AppRouteRecordRaw = {
  path: '/frame/po/safety/vehicleexecution/create',
  component: () => import('/@/views/po/safety/vehicleexecution/createOrUpdate.vue'),
  meta: { keepAlive: true },
};

export const PoSafetyFiles: AppRouteRecordRaw = {
  path: '/frame/po/safety/safetyFiles',
  component: () => import('/@/views/po/safety/safetyfiles/index.vue'),
  meta: { keepAlive: true },
};

export const PoSafetyFilesCreate: AppRouteRecordRaw = {
  path: '/frame/po/safety/safetyfiles/create',
  component: () => import('/@/views/po/safety/safetyfiles/SafetyFilesModal.vue'),
  meta: { keepAlive: true },
};

export const PoSafetyFilesDetail: AppRouteRecordRaw = {
  path: '/frame/po/safety/safetyfiles/detail',
  component: () => import('/@/views/po/safety/safetyfiles/SafetyFilesModal.vue'),
  meta: { keepAlive: true },
};

export const PoEmergencydrill: AppRouteRecordRaw = {
  path: '/frame/po/safety/emergencydrill',
  component: () => import('/@/views/po/safety/emergencydrill/index.vue'),
  meta: { keepAlive: true },
};

export const PoEmergencydrillCreate: AppRouteRecordRaw = {
  path: '/frame/po/safety/emergencydrill/create',
  component: () => import('/@/views/po/safety/emergencydrill/emergencyDrillModal.vue'),
  meta: { keepAlive: true },
};

export const PoEmergencydrillDetail: AppRouteRecordRaw = {
  path: '/frame/po/safety/emergencydrill/detail',
  component: () => import('/@/views/po/safety/emergencydrill/emergencyDrillModal.vue'),
  meta: { keepAlive: true },
};

export const PoSafetyAccident: AppRouteRecordRaw = {
  path: '/frame/po/safetyAccident',
  component: () => import('/@/views/po/safety/safetyaccident/index.vue'),
  meta: { keepAlive: true },
};

export const PoSafetyAccidentCreate: AppRouteRecordRaw = {
  path: '/frame/po/safetyAccident/create',
  component: () => import('/@/views/po/safety/safetyaccident/safetyAccidentModal.vue'),
  meta: { keepAlive: true },
};

export const PoSafetyAccidentDetail: AppRouteRecordRaw = {
  path: '/frame/po/safetyAccident/detail',
  component: () => import('/@/views/po/safety/safetyaccident/safetyAccidentModal.vue'),
  meta: { keepAlive: true },
};

export const PoSafetytoolsscrap: AppRouteRecordRaw = {
  path: '/frame/po/safetytools/safetytoolsscrap',
  component: () => import('/@/views/po/safetytools/safetytoolsscrap/index.vue'),
  meta: { keepAlive: true },
};

export const PoSafetytoolsscrapCreate: AppRouteRecordRaw = {
  path: '/frame/po/safetytools/safetytoolsscrap/create',
  component: () => import('/@/views/po/safetytools/safetytoolsscrap/create.vue'),
  meta: { keepAlive: true },
};

export const PoSafetytoolscheck: AppRouteRecordRaw = {
  path: '/frame/po/safetytools/safetytoolscheck',
  component: () => import('/@/views/po/safetytools/safetytoolscheck/index.vue'),
  meta: { keepAlive: true },
};

export const PoSafetytoolscheckCreate: AppRouteRecordRaw = {
  path: '/frame/po/safetytools/safetytoolscheck/create',
  component: () => import('/@/views/po/safetytools/safetytoolscheck/create.vue'),
  meta: { keepAlive: true },
};

export const PoSafetytools: AppRouteRecordRaw = {
  path: '/frame/po/safetytools/safetytools',
  component: () => import('/@/views/po/safetytools/safetytools/index.vue'),
  meta: { keepAlive: true },
};

export const PoSafetytoolsCreate: AppRouteRecordRaw = {
  path: '/frame/po/safetytools/safetytools/create',
  component: () => import('/@/views/po/safetytools/safetytools/create.vue'),
  meta: { keepAlive: true },
};

export const PoSafetyRespAgreement: AppRouteRecordRaw = {
  path: '/frame/po/safetyRespAgreement',
  component: () => import('/@/views/po/safety/safetyrespagreement/index.vue'),
  meta: { keepAlive: true },
};

export const PoSafetyRespAgreementCreate: AppRouteRecordRaw = {
  path: '/frame/po/safetyRespAgreement/create',
  component: () => import('/@/views/po/safety/safetyrespagreement/safetyRespAgreementModal.vue'),
  meta: { keepAlive: true },
};

export const PoSafetyRespAgreementDetail: AppRouteRecordRaw = {
  path: '/frame/po/safetyRespAgreement/detail',
  component: () => import('/@/views/po/safety/safetyrespagreement/safetyRespAgreementModal.vue'),
  meta: { keepAlive: true },
};

export const PoOperationticket: AppRouteRecordRaw = {
  path: '/frame/po/ticket/operationticket/index',
  component: () => import('/@/views/po/ticket/operationticket/index.vue'),
  meta: { keepAlive: true },
};

export const PoOperationticketCreate: AppRouteRecordRaw = {
  path: '/frame/po/ticket/operationticket/create',
  component: () => import('/@/views/po/ticket/operationticket/create.vue'),
  meta: { keepAlive: true },
};

export const PoFirstworkticket: AppRouteRecordRaw = {
  path: '/frame/po/ticket/firstworkticket/index',
  component: () => import('/@/views/po/ticket/firstworkticket/index.vue'),
  meta: { keepAlive: true },
};

export const PoFirstworkticketCreate: AppRouteRecordRaw = {
  path: '/frame/po/ticket/firstworkticket/create',
  component: () => import('/@/views/po/ticket/firstworkticket/create.vue'),
  meta: { keepAlive: true },
};

export const PoSecondworkticket: AppRouteRecordRaw = {
  path: '/frame/po/ticket/secondworkticket/index',
  component: () => import('/@/views/po/ticket/secondworkticket/index.vue'),
  meta: { keepAlive: true },
};

export const PoSecondworkticketCreate: AppRouteRecordRaw = {
  path: '/frame/po/ticket/secondworkticket/create',
  component: () => import('/@/views/po/ticket/secondworkticket/create.vue'),
  meta: { keepAlive: true },
};

export const PoInspectionplan: AppRouteRecordRaw = {
  path: '/frame/po/inspection/inspectionplan',
  component: () => import('/@/views/po/inspection/inspectionplan/index.vue'),
  meta: { keepAlive: true },
};

export const PoInspectionplanCreate: AppRouteRecordRaw = {
  path: '/frame/po/inspection/inspectionplan/create',
  component: () => import('/@/views/po/inspection/inspectionplan/create.vue'),
  meta: { keepAlive: true },
};

export const PoInspectionexecution: AppRouteRecordRaw = {
  path: '/frame/po/inspection/inspectionexecution',
  component: () => import('/@/views/po/inspection/inspectionexecution/index.vue'),
  meta: { keepAlive: true },
};

export const PoInspectionexecutionCreate: AppRouteRecordRaw = {
  path: '/frame/po/inspection/inspectionexecution/create',
  component: () => import('/@/views/po/inspection/inspectionexecution/create.vue'),
  meta: { keepAlive: true },
};

export const PoSupervision: AppRouteRecordRaw = {
  path: '/frame/po/supervision/index',
  component: () => import('/@/views/po/supervision/index.vue'),
  meta: { keepAlive: true },
};

export const PoSupervisionCreate: AppRouteRecordRaw = {
  path: '/frame/po/supervision/create',
  component: () => import('/@/views/po/supervision/create.vue'),
  meta: { keepAlive: true },
};

export const PoSupervisionDetail: AppRouteRecordRaw = {
  path: '/frame/po/supervision/detail',
  component: () => import('/@/views/po/supervision/create.vue'),
  meta: { keepAlive: true },
};

export const PoDanger: AppRouteRecordRaw = {
  path: '/frame/po/danger/index',
  component: () => import('/@/views/po/danger/index.vue'),
  meta: { keepAlive: true },
};

export const PoDangerCreate: AppRouteRecordRaw = {
  path: '/frame/po/danger/create',
  component: () => import('/@/views/po/danger/create.vue'),
  meta: { keepAlive: true },
};

export const PoDangerDetail: AppRouteRecordRaw = {
  path: '/frame/po/danger/detail',
  component: () => import('/@/views/po/danger/create.vue'),
  meta: { keepAlive: true },
};

export const PoFault: AppRouteRecordRaw = {
  path: '/frame/po/fault/index',
  component: () => import('/@/views/po/fault/index.vue'),
  meta: { keepAlive: true },
};

export const PoFaultCreate: AppRouteRecordRaw = {
  path: '/frame/po/fault/create',
  component: () => import('/@/views/po/fault/create.vue'),
  meta: { keepAlive: true },
};

export const PoFaultDetail: AppRouteRecordRaw = {
  path: '/frame/po/fault/detail',
  component: () => import('/@/views/po/fault/create.vue'),
  meta: { keepAlive: true },
};

export const PoWorkorder: AppRouteRecordRaw = {
  path: '/frame/po/workorder/index',
  component: () => import('/@/views/po/workorder/index.vue'),
  meta: { keepAlive: true },
};

export const PoWorkorderCreate: AppRouteRecordRaw = {
  path: '/frame/po/workorder/create',
  component: () => import('/@/views/po/workorder/create.vue'),
  meta: { keepAlive: true },
};

export const PoPowerCutPlan: AppRouteRecordRaw = {
  path: '/frame/po/powerCutPlan/index',
  component: () => import('/@/views/po/powercutplan/powerCutPlan.vue'),
  meta: { keepAlive: true },
};

export const PoPowerCutPlanCreate: AppRouteRecordRaw = {
  path: '/frame/po/powerCutPlan/create',
  component: () => import('/@/views/po/powercutplan/powerCutPlanModal.vue'),
  meta: { keepAlive: true },
};

export const PoPowerCutPlanDetail: AppRouteRecordRaw = {
  path: '/frame/po/powerCutPlan/detail',
  component: () => import('/@/views/po/powercutplan/powerCutPlanModal.vue'),
  meta: { keepAlive: true },
};

export const PoAssessTemplate: AppRouteRecordRaw = {
  path: '/frame/po/assess/template/index',
  component: () => import('/@/views/po/assess/template/index.vue'),
  meta: { keepAlive: true },
};

export const PoAssessTemplateCreate: AppRouteRecordRaw = {
  path: '/frame/po/assess/template/create',
  component: () => import('/@/views/po/assess/template/create.vue'),
  meta: { keepAlive: true },
};

export const PoAssessFilling: AppRouteRecordRaw = {
  path: '/frame/po/assess/filling/index',
  component: () => import('/@/views/po/assess/filling/index.vue'),
  meta: { keepAlive: true },
};

export const PoAssessFillingCreate: AppRouteRecordRaw = {
  path: '/frame/po/assess/filling/create',
  component: () => import('/@/views/po/assess/filling/create.vue'),
  meta: { keepAlive: true },
};

export const PoEquipment: AppRouteRecordRaw = {
  path: '/frame/po/equipment/index',
  component: () => import('/@/views/po/equipment/index.vue'),
  meta: { keepAlive: true },
};

export const PoEquipmentCreate: AppRouteRecordRaw = {
  path: '/frame/po/equipment/create',
  component: () => import('/@/views/po/equipment/create.vue'),
  meta: { keepAlive: true },
};

export const PoEquipmentDetail: AppRouteRecordRaw = {
  path: '/frame/po/equipment/detail',
  component: () => import('/@/views/po/equipment/detail.vue'),
  meta: { keepAlive: true },
};

export const PoEquipmentWarehousing: AppRouteRecordRaw = {
  path: '/frame/po/equipment/warehousing/index',
  component: () => import('/@/views/po/equipment/warehousing/index.vue'),
  meta: { keepAlive: true },
};

export const PoEquipmentWarehousingCreate: AppRouteRecordRaw = {
  path: '/frame/po/equipment/warehousing/create',
  component: () => import('/@/views/po/equipment/warehousing/create.vue'),
  meta: { keepAlive: true },
};

export const PoEquipmentWarehousingDetail: AppRouteRecordRaw = {
  path: '/frame/po/equipment/warehousing/detail',
  component: () => import('/@/views/po/equipment/warehousing/create.vue'),
  meta: { keepAlive: true },
};

export const PoEquipmentOutbound: AppRouteRecordRaw = {
  path: '/frame/po/equipment/outbound/index',
  component: () => import('/@/views/po/equipment/outbound/index.vue'),
  meta: { keepAlive: true },
};

export const PoEquipmentOutboundCreate: AppRouteRecordRaw = {
  path: '/frame/po/equipment/outbound/create',
  component: () => import('/@/views/po/equipment/outbound/create.vue'),
  meta: { keepAlive: true },
};

export const PoEquipmentOutboundDetail: AppRouteRecordRaw = {
  path: '/frame/po/equipment/outbound/detail',
  component: () => import('/@/views/po/equipment/outbound/create.vue'),
  meta: { keepAlive: true },
};

export const PoEquipmentInventory: AppRouteRecordRaw = {
  path: '/frame/po/equipment/inventory/index',
  component: () => import('/@/views/po/equipment/inventory/index.vue'),
  meta: { keepAlive: true },
};

export const PoEquipmentInventoryCreate: AppRouteRecordRaw = {
  path: '/frame/po/equipment/inventory/create',
  component: () => import('/@/views/po/equipment/inventory/create.vue'),
  meta: { keepAlive: true },
};

export const PoEquipmentInventoryDetail: AppRouteRecordRaw = {
  path: '/frame/po/equipment/inventory/detail',
  component: () => import('/@/views/po/equipment/inventory/create.vue'),
  meta: { keepAlive: true },
};

export const PoInPersoncertificate: AppRouteRecordRaw = {
  path: '/frame/po/integrated/personcertificate',
  component: () => import('/@/views/po/integrated/personcertificate/index.vue'),
  meta: { keepAlive: true },
};

export const PoInPersoncertificateCreate: AppRouteRecordRaw = {
  path: '/frame/po/integrated/personcertificate/create',
  component: () => import('/@/views/po/integrated/personcertificate/certificateDrawer.vue'),
  meta: { keepAlive: true },
};

export const PoIntegratedTraining: AppRouteRecordRaw = {
  path: '/frame/po/integrated/training',
  component: () => import('/@/views/po/integrated/training/index.vue'),
  meta: { keepAlive: true },
};

export const PoIntegratedTrainingCreate: AppRouteRecordRaw = {
  path: '/frame/po/integrated/training/create',
  component: () => import('/@/views/po/integrated/training/trainingCreate.vue'),
  meta: { keepAlive: true },
};

export const PoIntegratedInfoarchive: AppRouteRecordRaw = {
  path: '/frame/po/integrated/infoarchive',
  component: () => import('/@/views/po/integrated/infoarchive/index.vue'),
  meta: { keepAlive: true },
};

export const PoIntegratedInfoarchiveCreate: AppRouteRecordRaw = {
  path: '/frame/po/integrated/infoarchive/create',
  component: () => import('/@/views/po/integrated/infoarchive/infoarchiveCreate.vue'),
  meta: { keepAlive: true },
};

export const PoIntegratedVehicle: AppRouteRecordRaw = {
  path: '/frame/po/integrated/vehicle/index',
  component: () => import('/@/views/po/integrated/vehicle/index.vue'),
  meta: { keepAlive: true },
};

export const PoIntegratedVehicleCreate: AppRouteRecordRaw = {
  path: '/frame/po/integrated/vehicle/create',
  component: () => import('/@/views/po/integrated/vehicle/create.vue'),
  meta: { keepAlive: true },
};

export const PoIntegratedContract: AppRouteRecordRaw = {
  path: '/frame/po/integrated/contract',
  component: () => import('/@/views/po/integrated/contract/index.vue'),
  meta: { keepAlive: true },
};

export const PoIntegratedContractCreate: AppRouteRecordRaw = {
  path: '/frame/po/integrated/contract/create',
  component: () => import('/@/views/po/integrated/contract/contractModal.vue'),
  meta: { keepAlive: true },
};

export const PoIntegratedContractDetail: AppRouteRecordRaw = {
  path: '/frame/po/integrated/contract/detail',
  component: () => import('/@/views/po/integrated/contract/contractModal.vue'),
  meta: { keepAlive: true },
};

export const PoIntegratedKnowledge: AppRouteRecordRaw = {
  path: '/frame/po/integrated/knowledge',
  component: () => import('/@/views/po/integrated/knowledge/knowledge.vue'),
  meta: { keepAlive: true },
};

export const PoIntegratedKnowledgeCreate: AppRouteRecordRaw = {
  path: '/frame/po/integrated/knowledge/create',
  component: () => import('/@/views/po/integrated/knowledge/knowledgeDrawer.vue'),
  meta: { keepAlive: true },
};

export const PoIntegratedKnowledgeDetail: AppRouteRecordRaw = {
  path: '/frame/po/integrated/knowledge/detail',
  component: () => import('/@/views/po/integrated/knowledge/knowledgeDrawer.vue'),
  meta: { keepAlive: true },
};

export const PoAssessEvaluation: AppRouteRecordRaw = {
  path: '/frame/po/integrated/assessmentevaluation/index',
  component: () => import('/@/views/po/integrated/assessmentevaluation/index/index.vue'),
  meta: { keepAlive: true },
};

export const PoAssessEvaluationTemplate: AppRouteRecordRaw = {
  path: '/frame/po/integrated/assessmentevaluation/template',
  component: () => import('/@/views/po/integrated/assessmentevaluation/template/index.vue'),
  meta: { keepAlive: true },
};

export const PoAssessEvaluationTemplateCreate: AppRouteRecordRaw = {
  path: '/frame/po/integrated/assessmentevaluation/template/templateCreate',
  component: () =>
    import('/@/views/po/integrated/assessmentevaluation/template/templateCreate.vue'),
  meta: { keepAlive: true },
};

export const PoAssessEvaluationDaily: AppRouteRecordRaw = {
  path: '/frame/po/integrated/assessmentevaluation/daily',
  component: () => import('/@/views/po/integrated/assessmentevaluation/daily/index.vue'),
  meta: { keepAlive: true },
};

export const PoAssessEvaluationDailyCreate: AppRouteRecordRaw = {
  path: '/frame/po/integrated/assessmentevaluation/daily/create',
  component: () => import('/@/views/po/integrated/assessmentevaluation/daily/create.vue'),
  meta: { keepAlive: true },
};

export const PoAssessEvaluationMonthly: AppRouteRecordRaw = {
  path: '/frame/po/integrated/assessmentevaluation/monthly',
  component: () => import('/@/views/po/integrated/assessmentevaluation/monthly/index.vue'),
  meta: { keepAlive: true },
};

export const PoAssessEvaluationMonthlyCreate: AppRouteRecordRaw = {
  path: '/frame/po/integrated/assessmentevaluation/monthly/create',
  component: () => import('/@/views/po/integrated/assessmentevaluation/monthly/create.vue'),
  meta: { keepAlive: true },
};

export const PoAssessEvaluationMonthlyScoring: AppRouteRecordRaw = {
  path: '/frame/po/integrated/assessmentevaluation/monthly/scoring',
  component: () => import('/@/views/po/integrated/assessmentevaluation/monthly/scoring.vue'),
  meta: { keepAlive: true },
};

export const PoAssessEvaluationMonthlyStationDtl: AppRouteRecordRaw = {
  path: '/frame/po/integrated/assessmentevaluation/monthly/stationDtl',
  component: () => import('/@/views/po/integrated/assessmentevaluation/monthly/stationDtl.vue'),
  meta: { keepAlive: true },
};

export const PoAssessEvaluationReport: AppRouteRecordRaw = {
  path: '/frame/po/integrated/assessmentevaluation/report',
  component: () => import('/@/views/po/integrated/assessmentevaluation/report/index.vue'),
  meta: { keepAlive: true },
};

export const GroupOperation: AppRouteRecordRaw = {
  path: '/frame/groupOperation',
  component: () => import('/@/views/da/groupOperation/GroupOperation.vue'),
  meta: { keepAlive: true },
};

export const StationOperation: AppRouteRecordRaw = {
  path: '/frame/stationOperation',
  component: () => import('/@/views/da/stationOperation/StationOperation.vue'),
  meta: { keepAlive: true },
};

export const BiCapacityStatistics: AppRouteRecordRaw = {
  path: '/frame/bi/grid/capacity/statistics',
  component: () => import('/@/views/bi/elec/gridCapacity/index.vue'),
  meta: { keepAlive: true },
};

export const BiRecordStatistics: AppRouteRecordRaw = {
  path: '/frame/bi/grid/record/statistics',
  component: () => import('/@/views/bi/elec/gridRecord/index.vue'),
  meta: { keepAlive: true },
};

export const BiElecEnvironmental: AppRouteRecordRaw = {
  path: '/frame/bi/elec/environmental',
  component: () => import('/@/views/bi/elec/environmental/index.vue'),
  meta: { keepAlive: true },
};

export const BiElecLossPower: AppRouteRecordRaw = {
  path: '/frame/bi/elec/lossPower',
  component: () => import('/@/views/bi/elec/lossPower/index.vue'),
  meta: { keepAlive: true },
};

export const BiElecLossDetail: AppRouteRecordRaw = {
  path: '/frame/bi/elec/lossDetail',
  component: () => import('/@/views/bi/elec/lossDetail/index.vue'),
  meta: { keepAlive: true },
};

export const BiElecLossPlanned: AppRouteRecordRaw = {
  path: '/frame/bi/elec/planned',
  component: () => import('/@/views/bi/elec/planned/index.vue'),
  meta: { keepAlive: true },
};

export const BiElecLossSettlement: AppRouteRecordRaw = {
  path: '/frame/bi/elec/settlement',
  component: () => import('/@/views/bi/elec/settlement/index.vue'),
  meta: { keepAlive: true },
};

export const BiSafetyDisasterWarning: AppRouteRecordRaw = {
  path: '/frame/bi/safety/disasterWarning',
  component: () => import('/@/views/bi/safety/disasterwarning/index.vue'),
  meta: { keepAlive: true },
};

export const BiSafetyCheck: AppRouteRecordRaw = {
  path: '/frame/bi/safety/check',
  component: () => import('/@/views/bi/safety/check/index.vue'),
  meta: { keepAlive: true },
};

export const BiSafetyAgreement: AppRouteRecordRaw = {
  path: '/frame/bi/safety/agreement',
  component: () => import('/@/views/bi/safety/agreement/index.vue'),
  meta: { keepAlive: true },
};

export const BiSafetytoolsIndex: AppRouteRecordRaw = {
  path: '/frame/bi/safetytools/index',
  component: () => import('/@/views/bi/safetytools/index.vue'),
  meta: { keepAlive: true },
};

export const BiIntegratedVehicle: AppRouteRecordRaw = {
  path: '/frame/bi/integrated/vehicle',
  component: () => import('/@/views/bi/integrated/vehicle/index.vue'),
  meta: { keepAlive: true },
};

export const BiHiddenIndex: AppRouteRecordRaw = {
  path: '/frame/bi/hidden/index',
  component: () => import('/@/views/bi/hidden/index.vue'),
  meta: { keepAlive: true },
};

export const BiInspectionIndex: AppRouteRecordRaw = {
  path: '/frame/bi/inspection/index',
  component: () => import('/@/views/bi/inspection/index.vue'),
  meta: { keepAlive: true },
};

export const BiMaintenanceTicket: AppRouteRecordRaw = {
  path: '/frame/bi/maintenance/ticket',
  component: () => import('/@/views/bi/maintenance/ticket/index.vue'),
  meta: { keepAlive: true },
};

export const BiFaultIndex: AppRouteRecordRaw = {
  path: '/frame/bi/fault/index',
  component: () => import('/@/views/bi/fault/index.vue'),
  meta: { keepAlive: true },
};

export const BiMaintenanceWorkorder: AppRouteRecordRaw = {
  path: '/frame/bi/maintenance/workorder',
  component: () => import('/@/views/bi/maintenance/workorder/index.vue'),
  meta: { keepAlive: true },
};

export const BiMaintenancePowerCut: AppRouteRecordRaw = {
  path: '/frame/bi/maintenance/powerCut',
  component: () => import('/@/views/bi/maintenance/powercut/index.vue'),
  meta: { keepAlive: true },
};

export const BiMaintenanceAssess: AppRouteRecordRaw = {
  path: '/frame/bi/maintenance/assess',
  component: () => import('/@/views/bi/maintenance/assess/index.vue'),
  meta: { keepAlive: true },
};

export const BiEquipmentIndex: AppRouteRecordRaw = {
  path: '/frame/bi/equipment/index',
  component: () => import('/@/views/bi/equipment/index.vue'),
  meta: { keepAlive: true },
};

export const BiIntegratedPersonnelqualifications: AppRouteRecordRaw = {
  path: '/frame/bi/integrated/personnelQualifications',
  component: () => import('/@/views/bi/integrated/personnelqualifications/index.vue'),
  meta: { keepAlive: true },
};

export const BiIntegratedPersonnelStructure: AppRouteRecordRaw = {
  path: '/frame/bi/integrated/personnelStructure',
  component: () => import('/@/views/bi/integrated/personnelstructure/index.vue'),
  meta: { keepAlive: true },
};

export const BiIntegratedTrainingStatistics: AppRouteRecordRaw = {
  path: '/frame/bi/integrated/trainingStatistics',
  component: () => import('/@/views/bi/integrated/trainingstatistics/index.vue'),
  meta: { keepAlive: true },
};

export const BiOaAtt: AppRouteRecordRaw = {
  path: '/frame/bi/oa/att',
  component: () => import('/@/views/bi/oa/att/index.vue'),
  meta: { keepAlive: true },
};

export const BiPowerContrast: AppRouteRecordRaw = {
  path: '/frame/bi/elec/powerContrast',
  component: () => import('/@/views/bi/elec/powerContrast/index.vue'),
  meta: { keepAlive: true },
};

export const OaInfoInfoKind: AppRouteRecordRaw = {
  path: '/frame/oa/info/infoKind',
  component: () => import('/@/views/oa/info/infokind/infoKind.vue'),
  meta: { keepAlive: true },
};

export const OaInfoOfficedoc: AppRouteRecordRaw = {
  path: '/frame/oa/info/officedoc/index',
  component: () => import('/@/views/oa/info/officedoc/index.vue'),
  meta: { keepAlive: true },
};

export const OaInfoOfficedocCreate: AppRouteRecordRaw = {
  path: '/frame/oa/info/officedoc/create',
  component: () => import('/@/views/oa/info/officedoc/create.vue'),
  meta: { keepAlive: true },
};

export const OaInfoInfonoticeIndex: AppRouteRecordRaw = {
  path: '/frame/oa/info/infonotice/index',
  component: () => import('/@/views/oa/info/infonotice/index.vue'),
  meta: { keepAlive: true },
};

export const OaInfoInfonoticeCreate: AppRouteRecordRaw = {
  path: '/frame/oa/info/infonotice/create',
  component: () => import('/@/views/oa/info/infonotice/create.vue'),
  meta: { keepAlive: true },
};

export const OaInfoInformationIndex: AppRouteRecordRaw = {
  path: '/frame/oa/info/information/index',
  component: () => import('/@/views/oa/info/information/index.vue'),
  meta: { keepAlive: true },
};

export const OaInfoInformationCreate: AppRouteRecordRaw = {
  path: '/frame/oa/info/information/create',
  component: () => import('/@/views/oa/info/information/create.vue'),
  meta: { keepAlive: true },
};

export const OaInfoQueryIndex: AppRouteRecordRaw = {
  path: '/frame/oa/info/query/index',
  component: () => import('/@/views/oa/info/query/index.vue'),
  meta: { keepAlive: true },
};

export const OaAttendIndex: AppRouteRecordRaw = {
  path: '/frame/oa/attend/index',
  component: () => import('/@/views/oa/attend/index.vue'),
  meta: { keepAlive: true },
};

export const OaAttendCreate: AppRouteRecordRaw = {
  path: '/frame/oa/attend/create',
  component: () => import('/@/views/oa/attend/create.vue'),
  meta: { keepAlive: true },
};

export const OaAttendCalendar: AppRouteRecordRaw = {
  path: '/frame/oa/attend/calendar',
  component: () => import('/@/views/oa/attend/calendar.vue'),
  meta: { keepAlive: true },
};

export const OaAskreportIndex: AppRouteRecordRaw = {
  path: '/frame/oa/askreport',
  component: () => import('/@/views/oa/askreport/index.vue'),
  meta: { keepAlive: true },
};

export const OaAskreportDetail: AppRouteRecordRaw = {
  path: '/frame/oa/askreport/detail',
  component: () => import('/@/views/oa/askreport/detail.vue'),
  meta: { keepAlive: true },
};

export const OaAddressbook: AppRouteRecordRaw = {
  path: '/frame/oa/addressbook',
  component: () => import('/@/views/oa/addressbook/index.vue'),
  meta: { keepAlive: true },
};

export const OaWorkbench: AppRouteRecordRaw = {
  path: '/frame/workbench',
  component: () => import('/@/views/workbench/Workbench.vue'),
  meta: { keepAlive: true },
};

export const BpmWorkflow: AppRouteRecordRaw = {
  path: '/frame/bpm/manage/workflow',
  component: () => import('/@/views/bpm/manage/workflow/workflow.vue'),
  meta: { keepAlive: true },
};

export const DevPage: AppRouteRecordRaw = {
  path: '/frame/dev',
  component: () => import('/@/views/dev/dev.vue'),
  meta: { keepAlive: true },
};

export const FormDesignPage: AppRouteRecordRaw = {
  path: '/frame/formdesign',
  component: () => import('/@/views/dev/FormDesign.vue'),
  meta: { keepAlive: true },
};

export const FormBuildPage: AppRouteRecordRaw = {
  path: '/frame/formbuild',
  component: () => import('/@/views/dev/FormBuild.vue'),
  meta: { keepAlive: true },
};

export const EdittablePage: AppRouteRecordRaw = {
  path: '/frame/edittable',
  component: () => import('/@/views/dev/EditRowTable.vue'),
  meta: { keepAlive: true },
};

export const Meta2dRenderPage: AppRouteRecordRaw = {
  path: '/frame/monitor/wiringDiagram/meta2d',
  component: () => import('/@/views/monitor/wiringDiagram/meta2d.vue'),
  meta: { keepAlive: true },
};

export const BpmWftaskAssignRule: AppRouteRecordRaw = {
  path: '/frame/bpm/manage/wftaskAssignRule',
  component: () => import('/@/views/bpm/manage/taskAssignRule/index.vue'),
  meta: { keepAlive: true },
};

export const BpmWfdefinition: AppRouteRecordRaw = {
  path: '/frame/bpm/manage/wftaskDefinition',
  component: () => import('/@/views/bpm/manage/definition/index.vue'),
  meta: { keepAlive: true },
};

export const BpmWfprocessEditor: AppRouteRecordRaw = {
  path: '/frame/bpm/manage/wfeditor',
  component: () => import('/@/views/bpm/manage/workflow/processEditor.vue'),
  meta: { keepAlive: true },
};

export const BpmWfprocessInstance: AppRouteRecordRaw = {
  path: '/frame/bpm/task/processInstance',
  component: () => import('/@/views/bpm/manage/processInstance/index.vue'),
  meta: { keepAlive: true },
};

export const BpmWftaskTodo: AppRouteRecordRaw = {
  path: '/frame/bpm/task/todo',
  component: () => import('/@/views/bpm/manage/task/todo/index.vue'),
  meta: { keepAlive: true },
};

export const BpmWftaskDone: AppRouteRecordRaw = {
  path: '/frame/bpm/task/done',
  component: () => import('/@/views/bpm/manage/task/done/index.vue'),
  meta: { keepAlive: true },
};

export const BpmTaskCenter: AppRouteRecordRaw = {
  path: '/frame/bpm/task/taskCenter',
  component: () => import('/@/views/bpm/manage/task/taskCenter/index.vue'),
  meta: { keepAlive: true },
};

export const BpmTaskOperation: AppRouteRecordRaw = {
  path: '/frame/bpm/task/operation',
  component: () => import('/@/views/bpm/manage/task/operation/index.vue'),
  meta: { keepAlive: true },
};

export const BasesetMonitorAreaSet: AppRouteRecordRaw = {
  path: '/frame/baseset/monitor/area',
  component: () => import('/@/views/baseset/monitor/area/areaSet.vue'),
  meta: { keepAlive: true },
};

export const BasesetMonitorModelSet: AppRouteRecordRaw = {
  path: '/frame/baseset/monitor/model',
  component: () => import('/@/views/baseset/monitor/model/modelSet.vue'),
  meta: { keepAlive: true },
};

export const BasesetMonitorDeviceSet: AppRouteRecordRaw = {
  path: '/frame/baseset/monitor/device',
  component: () => import('/@/views/baseset/monitor/device/deviceSet.vue'),
  meta: { keepAlive: true },
};

export const BasesetMonitorDeviceInfoSet: AppRouteRecordRaw = {
  path: '/frame/baseset/monitor/deviceinfo',
  component: () => import('/@/views/baseset/monitor/deviceinfo/deviceInfoSet.vue'),
  meta: { keepAlive: true },
};

export const BasesetMonitorModelInfo: AppRouteRecordRaw = {
  path: '/frame/baseset/monitor/modelinfo/modelInfo',
  component: () => import('/@/views/baseset/monitor/modelinfo/modelInfo.vue'),
  meta: { keepAlive: true },
};

export const BasesetMonitorSunrise: AppRouteRecordRaw = {
  path: '/frame/baseset/monitor/sunrise',
  component: () => import('/@/views/baseset/monitor/sunrise/sunriseSet.vue'),
  meta: { keepAlive: true },
};

export const BasesetPowerstation: AppRouteRecordRaw = {
  path: '/frame/baseset/operation/powerstation',
  component: () => import('/@/views/baseset/operation/powerstation/index.vue'),
  meta: { keepAlive: true },
};

export const BasesetStationDrawer: AppRouteRecordRaw = {
  path: '/frame/baseset/operation/powerstation/create',
  component: () => import('/@/views/baseset/operation/powerstation/stationDrawer.vue'),
  meta: { keepAlive: true },
};

export const BasesetMaterial: AppRouteRecordRaw = {
  path: '/frame/baseset/operation/material',
  component: () => import('/@/views/baseset/operation/material/material.vue'),
  meta: { keepAlive: true },
};

export const BasesetRelatedParty: AppRouteRecordRaw = {
  path: '/frame/baseset/operation/relatedparty',
  component: () => import('/@/views/baseset/operation/relatedparty/relatedParty.vue'),
  meta: { keepAlive: true },
};

export const BasesetWarehouse: AppRouteRecordRaw = {
  path: '/frame/baseset/operation/warehouse',
  component: () => import('/@/views/baseset/operation/warehouse/warehouse.vue'),
  meta: { keepAlive: true },
};

export const BasesetAssessRule: AppRouteRecordRaw = {
  path: '/frame/baseset/operation/assessRule',
  component: () => import('/@/views/baseset/operation/assessrule/assessRule.vue'),
  meta: { keepAlive: true },
};

export const BasesetSafeCheckSet: AppRouteRecordRaw = {
  path: '/frame/baseset/operation/safeCheckSet',
  component: () => import('/@/views/baseset/operation/safecheck/safeCheckSet.vue'),
  meta: { keepAlive: true },
};

export const BasesetPersonnelqualifications: AppRouteRecordRaw = {
  path: '/frame/baseset/operation/personnelqualifications',
  component: () => import('/@/views/baseset/operation/personnelqualifications/index.vue'),
  meta: { keepAlive: true },
};

export const BasesetSettlement: AppRouteRecordRaw = {
  path: '/frame/baseset/operation/settlement',
  component: () => import('/@/views/baseset/operation/settlement/index.vue'),
  meta: { keepAlive: true },
};

export const BasesetLinelossrate: AppRouteRecordRaw = {
  path: '/frame/baseset/operation/linelossrate',
  component: () => import('/@/views/baseset/operation/linelossrate/lineLossRateSet.vue'),
  meta: { keepAlive: true },
};

export const SysParameter: AppRouteRecordRaw = {
  path: '/frame/system/configuration/parameter',
  component: () => import('/@/views/system/configuration/parameter/index.vue'),
  meta: { keepAlive: true },
};

export const SysOrgan: AppRouteRecordRaw = {
  path: '/frame/system/rbac/org/index',
  component: () => import('/@/views/system/rbac/org/index.vue'),
  meta: { keepAlive: true },
};

export const SysFunction: AppRouteRecordRaw = {
  path: '/frame/system/rbac/function/index',
  component: () => import('/@/views/system/rbac/function/index.vue'),
  meta: { keepAlive: true },
};

export const SysPermission: AppRouteRecordRaw = {
  path: '/frame/system/rbac/permission/index',
  component: () => import('/@/views/system/rbac/permission/index.vue'),
  meta: { keepAlive: true },
};

export const SystemDict: AppRouteRecordRaw = {
  path: '/frame/system/configuration/dict',
  component: () => import('/@/views/system/configuration/dict/index.vue'),
  meta: { keepAlive: true },
};

export const SysRole: AppRouteRecordRaw = {
  path: '/frame/system/rbac/role/index',
  component: () => import('/@/views/system/rbac/role/index.vue'),
  meta: { keepAlive: true },
};

export const OALeave: AppRouteRecordRaw = {
  path: '/frame/hr/manage/oaleave',
  component: () => import('/@/views/hr/manage/oaleave/index.vue'),
  meta: { keepAlive: true },
};

export const OALeaveCreate: AppRouteRecordRaw = {
  path: '/frame/hr/manage/OALeaveCreate',
  component: () => import('/@/views/hr/manage/oaleave/create.vue'),
  meta: { keepAlive: true },
};

export const OALeaveDetail: AppRouteRecordRaw = {
  path: '/frame/hr/manage/OALeaveCreate',
  component: () => import('/@/views/hr/manage/oaleave/create.vue'),
  meta: { keepAlive: true },
};

export const BasesetIndexStorehHouse: AppRouteRecordRaw = {
  path: '/frame/baseset/bi/indexstorehouse',
  component: () => import('/@/views/baseset/bi/indexstorehouse/index.vue'),
  meta: { keepAlive: true },
};

export const OAScheduleList: AppRouteRecordRaw = {
  path: '/frame/oa/schedule/index',
  component: () => import('/@/views/oa/schedule/index.vue'),
  meta: { keepAlive: true },
};

export const SysOrgType: AppRouteRecordRaw = {
  path: '/frame/system/configuration/orgType',
  component: () => import('/@/views/system/configuration/orgType/orgType.vue'),
  meta: { keepAlive: true },
};

export const BiReportFormPreview: AppRouteRecordRaw = {
  path: '/frame/bi/reportform/preview/index',
  component: () => import('/@/views/bi/reportform/preview/index.vue'),
  meta: { keepAlive: true },
};

export const BiReportForm: AppRouteRecordRaw = {
  path: '/frame/bi/reportform/index',
  component: () => import('/@/views/bi/reportform/index.vue'),
  meta: { keepAlive: true },
};

export const CodeBuildRule: AppRouteRecordRaw = {
  path: '/frame/system/configuration/codeBuildRule',
  component: () => import('/@/views/system/configuration/codeBuildRule/index.vue'),
  meta: { keepAlive: true },
};

export const BaseWiringDiagram: AppRouteRecordRaw = {
  path: '/frame/baseset/monitor/wiringdiagram/index',
  component: () => import('/@/views/baseset/monitor/wiringdiagram/wiringdiagram.vue'),
  meta: { keepAlive: true },
};

export const OaScheduleWorkMenu: AppRouteRecordRaw = {
  path: '/frame/oa/schedule/work/menu/index',
  component: () => import('/@/views/oa/schedule/work/menu/index.vue'),
  meta: { keepAlive: true },
};

export const OaScheduleWorkIndex: AppRouteRecordRaw = {
  path: '/frame/oa/schedule/work/schedule/index',
  component: () => import('/@/views/oa/schedule/work/schedule/index.vue'),
  meta: { keepAlive: true },
};

export const OaScheduleWorkCreate: AppRouteRecordRaw = {
  path: '/frame/oa/schedule/work/schedule/create',
  component: () => import('/@/views/oa/schedule/work/schedule/create.vue'),
  meta: { keepAlive: true },
};

export const OaScheduleWorkRecord: AppRouteRecordRaw = {
  path: '/frame/oa/schedule/work/record/index',
  component: () => import('/@/views/oa/schedule/work/record/index.vue'),
  meta: { keepAlive: true },
};

export const OaInfoOfficedocView: AppRouteRecordRaw = {
  path: '/frame/oa/info/officedoc/view',
  component: () => import('/@/views/oa/info/officedoc/view.vue'),
  meta: { keepAlive: true },
};

export const PoInspectionpause: AppRouteRecordRaw = {
  path: '/frame/po/inspection/inspectionpause',
  component: () => import('/@/views/po/inspection/inspectionpause/index.vue'),
  meta: { keepAlive: true },
};
export const PoInspectionpauseCreate: AppRouteRecordRaw = {
  path: '/frame/po/inspection/inspectionpause/create',
  component: () => import('/@/views/po/inspection/inspectionpause/create.vue'),
  meta: { keepAlive: true },
};
export const SystemUserProfile: AppRouteRecordRaw = {
  path: '/frame/system/rbac/org/userProfile',
  component: () => import('/@/views/system/rbac/org/userProfile.vue'),
  meta: { keepAlive: true },
};
export const DeviceEquipment: AppRouteRecordRaw = {
  path: '/frame/baseset/operation/deviceequipment',
  component: () => import('/@/views/baseset/operation/deviceequipment/index.vue'),
  meta: { keepAlive: true },
};
export const BaseEleWorkCardIndex: AppRouteRecordRaw = {
  path: '/frame/baseset/monitor/smartdevices/eleworkcard/index',
  component: () => import('/@/views/baseset/monitor/smartdevices/eleworkcard/index.vue'),
  meta: { keepAlive: true },
};

export const BaseEleWorkCardCreate: AppRouteRecordRaw = {
  path: '/frame/baseset/monitor/smartdevices/eleworkcard/create',
  component: () => import('/@/views/baseset/monitor/smartdevices/eleworkcard/detail.vue'),
  meta: { keepAlive: true },
};

export const BaseInspectionInstrumentCreate: AppRouteRecordRaw = {
  path: '/frame/baseset/monitor/smartdevices/inspectioninstrument/create',
  component: () => import('/@/views/baseset/monitor/smartdevices/inspectioninstrument/detail.vue'),
  meta: { keepAlive: true },
};

export const BaseInspectionInstrumentIndex: AppRouteRecordRaw = {
  path: '/frame/baseset/monitor/smartdevices/inspectioninstrument/index',
  component: () => import('/@/views/baseset/monitor/smartdevices/inspectioninstrument/index.vue'),
  meta: { keepAlive: true },
};

export const BaseDrivingRecorderCreate: AppRouteRecordRaw = {
  path: '/frame/baseset/monitor/smartdevices/drivingrecorder/create',
  component: () => import('/@/views/baseset/monitor/smartdevices/drivingrecorder/detail.vue'),
  meta: { keepAlive: true },
};

export const BaseDrivingRecorderIndex: AppRouteRecordRaw = {
  path: '/frame/baseset/monitor/smartdevices/drivingrecorder/index',
  component: () => import('/@/views/baseset/monitor/smartdevices/drivingrecorder/index.vue'),
  meta: { keepAlive: true },
};

export const MonitorSmartDeviceRealStatus: AppRouteRecordRaw = {
  path: '/frame/monitor/smartdevice/realstatus/index',
  component: () => import('/@/views/monitor/smartdevice/realstatus/index.vue'),
  meta: { keepAlive: true },
};

export const MonitorSmartDeviceMonitorInfo: AppRouteRecordRaw = {
  path: '/frame/monitor/smartdevice/monitorInfo/monitorInfo',
  component: () => import('/@/views/monitor/smartdevice/monitorInfo/monitorInfo.vue'),
  meta: { keepAlive: false },
};

export const MonitorSmartDeviceVideo: AppRouteRecordRaw = {
  path: '/frame/monitor/smartdevice/video/index',
  component: () => import('/@/views/monitor/smartdevice/video/index.vue'),
  meta: { keepAlive: false },
};

export const MonitorSmartDeviceVideoHistory: AppRouteRecordRaw = {
  path: '/frame/monitor/smartdevice/video/history',
  component: () => import('/@/views/monitor/smartdevice/video/history.vue'),
  meta: { keepAlive: false },
};

export const SysAuthInfo: AppRouteRecordRaw = {
  path: '/frame/system/rbac/authinfo/index',
  component: () => import('/@/views/system/rbac/authinfo/index.vue'),
  meta: { keepAlive: true },
};

// 暴露基础路由
export const basicRoutes = [
  SysAuthInfo,
  MonitorSmartDeviceVideo,
  MonitorSmartDeviceVideoHistory,
  MonitorSmartDeviceRealStatus,
  MonitorSmartDeviceMonitorInfo,
  BaseEleWorkCardIndex,
  BaseEleWorkCardCreate,
  BaseInspectionInstrumentIndex,
  BaseInspectionInstrumentCreate,
  BaseDrivingRecorderIndex,
  BaseDrivingRecorderCreate,
  DeviceEquipment,
  PoInspectionpause,
  PoInspectionpauseCreate,
  OaInfoOfficedocView,
  OaScheduleWorkRecord,
  OaScheduleWorkCreate,
  OaScheduleWorkIndex,
  OaScheduleWorkMenu,
  BaseWiringDiagram,
  CodeBuildRule,
  BiReportForm,
  BiReportFormPreview,
  SysOrgType,
  OAScheduleList,
  BasesetIndexStorehHouse,
  OALeave,
  OALeaveCreate,
  OALeaveDetail,
  SysRole,
  SystemDict,
  SysPermission,
  SysFunction,
  SysOrgan,
  SysParameter,
  LoginRoute,
  CachePage,
  CockpitOverviewRoute,
  CockpitOperationRoute,
  CockpitPropertyRoute,
  CockpitSecurityRoute,
  CockpitCompositionRoute,
  CockpitPowerRoute,
  RootRoute,
  ...mainOutRoutes,
  REDIRECT_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
  GroupOperationRoute,
  StationOperationRoute,
  Frame,
  FramePage,
  FrameWorkbench,
  PvSubareaOverview,
  PvInverterOverview,
  PvTransformerSubstationOverview,
  PvGroupSeriesOverview,
  PvBoosterStationOverview,
  PvFaultWarning,
  PvEnergyStorage,
  PvAreaRealTimeAnalysis,
  PvInverterRealTimeAnalysis,
  PvDispersionRatioRealTimeAnalysis,
  PvDispersionRatioRealTimeAnalysis,
  PvGroupSeriesRealTimeAnalysis,
  PoElecProduceIndex,
  PoElecProduceDayReportCreate,
  PoElecProduceWeekReportCreate,
  PoElecProduceMonthReportCreate,
  PoElecProduceYearReportCreate,
  PoElecSettlementElectricity,
  PoElecSettlementElecModal,
  PoElecSettlementElecSetElecDetail,
  PoPlannedElectricity,
  PoPlannedElecCreate,
  PoPlannedElecDetail,
  PoSafechecktemplate,
  PoSafechecktemplateCreateOrUpdate,
  PoSafecheckissue,
  PoSafecheckissueCreateOrUpdate,
  PoSafecheckexecutionCheckType1,
  PoSafecheckexecutionCreateCheckType1,
  PoSafecheckexecutionCheckType2,
  PoSafecheckexecutionCreateCheckType2,
  PoSafecheckexecution,
  PoSafecheckexecutionCreate,
  PoVehicleexecution,
  PoVehicleexecutionCreate,
  PoSafetyFiles,
  PoSafetyFilesCreate,
  PoSafetyFilesDetail,
  PoEmergencydrill,
  PoEmergencydrillCreate,
  PoEmergencydrillDetail,
  PoSafetyAccident,
  PoSafetyAccidentCreate,
  PoSafetyAccidentDetail,
  PoSafetytoolsscrap,
  PoSafetytoolsscrapCreate,
  PoSafetytoolscheck,
  PoSafetytoolscheckCreate,
  PoSafetytools,
  PoSafetytoolsCreate,
  PoSafetyRespAgreement,
  PoSafetyRespAgreementCreate,
  PoSafetyRespAgreementDetail,
  PoOperationticket,
  PoOperationticketCreate,
  PoFirstworkticket,
  PoFirstworkticketCreate,
  PoSecondworkticket,
  PoSecondworkticketCreate,
  PoInspectionplan,
  PoInspectionplanCreate,
  PoInspectionexecution,
  PoInspectionexecutionCreate,
  PoSupervision,
  PoSupervisionCreate,
  PoSupervisionDetail,
  PoDanger,
  PoDangerCreate,
  PoDangerDetail,
  PoFault,
  PoFaultCreate,
  PoFaultDetail,
  PoWorkorder,
  PoWorkorderCreate,
  PoPowerCutPlan,
  PoPowerCutPlanCreate,
  PoPowerCutPlanDetail,
  PoAssessTemplate,
  PoAssessTemplateCreate,
  PoAssessFilling,
  PoAssessFillingCreate,
  PoEquipment,
  PoEquipmentCreate,
  PoEquipmentWarehousing,
  PoEquipmentWarehousingCreate,
  PoEquipmentOutbound,
  PoEquipmentOutboundCreate,
  PoEquipmentOutboundDetail,
  PoEquipmentInventory,
  PoEquipmentInventoryCreate,
  PoEquipmentInventoryDetail,
  PoInPersoncertificate,
  PoInPersoncertificateCreate,
  PoIntegratedTraining,
  PoIntegratedTrainingCreate,
  PoIntegratedInfoarchive,
  PoIntegratedInfoarchiveCreate,
  PoIntegratedVehicle,
  PoIntegratedVehicleCreate,
  PoIntegratedContract,
  PoIntegratedContractCreate,
  PoIntegratedContractDetail,
  PoIntegratedKnowledge,
  PoIntegratedKnowledgeCreate,
  PoIntegratedKnowledgeDetail,
  PoAssessEvaluation,
  PoAssessEvaluationTemplate,
  PoAssessEvaluationTemplateCreate,
  PoAssessEvaluationDaily,
  PoAssessEvaluationDailyCreate,
  PoAssessEvaluationMonthly,
  PoAssessEvaluationMonthlyCreate,
  PoAssessEvaluationMonthlyScoring,
  PoAssessEvaluationMonthlyStationDtl,
  PoAssessEvaluationReport,
  GroupOperation,
  StationOperation,
  BiCapacityStatistics,
  BiRecordStatistics,
  BiElecEnvironmental,
  BiElecLossPower,
  BiElecLossDetail,
  BiElecLossPlanned,
  BiElecLossSettlement,
  BiSafetyDisasterWarning,
  BiSafetyCheck,
  BiSafetyAgreement,
  BiSafetytoolsIndex,
  BiIntegratedVehicle,
  BiHiddenIndex,
  BiInspectionIndex,
  BiMaintenanceTicket,
  BiFaultIndex,
  BiMaintenanceWorkorder,
  BiMaintenancePowerCut,
  BiMaintenanceAssess,
  BiEquipmentIndex,
  BiIntegratedPersonnelqualifications,
  BiIntegratedPersonnelStructure,
  BiIntegratedTrainingStatistics,
  BiOaAtt,
  BiPowerContrast,
  OaInfoInfoKind,
  OaInfoOfficedoc,
  OaInfoOfficedocCreate,
  OaInfoInfonoticeIndex,
  OaInfoInfonoticeCreate,
  OaInfoInformationIndex,
  OaInfoInformationCreate,
  OaInfoQueryIndex,
  OaAttendIndex,
  OaAttendCreate,
  OaAttendCalendar,
  OaAskreportIndex,
  OaAskreportDetail,
  OaAddressbook,
  OaWorkbench,
  DevPage,
  FormDesignPage,
  FormBuildPage,
  EdittablePage,
  Meta2dRenderPage,
  BpmWorkflow,
  BpmWftaskAssignRule,
  BpmWfdefinition,
  BpmWfprocessEditor,
  BpmWfprocessInstance,
  BpmWftaskTodo,
  BpmWftaskDone,
  BpmTaskCenter,
  BpmTaskOperation,
  BasesetMonitorAreaSet,
  BasesetMonitorModelSet,
  BasesetMonitorDeviceSet,
  BasesetMonitorDeviceInfoSet,
  BasesetMonitorModelInfo,
  BasesetMonitorSunrise,
  BasesetPowerstation,
  BasesetStationDrawer,
  BasesetMaterial,
  BasesetRelatedParty,
  BasesetWarehouse,
  BasesetAssessRule,
  BasesetSafeCheckSet,
  BasesetPersonnelqualifications,
  BasesetSettlement,
  BasesetLinelossrate,
  SystemUserProfile,
];
