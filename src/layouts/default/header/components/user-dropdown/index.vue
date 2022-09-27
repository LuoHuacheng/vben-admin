<template>
  <Dropdown placement="bottomLeft" :overlayClassName="`${prefixCls}-dropdown-overlay`">
    <span :class="[prefixCls, `${prefixCls}--${theme}`]" class="flex">
      <Avatar style="background-color: #c5e5f5">
        <template #icon>
          <UserOutlined />
        </template>
      </Avatar>
      <span :class="`${prefixCls}__info hidden md:block`">
        <span :class="`${prefixCls}__name  `" class="truncate">
          {{ getUserInfo.userName }}
        </span>
      </span>
    </span>

    <template #overlay>
      <Menu @click="handleMenuClick">
        <MenuItem
          v-if="getUseLockPage"
          key="lock"
          :text="t('layout.header.tooltipLock')"
          icon="ion:lock-closed-outline"
        />
        <MenuDivider />
        <MenuItem key="password" :text="t('routes.demo.system.password')" icon="ion:key-outline" />
        <MenuDivider />
        <MenuItem
          key="logout"
          :text="t('layout.header.dropdownItemLoginOut')"
          icon="ion:power-outline"
        />
      </Menu>
    </template>
  </Dropdown>
  <LockAction @register="registerLockModal" />
  <BasicModal
    v-bind="$attrs"
    :title="t('component.excel.exportModalTitle')"
    @ok="handlePwdOk"
    @register="registerPwdModal"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  // components
  import { Avatar, Dropdown, Menu } from 'ant-design-vue';
  import { UserOutlined } from '@ant-design/icons-vue';

  import { defineComponent, computed } from 'vue';

  import { useUserStore } from '/@/store/modules/user';
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';

  import { propTypes } from '/@/utils/propTypes';

  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

  import { editPwd } from '/@/api/sys/user';

  export default defineComponent({
    name: 'UserDropdown',
    components: {
      Avatar,
      UserOutlined,
      Dropdown,
      Menu,
      BasicModal,
      BasicForm,
      MenuItem: createAsyncComponent(() => import('./DropMenuItem.vue')),
      MenuDivider: Menu.Divider,
      LockAction: createAsyncComponent(() => import('../lock/LockModal.vue')),
    },
    props: {
      theme: propTypes.oneOf(['dark', 'light']),
    },
    setup() {
      const { prefixCls } = useDesign('header-user-dropdown');
      const { t } = useI18n();
      const { getUseLockPage } = useHeaderSetting();
      const userStore = useUserStore();
      const { createMessage } = useMessage();

      const getUserInfo = computed(() => {
        return userStore.getUserInfo || {};
      });

      const [registerLockModal, { openModal: openLockModal }] = useModal();
      const [registerPwdModal, { openModal: openPwdModal, closeModal: closePwdModal }] = useModal();

      const [registerForm, { validate }] = useForm({
        labelWidth: 100,
        showActionButtonGroup: false,
        schemas: [
          {
            field: 'passwordOld',
            label: '当前密码',
            component: 'InputPassword',
            required: true,
          },
          {
            field: 'passwordNew',
            label: '新密码',
            component: 'StrengthMeter',
            componentProps: {
              placeholder: '新密码',
            },
            rules: [
              {
                required: true,
                message: '请输入新密码',
              },
            ],
          },
          {
            field: 'confirmPassword',
            label: '确认密码',
            component: 'InputPassword',
            dynamicRules: ({ values }) => {
              return [
                {
                  required: true,
                  validator: (_, value) => {
                    if (!value) {
                      return Promise.reject('密码不能为空');
                    }
                    if (value !== values.passwordNew) {
                      return Promise.reject('两次输入的密码不一致!');
                    }
                    return Promise.resolve();
                  },
                },
              ];
            },
          },
        ],
      });

      function handleLock() {
        openLockModal(true);
      }

      function handlePassword() {
        openPwdModal(true);
      }

      //  login out
      function handleLoginOut() {
        userStore.confirmLoginOut();
      }

      function handleMenuClick({ key }) {
        switch (key) {
          case 'logout':
            handleLoginOut();
            break;
          case 'password':
            handlePassword();
            break;
          case 'lock':
            handleLock();
            break;
        }
      }

      async function handlePwdOk() {
        try {
          const values = await validate();
          const { passwordNew } = values;
          const { mobile } = getUserInfo.value;
          const res = await editPwd({
            mobile,
            password: passwordNew,
          });
          if (res) {
            closePwdModal();
            createMessage.success('修改成功, 请重新登录', 2, async () => {
              await userStore.logout(true);
            });
          }
        } catch (error) {
          throw error;
        }
      }

      return {
        prefixCls,
        t,
        getUserInfo,
        handleMenuClick,
        registerLockModal,
        registerPwdModal,
        registerForm,
        handlePwdOk,
        getUseLockPage,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-user-dropdown';

  .@{prefix-cls} {
    height: @header-height;
    padding: 0 10px;
    overflow: hidden;
    font-size: 12px;
    cursor: pointer;
    align-items: center;

    &__name {
      padding-left: 6px;
      font-size: 14px;
    }

    &--dark {
      &:hover {
        background-color: @header-dark-bg-hover-color;
      }
    }

    &--light {
      &:hover {
        background-color: @header-light-bg-hover-color;
      }

      .@{prefix-cls}__name {
        color: @text-color-base;
      }

      .@{prefix-cls}__desc {
        color: @header-light-desc-color;
      }
    }

    &-dropdown-overlay {
      .ant-dropdown-menu-item {
        min-width: 160px;
      }
    }
  }
</style>
