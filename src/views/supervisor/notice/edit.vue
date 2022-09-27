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
  import { getConfigs } from '/@/api/supervisor/config';
  import { addNotice, editNotice } from '/@/api/supervisor/notice';

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
        const configList = await getConfigs();
        const configOptions = configList.map((item: Recordable) => ({
          label: `${item.projectName}_${item.serviceName}`,
          value: item.configId,
          key: item.namespaceId,
        }));
        await updateSchema({ field: 'configId', componentProps: { options: configOptions } });
        switch (data?.action) {
          case 'create':
            drawerTitle.value = '添加通知';
            break;
          case 'edit':
            drawerTitle.value = '编辑通知';
            let { userMobiles } = data.record;
            userMobiles = userMobiles.join(',');
            await setFieldsValue({ ...data.record, userMobiles });
            break;
          default:
            break;
        }
      });

      const [registerForm, { updateSchema, resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 100,
        schemas: [
          {
            field: 'configId',
            label: '配置',
            component: 'Select',
            colProps: { span: 24 },
          },
          {
            field: 'messageType',
            label: '消息类型',
            component: 'Select',
            componentProps: {
              options: [
                {
                  label: '文本',
                  value: 'text',
                  key: 0,
                },
                {
                  label: '链接',
                  value: 'link',
                  key: 1,
                },
                {
                  label: 'markdown',
                  value: 'markdown',
                  key: 2,
                },
                {
                  label: '卡片',
                  value: 'actionCard',
                  key: 3,
                },
              ],
            },
            defaultValue: 'text',
            colProps: { span: 24 },
          },
          {
            field: 'noticeType',
            label: '通知类型',
            component: 'Select',
            componentProps: {
              options: [
                {
                  label: '钉钉',
                  value: 0,
                  key: 0,
                },
                {
                  label: '其他',
                  value: 1,
                  key: 1,
                },
              ],
            },
            defaultValue: 0,
            colProps: { span: 24 },
          },
          {
            field: 'noticeUrl',
            label: '通知地址',
            component: 'InputTextArea',
            componentProps: {
              maxlength: 500,
              showCount: true,
              autoSize: {
                minRows: 1,
                maxRows: 5,
              },
            },
            rules: [{ required: true, type: 'url' }],
            colProps: { span: 24 },
          },
          {
            field: 'userMobiles',
            label: '通知人',
            helpMessage: '多个值用英文逗号分隔',
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
          let { userMobiles } = data;
          userMobiles = userMobiles.split(',');
          let res: any;
          switch (actionType.value) {
            case 'create':
              res = await addNotice({ ...data, userMobiles });
              break;
            case 'edit':
              res = await editNotice({ ...data, configId: configId.value, userMobiles });
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
