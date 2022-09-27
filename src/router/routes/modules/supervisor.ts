import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { RoleEnum } from '/@/enums/roleEnum';

const supervisor: AppRouteModule = {
  path: '/supervisor',
  name: 'Supervisor',
  component: LAYOUT,
  redirect: '/supervisor/tasks',
  meta: {
    icon: 'ion:ios-paper',
    title: '服务监控',
    orderNo: 3,
    roles: [RoleEnum.SUPER],
  },
  children: [
    // {
    //   path: 'tasks',
    //   name: 'Tasks',
    //   component: () => import('/@/views/supervisor/task/index.vue'),
    //   meta: {
    //     title: '任务',
    //   },
    // },
    {
      path: 'config',
      name: 'Config',
      component: () => import('/@/views/supervisor/config/index.vue'),
      meta: {
        title: '服务器配置',
      },
    },
    {
      path: 'notice',
      name: 'Notice',
      component: () => import('/@/views/supervisor/notice/index.vue'),
      meta: {
        title: '服务器通知配置',
      },
    },
  ],
};

export default supervisor;
