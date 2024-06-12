import { clearStorageListener } from '@/utils/event/index';
import { Config } from '/@/constant/constant';
import { useRouter } from 'vue-router';
import { TaskExecutor } from '/@/executor/taskExecutor';
import { OnceExecutor } from '/@/executor/onceExecutor';

const REFRESH_TIME_INTERVAL = [100, 300, 500, 700, 900, 1000, 1250, 1500];

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

const setTimeoutExecs = (callback, intervals) => {
  intervals.forEach((interval) => {
    setTimeout(() => {
      callback();
    }, interval);
  });
};

const pushToLastPath = (element, diff) => {
  const path = window.location.hash.replace('#/', '/');
  const targetPath = element.path.replace('#/', '/');
  const prefix = element.path.includes('/#') ? '' : '/#';
  if (diff < 10000 && path != targetPath) {
    window.location.href = window.origin + prefix + element.path;
  }
  sessionStorage.removeItem('ROUTE_PUSH_PATH');
};

const handleLoginCheck = () => {
  setTimeout(() => {
    const hash = window.location.hash.replace('#/', '/');
    const path = window.location.hash.replace('#/', '/').split('?')[0];
    if (path == '/login' && path != hash) {
      window.location.href = window.origin + '/#/login?_t=' + new Date().getTime();
    }
  }, 300);
};

const handleRouteRefresh = () => {
  const item = sessionStorage.getItem('ROUTE_PUSH_PATH');
  if (item) {
    const element = JSON.parse(item);
    const diff = new Date().getTime() - element.time;
    setTimeoutExecs(() => {
      pushToLastPath(element, diff);
    }, REFRESH_TIME_INTERVAL);
  }
  handleLoginCheck();
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
    this.registerExecutor();
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
    handleRouteRefresh();
  }

  public registerExecutor() {
    if (window.self != window.top) {
      TaskExecutor.getInstance().start();
      OnceExecutor.getInstance().start();
    }
  }

  // 销毁所有Manager
  public destory() {
    this.destoryClearStorage();
    this.destoryMessage();
    this.destoryUnload();
    this.destoryExecutor();
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

  public destoryExecutor() {
    // 清空线程执行
    TaskExecutor.getInstance().destroy();
    OnceExecutor.getInstance().destroy();
  }
}
