export class MsgManager {
  private static instance: MsgManager | undefined;
  private static channels: Map<string, any>;

  constructor() {
    MsgManager.channels = new Map<string, any>();
  }

  getInstance() {
    if (!MsgManager.instance) {
      MsgManager.instance = new MsgManager();
    }
    return MsgManager.instance;
  }

  sendMsg(channelName, message) {
    let channel = MsgManager.channels.get(channelName);
    if (!channel) {
      channel = new BroadcastChannel(channelName);
      MsgManager.channels.set(channelName, channel);
    }
    channel.postMessage(message);
  }

  listen(channelName, callback) {
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
