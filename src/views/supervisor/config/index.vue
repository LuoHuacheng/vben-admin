<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <x-button type="primary" @click="handleAction({}, 'create')"> 添加配置 </x-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '编辑',
              onClick: handleAction.bind(null, record, 'edit'),
            },
            {
              label: '删除',
              color: 'error',
              confirmConfig: {
                title: '确定删除吗',
                confirm: handleAction.bind(null, record, 'delete'),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <EditDrawer @register="registerEditDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getConfigs, delConfig } from '/@/api/supervisor/config';

  import { useDrawer } from '/@/components/Drawer';
  import EditDrawer from './edit.vue';

  export default defineComponent({
    name: 'ConfigManagement',
    components: { BasicTable, TableAction, EditDrawer },
    setup() {
      async function getConfigAll() {
        setLoading(true);
        try {
          const res = await getConfigs();
          setTableData(res);
          setPagination({
            total: res.length,
            current: 1,
          });
        } catch (error) {
          setTableData([]);
          setPagination({
            total: 0,
            current: 1,
          });
          throw error;
        } finally {
          setLoading(false);
        }
      }

      const [registerTable, { setLoading, setTableData, setPagination }] = useTable({
        title: '配置列表',
        columns: [
          {
            title: '配置ID',
            dataIndex: 'configId',
            align: 'left',
            width: 200,
          },
          {
            title: 'namespace',
            dataIndex: 'namespaceId',
            align: 'left',
          },
          {
            title: '域名',
            dataIndex: 'domainName',
            align: 'left',
          },
          {
            title: '路径',
            dataIndex: 'path',
            align: 'left',
          },
          {
            title: '组名',
            dataIndex: 'groupName',
            align: 'left',
          },
          {
            title: '服务名称',
            dataIndex: 'serviceName',
            align: 'left',
          },
          {
            title: '项目名称',
            dataIndex: 'projectName',
            align: 'left',
          },
          {
            title: '监控列表',
            width: 80,
            dataIndex: 'monitorServeList',
            format: (_text, record) => record.monitorServeList.join(','),
          },
          {
            title: '状态',
            dataIndex: 'state',
            format: (text) => (text == '0' ? '有效' : '无效'),
          },
          {
            title: '备注',
            dataIndex: 'remark',
            align: 'left',
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

      const [registerEditDrawer, { openDrawer: openEditDrawer }] = useDrawer();

      async function handleAction(record: Recordable, type: string) {
        if (type !== 'delete') {
          openEditDrawer(true, {
            record,
            action: type,
          });
        } else {
          try {
            const res = await delConfig(record.configId);
            if (res) {
              await getConfigAll();
            }
          } catch (error) {
            throw error;
          }
        }
      }

      async function handleSuccess() {
        await getConfigAll();
      }

      onMounted(async () => {
        await getConfigAll();
      });

      return {
        registerTable,
        handleAction,
        registerEditDrawer,
        handleSuccess,
      };
    },
  });
</script>
