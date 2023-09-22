/***
 * @description 线程基类
 * @class  Thread 线程基类
 * @classdesc 线程基类，处理定时执行的基本逻辑，设置定时时间间隔、执行启动及关闭等功能
 */
export abstract class Thread {
  private timer;
  private running = false;
  private callback;
  public interval = 100;

  constructor(callback = () => {}) {
    this.callback = callback;
  }

  abstract run(): void;

  pushTask(callback) {
    this.callback = callback;
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
      }
    }, this.interval);
  }
}
