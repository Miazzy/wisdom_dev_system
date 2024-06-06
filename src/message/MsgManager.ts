interface Emitter {
  on(type: String, handler: Function): void;
  off(type: String, handler?: Function): void;
  emit(type: String, args: Object): void;
}

/**
 * @description 空回调函数
 */
const emptyCallback = (type: string, args: any = '...') => {
  console.info('msgmanager exec empty callback: ', type, args);
};

/**
 * @description 主题类
 */
class Subject {
  observers;
  observeMap;

  constructor() {
    this.observers = new Set();
    this.observeMap = new Map<string, Set<any>>();
  }

  // 注册观察者
  addObserver(observer) {
    const channelName = observer.getChannelName();
    this.observers.add(observer);
    if (channelName) {
      const sets = this.observeMap.get(channelName);
      if (!sets) {
        this.observeMap.set(channelName, new Set([observer]));
      } else {
        sets.add(observer);
        this.observeMap.set(channelName, sets);
      }
    }
  }

  // 移除观察者
  removeObserver(observer) {
    this.observers.delete(observer);
  }

  // 通知观察者
  notifyObservers(channelName, message) {
    try {
      const sets = this.observeMap.get(channelName);
      if (sets && sets.size) {
        sets.forEach((observer) => observer.update(channelName, message));
      } else {
        for (const observer of this.observers) {
          if (channelName === observer.getChannelName()) {
            observer.update(channelName, message);
          }
        }
      }
    } catch (error) {
      //
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

  getChannelName() {
    return this.channelName;
  }
}

/**
 * @description 全局推送监听消息类
 */
export class MsgManager extends Subject {
  private static instance: MsgManager | undefined;
  private static channels: Map<string, any>;
  private static subchannels: Map<string, any>;
  private static emitter: Emitter;

  constructor() {
    super();
    MsgManager.channels = new Map<string, any>();
    MsgManager.subchannels = new Map<string, any>();
    MsgManager.emitter = window?.mitt ? window?.mitt() : { on: emptyCallback, off: emptyCallback, emit: emptyCallback };
  }

  // 获取示例函数
  static getInstance(): MsgManager {
    if (!MsgManager.instance) {
      const instance = new MsgManager();
      MsgManager.instance = instance;
      try {
        if (!Reflect.has(window, 'MsgManager')) {
          window.MsgManager = instance;
        }
        if (!Reflect.has(window.self, 'MsgManager')) {
          window.self.MsgManager = instance;
        }
        if (!Reflect.has(window.top, 'MsgManager')) {
          window.top.MsgManager = instance;
        }
      } catch (error) {
        window.MsgManager = instance;
      }
    }
    return MsgManager.instance as MsgManager;
  }

  // 向指定信道推送信息
  public sendMsg(channelName, message) {
    try {
      const precall = async () => {
        try {
          let channel = MsgManager.channels.get(channelName);
          if (!channel) {
            channel = new BroadcastChannel(channelName);
            MsgManager.channels.set(channelName, channel);
          }
          channel.postMessage(message);
        } catch (error) {
          //
        }
      };
      precall();
      const callback = async () => {
        try {
          let subchannel = MsgManager.subchannels.get(channelName);
          if (!subchannel) {
            subchannel = new Set();
            MsgManager.subchannels.set(channelName, subchannel);
          }
          subchannel.add(message);
          this.notifyObservers(channelName, message);
        } catch (error) {
          //
        }
      };
      callback();
    } catch (error) {
      //
    }
    try {
      MsgManager.emitter.emit(channelName, message);
    } catch {
      //
    }
  }

  // 监听指定信道消息
  public listen(channelName, callback) {
    try {
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
    } catch (error) {
      //
    }
    try {
      MsgManager.emitter.on(channelName, callback);
    } catch {
      //
    }
  }
}
