import { withInstall } from '/@/utils';
import './src/index.less';
// import OrganDialog from '/@/components/Framework/Modal/OrganDialog.vue';
// import Dialog from '/@/components/Framework/Modal/Dialog.vue';
import basicModal from './src/BasicModal.vue';
import aModal from './src/AModal.vue';

export const BasicModal = withInstall(basicModal);
export const AModal = withInstall(aModal);
// export const OrganDialog = () => withInstall(OrganDialog);
// export const Dialog = () => withInstall(Dialog);
export { useModalContext } from './src/hooks/useModalContext';
export { useModal, useModalInner } from './src/hooks/useModal';
export * from './src/typing';
