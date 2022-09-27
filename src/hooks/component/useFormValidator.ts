import type { RuleObject } from 'ant-design-vue/lib/form/interface';

const REG_STRING = /^\S+$/;
const REG_STRING_EN = /^[a-zA-Z]+$/;
const REG_URL =
  /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/;
const REG_EMAIL = /^[A-Za-z0-9\.\-_]+@([A-Za-z0-9_\-]+\.)+[A-Za-z]{2,6}$/;
const REG_MOBILE =
  /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/;
const REG_PASSWORD = /^\S{6,24}$/;

const validateEmpty = async (_: RuleObject, value: string) => {
  return !REG_STRING.test(value)
    ? Promise.reject('请输入字母数字或其他非空字符组合')
    : Promise.resolve();
};

const validateEn = async (_: RuleObject, value: string) => {
  return !REG_STRING_EN.test(value) ? Promise.reject('请输入英文字母') : Promise.resolve();
};

const validateURL = async (_: RuleObject, value: string) => {
  return !REG_URL.test(value) ? Promise.reject('请输入正确的URL地址') : Promise.resolve();
};

const validateEmptyOrURL = async (_: RuleObject, value: string) => {
  if (!value) {
    return Promise.resolve();
  } else {
    return !REG_URL.test(value) ? Promise.reject('请输入正确的URL地址') : Promise.resolve();
  }
};

const validateEmail = async (_: RuleObject, value: string) => {
  return !REG_EMAIL.test(value) ? Promise.reject('请输入邮箱地址') : Promise.resolve();
};

const validateMobile = async (_: RuleObject, value: string) => {
  return !REG_MOBILE.test(value) ? Promise.reject('请输入手机号码') : Promise.resolve();
};

const validatePassword = async (_: RuleObject, value: string) => {
  return !REG_PASSWORD.test(value)
    ? Promise.reject('请输入8~24位字母数字或下划线组合')
    : Promise.resolve();
};

const validateCaptcha = async (_: RuleObject, value: string) => {
  return !/^\d+$/g.test(value) ? Promise.reject('请输入验证码') : Promise.resolve();
};

const validateConfirmPassword = (password: string) => {
  return async (_: RuleObject, value: string) => {
    if (!value) {
      return Promise.reject('请再次输入密码');
    }
    if (value !== password) {
      return Promise.reject('再次输入密码不一致');
    }
    return Promise.resolve();
  };
};

/**
 * @description: validator
 */
export function useFormValidator() {
  return {
    validateEmpty,
    validateEn,
    validateURL,
    validateEmptyOrURL,
    validateEmail,
    validateMobile,
    validatePassword,
    validateCaptcha,
    validateConfirmPassword,
  };
}
