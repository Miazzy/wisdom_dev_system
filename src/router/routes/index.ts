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
  path: '/framepage/cockpit/overview',
  name: 'CockpitOverview',
  component: () => import('/@/views/da/cockpit/overview/Overview.vue'),
};

// 运维驾驶舱路由
export const CockpitOperationRoute: AppRouteRecordRaw = {
  path: '/framepage/cockpit/operation',
  component: () => import('/@/views/da/cockpit/operation/Operation.vue'),
};

// 资产驾驶舱路由
export const CockpitPropertyRoute: AppRouteRecordRaw = {
  path: '/framepage/cockpit/property',
  component: () => import('/@/views/da/cockpit/property/Property.vue'),
};

// 安全驾驶舱路由
export const CockpitSecurityRoute: AppRouteRecordRaw = {
  path: '/framepage/cockpit/security',
  component: () => import('/@/views/da/cockpit/security/Security.vue'),
};

// 综合驾驶舱路由
export const CockpitCompositionRoute: AppRouteRecordRaw = {
  path: '/framepage/cockpit/composition',
  component: () => import('/@/views/da/cockpit/composition/Composition.vue'),
};

// 安全驾驶舱路由
export const CockpitPowerRoute: AppRouteRecordRaw = {
  path: '/framepage/cockpit/power',
  component: () => import('/@/views/da/cockpit/power/Power.vue'),
};

// 集团运营大屏
export const GroupOperationRoute: AppRouteRecordRaw = {
  path: '/groupOperation',
  name: 'GroupOperation',
  component: () => import('/@/views/da/groupOperation/GroupOperation.vue'),
  meta: {
    title: '集团运营',
  },
};
// 电站运营大屏
export const StationOperationRoute: AppRouteRecordRaw = {
  path: '/stationOperation',
  name: 'StationOperation',
  component: () => import('/@/views/da/stationOperation/StationOperation.vue'),
  meta: {
    title: '电站运营',
  },
};

// 电站运营大屏
export const FrameWorkbench: AppRouteRecordRaw = {
  path: '/frame/workbench',
  name: 'FrameWorkbench',
  component: () => import('/@/views/workbench/Workbench.vue'),
  meta: {
    title: '工作台',
  },
};

// 框架页面
export const FramePage: AppRouteRecordRaw = {
  path: '/framepage',
  name: 'FramePage',
  component: () => import('/@/layouts/frame/MainLayout.vue'),
  meta: {
    title: '工作台',
  },
};

export const PvSubareaOverview: AppRouteRecordRaw = {
  path: '/framepage/monitor/pvarea/subareaoverview',
  component: () => import('/@/views/monitor/PVArea/subareaOverview/subareaOverview.vue'),
};

export const PvInverterOverview: AppRouteRecordRaw = {
  path: '/framepage/monitor/PVArea/inverterOverview',
  component: () => import('/@/views/monitor/PVArea/inverterOverview/inverterOverview.vue'),
};

export const PvTransformerSubstationOverview: AppRouteRecordRaw = {
  path: '/framepage/monitor/PVArea/boxTransformerSubstationOverview',
  component: () =>
    import(
      '/@/views/monitor/PVArea/boxTransformerSubstationOverview/boxTransformerSubstationOverview.vue'
    ),
};

export const PvGroupSeriesOverview: AppRouteRecordRaw = {
  path: '/framepage/monitor/PVArea/groupSeriesOverview',
  component: () => import('/@/views/monitor/PVArea/groupSeriesOverview/groupSeriesOverview.vue'),
};

export const PvBoosterStationOverview: AppRouteRecordRaw = {
  path: '/framepage/monitor/boosterStation/boosterStationOverview',
  component: () =>
    import('/@/views/monitor/boosterStation/boosterStationOverview/boosterStationOverview.vue'),
};

export const PvFaultWarning: AppRouteRecordRaw = {
  path: '/framepage/monitor/faultWarning',
  component: () => import('/@/views/monitor/faultWarning/faultWarning.vue'),
};

export const PvEnergyStorage: AppRouteRecordRaw = {
  path: '/framepage/monitor/energyStorage',
  component: () => import('/@/views/monitor/energyStorage/energyStorageMonitor.vue'),
};

export const PvAreaRealTimeAnalysis: AppRouteRecordRaw = {
  path: '/framepage/monitor/realTimeAnalysis/areaRealTimeAnalysis',
  component: () => import('/@/views/monitor/realTimeAnalysis/areaRealTimeAnalysis.vue'),
};

export const PvInverterRealTimeAnalysis: AppRouteRecordRaw = {
  path: '/framepage/monitor/realTimeAnalysis/inverterRealTimeAnalysis',
  component: () => import('/@/views/monitor/realTimeAnalysis/inverterRealTimeAnalysis.vue'),
};

export const PvDispersionRatioRealTimeAnalysis: AppRouteRecordRaw = {
  path: '/framepage/monitor/realTimeAnalysis/dispersionRatioRealTimeAnalysis',
  component: () => import('/@/views/monitor/realTimeAnalysis/dispersionRatioRealTimeAnalysis.vue'),
};

