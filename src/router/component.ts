import { asyncImportComponent } from '/@/router/helper/routeHelper';
import { EXCEPTION_COMPONENT } from '/@/router/constant';
// 获取页面组件配置路由
export const getComponentRoutes = (menu: any) => {
  try {
    // 此处不能通过 import(menu.component) 进行动态加载，会导致vite打包分析问题
    if (menu.component == 'LAYOUT' || menu.parentId == '1') {
      return import('/@/layouts/default/index.vue');
    } else if (menu.component == '/@/views/sys/iframe/FrameBlank.vue') {
      return asyncImportComponent('/@/views/sys/iframe/FrameBlank.vue');
    } else if (menu.component == '/@/views/bpm/manage/workflow/workflow.vue') {
      return asyncImportComponent('/@/views/bpm/manage/workflow/workflow.vue');
    } else if (menu.component == '/@/views/bpm/manage/taskAssignRule/index.vue') {
      return asyncImportComponent('/@/views/bpm/manage/taskAssignRule/index.vue');
    } else if (menu.component == '/@/views/bpm/manage/definition/index.vue') {
      return asyncImportComponent('/@/views/bpm/manage/definition/index.vue');
    } else if (menu.component == '/@/views/bpm/manage/workflow/processEditor.vue') {
      return asyncImportComponent('/@/views/bpm/manage/workflow/processEditor.vue');
    } else if (menu.component == '/@/views/dev/dev.vue') {
      return asyncImportComponent('/@/views/dev/dev.vue');
    }

    // baseset/demo
    else if (menu.component == '/@/views/hr/manage/oaleave/index.vue') {
      return asyncImportComponent('/@/views/hr/manage/oaleave/index.vue');
    } else if (menu.component == '/@/views/hr/manage/oaleave/create.vue') {
      return asyncImportComponent('/@/views/hr/manage/oaleave/create.vue');
    } else if (menu.component == '/@/views/hr/manage/oaleave/detail.vue') {
      return asyncImportComponent('/@/views/hr/manage/oaleave/detail.vue');
    }

    // bpm/processInstance、todo、done
    else if (menu.component == '/@/views/bpm/manage/processInstance/index.vue') {
      return asyncImportComponent('/@/views/bpm/manage/processInstance/index.vue');
    } else if (menu.component == '/@/views/bpm/manage/task/todo/index.vue') {
      return asyncImportComponent('/@/views/bpm/manage/task/todo/index.vue');
    } else if (menu.component == '/@/views/bpm/manage/task/done/index.vue') {
      return asyncImportComponent('/@/views/bpm/manage/task/done/index.vue');
    }

    // baseset/monitor
    else if (menu.component == '/@/views/baseset/monitor/area/areaSet.vue') {
      return asyncImportComponent('/@/views/baseset/monitor/area/areaSet.vue');
    } else if (menu.component == '/@/views/baseset/monitor/model/modelSet.vue') {
      return asyncImportComponent('/@/views/baseset/monitor/model/modelSet.vue');
    } else if (menu.component == '/@/views/baseset/monitor/device/deviceSet.vue') {
      return asyncImportComponent('/@/views/baseset/monitor/device/deviceSet.vue');
    } else if (menu.component == '/@/views/baseset/monitor/deviceinfo/deviceInfoSet.vue') {
      return asyncImportComponent('/@/views/baseset/monitor/deviceinfo/deviceInfoSet.vue');
    } else if (menu.component == '/@/views/baseset/monitor/sunrise/sunriseSet.vue') {
      return asyncImportComponent('/@/views/baseset/monitor/sunrise/sunriseSet.vue');
    } else if (menu.component == '/@/views/baseset/monitor/modelinfo/modelInfo.vue') {
      return asyncImportComponent('/@/views/baseset/monitor/modelinfo/modelInfo.vue');
    }

    // baseset/operation
    else if (menu.component == '/@/views/baseset/operation/powerstation/index.vue') {
      return asyncImportComponent('/@/views/baseset/operation/powerstation/index.vue');
    } else if (menu.component == '/@/views/baseset/operation/safecheck/safeCheckSet.vue') {
      return asyncImportComponent('/@/views/baseset/operation/safecheck/safeCheckSet.vue');
    } else if (menu.component == '/@/views/baseset/operation/material/material.vue') {
      return asyncImportComponent('/@/views/baseset/operation/material/material.vue');
    } /*else if (menu.component == '/@/views/baseset/operation/warehouse/warehouse.vue') {
      return import('/@/views/baseset/operation/warehouse/warehouse.vue');
    }*/ else if (menu.component == '/@/views/baseset/operation/assessRule/assessRule.vue') {
      return asyncImportComponent('/@/views/baseset/operation/assessRule/assessRule.vue');
    } else if (menu.component == '/@/views/baseset/operation/relatedParty/relatedParty.vue') {
      return asyncImportComponent('/@/views/baseset/operation/relatedParty/relatedParty.vue');
    } else if (menu.component == '/@/views/baseset/operation/settlement/index.vue') {
      return asyncImportComponent('/@/views/baseset/operation/settlement/index.vue');
    } else if (menu.component == '/@/views/baseset/operation/personnelqualifications/index.vue') {
      return asyncImportComponent('/@/views/baseset/operation/personnelqualifications/index.vue');
    } else {
      return import('/@/layouts/default/index.vue');
    }
  } catch (e) {
    return EXCEPTION_COMPONENT;
  }
};
