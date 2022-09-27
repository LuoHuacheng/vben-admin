import type { ValidationRule } from 'ant-design-vue/lib/form/Form';
import { ref, computed, unref, Ref } from 'vue';
import { useFormValidator } from '/@/hooks/component/useFormValidator';

export enum LoginStateEnum {
  LOGIN,
  REGISTER,
  RESET_PASSWORD,
  MOBILE,
  QR_CODE,
}

const currentState = ref(LoginStateEnum.LOGIN);

export function useLoginState() {
  function setLoginState(state: LoginStateEnum) {
    currentState.value = state;
  }

  const getLoginState = computed(() => currentState.value);

  function handleBackLogin() {
    setLoginState(LoginStateEnum.LOGIN);
  }

  return { setLoginState, getLoginState, handleBackLogin };
}

export function useFormValid<T extends Object = any>(formRef: Ref<any>) {
  async function validForm() {
    const form = unref(formRef);
    if (!form) return;
    const data = await form.validate();
    return data as T;
  }

  return { validForm };
}

export function useFormRules(formData?: Recordable) {
  const { validateEmail, validatePassword, validateConfirmPassword, validateCaptcha } =
    useFormValidator();

  const getFormRules = computed((): { [k: string]: ValidationRule | ValidationRule[] } => {
    switch (unref(currentState)) {
      // register form rules
      case LoginStateEnum.REGISTER:
        return {
          email: [{ validator: validateEmail, trigger: 'change' }],
          password: [{ validator: validatePassword, trigger: 'change' }],
          confirmPassword: [
            { validator: validateConfirmPassword(formData?.password), trigger: 'change' },
          ],
        };

      // login form rules
      default:
        return {
          email: [{ validator: validateEmail, trigger: 'change' }],
          password: [{ validator: validatePassword, trigger: 'change' }],
          captchad_code: [{ validator: validateCaptcha, trigger: 'change' }],
        };
    }
  });
  return { getFormRules };
}
