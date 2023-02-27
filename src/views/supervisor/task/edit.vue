<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    show-footer
    :title="drawerTitle"
    width="80%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" :schemas="formSchemas" @submit="handleSubmit" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';

  export default defineComponent({
    name: 'ServerEditDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const actionType = ref('true');
      const serverId = ref('');
      const drawerTitle = ref('');
      const formSchemas = ref<any[]>([]);

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner((data) => {
        actionType.value = data?.action;
        serverId.value = data.record?.serverId;
        switch (data?.action) {
          case 'create':
            drawerTitle.value = '添加服务器';
            break;
          case 'update':
            drawerTitle.value = '编辑服务器';
            break;
          case 'copy':
            drawerTitle.value = '复制服务器';
            break;
          default:
            break;
        }
        if (data.record?.paramList?.length) {
          data.record?.paramList.forEach((item: any) => {
            add(item);
          });
        }
      });

      const [registerForm, { appendSchemaByField, removeSchemaByField, setFieldsValue, validate }] =
        useForm({
          labelWidth: 20,
          actionColOptions: { span: 24 },
          showResetButton: false,
          showSubmitButton: false,
          baseRowStyle: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
        });

      async function handleSubmit() {
        try {
          setDrawerProps({ confirmLoading: true });
          const data = await validate();
          let res: any;
          switch (data?.action) {
            case 'create':
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

      const fieldOrder = ref(1);

      function showAdd(field: number | string) {
        if (fieldOrder.value === 1 && field === 'ignore_serverIp_add') {
          return true;
        } else if (field == fieldOrder.value - 1) {
          return true;
        } else {
          return false;
        }
      }

      async function add(param: any) {
        try {
          await validate();
          appendSchemaByField(
            {
              field: `field_${fieldOrder.value}_desc`,
              label: '',
              component: 'Input',
              componentProps: { maxlength: 100, placeholder: '请输入参数描述' },
              rules: [{ required: true, message: '请输入参数描述' }],
              colProps: { span: 4 },
            },
            '',
          );
          appendSchemaByField(
            {
              field: `field_${fieldOrder.value}_key`,
              label: '',
              component: 'Input',
              componentProps: { maxlength: 100, placeholder: '请输入参数key' },
              rules: [{ required: true, message: '请输入参数key' }],
              colProps: { span: 4 },
            },
            '',
          );
          appendSchemaByField(
            {
              field: `field_${fieldOrder.value}_value`,
              label: '',
              component: 'Input',
              componentProps: { maxlength: 100, placeholder: '请输入参数值' },
              rules: [{ required: true, message: '请输入参数值' }],
              colProps: { span: 10 },
            },
            '',
          );
          setFieldsValue({
            [`field_${fieldOrder.value}_desc`]: param.desc,
            [`field_${fieldOrder.value}_key`]: param.key,
            [`field_${fieldOrder.value}_value`]: param.value,
          });
          appendSchemaByField(
            {
              field: `${fieldOrder.value}`,
              component: 'Input',
              label: '',
              colProps: { span: 4 },
              slot: 'add',
            },
            '',
          );
          fieldOrder.value++;
        } catch (error) {
          throw error;
        }
      }

      function del(field: number | string) {
        removeSchemaByField([
          `field_${field}_desc`,
          `field_${field}_key`,
          `field_${field}_value`,
          `${field}`,
        ]);
        fieldOrder.value--;
      }

      return {
        registerDrawer,
        drawerTitle,
        registerForm,
        formSchemas,
        fieldOrder,
        showAdd,
        add,
        del,
        handleSubmit,
      };
    },
  });
</script>
