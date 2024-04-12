import type { ModalFunc, ModalFuncProps } from 'ant-design-vue/lib/modal/Modal';
import { Modal, message as Message, notification } from 'ant-design-vue';
import {
  InfoCircleFilled,
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue';
import { NotificationArgsProps, ConfigProps } from 'ant-design-vue/lib/notification';
import { useI18n } from '/@/hooks/web/useI18n';
import { isString } from '/@/utils/is';
import { ElMessageBox } from 'element-plus';
import { createVNode } from 'vue';
import { MsgManager } from '/@/message/MsgManager';

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
  const { onOk, onCancel } = options;
  const handleOk = async (...args) => {
    if (onOk && typeof onOk == 'function') {
      await onOk(args);
    }
    if (window.self !== window.top) {
      MsgManager.getInstance().sendMsg('modal-open', { type: 'remove' });
    }
  };
  const handleCancel = async (...args) => {
    if (onCancel && typeof onCancel == 'function') {
      await onCancel(args);
    }
    if (window.self !== window.top) {
      MsgManager.getInstance().sendMsg('modal-open', { type: 'remove' });
    }
  };
  const opt: ModalFuncProps = {
    centered: true,
    icon: getIcon(iconType),
    ...options,
    onOk: handleOk,
    onCancel: handleCancel,
    content: renderContent(options),
  };
  if (window.self !== window.top) {
    MsgManager.getInstance().sendMsg('modal-open', { type: 'open' });
  }
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
  SysMessage.getInstance().info(content);
}

// 错误消息
function error(content: string) {
  SysMessage.getInstance().error(content);
}

// 成功消息
function success(content: string) {
  SysMessage.getInstance().success(content);
}

// 警告消息
function warning(content: string) {
  SysMessage.getInstance().warning(content);
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
  notification.info({
    message: '通知提示',
    description: content,
  });
}

// 错误通知
function notifyError(content: string) {
  notification.error({
    message: '错误提示',
    description: content,
  });
}

// 成功通知
function notifySuccess(content: string) {
  notification.success({
    message: '成功提示',
    description: content,
  });
}

// 警告通知
function notifyWarning(content: string) {
  notification.warning({
    message: '警告提示',
    description: content,
  });
}

// 确认窗体
function confirm(content: string, tip?: string) {
  const { t } = useI18n();
  MsgManager.getInstance().sendMsg('modal-open', { type: 'open' });
  return Modal.confirm({
    title: tip ? tip : t('common.message.confirmTitle'),
    content: content,
    onOk() {
      return new Promise((resolve) => {
        setTimeout(resolve, 0);
      })
        .catch(() => console.log('error'))
        .finally(() => MsgManager.getInstance().sendMsg('modal-open', { type: 'remove' }));
    },
    onCancel() {
      MsgManager.getInstance().sendMsg('modal-open', { type: 'remove' });
    },
  });
}

// 删除窗体
const delConfirm = async (content?: string, tip?: string) => {
  const { t } = useI18n();
  MsgManager.getInstance().sendMsg('modal-open', { type: 'open' });
  const callback = new Promise((resolve, reject) => {
    Modal.confirm({
      title: tip ? tip : t('common.message.confirmTitle'),
      icon: createVNode(ExclamationCircleOutlined),
      content: content ? content : t('common.message.delMessage'),
      onOk() {
        MsgManager.getInstance().sendMsg('modal-open', { type: 'remove' });
        resolve(true);
      },
      onCancel() {
        MsgManager.getInstance().sendMsg('modal-open', { type: 'remove' });
        reject(false);
      },
    });
  });
  return await callback;
};

// 导出窗体
function exportConfirm(content?: string, tip?: string) {
  const { t } = useI18n();
  MsgManager.getInstance().sendMsg('modal-open', { type: 'open' });
  return Modal.confirm({
    title: tip ? tip : t('common.message.confirmTitle'),
    content: content ? content : t('common.message.exportMessage'),
    onOk() {
      return new Promise((resolve) => {
        setTimeout(resolve, 0);
      })
        .catch(() => console.log('error'))
        .finally(() => MsgManager.getInstance().sendMsg('modal-open', { type: 'remove' }));
    },
    onCancel() {
      MsgManager.getInstance().sendMsg('modal-open', { type: 'remove' });
    },
  });
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

export class SysMessage {
  private static instance: SysMessage;
  private static lastMessage: string;
  private static lasttime: number;

  static getInstance() {
    if (!SysMessage.instance) {
      const instance = new SysMessage();
      SysMessage.instance = instance;
      try {
        if (!Reflect.has(window.top, 'SysMessage')) {
          window.top.SysMessage = instance;
        }
        if (window.top !== window) {
          SysMessage.instance = window?.top?.SysMessage ? window?.top?.SysMessage : instance;
        } else {
          SysMessage.instance = instance;
          window.SysMessage = instance;
        }
      } catch (error) {
        //
      }
    }
    return SysMessage.instance;
  }

  constructor() {
    SysMessage.lasttime = 0;
    SysMessage.lastMessage = '';
  }

  static valid(content) {
    const nowtime = new Date().getTime();
    if (SysMessage.lastMessage == content && nowtime < SysMessage.lasttime + 3000) {
      return false;
    } else {
      return true;
    }
  }

  info(content: string) {
    if (SysMessage.valid(content) && !document.hidden) {
      SysMessage.lasttime = new Date().getTime();
      SysMessage.lastMessage = content;
      Message.info(content);
    }
  }

  error(content: string) {
    if (SysMessage.valid(content) && !document.hidden) {
      SysMessage.lasttime = new Date().getTime();
      SysMessage.lastMessage = content;
      Message.error(content);
    }
  }

  success(content: string) {
    if (SysMessage.valid(content) && !document.hidden) {
      SysMessage.lasttime = new Date().getTime();
      SysMessage.lastMessage = content;
      Message.success(content);
    }
  }

  warning(content: string) {
    if (SysMessage.valid(content) && !document.hidden) {
      SysMessage.lasttime = new Date().getTime();
      SysMessage.lastMessage = content;
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