export const PvGroupSeriesRealTimeAnalysis: AppRouteRecordRaw = {
  path: '/framepage/monitor/realTimeAnalysis/groupSeriesRealTimeAnalysis',
  component: () => import('/@/views/monitor/realTimeAnalysis/groupSeriesRealTimeAnalysis.vue'),
};

export const PoElecProduceIndex: AppRouteRecordRaw = {
  path: '/framepage/po/elec/produce/index',
  component: () => import('/@/views/po/elec/produce/index.vue'),
};

export const PoElecProduceDayReportCreate: AppRouteRecordRaw = {
  path: '/framepage/po/elec/produce/dayReportCreate',
  component: () => import('/@/views/po/elec/produce/dayReportCreate.vue'),
};

export const PoElecProduceWeekReportCreate: AppRouteRecordRaw = {
  path: '/framepage/po/elec/produce/weekReportCreate',
  component: () => import('/@/views/po/elec/produce/weekReportCreate.vue'),
};

export const PoElecProduceMonthReportCreate: AppRouteRecordRaw = {
  path: '/framepage/po/elec/produce/monthReportCreate',
  component: () => import('/@/views/po/elec/produce/monthReportCreate.vue'),
};

export const PoElecProduceYearReportCreate: AppRouteRecordRaw = {
  path: '/framepage/po/elec/produce/yearReportCreate',
  component: () => import('/@/views/po/elec/produce/yearReportCreate.vue'),
};

export const PoElecSettlementElectricity: AppRouteRecordRaw = {
  path: '/framepage/po/elec/settlementelec/settlementElectricity',
  component: () => import('/@/views/po/elec/settlementelec/settlementElectricity.vue'),
};

export const PoElecSettlementElecModal: AppRouteRecordRaw = {
  path: '/framepage/po/elec/settlementelec/setElecCreate',
  component: () => import('/@/views/po/elec/settlementelec/settlemenElecModal.vue'),
};

export const PoElecSettlementElecSetElecDetail: AppRouteRecordRaw = {
  path: '/framepage/po/elec/settlementelec/setElecDetail',
  component: () => import('/@/views/po/elec/settlementelec/settlemenElecModal.vue'),
};

export const PoPlannedElectricity: AppRouteRecordRaw = {
  path: '/framepage/po/elec/settlementelec/plannedElectricity',
  component: () => import('/@/views/po/elec/plannedelectricity/plannedElectricity.vue'),
};

export const PoPlannedElecCreate: AppRouteRecordRaw = {
  path: '/framepage/po/elec/plannedelec/plannedElecCreate',
  component: () => import('/@/views/po/elec/plannedelectricity/plannedElecModal.vue'),
};

export const PoPlannedElecDetail: AppRouteRecordRaw = {
  path: '/framepage/po/elec/plannedelec/plannedElecDetail',
  component: () => import('/@/views/po/elec/plannedelectricity/plannedElecModal.vue'),
};

export const PoSafechecktemplate: AppRouteRecordRaw = {
  path: '/framepage/po/safety/safechecktemplate',
  component: () => import('/@/views/po/safety/safechecktemplate/index.vue'),
};

export const PoSafechecktemplateCreateOrUpdate: AppRouteRecordRaw = {
  path: '/framepage/po/safety/safechecktemplate/create',
  component: () => import('/@/views/po/safety/safechecktemplate/createOrUpdate.vue'),
};

export const PoSafecheckissue: AppRouteRecordRaw = {
  path: '/framepage/po/safety/safecheckissue',
  component: () => import('/@/views/po/safety/safecheckissue/index.vue'),
};

export const PoSafecheckissueCreateOrUpdate: AppRouteRecordRaw = {
  path: '/framepage/po/safety/safecheckissue/create',
  component: () => import('/@/views/po/safety/safecheckissue/createOrUpdate.vue'),
};

export const PoSafecheckexecutionCheckType1: AppRouteRecordRaw = {
  path: '/framepage/po/safety/safecheckexecution/checkType__1',
  component: () => import('/@/views/po/safety/safecheckexecution/index.vue'),
};

export const PoSafecheckexecutionCreateCheckType1: AppRouteRecordRaw = {
  path: '/framepage/po/safety/safecheckexecution/create/checkType__1',
  component: () => import('/@/views/po/safety/safecheckexecution/createOrUpdate.vue'),
};

export const PoSafecheckexecutionCheckType2: AppRouteRecordRaw = {
  path: '/framepage/po/safety/safecheckexecution/checkType__2',
  component: () => import('/@/views/po/safety/safecheckexecution/index.vue'),
};

export const PoSafecheckexecutionCreateCheckType2: AppRouteRecordRaw = {
  path: '/framepage/po/safety/safecheckexecution/create/checkType__2',
  component: () => import('/@/views/po/safety/safecheckexecution/createOrUpdate.vue'),
};

export const PoVehicleexecution: AppRouteRecordRaw = {
  path: '/framepage/po/safety/vehicleexecution',
  component: () => import('/@/views/po/safety/vehicleexecution/index.vue'),
};

export const PoVehicleexecutionCreate: AppRouteRecordRaw = {
  path: '/framepage/po/safety/vehicleexecution/create',
  component: () => import('/@/views/po/safety/vehicleexecution/createOrUpdate.vue'),
};

