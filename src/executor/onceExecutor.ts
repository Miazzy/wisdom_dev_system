import { TimeInterval } from '@/constant/constant';
import { Thread } from '@/executor/thread';

/***
 * @description Once任务线程
 * @class  OnceExecutor 任务线程执行器
 * @classdesc 任务线程，定时执行主动指令、阈值指令、定时任务指令，处理几类指令的调度任务
 */
export class OnceExecutor extends Thread {
  private static instance: OnceExecutor;

  static getInstance(time = TimeInterval.ONE_SECOND) {
    if (!OnceExecutor.instance) {
      const instance = new OnceExecutor(time); // OnceExecutor.instance = new OnceExecutor(time);
      OnceExecutor.instance = instance;
      try {
        if (!Reflect.has(window.top, 'OnceExecutor')) {
          window.top.OnceExecutor = instance;
        }
        if (window.top !== window) {
          OnceExecutor.instance = window?.top?.OnceExecutor ? window?.top?.OnceExecutor : instance;
        } else {
          OnceExecutor.instance = instance;
        }
      } catch (error) {
        //
      }
    }
    return OnceExecutor.instance;
  }

  static getNewInstance(time = TimeInterval.TEN_SECOND) {
    return new OnceExecutor(time);
  }

  constructor(time = TimeInterval.ONE_SECOND) {
    super();
    this.interval = time || TimeInterval.ONE_SECOND;
  }

  override run() {
    // TODO
  }
}
