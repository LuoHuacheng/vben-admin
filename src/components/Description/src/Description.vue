<script lang="tsx">
  import type { DescriptionProps, DescInstance, DescItem } from './typing';
  import type { DescriptionsProps } from 'ant-design-vue/es/descriptions/index';
  import type { CollapseContainerOptions } from '/@/components/Container/index';
  import { defineComponent, computed, ref, unref, toRefs } from 'vue';
  import { get } from 'lodash-es';
  import { Descriptions } from 'ant-design-vue';
  import { CollapseContainer } from '/@/components/Container/index';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { isFunction, isEmpty, isNullOrUnDef } from '/@/utils/is';
  import { getSlot } from '/@/utils/helper/tsxHelper';
  import { useAttrs } from '/@/hooks/core/useAttrs';

  const props = {
    useCollapse: { type: Boolean, default: false },
    title: { type: String, default: '' },
    size: {
      type: String,
      validator: (v) => ['small', 'default', 'middle', undefined].includes(v),
      default: 'small',
    },
    bordered: { type: Boolean, default: true },
    column: {
      type: [Number, Object] as PropType<number | Recordable>,
      default: () => {
        return { xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 };
      },
    },
    collapseOptions: {
      type: Object as PropType<CollapseContainerOptions>,
      default: () => null,
    },
    labelWidth: { type: Number, default: 120 },
    contentWidth: { type: Number, default: 0 },
    schema: {
      type: Array as PropType<DescItem[]>,
      default: () => [],
    },
    data: { type: Object, default: () => ({}) },
    emptyStr: { type: String, default: '' },
  };

  export default defineComponent({
    name: 'Description',
    props,
    emits: ['register'],
    setup(props, { slots, emit }) {
      const propsRef = ref<Partial<DescriptionProps> | null>(null);

      const { prefixCls } = useDesign('description');
      const attrs = useAttrs();

      // Custom title component: get title
      const getMergeProps = computed(() => {
        return {
          ...props,
          ...(unref(propsRef) as Recordable),
        } as DescriptionProps;
      });

      const getProps = computed(() => {
        const opt = {
          ...unref(getMergeProps),
          title: undefined,
        };
        return opt as DescriptionProps;
      });

      /**
       * @description: Whether to setting title
       */
      const useWrapper = computed(() => !!unref(getMergeProps).title);

      /**
       * @description: Get configuration Collapse
       */
      const getCollapseOptions = computed((): CollapseContainerOptions => {
        return {
          // Cannot be expanded by default
          canExpand: false,
          ...unref(getProps).collapseOptions,
        };
      });

      const getDescriptionsProps = computed(() => {
        return { ...unref(attrs), ...unref(getProps) } as DescriptionsProps;
      });

      /**
       * @description:设置desc
       */
      function setDescProps(descProps: Partial<DescriptionProps>): void {
        // Keep the last setDrawerProps
        propsRef.value = { ...(unref(propsRef) as Recordable), ...descProps } as Recordable;
      }

      function renderItem() {
        const { schema, data, labelWidth, contentWidth } = unref(getProps);
        return unref(schema)
          .map((item) => {
            const {
              field,
              label,
              labelMinWidth,
              labelStyles,
              contentMinWidth,
              contentStyles,
              span,
              show,
              render,
            } = item;

            if (show && isFunction(show) && !show(data)) {
              return null;
            }

            const getLabelStyle = () => {
              if (!labelStyles && !labelMinWidth) {
                return { width: `${labelWidth}px` };
              } else {
                return {
                  ...labelStyles,
                  minWidth: `${labelMinWidth}px`,
                };
              }
            };

            const getContentStyle = () => {
              if (!contentStyles && !contentMinWidth) {
                if (!contentWidth) return {};
                return { width: `${contentWidth}px` };
              } else {
                return {
                  ...contentStyles,
                  minWidth: `${contentMinWidth}px`,
                };
              }
            };

            const getContent = () => {
              const _data = unref(getProps)?.data;
              if (!_data) {
                return null;
              }
              const getField = get(_data, field);
              if (!!getField && !toRefs(_data).hasOwnProperty(field)) {
                return isFunction(render) ? render('', _data) : props.emptyStr;
              }
              let fieldResult: any;
              if (isNullOrUnDef(getField) || isEmpty(getField)) {
                fieldResult = props.emptyStr;
              } else {
                fieldResult = getField;
              }
              return isFunction(render) ? render(fieldResult, _data) : fieldResult;
            };

            return (
              <Descriptions.Item
                key={field}
                span={span}
                label={label}
                labelStyle={getLabelStyle()}
                contentStyle={getContentStyle()}
              >
                {() => getContent()}
              </Descriptions.Item>
            );
          })
          .filter((item) => !!item);
      }

      const renderDesc = () => {
        return (
          <Descriptions class={`${prefixCls}`} {...(unref(getDescriptionsProps) as any)}>
            {renderItem()}
          </Descriptions>
        );
      };

      const renderContainer = () => {
        const content = props.useCollapse ? renderDesc() : <div>{renderDesc()}</div>;
        // Reduce the dom level
        if (!props.useCollapse) {
          return content;
        }

        const { canExpand, helpMessage } = unref(getCollapseOptions);
        const { title } = unref(getMergeProps);

        return (
          <CollapseContainer title={title} canExpan={canExpand} helpMessage={helpMessage}>
            {{
              default: () => content,
              action: () => getSlot(slots, 'action'),
            }}
          </CollapseContainer>
        );
      };

      const methods: DescInstance = {
        setDescProps,
      };

      emit('register', methods);
      return () => (unref(useWrapper) ? renderContainer() : renderDesc());
    },
  });
</script>
