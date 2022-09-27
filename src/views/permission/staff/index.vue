<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <x-button type="primary" @click="handleAction('create', null)"> 添加用户 </x-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '编辑',
              onClick: handleAction.bind(null, 'edit', record),
            },
            {
              label: '删除',
              color: 'error',
              confirmConfig: {
                title: '确定删除此用户吗?',
                confirm: handleAction.bind(null, 'delete', record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <StaffDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, h } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useDrawer } from '/@/components/Drawer';
  import StaffDrawer from './StaffDrawer.vue';
  import { getUsers, deleteUser } from '/@/api/permission/staff';

  import { formatToDateTime } from '/@/utils/dateUtil';

  export default defineComponent({
    name: 'StaffManagement',
    components: { BasicTable, TableAction, StaffDrawer },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload }] = useTable({
        title: '用户管理',
        api: getUsers,
        columns: [
          {
            title: '手机号',
            dataIndex: 'mobile',
            align: 'left',
          },
          {
            title: '用户名称',
            dataIndex: 'userName',
            align: 'left',
          },
          {
            title: '所属项目',
            dataIndex: 'projectName',
            align: 'left',
          },
          {
            title: '状态',
            dataIndex: 'state',
            align: 'left',
            customRender: ({ record }) =>
              h(
                'span',
                { style: { color: record.state > 0 ? '#ff3333' : null } },
                record.state > 0 ? '冻结' : '正常',
              ),
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            width: 180,
            format: (_, record) => formatToDateTime(record.createTime),
          },
        ],
        useSearchForm: false,
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          customSlots: { render: 'action' },
        },
      });

      async function handleAction(type: string, record: any) {
        if (type === 'create') {
          openDrawer(true, {
            action: type,
          });
        }
        if (type === 'edit') {
          openDrawer(true, {
            action: type,
            record,
          });
        }
        if (type === 'delete') {
          await delUser(record);
        }
      }

      async function delUser(data: Recordable) {
        try {
          const res = await deleteUser(data.mobile);
          if (res) {
            reload();
          }
        } catch (error) {
          throw error;
        }
      }

      function handleSuccess() {
        reload();
      }

      return {
        registerTable,
        registerDrawer,
        handleAction,
        handleSuccess,
      };
    },
  });
</script>
