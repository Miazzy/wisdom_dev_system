// 获取页面组件配置路由
export const getComponentRoutes = (menu: any) => {
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

  // baseset/demo
  else if (menu.component == '/@/views/hr/manage/oaleave/index.vue') {
    return import('/@/views/hr/manage/oaleave/index.vue');
  } else if (menu.component == '/@/views/hr/manage/oaleave/create.vue') {
    return import('/@/views/hr/manage/oaleave/create.vue');
  } else if (menu.component == '/@/views/hr/manage/oaleave/detail.vue') {
    return import('/@/views/hr/manage/oaleave/detail.vue');
  }

  // bpm/processInstance、todo、done
  else if (menu.component == '/@/views/bpm/manage/processInstance/index.vue') {
    return import('/@/views/bpm/manage/processInstance/index.vue');
  } else if (menu.component == '/@/views/bpm/manage/task/todo/index.vue') {
    return import('/@/views/bpm/manage/task/todo/index.vue');
  } else if (menu.component == '/@/views/bpm/manage/task/done/index.vue') {
    return import('/@/views/bpm/manage/task/done/index.vue');
  }

  // baseset/monitor
  else if (menu.component == '/@/views/baseset/monitor/area/areaSet.vue') {
    return import('/@/views/baseset/monitor/area/areaSet.vue');
  } else if (menu.component == '/@/views/baseset/monitor/model/modelSet.vue') {
    return import('/@/views/baseset/monitor/model/modelSet.vue');
  } else if (menu.component == '/@/views/baseset/monitor/device/deviceSet.vue') {
    return import('/@/views/baseset/monitor/device/deviceSet.vue');
  } else if (menu.component == '/@/views/baseset/monitor/deviceinfo/deviceInfoSet.vue') {
    return import('/@/views/baseset/monitor/deviceinfo/deviceInfoSet.vue');
  } else if (menu.component == '/@/views/baseset/monitor/sunrise/sunriseSet.vue') {
    return import('/@/views/baseset/monitor/sunrise/sunriseSet.vue');
  } else if (menu.component == '/@/views/baseset/monitor/modelinfo/modelInfo.vue') {
    return import('/@/views/baseset/monitor/modelinfo/modelInfo.vue');
  }

  // baseset/operation
  else if (menu.component == '/@/views/baseset/operation/powerstation/index.vue') {
    return import('/@/views/baseset/operation/powerstation/index.vue');
  } else if (menu.component == '/@/views/baseset/operation/safecheck/safeCheckSet.vue') {
    return import('/@/views/baseset/operation/safecheck/safeCheckSet.vue');
  } else if (menu.component == '/@/views/baseset/operation/material/material.vue') {
    return import('/@/views/baseset/operation/material/material.vue');
  } /*else if (menu.component == '/@/views/baseset/operation/warehouse/warehouse.vue') {
    return import('/@/views/baseset/operation/warehouse/warehouse.vue');
  }*/ else if (menu.component == '/@/views/baseset/operation/assessRule/assessRule.vue') {
    return import('/@/views/baseset/operation/assessRule/assessRule.vue');
  } else if (menu.component == '/@/views/baseset/operation/relatedParty/relatedParty.vue') {
    return import('/@/views/baseset/operation/relatedParty/relatedParty.vue');
  } else if (menu.component == '/@/views/baseset/operation/settlement/index.vue') {
    return import('/@/views/baseset/operation/settlement/index.vue');
  } else if (menu.component == '/@/views/baseset/operation/personnelqualifications/index.vue') {
    return import('/@/views/baseset/operation/personnelqualifications/index.vue');
  } else {
    return import('/@/layouts/default/index.vue');
  }
};
