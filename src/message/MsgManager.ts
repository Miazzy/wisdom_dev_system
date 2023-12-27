/**
 * @description 全局推送监听消息类
 */
export class MsgManager {
  private static instance: MsgManager | undefined;
  private static channels: Map<string, any>;

  constructor() {
    MsgManager.channels = new Map<string, any>();
  }

  // 获取示例函数
  static getInstance(): MsgManager {
    if (!MsgManager.instance) {
      MsgManager.instance = new MsgManager();
    }
    return MsgManager.instance;
  }

  // 向指定信道推送信息
  public sendMsg(channelName, message) {
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
  }
}