export const PoSafetyFiles: AppRouteRecordRaw = {
  path: '/framepage/po/safety/safetyFiles',
  component: () => import('/@/views/po/safety/safetyfiles/index.vue'),
};

export const PoSafetyFilesCreate: AppRouteRecordRaw = {
  path: '/framepage/po/safety/safetyfiles/create',
  component: () => import('/@/views/po/safety/safetyfiles/SafetyFilesModal.vue'),
};

export const PoSafetyFilesDetail: AppRouteRecordRaw = {
  path: '/framepage/po/safety/safetyfiles/detail',
  component: () => import('/@/views/po/safety/safetyfiles/SafetyFilesModal.vue'),
};

export const PoEmergencydrill: AppRouteRecordRaw = {
  path: '/framepage/po/safety/emergencydrill',
  component: () => import('/@/views/po/safety/emergencydrill/index.vue'),
};

export const PoEmergencydrillCreate: AppRouteRecordRaw = {
  path: '/framepage/po/safety/emergencydrill/create',
  component: () => import('/@/views/po/safety/emergencydrill/emergencyDrillModal.vue'),
};

export const PoEmergencydrillDetail: AppRouteRecordRaw = {
  path: '/framepage/po/safety/emergencydrill/detail',
  component: () => import('/@/views/po/safety/emergencydrill/emergencyDrillModal.vue'),
};

export const PoSafetyAccident: AppRouteRecordRaw = {
  path: '/framepage/po/safetyAccident',
  component: () => import('/@/views/po/safety/safetyaccident/index.vue'),
};

export const PoSafetyAccidentCreate: AppRouteRecordRaw = {
  path: '/framepage/po/safetyAccident/create',
  component: () => import('/@/views/po/safety/safetyaccident/safetyAccidentModal.vue'),
};

export const PoSafetyAccidentDetail: AppRouteRecordRaw = {
  path: '/framepage/po/safetyAccident/detail',
  component: () => import('/@/views/po/safety/safetyaccident/safetyAccidentModal.vue'),
};

export const PoSafetytoolsscrap: AppRouteRecordRaw = {
  path: '/framepage/po/safetytools/safetytoolsscrap',
  component: () => import('/@/views/po/safetytools/safetytoolsscrap/index.vue'),
};

export const PoSafetytoolsscrapCreate: AppRouteRecordRaw = {
  path: '/framepage/po/safetytools/safetytoolsscrap/create',
  component: () => import('/@/views/po/safetytools/safetytoolsscrap/create.vue'),
};

export const PoSafetytoolscheck: AppRouteRecordRaw = {
  path: '/framepage/po/safetytools/safetytoolscheck',
  component: () => import('/@/views/po/safetytools/safetytoolscheck/index.vue'),
};

export const PoSafetytoolscheckCreate: AppRouteRecordRaw = {
  path: '/framepage/po/safetytools/safetytoolscheck/create',
  component: () => import('/@/views/po/safetytools/safetytoolscheck/create.vue'),
};

export const PoSafetytools: AppRouteRecordRaw = {
  path: '/framepage/po/safetytools/safetytools',
  component: () => import('/@/views/po/safetytools/safetytools/index.vue'),
};

export const PoSafetytoolsCreate: AppRouteRecordRaw = {
  path: '/framepage/po/safetytools/safetytools/create',
  component: () => import('/@/views/po/safetytools/safetytools/create.vue'),
};

export const PoSafetyRespAgreement: AppRouteRecordRaw = {
  path: '/framepage/po/safetyRespAgreement',
  component: () => import('/@/views/po/safety/safetyrespagreement/index.vue'),
};

export const PoSafetyRespAgreementCreate: AppRouteRecordRaw = {
  path: '/framepage/po/safetyRespAgreement/create',
  component: () => import('/@/views/po/safety/safetyrespagreement/safetyRespAgreementModal.vue'),
};

export const PoSafetyRespAgreementDetail: AppRouteRecordRaw = {
  path: '/framepage/po/safetyRespAgreement/detail',
  component: () => import('/@/views/po/safety/safetyrespagreement/safetyRespAgreementModal.vue'),
};

export const PoOperationticket: AppRouteRecordRaw = {
  path: '/framepage/po/ticket/operationticket/index',
  component: () => import('/@/views/po/ticket/operationticket/index.vue'),
};

export const PoOperationticketCreate: AppRouteRecordRaw = {
  path: '/framepage/po/ticket/operationticket/create',
  component: () => import('/@/views/po/ticket/operationticket/create.vue'),
};

export const PoFirstworkticket: AppRouteRecordRaw = {
  path: '/framepage/po/ticket/firstworkticket/index',
  component: () => import('/@/views/po/ticket/firstworkticket/index.vue'),
};

export const PoFirstworkticketCreate: AppRouteRecordRaw = {
  path: '/framepage/po/ticket/firstworkticket/create',
  component: () => import('/@/views/po/ticket/firstworkticket/create.vue'),
};

export const PoSecondworkticket: AppRouteRecordRaw = {
  path: '/framepage/po/ticket/secondworkticket/index',
  component: () => import('/@/views/po/ticket/secondworkticket/index.vue'),
};

