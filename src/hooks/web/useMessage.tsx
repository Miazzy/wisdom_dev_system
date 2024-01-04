import type { ModalFunc, ModalFuncProps } from 'ant-design-vue/lib/modal/Modal';
import { Modal, message as Message, notification } from 'ant-design-vue';
import { InfoCircleFilled, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons-vue';
import { NotificationArgsProps, ConfigProps } from 'ant-design-vue/lib/notification';
import { useI18n } from '/@/hooks/web/useI18n';
import { isString } from '/@/utils/is';
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';

export interface NotifyApi {
  info(config: NotificationArgsProps): void;
  success(config: NotificationArgsProps): void;
  error(config: NotificationArgsProps): void;
  warn(config: NotificationArgsProps): void;
  warning(config: NotificationArgsProps): void;
  open(args: NotificationArgsProps): void;
  close(key: String): void;
  config(options: ConfigProps): void;
  destroy(): void;
}

export declare type NotificationPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
export declare type IconType = 'success' | 'info' | 'error' | 'warning';
export interface ModalOptionsEx extends Omit<ModalFuncProps, 'iconType'> {
  iconType: 'warning' | 'success' | 'error' | 'info';
}
export type ModalOptionsPartial = Partial<ModalOptionsEx> & Pick<ModalOptionsEx, 'content'>;

interface ConfirmOptions {
  info: ModalFunc;
  success: ModalFunc;
  error: ModalFunc;
  warn: ModalFunc;
  warning: ModalFunc;
}

function getIcon(iconType: string) {
  if (iconType === 'warning') {
    return <InfoCircleFilled class="modal-icon-warning" />;
  } else if (iconType === 'success') {
    return <CheckCircleFilled class="modal-icon-success" />;
  } else if (iconType === 'info') {
    return <InfoCircleFilled class="modal-icon-info" />;
  } else {
    return <CloseCircleFilled class="modal-icon-error" />;
  }
}

function renderContent({ content }: Pick<ModalOptionsEx, 'content'>) {
  if (isString(content)) {
    return <div innerHTML={`<div>${content as string}</div>`}></div>;
  } else {
    return content;
  }
}

/**
 * @description: Create confirmation box
 */
function createConfirm(options: ModalOptionsEx): ConfirmOptions {
  const iconType = options.iconType || 'warning';
  Reflect.deleteProperty(options, 'iconType');
  const opt: ModalFuncProps = {
    centered: true,
    icon: getIcon(iconType),
    ...options,
    content: renderContent(options),
  };
  return Modal.confirm(opt) as unknown as ConfirmOptions;
}

const getBaseOptions = () => {
  const { t } = useI18n();
  return {
    okText: t('common.okText'),
    centered: true,
  };
};

function createModalOptions(options: ModalOptionsPartial, icon: string): ModalOptionsPartial {
  return {
    ...getBaseOptions(),
    ...options,
    content: renderContent(options),
    icon: getIcon(icon),
  };
}

function createSuccessModal(options: ModalOptionsPartial) {
  return Modal.success(createModalOptions(options, 'success'));
}

function createErrorModal(options: ModalOptionsPartial) {
  return Modal.error(createModalOptions(options, 'error'));
}

function createInfoModal(options: ModalOptionsPartial) {
  return Modal.info(createModalOptions(options, 'info'));
}

function createWarningModal(options: ModalOptionsPartial) {
  return Modal.warning(createModalOptions(options, 'warning'));
}

notification.config({
  placement: 'topRight',
  duration: 3,
});

// 消息提示
function info(content: string) {
  ElMessage.info(content);
}

// 错误消息
function error(content: string) {
  ElMessage.error(content);
}

// 成功消息
function success(content: string) {
  ElMessage.success(content);
}

// 警告消息
function warning(content: string) {
  ElMessage.warning(content);
}

// 弹出提示
function alert(content: string) {
  const { t } = useI18n();
  ElMessageBox.alert(content, t('common.message.confirmTitle'));
}

// 错误提示
function alertError(content: string) {
  const { t } = useI18n();
  ElMessageBox.alert(content, t('common.message.confirmTitle'), { type: 'error' });
}

// 成功提示
function alertSuccess(content: string) {
  const { t } = useI18n();
  ElMessageBox.alert(content, t('common.message.confirmTitle'), { type: 'success' });
}

// 警告提示
function alertWarning(content: string) {
  const { t } = useI18n();
  ElMessageBox.alert(content, t('common.message.confirmTitle'), { type: 'warning' });
}

// 通知提示
function notify(content: string) {
  ElNotification.info(content);
}

// 错误通知
function notifyError(content: string) {
  ElNotification.error(content);
}

// 成功通知
function notifySuccess(content: string) {
  ElNotification.success(content);
}

// 警告通知
function notifyWarning(content: string) {
  ElNotification.warning(content);
}

// 确认窗体
function confirm(content: string, tip?: string) {
  const { t } = useI18n();
  return ElMessageBox.confirm(content, tip ? tip : t('common.message.confirmTitle'), {
    confirmButtonText: t('common.okText'),
    cancelButtonText: t('common.cancelText'),
    type: 'warning',
  });
}

// 删除窗体
function delConfirm(content?: string, tip?: string) {
  const { t } = useI18n();
  return ElMessageBox.confirm(
    content ? content : t('common.message.delMessage'),
    tip ? tip : t('common.message.confirmTitle'),
    {
      confirmButtonText: t('common.okText'),
      cancelButtonText: t('common.cancelText'),
      type: 'warning',
    },
  );
}

// 导出窗体
function exportConfirm(content?: string, tip?: string) {
  const { t } = useI18n();
  return ElMessageBox.confirm(
    content ? content : t('common.message.exportMessage'),
    tip ? tip : t('common.message.confirmTitle'),
    {
      confirmButtonText: t('common.okText'),
      cancelButtonText: t('common.cancelText'),
      type: 'warning',
    },
  );
}

// 提交内容
function prompt(content: string, tip: string) {
  const { t } = useI18n();
  return ElMessageBox.prompt(content, tip, {
    confirmButtonText: t('common.okText'),
    cancelButtonText: t('common.cancelText'),
    type: 'warning',
  });
}

class SysMessage {
  private static instance: SysMessage;
  lastMessage: string;
  lasttime: number;

  static getInstance() {
    if (!SysMessage.instance) {
      SysMessage.instance = new SysMessage();
    }
    return SysMessage.instance;
  }

  constructor() {
    this.lasttime = 0;
    this.lastMessage = '';
  }

  valid(content) {
    const nowtime = new Date().getTime();
    if (this.lastMessage != content && nowtime < this.lasttime + 3000) {
      return true;
    } else {
      return false;
    }
  }

  info(content: string) {
    if (this.valid(content)) {
      this.lastMessage = content;
      Message.info(content);
    }
  }

  error(content: string) {
    if (this.valid(content)) {
      this.lastMessage = content;
      Message.error(content);
    }
  }

  success(content: string) {
    if (this.valid(content)) {
      this.lastMessage = content;
      Message.success(content);
    }
  }

  warning(content: string) {
    if (this.valid(content)) {
      this.lastMessage = content;
      Message.warning(content);
    }
  }
}

/**
 * @description: message
 */
export function useMessage() {
  return {
    createMessage: SysMessage.getInstance(),
    notification: notification as NotifyApi,
    createConfirm: createConfirm,
    createSuccessModal,
    createErrorModal,
    createInfoModal,
    createWarningModal,
    info,
    error,
    success,
    warning,
    alert,
    alertError,
    alertSuccess,
    alertWarning,
    notify,
    notifyError,
    notifySuccess,
    notifyWarning,
    confirm,
    delConfirm,
    exportConfirm,
    prompt,
  };
}
