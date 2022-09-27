<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <x-button type="primary" @click="handleAction({}, 'create')"> 添加通知 </x-button>
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
  import { getNotices, delNotice } from '/@/api/supervisor/notice';

  import { useDrawer } from '/@/components/Drawer';
  import EditDrawer from './edit.vue';

  export default defineComponent({
    name: 'NoticeManagement',
    components: { BasicTable, TableAction, EditDrawer },
    setup() {
      async function getNoticeAll() {
        setLoading(true);
        try {
          const res = await getNotices();
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
        title: '通知列表',
        columns: [
          {
            title: '配置ID',
            dataIndex: 'configId',
            align: 'left',
            width: 200,
          },
          {
            title: '通知人',
            dataIndex: 'userMobiles',
            format: (_text, record) => record.userMobiles.join(','),
          },
          {
            title: '通知类型',
            dataIndex: 'noticeType',
            align: 'left',
            width: 80,
            format: (text) => (text == '0' ? '钉钉' : '其他'),
          },
          {
            title: '消息类型',
            dataIndex: 'messageType',
            align: 'left',
            width: 80,
          },
          {
            title: '通知地址',
            dataIndex: 'noticeUrl',
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
            const res = await delNotice(record.configId);
            if (res) {
              await getNoticeAll();
            }
          } catch (error) {
            throw error;
          }
        }
      }

      async function handleSuccess() {
        await getNoticeAll();
      }

      onMounted(async () => {
        await getNoticeAll();
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
