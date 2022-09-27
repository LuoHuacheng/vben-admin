<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLogin"
  >
    <FormItem name="mobile" class="enter-x">
      <Input
        size="large"
        v-model:value="formData.mobile"
        placeholder="账号"
        class="fix-auto-fill"
      />
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword
        size="large"
        visibilityToggle
        autocomplete="off"
        v-model:value="formData.password"
        placeholder="密码"
      />
    </FormItem>

    <Row class="enter-x">
      <Col :span="12">
        <FormItem>
          <!-- No logic, you need to deal with it yourself -->
          <Checkbox v-model:checked="rememberMe" size="small">
            {{ t('sys.login.rememberMe') }}
          </Checkbox>
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem :style="{ 'text-align': 'right' }">
          <!-- No logic, you need to deal with it yourself -->
          <x-button type="link" size="small" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">
            {{ t('sys.login.forgetPassword') }}
          </x-button>
        </FormItem>
      </Col>
    </Row>

    <FormItem class="enter-x">
      <x-button type="primary" size="large" block @click="handleLogin" :loading="loading">
        登录
      </x-button>
    </FormItem>

    <Row class="enter-x">
      <Col :md="8" :xs="24">
        <x-button block @click="setLoginState(LoginStateEnum.MOBILE)">
          {{ t('sys.login.mobileSignInFormTitle') }}
        </x-button>
      </Col>
      <Col :md="8" :xs="24" class="!my-2 !md:my-0 xs:mx-0 md:mx-2">
        <x-button block @click="setLoginState(LoginStateEnum.QR_CODE)">
          {{ t('sys.login.qrSignInFormTitle') }}
        </x-button>
      </Col>
      <Col :md="6" :xs="24">
        <x-button block @click="setLoginState(LoginStateEnum.REGISTER)">
          {{ t('sys.login.registerButton') }}
        </x-button>
      </Col>
    </Row>
  </Form>
</template>
<script lang="ts" setup>
  import { reactive, ref, unref, computed } from 'vue';

  import { Form, Row, Col, Input, Checkbox } from 'ant-design-vue';
  import LoginFormTitle from './LoginFormTitle.vue';

  import { useUserStore } from '/@/store/modules/user';
  import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from './useLogin';

  import { useI18n } from '/@/hooks/web/useI18n';

  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const userStore = useUserStore();
  const { t } = useI18n();

  const { setLoginState, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const formRef = ref();
  const loading = ref(false);
  const formData = reactive({
    mobile: '',
    password: '',
  });
  const rememberMe = ref(false);

  const { validForm } = useFormValid(formRef);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      await userStore.login({
        password: data.password,
        mobile: data.mobile,
      });
    } catch (error) {
      return error;
    } finally {
      loading.value = false;
    }
  }
</script>
