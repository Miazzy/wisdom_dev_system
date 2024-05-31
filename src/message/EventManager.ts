import { clearStorageListener } from '@/utils/event/index';
import { Config } from '/@/constant/constant';
import { useRouter } from 'vue-router';

const listenMessage = (event) => {
  const router = useRouter();
  const { currentRoute } = router;
  if (Config.RENDER_ENGINE_URL.includes(event.origin)) {
    const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
    if (data.message == 'verify_route') {
      if (data.action == 'load') {
        router.push(data.path);
      }
    }
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
  }

  // 监听清空缓存操作
  public registerClearStorage() {
    window.addEventListener('storage', clearStorageListener);
  }

  public registerMessage() {
    window.addEventListener('message', listenMessage);
  }

  // 销毁所有Manager
  public destory() {
    this.destoryClearStorage();
    this.destoryMessage();
  }

  // 注销监听清空缓存
  public destoryClearStorage() {
    window.removeEventListener('storage', clearStorageListener);
  }

  public destoryMessage() {
    window.removeEventListener('message', listenMessage);
  }
}
