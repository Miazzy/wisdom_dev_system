import { asyncImportComponent, checkImportComponent } from '/@/router/helper/routeHelper';
import { EXCEPTION_COMPONENT } from '/@/router/constant';
// 获取页面组件配置路由
export const getComponentRoutes = (menu: any) => {
  try {
    // 此处不能通过 import(menu.component) 进行动态加载，会导致vite打包分析问题
    menu.component = menu.component == '' ? 'LAYOUT' : menu.component;
    if (menu.component == 'LAYOUT' || menu.parentId == '1') {
      return import('/@/layouts/default/index.vue');
    } else if (checkImportComponent('/@/views/sys/iframe/FrameBlank.vue', menu.component)) {
      return import('/@/views/sys/iframe/FrameBlank.vue');
    } else if (checkImportComponent('/@/views/bpm/manage/workflow/workflow.vue', menu.component)) {
      return import('/@/views/bpm/manage/workflow/workflow.vue');
    } else if (
      checkImportComponent('/@/views/bpm/manage/taskAssignRule/index.vue', menu.component)
    ) {
      return import('/@/views/bpm/manage/taskAssignRule/index.vue');
    } else if (checkImportComponent('/@/views/bpm/manage/definition/index.vue', menu.component)) {
      return import('/@/views/bpm/manage/definition/index.vue');
    } else if (
      checkImportComponent('/@/views/bpm/manage/workflow/processEditor.vue', menu.component)
    ) {
      return import('/@/views/bpm/manage/workflow/processEditor.vue');
    } else if (checkImportComponent('/@/views/da/overview/Overview.vue', menu.component)) {
      return import('/@/views/da/overview/Overview.vue');
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
    } else if (checkImportComponent('/@/views/bpm/manage/task/todo/index.vue', menu.component)) {
      return import('/@/views/bpm/manage/task/todo/index.vue');
    } else if (checkImportComponent('/@/views/bpm/manage/task/done/index.vue', menu.component)) {
      return import('/@/views/bpm/manage/task/done/index.vue');
    }

    // baseset/monitor
    else if (checkImportComponent('/@/views/baseset/monitor/area/areaSet.vue', menu.component)) {
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
      checkImportComponent('/@/views/baseset/monitor/deviceinfo/deviceInfoSet.vue', menu.component)
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
      checkImportComponent('/@/views/baseset/operation/safecheck/safeCheckSet.vue', menu.component)
    ) {
      return import('/@/views/baseset/operation/safecheck/safeCheckSet.vue');
    } else if (
      checkImportComponent('/@/views/baseset/operation/material/material.vue', menu.component)
    ) {
      return import('/@/views/baseset/operation/material/material.vue');
    // } else if (
    //   checkImportComponent('/@/views/baseset/operation/warehouse/warehouse.vue', menu.component)
    // ) {
    //   return import('/@/views/baseset/operation/warehouse/warehouse.vue');
    } else if (
      checkImportComponent('/@/views/baseset/operation/assessRule/assessRule.vue', menu.component)
    ) {
      return import('/@/views/baseset/operation/assessRule/assessRule.vue');
    } else if (
      checkImportComponent(
        '/@/views/baseset/operation/relatedParty/relatedParty.vue',
        menu.component,
      )
    ) {
      return import('/@/views/baseset/operation/relatedParty/relatedParty.vue');
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
    } else {
      return asyncImportComponent(menu.component);
    }
  } catch (e) {
    return EXCEPTION_COMPONENT;
  }
};
