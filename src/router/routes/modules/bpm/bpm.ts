import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

// 生产监视菜单配置位置
const system: AppRouteModule = {
  path: '/bpm',
  name: 'bpm',
  component: LAYOUT,
  redirect: '/bpm/manage/workflow',
  meta: {
    orderNo: 100,
    icon: 'ion:airplane',
    title: t('routes.basic.bpm.name'),
  },
  children: [
    {
      path: 'manage',
      name: 'manage',
      component: LAYOUT,
      meta: {
        title: t('routes.basic.bpm.management'),
      },
      children: [
        {
          path: 'workflow',
          name: 'workflow',
          component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
          meta: {
            title: t('routes.basic.bpm.manage.workflow'),
          },
        },
      ],
    },
  ],
};

export default system;
