<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    show-footer
    :title="drawerTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" @submit="handleSubmit" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { addConfig, editConfig } from '/@/api/supervisor/config';

  export default defineComponent({
    name: 'ServerEditDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const actionType = ref();
      const configId = ref('');
      const drawerTitle = ref('');
      const formSchemas = ref<any[]>([]);

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        actionType.value = data?.action;
        configId.value = data.record?.configId;
        await resetFields();
        switch (data?.action) {
          case 'create':
            drawerTitle.value = '添加配置';
            break;
          case 'edit':
            drawerTitle.value = '编辑配置';
            let { monitorServeList } = data.record;
            monitorServeList = monitorServeList.join(',');
            await setFieldsValue({ ...data.record, monitorServeList });
            break;
          default:
            break;
        }
      });

      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 100,
        schemas: [
          {
            field: 'domainName',
            label: '域名',
            component: 'Input',
            componentProps: {
              maxlength: 100,
            },
            rules: [{ required: true, type: 'url' }],
            colProps: { span: 24 },
          },
          {
            field: 'namespaceId',
            label: 'namespaceId',
            component: 'Input',
            componentProps: {
              maxlength: 100,
            },
            required: true,
            colProps: { span: 24 },
          },
          {
            field: 'path',
            label: '路径',
            component: 'Input',
            componentProps: {
              maxlength: 200,
            },
            required: true,
            colProps: { span: 24 },
          },
          {
            field: 'groupName',
            label: '组名',
            component: 'Input',
            componentProps: {
              maxlength: 100,
            },
            required: true,
            colProps: { span: 24 },
          },
          {
            field: 'serviceName',
            label: '服务名称',
            component: 'Input',
            componentProps: {
              maxlength: 100,
            },
            required: true,
            colProps: { span: 24 },
          },
          {
            field: 'projectName',
            label: '项目名称',
            component: 'Select',
            componentProps: {
              options: [
                {
                  label: '圣光与荣耀',
                  value: '圣光与荣耀',
                  key: 1,
                },
                {
                  label: '钟之境',
                  value: '钟之境',
                  key: 1,
                },
              ],
            },
            defaultValue: '圣光与荣耀',
            colProps: { span: 24 },
          },
          {
            field: 'monitorServeList',
            label: '监控列表',
            helpMessage: '多个值用英文逗号分隔',
            component: 'InputTextArea',
            componentProps: {
              maxlength: 150000,
              showCount: true,
              autoSize: {
                minRows: 5,
                maxRows: 100,
              },
            },
            required: true,
            colProps: { span: 24 },
          },
          {
            field: 'remark',
            label: '备注',
            component: 'Input',
            componentProps: {
              maxlength: 100,
            },
            required: true,
            colProps: { span: 24 },
          },
        ],
        showActionButtonGroup: false,
      });

      async function handleSubmit() {
        try {
          setDrawerProps({ confirmLoading: true });
          const data = await validate();
          let { monitorServeList } = data;
          monitorServeList = monitorServeList.split(',');
          let res: any;
          switch (actionType.value) {
            case 'create':
              res = await addConfig({ ...data, monitorServeList });
              break;
            case 'edit':
              res = await editConfig({ ...data, configId: configId.value, monitorServeList });
              break;
            default:
              break;
          }
          if (res) {
            closeDrawer();
            emit('success');
          }
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return {
        registerDrawer,
        drawerTitle,
        registerForm,
        formSchemas,
        handleSubmit,
      };
    },
  });
</script>
