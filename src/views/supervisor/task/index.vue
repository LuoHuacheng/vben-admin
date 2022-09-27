<template>
  <div>
    <BasicTable @register="registerTable">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '查看',
              onClick: handleView.bind(null, record),
            },
            {
              label: '编辑',
              onClick: handleEdit.bind(null, record),
            },
          ]"
        />
      </template>
    </BasicTable>
    <EditDrawer @register="registerEditDrawer" @success="handleSuccess" />
    <DetailDrawer @register="registerDetailDrawer" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getTasks } from '/@/api/supervisor/task';

  import { useDrawer } from '/@/components/Drawer';
  import EditDrawer from './edit.vue';
  import DetailDrawer from './detail.vue';

  import { formatToDateTime } from '/@/utils/dateUtil';

  export default defineComponent({
    name: 'TaskManagement',
    components: { BasicTable, TableAction, EditDrawer, DetailDrawer },
    setup() {
      async function getTaskAll() {
        setLoading(true);
        try {
          const res = await getTasks();
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
        title: '任务列表',
        columns: [
          {
            title: '任务ID',
            dataIndex: 'taskId',
            align: 'left',
            width: 200,
          },
          {
            title: '任务描述',
            dataIndex: 'taskDesc',
            align: 'left',
          },
          {
            title: '操作人',
            width: 80,
            dataIndex: 'handleUsers',
            format: (_text, record) => record.handleUsers.join(','),
          },
          {
            title: '创建时间',
            width: 200,
            dataIndex: 'createTime',
            format: (text) => formatToDateTime(text),
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
      const [registerDetailDrawer, { openDrawer: openDetailDrawer }] = useDrawer();

      async function handleView(record: Recordable) {
        openDetailDrawer(true, record);
      }

      function handleEdit(record: Recordable) {
        openEditDrawer(true, {
          record,
          action: 'update',
        });
      }

      async function handleSuccess() {
        await getTaskAll();
      }

      onMounted(async () => {
        await getTaskAll();
      });

      return {
        registerTable,
        handleView,
        handleEdit,
        registerEditDrawer,
        handleSuccess,
        registerDetailDrawer,
      };
    },
  });
</script>
