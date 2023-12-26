import { DateTools } from '/@/utils/dateUtil';

/***
 * @description 线程基类
 * @class  Thread 线程基类
 * @classdesc 线程基类，处理定时执行的基本逻辑，设置定时时间间隔、执行启动及关闭等功能
 */
export class Thread {
  private timer;
  private running = false;
  private callback;
  private arrayTask;
  private listTask;
  public interval = 100;

  constructor(callback = () => {}) {
    this.callback = callback;
    this.arrayTask = [];
    this.listTask = [];
  }

  run() {
    // TODO
  }

  pushTask(callback: Function) {
    this.callback = callback;
  }

  removeTask() {
    this.callback = null;
  }

  pushOnceTask(callback: Function) {
    this.arrayTask.push(callback);
  }

  pushListTask(id, callback: Function, interval = 1000) {
    const lasttime = new Date().getTime();
    this.listTask.push({ id, callback, interval, lasttime });
  }

  removeListTask(id) {
    this.listTask = this.listTask.filter((task) => task.id !== id);
  }

  setTimeValue(timeValue) {
    this.interval = timeValue;
  }

  start() {
    if (!this.running) {
      this.running = true;
      this.runLoop();
    }
  }

  stop() {
    if (this.running) {
      this.running = false;
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  runLoop() {
    this.timer = setInterval(() => {
      if (this.running) {
        this.run();
        // 执行回调函数
        if (this.callback != null && typeof this.callback == 'function') {
          this.callback();
        }
        // 执行临时任务
        if (this.arrayTask.length > 0) {
          this.arrayTask.forEach((callback) => {
            callback();
          });
          setTimeout(() => {
            this.arrayTask = [];
          }, 1000);
        }
        // 执行循环任务
        if (this.listTask.length > 0) {
          this.listTask.forEach((element) => {
            const currentTime = new Date().getTime();
            const time = DateTools.format(new Date(), 'hh:mm:ss');
            const { id, callback, interval, lasttime } = element;
            if (currentTime > lasttime + interval) {
              callback();
              element.lasttime = new Date().getTime();
              console.info(`now exec task, which id is `, id, ' time:', time);
            }
          });
        }
      }
    }, this.interval);
  }
}
