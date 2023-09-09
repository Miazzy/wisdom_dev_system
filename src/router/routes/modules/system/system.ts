import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

// 生产监视菜单配置位置
const system: AppRouteModule = {
  path: '/system',
  name: 'system',
  component: LAYOUT,
  redirect: '/system/base',
  meta: {
    orderNo: 0,
    icon: 'ion:settings',
    title: t('routes.basic.base'),
  },
  children: [
    {
      path: 'base',
      name: 'base',
      component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
      meta: {
        title: t('routes.basic.base'),
      },
    },
  ],
};

export default system;