export const PoSecondworkticketCreate: AppRouteRecordRaw = {
  path: '/framepage/po/ticket/secondworkticket/create',
  component: () => import('/@/views/po/ticket/secondworkticket/create.vue'),
};

export const PoInspectionplan: AppRouteRecordRaw = {
  path: '/framepage/po/inspection/inspectionplan',
  component: () => import('/@/views/po/inspection/inspectionplan/index.vue'),
};

export const PoInspectionplanCreate: AppRouteRecordRaw = {
  path: '/framepage/po/inspection/inspectionplan/create',
  component: () => import('/@/views/po/inspection/inspectionplan/create.vue'),
};

export const PoInspectionexecution: AppRouteRecordRaw = {
  path: '/framepage/po/inspection/inspectionexecution',
  component: () => import('/@/views/po/inspection/inspectionexecution/index.vue'),
};

export const PoInspectionexecutionCreate: AppRouteRecordRaw = {
  path: '/framepage/po/inspection/inspectionexecution/create',
  component: () => import('/@/views/po/inspection/inspectionexecution/create.vue'),
};

export const PoSupervision: AppRouteRecordRaw = {
  path: '/framepage/po/supervision/index',
  component: () => import('/@/views/po/supervision/index.vue'),
};

export const PoSupervisionCreate: AppRouteRecordRaw = {
  path: '/framepage/po/supervision/create',
  component: () => import('/@/views/po/supervision/create.vue'),
};

export const PoSupervisionDetail: AppRouteRecordRaw = {
  path: '/framepage/po/supervision/detail',
  component: () => import('/@/views/po/supervision/create.vue'),
};

export const PoDanger: AppRouteRecordRaw = {
  path: '/framepage/po/danger/index',
  component: () => import('/@/views/po/danger/index.vue'),
};

export const PoDangerCreate: AppRouteRecordRaw = {
  path: '/framepage/po/danger/create',
  component: () => import('/@/views/po/danger/create.vue'),
};

export const PoDangerDetail: AppRouteRecordRaw = {
  path: '/framepage/po/danger/detail',
  component: () => import('/@/views/po/danger/create.vue'),
};

export const PoFault: AppRouteRecordRaw = {
  path: '/framepage/po/fault/index',
  component: () => import('/@/views/po/fault/index.vue'),
};

export const PoFaultCreate: AppRouteRecordRaw = {
  path: '/framepage/po/fault/create',
  component: () => import('/@/views/po/fault/create.vue'),
};

export const PoFaultDetail: AppRouteRecordRaw = {
  path: '/framepage/po/fault/detail',
  component: () => import('/@/views/po/fault/create.vue'),
};

export const PoWorkorder: AppRouteRecordRaw = {
  path: '/framepage/po/workorder/index',
  component: () => import('/@/views/po/workorder/index.vue'),
};

export const PoWorkorderCreate: AppRouteRecordRaw = {
  path: '/framepage/po/workorder/create',
  component: () => import('/@/views/po/workorder/create.vue'),
};

export const PoPowerCutPlan: AppRouteRecordRaw = {
  path: '/framepage/po/powerCutPlan/index',
  component: () => import('/@/views/po/powercutplan/powerCutPlan.vue'),
};

export const PoPowerCutPlanCreate: AppRouteRecordRaw = {
  path: '/framepage/po/powerCutPlan/create',
  component: () => import('/@/views/po/powercutplan/powerCutPlanModal.vue'),
};

export const PoPowerCutPlanDetail: AppRouteRecordRaw = {
  path: '/framepage/po/powerCutPlan/detail',
  component: () => import('/@/views/po/powercutplan/powerCutPlanModal.vue'),
};

export const PoAssessTemplate: AppRouteRecordRaw = {
  path: '/framepage/po/assess/template/index',
  component: () => import('/@/views/po/assess/template/index.vue'),
};

export const PoAssessTemplateCreate: AppRouteRecordRaw = {
  path: '/framepage/po/assess/template/create',
  component: () => import('/@/views/po/assess/template/create.vue'),
};

export const PoAssessFilling: AppRouteRecordRaw = {
  path: '/framepage/po/assess/filling/index',
  component: () => import('/@/views/po/assess/template/index.vue'),
};

export const PoAssessFillingCreate: AppRouteRecordRaw = {
  path: '/framepage/po/assess/filling/create',
  component: () => import('/@/views/po/assess/template/create.vue'),
};

export const PoEquipment: AppRouteRecordRaw = {
  path: '/framepage/po/equipment/index',
  component: () => import('/@/views/po/equipment/index.vue'),
};

export const PoEquipmentCreate: AppRouteRecordRaw = {
  path: '/framepage/po/equipment/create',
  component: () => import('/@/views/po/equipment/create.vue'),
};

export const PoEquipmentDetail: AppRouteRecordRaw = {
  path: '/framepage/po/equipment/detail',
  component: () => import('/@/views/po/equipment/detail.vue'),
};

export const PoEquipmentWarehousing: AppRouteRecordRaw = {
  path: '/framepage/po/equipment/warehousing/index',
  component: () => import('/@/views/po/equipment/warehousing/index.vue'),
};

