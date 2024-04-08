import { withInstall } from '/@/utils';
import type { ExtractPropTypes } from 'vue';
import aButton from './src/BasicButton.vue';
import vButton from '@/components/Framework/Button/Button.vue';
import popConfirmButton from './src/PopConfirmButton.vue';
import { buttonProps } from './src/props';

export const AButton = withInstall(aButton);
export const VButton = withInstall(vButton);
export const Button = AButton;
export const PopConfirmButton = withInstall(popConfirmButton);
export declare type ButtonProps = Partial<ExtractPropTypes<typeof buttonProps>>;
