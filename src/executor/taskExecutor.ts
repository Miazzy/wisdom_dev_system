import { TimeInterval } from '@/constant/constant';
import { Thread } from '@/executor/thread';

/***
 * @description 任务线程
 * @class  TaskExecutor 任务线程执行器
 * @classdesc 任务线程，定时执行调度任务
 */
export class TaskExecutor extends Thread {
  private static instance: TaskExecutor;

  static getInstance(time = TimeInterval.TEN_SECOND) {
    if (!TaskExecutor.instance) {
      TaskExecutor.instance = new TaskExecutor(time);
    }
    return TaskExecutor.instance;
  }

  static getNewInstance(time = TimeInterval.TEN_SECOND) {
    return new TaskExecutor(time);
  }

  constructor(time = TimeInterval.TEN_SECOND) {
    super();
    this.interval = time || TimeInterval.ONE_HOUR;
  }

  override run() {
    // TODO
  }
}
