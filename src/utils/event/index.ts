import ResizeObserver from 'resize-observer-polyfill';
import { sendOfflineMessage } from '@/utils/route';
import { SysMessage } from '/@/hooks/web/useMessage';

const isServer = typeof window === 'undefined';

/* istanbul ignore next */
function resizeHandler(entries: any[]) {
  for (const entry of entries) {
    const listeners = entry.target.__resizeListeners__ || [];
    if (listeners.length) {
      listeners.forEach((fn: () => any) => {
        fn();
      });
    }
  }
}

/* istanbul ignore next */
export function addResizeListener(element: any, fn: () => any) {
  if (isServer) return;
  if (!element.__resizeListeners__) {
    element.__resizeListeners__ = [];
    element.__ro__ = new ResizeObserver(resizeHandler);
    element.__ro__.observe(element);
  }
  element.__resizeListeners__.push(fn);
}

/* istanbul ignore next */
export function removeResizeListener(element: any, fn: () => any) {
  if (!element || !element.__resizeListeners__) return;
  element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
  if (!element.__resizeListeners__.length) {
    element.__ro__.disconnect();
  }
}

export function triggerWindowResize() {
  const event = document.createEvent('HTMLEvents');
  event.initEvent('resize', true, true);
  (event as any).eventType = 'message';
  window.dispatchEvent(event);
}

export function clearStorageListener(e) {
  if (SysMessage.logouting) {
    return;
  }
  if (e?.storageArea?.length === 0 && e?.key === null && e?.newValue === null) {
    console.info('执行 logout 操作，监听到清空缓存... ', new Date().getTime());
    sendOfflineMessage();
  }
}
