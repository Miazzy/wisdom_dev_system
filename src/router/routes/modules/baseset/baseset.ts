import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

/**
// 基础设置菜单配置位置
const baseset: AppRouteModule = {
  path: '/baseset',
  name: 'baseset',
  component: LAYOUT,
  redirect: '/baseset/monitor/sunriseset',
  meta: {
    orderNo: 100,
    icon: 'ion:settings',
    title: t('routes.basic.baseset.name'),
  },
  children: [
    {
      path: 'monitor',
      name: 'monitor',
      component: LAYOUT,
      meta: {
        title: t('routes.basic.baseset.monitorset.name'),
      },
      children: [
        {
          path: 'areaset',
          name: 'areaset',
          component: () => import('/@/views/baseset/monitor/areaset/areaSet.vue'),
          meta: {
            title: t('routes.basic.baseset.monitorset.areaSet'),
          },
        },
        {
          path: 'sunriseset',
          name: 'sunriseset',
          component: () => import('/@/views/baseset/monitor/sunriseset/sunriseSet.vue'),
          meta: {
            title: t('routes.basic.baseset.monitorset.sunRiseSet'),
          },
        },
      ],
    },
  ],
};

export default baseset;

*/
