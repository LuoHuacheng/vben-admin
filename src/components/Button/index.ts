import { withInstall } from '/@/utils';
import type { ExtractPropTypes } from 'vue';
import button from './src/BasicButton.vue';
import confirmButton from './src/ConfirmButton.vue';
import { buttonProps } from './src/props';

export const Button = withInstall(button);
export const ConfirmButton = withInstall(confirmButton);
export declare type ButtonProps = Partial<ExtractPropTypes<typeof buttonProps>>;
