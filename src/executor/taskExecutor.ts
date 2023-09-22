import { TimeInterval } from '@/constant/constant';
import { Thread } from '@/executor/thread';

/***
 * @description 任务线程
 * @class  SensorExecutor 任务线程执行器
 * @classdesc 任务线程，定时执行主动指令、阈值指令、定时任务指令，处理几类指令的调度任务
 */
export class TaskExecutor extends Thread {
  private static instance: TaskExecutor;

  static getInstance() {
    if (!TaskExecutor.instance) {
      TaskExecutor.instance = new TaskExecutor();
    }
    return TaskExecutor.instance;
  }

  static getNewInstance() {
    return new TaskExecutor();
  }

  constructor() {
    super();
    this.interval = TimeInterval.ONE_HOUR;
  }

  run() {
    // TODO
  }
}