export const PoEquipmentWarehousingCreate: AppRouteRecordRaw = {
  path: '/framepage/po/equipment/warehousing/create',
  component: () => import('/@/views/po/equipment/warehousing/create.vue'),
};

export const PoEquipmentWarehousingDetail: AppRouteRecordRaw = {
  path: '/framepage/po/equipment/warehousing/detail',
  component: () => import('/@/views/po/equipment/warehousing/create.vue'),
};

export const PoEquipmentOutbound: AppRouteRecordRaw = {
  path: '/framepage/po/equipment/outbound/index',
  component: () => import('/@/views/po/equipment/outbound/index.vue'),
};

export const PoEquipmentOutboundCreate: AppRouteRecordRaw = {
  path: '/framepage/po/equipment/outbound/create',
  component: () => import('/@/views/po/equipment/outbound/create.vue'),
};

export const PoEquipmentOutboundDetail: AppRouteRecordRaw = {
  path: '/framepage/po/equipment/outbound/detail',
  component: () => import('/@/views/po/equipment/outbound/create.vue'),
};

export const PoEquipmentInventory: AppRouteRecordRaw = {
  path: '/framepage/po/equipment/inventory/index',
  component: () => import('/@/views/po/equipment/inventory/index.vue'),
};

export const PoEquipmentInventoryCreate: AppRouteRecordRaw = {
  path: '/framepage/po/equipment/inventory/create',
  component: () => import('/@/views/po/equipment/inventory/create.vue'),
};

export const PoEquipmentInventoryDetail: AppRouteRecordRaw = {
  path: '/framepage/po/equipment/inventory/detail',
  component: () => import('/@/views/po/equipment/inventory/create.vue'),
};

export const PoInPersoncertificate: AppRouteRecordRaw = {
  path: '/framepage/po/integrated/personcertificate',
  component: () => import('/@/views/po/integrated/personcertificate/index.vue'),
};

export const PoInPersoncertificateCreate: AppRouteRecordRaw = {
  path: '/framepage/po/integrated/personcertificate/create',
  component: () => import('/@/views/po/integrated/personcertificate/certificateDrawer.vue'),
};

export const PoIntegratedTraining: AppRouteRecordRaw = {
  path: '/framepage/po/integrated/training',
  component: () => import('/@/views/po/integrated/training/index.vue'),
};

export const PoIntegratedTrainingCreate: AppRouteRecordRaw = {
  path: '/framepage/po/integrated/training/create',
  component: () => import('/@/views/po/integrated/training/trainingCreate.vue'),
};

export const PoIntegratedInfoarchive: AppRouteRecordRaw = {
  path: '/framepage/po/integrated/infoarchive',
  component: () => import('/@/views/po/integrated/infoarchive/index.vue'),
};

export const PoIntegratedInfoarchiveCreate: AppRouteRecordRaw = {
  path: '/framepage/po/integrated/infoarchive/create',
  component: () => import('/@/views/po/integrated/infoarchive/infoarchiveCreate.vue'),
};

export const PoIntegratedVehicle: AppRouteRecordRaw = {
  path: '/framepage/po/integrated/vehicle/index',
  component: () => import('/@/views/po/integrated/vehicle/index.vue'),
};

export const PoIntegratedVehicleCreate: AppRouteRecordRaw = {
  path: '/framepage/po/integrated/vehicle/create',
  component: () => import('/@/views/po/integrated/vehicle/create.vue'),
};

export const PoIntegratedContract: AppRouteRecordRaw = {
  path: '/framepage/po/integrated/contract',
  component: () => import('/@/views/po/integrated/contract/index.vue'),
};

export const PoIntegratedContractCreate: AppRouteRecordRaw = {
  path: '/framepage/po/integrated/contract/create',
  component: () => import('/@/views/po/integrated/contract/contractModal.vue'),
};

export const PoIntegratedContractDetail: AppRouteRecordRaw = {
  path: '/framepage/po/integrated/contract/detail',
  component: () => import('/@/views/po/integrated/contract/contractModal.vue'),
};

export const PoIntegratedKnowledge: AppRouteRecordRaw = {
  path: '/framepage/po/integrated/knowledge',
  component: () => import('/@/views/po/integrated/knowledge/knowledge.vue'),
};

export const PoIntegratedKnowledgeCreate: AppRouteRecordRaw = {
  path: '/framepage/po/integrated/knowledge/create',
  component: () => import('/@/views/po/integrated/knowledge/knowledgeDrawer.vue'),
};

export const PoIntegratedKnowledgeDetail: AppRouteRecordRaw = {
  path: '/framepage/po/integrated/knowledge/detail',
  component: () => import('/@/views/po/integrated/knowledge/knowledgeDrawer.vue'),
};

export const PoAssessEvaluation: AppRouteRecordRaw = {
  path: '/framepage/po/integrated/assessmentevaluation/index',
  component: () => import('/@/views/po/integrated/assessmentevaluation/index/index.vue'),
};

export const PoAssessEvaluationTemplate: AppRouteRecordRaw = {
  path: '/framepage/po/integrated/assessmentevaluation/template',
  component: () => import('/@/views/po/integrated/assessmentevaluation/template/index.vue'),
};

