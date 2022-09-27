import { generateAntColors, primaryColor } from '../config/themeConfig';
import { getThemeVariables } from 'ant-design-vue/dist/theme';
import { resolve } from 'path';

/**
 * less global variable
 */
export function generateModifyVars(dark = false) {
  const palettes = generateAntColors(primaryColor);
  const primary = palettes[5];

  const primaryColorObj: Record<string, string> = {};

  for (let index = 0; index < 10; index++) {
    primaryColorObj[`primary-${index + 1}`] = palettes[index];
  }

  const modifyVars = getThemeVariables({ dark });
  return {
    ...modifyVars,
    // Used for global import to avoid the need to import each style file separately
    // reference:  Avoid repeated references
    hack: `${modifyVars.hack} @import (reference) "${resolve('src/design/config.less')}";`,
    'primary-color': primary,
    ...primaryColorObj,
    'info-color': primary,
    'processing-color': primary,
    'success-color': '#4caf50', //  Success color
    'error-color': '#ef5350', //  False color
    'warning-color': '#ff9800', //   Warning color
    'disabled-color': 'rgba(0, 0, 0, 0.45)', //   Disabled color
    'border-color-base': '#d9d9d9',
    'border-color-split': '#e6e6e6',
    'background-color-light': '#f2f2f2',
    'background-color-base': '#e8e8e8',
    'layout-body-background': '#ffffff',
    'descriptions-bg': '#f1f1f1',
    'font-size-base': '12px', //  Main font size
    'border-radius-base': '2px', //  Component/float fillet
    'link-color': primary, //   Link color
    'app-content-background': '#fafafa', //   Link color
  };
}
