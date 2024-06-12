const STRING_PREFIX = '__s__';
const OBJECT_PREFIX = '__o__';

export class CacheManager {
  private static instance: CacheManager | undefined;
  private static storage: any;

  constructor() {
    CacheManager.storage = sessionStorage;
  }

  // 获取示例函数
  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      const instance = new CacheManager();
      CacheManager.instance = instance;
      try {
        if (!Reflect.has(window, 'MsgManager')) {
          window.CacheManager = instance;
        }
        if (!Reflect.has(window.top, 'MsgManager')) {
          window.top.CacheManager = instance;
        }
      } catch (error) {
        window.CacheManager = instance;
      }
    }
    return CacheManager.instance as CacheManager;
  }

  // 设置缓存
  setCache<T>(key: string, value: T): void {
    let storedValue: string;
    if (typeof value === 'string') {
      storedValue = `${STRING_PREFIX}${value}`;
    } else {
      storedValue = `${OBJECT_PREFIX}${JSON.stringify(value)}`;
    }
    CacheManager.storage.setItem(key, storedValue);
  }

  // 获取缓存
  getCache<T>(key: string): T | null {
    const storedValue = CacheManager.storage.getItem(key);
    if (!storedValue) {
      return null;
    }
    try {
      if (storedValue.startsWith(STRING_PREFIX)) {
        return storedValue.slice(STRING_PREFIX.length) as T;
      } else if (storedValue.startsWith(OBJECT_PREFIX)) {
        return JSON.parse(storedValue.slice(OBJECT_PREFIX.length)) as T;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error parsing cached value:', error);
      return null;
    }
  }

  // 移除缓存
  remove(key: string): void {
    CacheManager.storage.removeItem(key);
  }

  // 清除所有缓存
  clear(): void {
    CacheManager.storage.clear();
  }
}
