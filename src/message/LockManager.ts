interface LockManagerInterface {
  acquireLock(lockName: string, lockValue?: string): Promise<void>;
  releaseLock(lockName: string): Promise<void>;
  hasLock(lockName: string): Promise<boolean>;
}

export class LockManager implements LockManagerInterface {
  private static instance: LockManager | undefined;
  private static prefix = 'SESSION_LOCK_';

  constructor() {}

  // 获取示例函数
  static getInstance(): LockManagerInterface {
    if (!LockManager.instance) {
      const instance = new LockManager();
      LockManager.instance = instance;
      try {
        if (!Reflect.has(window, 'MsgManager')) {
          window.LockManager = instance;
        }
        if (!Reflect.has(window.top, 'MsgManager')) {
          window.top.LockManager = instance;
        }
      } catch (error) {
        window.LockManager = instance;
      }
    }
    return LockManager.instance as LockManagerInterface;
  }

  async acquireLock(lockName: string, lockValue: string = 'true'): Promise<void> {
    const lockKey = `${LockManager.prefix}${lockName}`;
    const existingValue = await this.hasLock(lockName);
    if (!existingValue) {
      await window.sessionStorage.setItem(lockKey, lockValue);
    } else {
      throw new Error('Lock already acquired.');
    }
  }

  async releaseLock(lockName: string): Promise<void> {
    const lockKey = `${LockManager.prefix}${lockName}`;
    await window.sessionStorage.removeItem(lockKey);
  }

  async hasLock(lockName: string): Promise<boolean> {
    const lockKey = `${LockManager.prefix}${lockName}`;
    const value = await window.sessionStorage.getItem(lockKey);
    return !!value;
  }
}
