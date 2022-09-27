<script lang="ts">
  import { computed, defineComponent, h, unref } from 'vue';
  import BasicButton from './BasicButton.vue';
  import { Popconfirm, Modal } from 'ant-design-vue';
  import { extendSlots } from '/@/utils/helper/tsxHelper';
  import { omit } from 'lodash-es';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { useI18n } from '/@/hooks/web/useI18n';

  const props = {
    /**
     * Whether to enable the drop-down menu
     * @default: true
     */
    enable: {
      type: Boolean,
      default: true,
    },
  };

  export default defineComponent({
    name: 'PopButton',
    inheritAttrs: false,
    props,
    setup(props, { slots }) {
      const { t } = useI18n();
      const attrs = useAttrs();

      // get inherit binding value
      const getBindValues = computed<any>(() => {
        return Object.assign(
          {
            okText: t('common.okText'),
            cancelText: t('common.cancelText'),
          },
          { ...props, ...unref(attrs) },
        );
      });

      return () => {
        const bindValues = omit(unref(getBindValues), 'icon');
        const btnBind = omit(bindValues, 'title') as Recordable;
        if (btnBind.disabled) btnBind.color = '';
        const Button = h(BasicButton, btnBind, extendSlots(slots));
        // If it is not enabled, it is a normal button
        if (!props.enable) {
          return Button;
        }
        if (bindValues.mode === 'modal') {
          return h(
            BasicButton,
            {
              ...bindValues,
              onClick: () =>
                Modal.confirm({
                  title: '温馨提示',
                  icon: bindValues?.icon,
                  content: bindValues?.content,
                  onOk: async () => await bindValues?.onConfirm?.(),
                  onCancel: async () => await bindValues?.onCancel?.(),
                  okText: bindValues.okText,
                  cancelText: bindValues.cancelText,
                }),
            },
            extendSlots(slots),
          );
        }
        return h(Popconfirm, bindValues, { default: () => Button });
      };
    },
  });
</script>
