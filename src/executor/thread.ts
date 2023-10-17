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
  public interval = 100;

  constructor(callback = () => {}) {
    this.callback = callback;
    this.arrayTask = [];
  }

  run() {
    // TODO
  }

  pushTask(callback: Function) {
    this.callback = callback;
  }

  pushOnceTask(callback: Function) {
    this.arrayTask.push(callback);
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
        this.callback(); // 执行回调函数
        // 执行临时任务
        if (this.arrayTask.length > 0) {
          this.arrayTask.forEach((callback) => {
            callback();
          });
          this.arrayTask = [];
        }
      }
    }, this.interval);
  }
}