export const PoAssessEvaluationTemplateCreate: AppRouteRecordRaw = {
  path: '/framepage/po/integrated/assessmentevaluation/template/templateCreate',
  component: () =>
    import('/@/views/po/integrated/assessmentevaluation/template/templateCreate.vue'),
};

export const PoAssessEvaluationDaily: AppRouteRecordRaw = {
  path: '/framepage/po/integrated/assessmentevaluation/daily',
  component: () => import('/@/views/po/integrated/assessmentevaluation/daily/index.vue'),
};

export const PoAssessEvaluationDailyCreate: AppRouteRecordRaw = {
  path: '/framepage/po/integrated/assessmentevaluation/daily/create',
  component: () => import('/@/views/po/integrated/assessmentevaluation/daily/create.vue'),
};

export const PoAssessEvaluationMonthly: AppRouteRecordRaw = {
  path: '/framepage/po/integrated/assessmentevaluation/monthly',
  component: () => import('/@/views/po/integrated/assessmentevaluation/monthly/index.vue'),
};

export const PoAssessEvaluationMonthlyCreate: AppRouteRecordRaw = {
  path: '/framepage/po/integrated/assessmentevaluation/monthly/create',
  component: () => import('/@/views/po/integrated/assessmentevaluation/monthly/create.vue'),
};

export const PoAssessEvaluationMonthlyScoring: AppRouteRecordRaw = {
  path: '/framepage/po/integrated/assessmentevaluation/monthly/scoring',
  component: () => import('/@/views/po/integrated/assessmentevaluation/monthly/scoring.vue'),
};

export const PoAssessEvaluationMonthlyStationDtl: AppRouteRecordRaw = {
  path: '/framepage/po/integrated/assessmentevaluation/monthly/stationDtl',
  component: () => import('/@/views/po/integrated/assessmentevaluation/monthly/stationDtl.vue'),
};

export const PoAssessEvaluationReport: AppRouteRecordRaw = {
  path: '/framepage/po/integrated/assessmentevaluation/report',
  component: () => import('/@/views/po/integrated/assessmentevaluation/report/index.vue'),
};

export const GroupOperation: AppRouteRecordRaw = {
  path: '/framepage/groupOperation',
  component: () => import('/@/views/da/groupOperation/GroupOperation.vue'),
};

export const StationOperation: AppRouteRecordRaw = {
  path: '/framepage/stationOperation',
  component: () => import('/@/views/da/stationOperation/StationOperation.vue'),
};

export const BiCapacityStatistics: AppRouteRecordRaw = {
  path: '/framepage/bi/grid/capacity/statistics',
  component: () => import('/@/views/bi/elec/gridCapacity/index.vue'),
};

export const BiRecordStatistics: AppRouteRecordRaw = {
  path: '/framepage/bi/grid/record/statistics',
  component: () => import('/@/views/bi/elec/gridRecord/index.vue'),
};

export const BiElecEnvironmental: AppRouteRecordRaw = {
  path: '/framepage/bi/elec/environmental',
  component: () => import('/@/views/bi/elec/environmental/index.vue'),
};

export const BiElecLossPower: AppRouteRecordRaw = {
  path: '/framepage/bi/elec/lossPower',
  component: () => import('/@/views/bi/elec/lossPower/index.vue'),
};

export const BiElecLossDetail: AppRouteRecordRaw = {
  path: '/framepage/bi/elec/lossDetail',
  component: () => import('/@/views/bi/elec/lossDetail/index.vue'),
};

export const BiElecLossPlanned: AppRouteRecordRaw = {
  path: '/framepage/bi/elec/planned',
  component: () => import('/@/views/bi/elec/planned/index.vue'),
};

export const BiElecLossSettlement: AppRouteRecordRaw = {
  path: '/framepage/bi/elec/settlement',
  component: () => import('/@/views/bi/elec/settlement/index.vue'),
};

export const BiSafetyDisasterWarning: AppRouteRecordRaw = {
  path: '/framepage/bi/safety/disasterWarning',
  component: () => import('/@/views/bi/safety/disasterwarning/index.vue'),
};

export const BiSafetyCheck: AppRouteRecordRaw = {
  path: '/framepage/bi/safety/check',
  component: () => import('/@/views/bi/safety/check/index.vue'),
};

export const BiSafetyAgreement: AppRouteRecordRaw = {
  path: '/framepage/bi/safety/agreement',
  component: () => import('/@/views/bi/safety/agreement/index.vue'),
};

export const BiSafetytoolsIndex: AppRouteRecordRaw = {
  path: '/framepage/bi/safetytools/index',
  component: () => import('/@/views/bi/safetytools/index.vue'),
};

export const BiIntegratedVehicle: AppRouteRecordRaw = {
  path: '/framepage/bi/integrated/vehicle',
  component: () => import('/@/views/bi/integrated/vehicle/index.vue'),
};

export const BiHiddenIndex: AppRouteRecordRaw = {
  path: '/framepage/bi/hidden/index',
  component: () => import('/@/views/bi/hidden/index.vue'),
};

export const BiInspectionIndex: AppRouteRecordRaw = {
  path: '/framepage/bi/inspection/index',
  component: () => import('/@/views/bi/inspection/index.vue'),
};

