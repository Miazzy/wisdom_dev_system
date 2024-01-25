/**
 * @description 主题类
 */
class Subject {
  observers;

  constructor() {
    this.observers = new Set();
  }

  // 注册观察者
  addObserver(observer) {
    this.observers.add(observer);
  }

  // 移除观察者
  removeObserver(observer) {
    this.observers.delete(observer);
  }

  // 通知观察者
  notifyObservers(channelName, message) {
    for (const observer of this.observers) {
      observer.update(channelName, message);
    }
  }
}

/**
 * @description 观察者
 */
class Observer {
  channelName;
  callback;
  constructor(channelName, callback) {
    this.channelName = channelName;
    this.callback = callback;
  }

  // 更新方法，当主题状态发生变化时调用
  update(channelName, message) {
    if (channelName === this.channelName) {
      this.callback(message);
    }
  }
}

/**
 * @description 全局推送监听消息类
 */
export class MsgManager extends Subject {
  private static instance: MsgManager | undefined;
  private static channels: Map<string, any>;
  private static subchannels: Map<string, any>;

  constructor() {
    super();
    MsgManager.channels = new Map<string, any>();
    MsgManager.subchannels = new Map<string, any>();
  }

  // 获取示例函数
  static getInstance(): MsgManager {
    if (!MsgManager.instance) {
      const instance = new MsgManager();
      MsgManager.instance = instance;
      try {
        if (!Reflect.has(window.top, 'MsgManager')) {
          window.top.MsgManager = instance;
        }
        if (window.top !== window) {
          MsgManager.instance = window?.top?.MsgManager ? window?.top?.MsgManager : instance;
        } else {
          MsgManager.instance = instance;
          window.MsgManager = instance;
        }
      } catch (error) {
        //
      }
    }
    return MsgManager.instance as MsgManager;
  }

  // 向指定信道推送信息
  public sendMsg(channelName, message) {
    let subchannel = MsgManager.subchannels.get(channelName);
    if (!subchannel) {
      subchannel = new Set();
      MsgManager.subchannels.set(channelName, subchannel);
    }
    subchannel.add(message);
    this.notifyObservers(channelName, message);

    let channel = MsgManager.channels.get(channelName);
    if (!channel) {
      channel = new BroadcastChannel(channelName);
      MsgManager.channels.set(channelName, channel);
    }
    channel.postMessage(message);
  }

  // 监听指定信道消息
  public listen(channelName, callback) {
    let channel = MsgManager.channels.get(channelName);
    if (!channel) {
      channel = new BroadcastChannel(channelName);
      MsgManager.channels.set(channelName, channel);
    }
    channel.onmessage = (event) => {
      const message = event.data;
      callback(message);
    };

    const observer = new Observer(channelName, callback);
    this.addObserver(observer);
    let subchannel = MsgManager.subchannels.get(channelName);
    if (!subchannel) {
      subchannel = new Set();
      MsgManager.subchannels.set(channelName, subchannel);
    }
    subchannel.forEach((message) => {
      observer.update(channelName, message);
    });
  }
}
