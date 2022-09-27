import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { RoleEnum } from '/@/enums/roleEnum';

const permission: AppRouteModule = {
  path: '/permission',
  name: 'Permission',
  component: LAYOUT,
  redirect: '/permission/staff',
  meta: {
    icon: 'ion:ios-lock',
    title: '权限管理',
    orderNo: 2,
    roles: [RoleEnum.SUPER],
  },
  children: [
    {
      path: 'staff',
      name: 'Staff',
      component: () => import('/@/views/permission/staff/index.vue'),
      meta: {
        title: '用户管理',
      },
    },
  ],
};

export default permission;
