export const REDIRECT_NAME = 'Redirect';

export const PARENT_LAYOUT_NAME = 'ParentLayout';

export const PAGE_NOT_FOUND_NAME = 'PageNotFound';

export const EXCEPTION_COMPONENT = () => import('/@/views/sys/exception/Exception.vue');

/**
 * @description: default layout
 */
export const LAYOUT = () => import('/@/layouts/default/index.vue');

/**
 * @description: ROUTE_PAGES
 */
export const FrameBlank = () => import('/@/views/sys/iframe/FrameBlank.vue');
export const Workflow = () => import('/@/views/bpm/manage/workflow/workflow.vue');
export const TaskAssignRule = () => import('/@/views/bpm/manage/taskAssignRule/index.vue');
export const Definition = () => import('/@/views/bpm/manage/definition/index.vue');
export const ProcessEditor = () => import('/@/views/bpm/manage/workflow/processEditor.vue');
export const DevPage = () => import('/@/views/dev/dev.vue');

export const routePageMap = new Map();

routePageMap.set('/@/views/sys/iframe/FrameBlank.vue', FrameBlank);
routePageMap.set('/@/views/bpm/manage/workflow/workflow.vue', Workflow);
routePageMap.set('/@/views/bpm/manage/taskAssignRule/index.vue', TaskAssignRule);
routePageMap.set('/@/views/bpm/manage/definition/index.vue', Definition);
routePageMap.set('/@/views/bpm/manage/workflow/processEditor.vue', ProcessEditor);
routePageMap.set('/@/views/dev/dev.vue', DevPage);

/**
 * @description: parent-layout
 */
export const getParentLayout = (_name?: string) => {
  return () =>
    new Promise((resolve) => {
      resolve({
        name: _name || PARENT_LAYOUT_NAME,
      });
    });
};
