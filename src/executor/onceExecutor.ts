import { TimeInterval } from '@/constant/constant';
import { Thread } from '@/executor/thread';

/***
 * @description Once任务线程
 * @class  OnceExecutor 任务线程执行器
 * @classdesc 任务线程，定时执行主动指令、阈值指令、定时任务指令，处理几类指令的调度任务
 */
export class OnceExecutor extends Thread {
  private static instance: OnceExecutor;

  static getInstance() {
    if (!OnceExecutor.instance) {
      OnceExecutor.instance = new OnceExecutor();
    }
    return OnceExecutor.instance;
  }

  static getNewInstance() {
    return new OnceExecutor();
  }

  constructor() {
    super();
    this.interval = TimeInterval.ONE_SECOND;
  }

  override run() {
    // TODO
  }
}