export const BiMaintenanceTicket: AppRouteRecordRaw = {
  path: '/framepage/bi/maintenance/ticket',
  component: () => import('/@/views/bi/maintenance/ticket/index.vue'),
};

export const BiFaultIndex: AppRouteRecordRaw = {
  path: '/framepage/bi/fault/index',
  component: () => import('/@/views/bi/fault/index.vue'),
};

export const BiMaintenanceWorkorder: AppRouteRecordRaw = {
  path: '/framepage/bi/maintenance/workorder',
  component: () => import('/@/views/bi/maintenance/workorder/index.vue'),
};

export const BiMaintenancePowerCut: AppRouteRecordRaw = {
  path: '/framepage/bi/maintenance/powerCut',
  component: () => import('/@/views/bi/maintenance/powercut/index.vue'),
};

export const BiMaintenanceAssess: AppRouteRecordRaw = {
  path: '/framepage/bi/maintenance/assess',
  component: () => import('/@/views/bi/maintenance/assess/index.vue'),
};

export const BiEquipmentIndex: AppRouteRecordRaw = {
  path: '/framepage/bi/equipment/index',
  component: () => import('/@/views/bi/equipment/index.vue'),
};

export const BiIntegratedPersonnelqualifications: AppRouteRecordRaw = {
  path: '/framepage/bi/integrated/personnelQualifications',
  component: () => import('/@/views/bi/integrated/personnelqualifications/index.vue'),
};

export const BiIntegratedPersonnelStructure: AppRouteRecordRaw = {
  path: '/framepage/bi/integrated/personnelStructure',
  component: () => import('/@/views/bi/integrated/personnelstructure/index.vue'),
};

export const BiIntegratedTrainingStatistics: AppRouteRecordRaw = {
  path: '/framepage/bi/integrated/trainingStatistics',
  component: () => import('/@/views/bi/integrated/trainingstatistics/index.vue'),
};

export const BiOaAtt: AppRouteRecordRaw = {
  path: '/framepage/bi/oa/att',
  component: () => import('/@/views/bi/oa/att/index.vue'),
};

export const BiPowerContrast: AppRouteRecordRaw = {
  path: '/framepage/bi/elec/powerContrast',
  component: () => import('/@/views/bi/elec/powerContrast/index.vue'),
};

export const OaInfoInfoKind: AppRouteRecordRaw = {
  path: '/framepage/oa/info/infoKind',
  component: () => import('/@/views/oa/info/infokind/infoKind.vue'),
};

export const OaInfoOfficedoc: AppRouteRecordRaw = {
  path: '/framepage/oa/info/officedoc/index',
  component: () => import('/@/views/oa/info/officedoc/index.vue'),
};

export const OaInfoOfficedocCreate: AppRouteRecordRaw = {
  path: '/framepage/oa/info/officedoc/create',
  component: () => import('/@/views/oa/info/officedoc/create.vue'),
};

export const OaInfoInfonoticeIndex: AppRouteRecordRaw = {
  path: '/framepage/oa/info/infonotice/index',
  component: () => import('/@/views/oa/info/infonotice/index.vue'),
};

export const OaInfoInfonoticeCreate: AppRouteRecordRaw = {
  path: '/framepage/oa/info/infonotice/create',
  component: () => import('/@/views/oa/info/infonotice/create.vue'),
};

export const OaInfoInformationIndex: AppRouteRecordRaw = {
  path: '/framepage/oa/info/information/index',
  component: () => import('/@/views/oa/info/information/index.vue'),
};

export const OaInfoInformationCreate: AppRouteRecordRaw = {
  path: '/framepage/oa/info/information/create',
  component: () => import('/@/views/oa/info/information/create.vue'),
};

export const OaInfoQueryIndex: AppRouteRecordRaw = {
  path: '/framepage/oa/info/query/index',
  component: () => import('/@/views/oa/info/query/index.vue'),
};

export const OaAttendIndex: AppRouteRecordRaw = {
  path: '/framepage/oa/attend/index',
  component: () => import('/@/views/oa/attend/index.vue'),
};

export const OaAttendCreate: AppRouteRecordRaw = {
  path: '/framepage/oa/attend/create',
  component: () => import('/@/views/oa/attend/create.vue'),
};

export const OaAttendCalendar: AppRouteRecordRaw = {
  path: '/framepage/oa/attend/calendar',
  component: () => import('/@/views/oa/attend/calendar.vue'),
};

export const OaAskreportIndex: AppRouteRecordRaw = {
  path: '/framepage/oa/askreport',
  component: () => import('/@/views/oa/askreport/index.vue'),
};

export const OaAskreportDetail: AppRouteRecordRaw = {
  path: '/framepage/oa/askreport/detail',
  component: () => import('/@/views/oa/askreport/detail.vue'),
};

export const OaAddressbook: AppRouteRecordRaw = {
  path: '/framepage/oa/addressbook',
  component: () => import('/@/views/oa/addressbook/index.vue'),
};

export const OaWorkbench: AppRouteRecordRaw = {
  path: '/framepage/workbench',
  component: () => import('/@/views/workbench/Workbench.vue'),
};

