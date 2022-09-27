<template>
  <BasicDrawer @register="registerDrawerInner" title="服务器详情" show-footer width="100%">
    <BasicTable @register="registerTable" :data-source="extraData">
      <template #tableTitle>
        <div class="h-40px leading-40px font-bold">其他信息</div>
      </template>
    </BasicTable>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTable, useTable } from '/@/components/Table';

  export default defineComponent({
    name: 'ServerDetailDrawer',
    components: { BasicDrawer, BasicTable },
    emits: ['register'],
    setup() {
      const extraData = ref([]);
      const [registerDrawerInner] = useDrawerInner((data: any) => {
        extraData.value = data.paramList;
      });

      const [registerTable] = useTable({
        columns: [
          {
            title: '参数描述',
            dataIndex: 'desc',
            align: 'left',
          },
          {
            title: '参数key',
            dataIndex: 'key',
            align: 'left',
          },
          {
            title: '参数value',
            dataIndex: 'value',
            align: 'left',
          },
        ],
        useSearchForm: false,
      });

      return {
        registerDrawerInner,
        registerTable,
        extraData,
      };
    },
  });
</script>
