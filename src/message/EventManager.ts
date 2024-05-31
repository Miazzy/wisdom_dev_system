import { clearStorageListener } from '@/utils/event/index';
import { Config } from '/@/constant/constant';
import { useRouter } from 'vue-router';

const listenMessage = (event) => {
  const router = useRouter();
  if (Config.RENDER_ENGINE_URL.includes(event.origin)) {
    const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
    if (data.message == 'verify_route') {
      if (data.action == 'load') {
        router.push(data.path);
      }
    }
  }
};

const beforeUnloadHandler = (event) => {
  console.info(window.location.href);
  console.info(event);
  // 记录当前大屏地址，然后再次跳转到此大屏地址
  const path = window.location.hash.replace('#/', '/');
  if (!path.startsWith('/frame')) {
    const element = JSON.stringify({ time: new Date().getTime(), path });
    sessionStorage.setItem('ROUTE_PUSH_PATH', element);
  }
};

/**
 * @description 全局Event管理器
 */
export class EventManager {
  private static instance: EventManager | undefined;

  constructor() {}

  // 获取Instance函数
  static getInstance(): EventManager {
    if (!EventManager.instance) {
      const instance = new EventManager();
      EventManager.instance = instance;
    }
    return EventManager.instance as EventManager;
  }

  // 注册所有Manager
  public register() {
    this.registerClearStorage();
    this.registerMessage();
    this.registerUnload();
    this.registerRouteRefresh();
  }

  // 监听清空缓存操作
  public registerClearStorage() {
    window.addEventListener('storage', clearStorageListener);
  }

  public registerMessage() {
    window.addEventListener('message', listenMessage);
  }

  public registerUnload() {
    window.addEventListener('beforeunload', beforeUnloadHandler);
  }

  public registerRouteRefresh() {
    const router = useRouter();
    const item = sessionStorage.getItem('ROUTE_PUSH_PATH');
    if (item) {
      const element = JSON.parse(item);
      const diff = new Date().getTime() - element.time;
      const path = window.location.hash.replace('#/', '/');
      setTimeout(() => {
        if (diff < 5000 && path != element.path) {
          router.push(element.path);
          sessionStorage.removeItem('ROUTE_PUSH_PATH');
        }
      }, 1000);
    }
  }

  // 销毁所有Manager
  public destory() {
    this.destoryClearStorage();
    this.destoryMessage();
    this.destoryUnload();
  }

  // 注销监听清空缓存
  public destoryClearStorage() {
    window.removeEventListener('storage', clearStorageListener);
  }

  public destoryMessage() {
    window.removeEventListener('message', listenMessage);
  }

  public destoryUnload() {
    window.removeEventListener('beforeunload', beforeUnloadHandler);
  }
}