export const BpmWorkflow: AppRouteRecordRaw = {
  path: '/framepage/bpm/manage/workflow',
  component: () => import('/@/views/bpm/manage/workflow/workflow.vue'),
};

export const BpmWftaskAssignRule: AppRouteRecordRaw = {
  path: '/framepage/bpm/manage/wftaskAssignRule',
  component: () => import('/@/views/bpm/manage/taskAssignRule/index.vue'),
};

export const BpmWfdefinition: AppRouteRecordRaw = {
  path: '/framepage/bpm/manage/wftaskDefinition',
  component: () => import('/@/views/bpm/manage/definition/index.vue'),
};

export const BpmWfprocessEditor: AppRouteRecordRaw = {
  path: '/framepage/bpm/manage/wfeditor',
  component: () => import('/@/views/bpm/manage/workflow/processEditor.vue'),
};

export const BpmWfprocessInstance: AppRouteRecordRaw = {
  path: '/framepage/bpm/task/processInstance',
  component: () => import('/@/views/bpm/manage/processInstance/index.vue'),
};

export const BpmWftaskTodo: AppRouteRecordRaw = {
  path: '/framepage/bpm/task/todo',
  component: () => import('/@/views/bpm/manage/task/todo/index.vue'),
};

export const BpmWftaskDone: AppRouteRecordRaw = {
  path: '/framepage/bpm/task/done',
  component: () => import('/@/views/bpm/manage/task/done/index.vue'),
};

export const BasesetMonitorAreaSet: AppRouteRecordRaw = {
  path: '/framepage/baseset/monitor/area',
  component: () => import('/@/views/baseset/monitor/area/areaSet.vue'),
};

export const BasesetMonitorModelSet: AppRouteRecordRaw = {
  path: '/framepage/baseset/monitor/model',
  component: () => import('/@/views/baseset/monitor/model/modelSet.vue'),
};

export const BasesetMonitorDeviceSet: AppRouteRecordRaw = {
  path: '/framepage/baseset/monitor/device',
  component: () => import('/@/views/baseset/monitor/device/deviceSet.vue'),
};

export const BasesetMonitorDeviceInfoSet: AppRouteRecordRaw = {
  path: '/framepage/baseset/monitor/deviceinfo',
  component: () => import('/@/views/baseset/monitor/deviceinfo/deviceInfoSet.vue'),
};

export const BasesetMonitorModelInfo: AppRouteRecordRaw = {
  path: '/framepage/baseset/monitor/modelinfo/modelInfo',
  component: () => import('/@/views/baseset/monitor/modelinfo/modelInfo.vue'),
};

export const BasesetMonitorSunrise: AppRouteRecordRaw = {
  path: '/framepage/baseset/monitor/sunrise',
  component: () => import('/@/views/baseset/monitor/sunrise/sunriseSet.vue'),
};

export const BasesetPowerstation: AppRouteRecordRaw = {
  path: '/framepage/baseset/operation/powerstation',
  component: () => import('/@/views/baseset/operation/powerstation/index.vue'),
};

export const BasesetStationDrawer: AppRouteRecordRaw = {
  path: '/framepage/baseset/operation/powerstation/create',
  component: () => import('/@/views/baseset/operation/powerstation/stationDrawer.vue'),
};

export const BasesetMaterial: AppRouteRecordRaw = {
  path: '/framepage/baseset/operation/material',
  component: () => import('/@/views/baseset/operation/material/material.vue'),
};

export const BasesetRelatedParty: AppRouteRecordRaw = {
  path: '/framepage/baseset/operation/relatedparty',
  component: () => import('/@/views/baseset/operation/relatedparty/relatedParty.vue'),
};

export const BasesetWarehouse: AppRouteRecordRaw = {
  path: '/framepage/baseset/operation/warehouse',
  component: () => import('/@/views/baseset/operation/warehouse/warehouse.vue'),
};

export const BasesetAssessRule: AppRouteRecordRaw = {
  path: '/framepage/baseset/operation/assessRule',
  component: () => import('/@/views/baseset/operation/assessrule/assessRule.vue'),
};

export const BasesetSafeCheckSet: AppRouteRecordRaw = {
  path: '/framepage/baseset/operation/safeCheckSet',
  component: () => import('/@/views/baseset/operation/safecheck/safeCheckSet.vue'),
};

export const BasesetPersonnelqualifications: AppRouteRecordRaw = {
  path: '/framepage/baseset/operation/personnelqualifications',
  component: () => import('/@/views/baseset/operation/personnelqualifications/index.vue'),
};

export const BasesetSettlement: AppRouteRecordRaw = {
  path: '/framepage/baseset/operation/settlement',
  component: () => import('/@/views/baseset/operation/settlement/index.vue'),
};

export const BasesetLinelossrate: AppRouteRecordRaw = {
  path: '/framepage/baseset/operation/linelossrate',
  component: () => import('/@/views/baseset/operation/linelossrate/lineLossRateSet.vue'),
};

// 暴露基础路由
export const basicRoutes = [
  LoginRoute,
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
  BpmWorkflow,
  BpmWftaskAssignRule,
  BpmWfdefinition,
  BpmWfprocessEditor,
  BpmWfprocessInstance,
  BpmWftaskTodo,
  BpmWftaskDone,
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
];
