<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="drawerTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { createUser, editUser } from '/@/api/permission/staff';

  import { useFormValidator } from '/@/hooks/component/useFormValidator';

  export default defineComponent({
    name: 'RoleDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const drawerTitle = ref('');
      const actionType = ref('');
      const userMobile = ref('');
      const { validatePassword, validateMobile } = useFormValidator();

      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
        labelWidth: 100,
        schemas: [
          {
            field: 'mobile',
            label: '手机号',
            component: 'Input',
            componentProps: {
              maxlength: 11,
              autocomplete: 'off',
            },
            rules: [{ required: true, validator: validateMobile, trigger: 'change' }],
          },
          {
            field: 'userName',
            label: '用户名',
            component: 'Input',
            componentProps: {
              maxlength: 32,
              autocomplete: 'off',
            },
            required: true,
          },
          {
            field: 'password',
            label: '密码',
            component: 'StrengthMeter',
            componentProps: {
              placeholder: '请输入密码',
              autocomplete: 'new-password',
            },
            rules: [{ required: true, validator: validatePassword, trigger: 'change' }],
          },
          {
            label: '所属项目',
            field: 'projectName',
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
          },
          {
            field: 'state',
            label: '是否激活',
            component: 'Switch',
            componentProps: {
              checkedValue: 0,
              unCheckedValue: 1,
              checkedChildren: '是',
              unCheckedChildren: '否',
            },
            defaultValue: 0,
          },
        ],
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });
        actionType.value = data?.action;
        if (data?.action === 'create') {
          drawerTitle.value = '添加用户';
          updateSchema({ field: 'mobile', componentProps: { disabled: false } });
          updateSchema({ field: 'userName', componentProps: { disabled: false } });
          updateSchema({ field: 'password', ifShow: true });
        }
        if (data?.action === 'edit') {
          drawerTitle.value = '编辑用户';
          userMobile.value = data?.record?.mobile;
          updateSchema({ field: 'mobile', componentProps: { disabled: true } });
          updateSchema({ field: 'userName', componentProps: { disabled: true } });
          updateSchema({ field: 'password', ifShow: false });
          setFieldsValue({
            mobile: data?.record.mobile,
            userName: data?.record.userName,
            state: data?.record.state,
          });
        }
      });

      async function handleSubmit() {
        try {
          const data = await validate();
          setDrawerProps({ confirmLoading: true });
          if (actionType.value === 'create') {
            await createUser(data);
          }
          if (actionType.value === 'edit') {
            await editUser({ ...data, mobile: userMobile.value });
          }
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return {
        registerDrawer,
        registerForm,
        drawerTitle,
        handleSubmit,
      };
    },
  });
</script>
