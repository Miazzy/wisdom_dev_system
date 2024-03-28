import { withInstall } from '/@/utils';
import './src/index.less';
import basicModal from './src/BasicModal.vue';
import aModal from './src/AModal.vue';

export const BasicModal = withInstall(basicModal);
export const AModal = withInstall(aModal);
export { useModalContext } from './src/hooks/useModalContext';
export { useModal, useModalInner } from './src/hooks/useModal';
export * from './src/typing';
