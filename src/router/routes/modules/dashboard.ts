import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const dashboard: AppRouteModule = {
  path: '/dashboard',
  name: 'Dashboard',
  component: LAYOUT,
  redirect: '/dashboard/workbench',
  meta: {
    hideChildrenInMenu: true,
    orderNo: 1,
    icon: 'ion:grid-outline',
    title: '工作台',
  },
  children: [
    {
      path: 'workbench',
      name: 'Workbench',
      hideMenu: true,
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        hideBreadcrumb: true,
        title: '工作台',
      },
    },
  ],
};

export default dashboard;
