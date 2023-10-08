import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

// 人力资源菜单配置位置
const hr: AppRouteModule = {
  path: '/hr',
  name: 'hr',
  component: LAYOUT,
  redirect: '/hr/manage/oaleave',
  meta: {
    orderNo: 100,
    icon: 'ion:airplane',
    title: t('routes.basic.hr.name'),
  },
  children: [
    {
      path: 'manage',
      name: 'manage',
      component: LAYOUT,
      meta: {
        title: t('routes.basic.hr.management'),
      },
      children: [
        {
          path: 'oaleave',
          name: 'oaleave',
          component: () => import('@/views/hr/manage/oaleave/index.vue'),
          meta: {
            title: t('routes.basic.hr.manage.oaleave'),
          },
        },
        {
          path: 'OALeaveCreate',
          component: () => import('@/views/hr/manage/oaleave/create.vue'),
          name: 'OALeaveCreate',
          meta: {
            canTo: true,
            hidden: true,
            noTagsView: false,
            icon: 'ant-design:edit-outlined',
            title: '发起 OA 请假',
            activeMenu: 'hr/oaleave/create',
          },
        },
      ],
    },
  ],
};

export default hr;
