<template>
  <div
    class="monitor-video-item"
    :style="`width: ${typeof props.width == 'number' ? props.width + 'px' : props.width}; height: ${
      typeof props.height == 'number' ? props.height + 'px' : props.height
    }`"
  >
    <div class="video-box">
      <div class="mcs8-video">
        <video
          class="video-layout"
          ref="mcs8Video"
          :src="videoSrc"
          autoplay
          playsinline
          controls
        ></video>
      </div>
    </div>
    <div class="title-box">
      <span>{{ props.title }}</span>
      <Icon icon="fluent-mdl2:scale-volume" style="font-size: 0.14rem" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, onUnmounted, ref } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { useMessage } from '@/hooks/web/useMessage';

  const props = defineProps({
    width: { type: [Number, String], default: 340 },
    height: { type: [Number, String], default: 208 },
    title: { type: String, default: '' },
    videoType: { type: String, default: '' },
    videoSrc: { type: String, default: '' },
    devId: { type: String, default: '', required: true },
  });

  const message = useMessage();
  const mcs8Video = ref();
  const client = ref();

  // 初始化
  const init = async () => {
    // 实时视频才初始化
    if (props.videoType !== 'real') {
      return;
    }
    if (!client.value) {
      await connectServer();
    }
  };

  // 加载实时视频
  const loadRealTimeVideo = async () => {
    await client.value.openVideo(props.devId, mcs8Video.value);
  };

  // 连接服务器
  const connectServer = async () => {
    client.value = new mcs8Client(); //第一步：创建SDK实例

    //第二步：注册SDK回调
    client.value.on('OnManage', (request) => {
      switch (request.method) {
        case 'responseConnect': //连接服务器返回
          {
            if (request.errCode == 200) {
              // document.getElementById('txtlog').value = '登录成功';
              console.log('登录成功');
            }
            if (request.errCode == 401 || request.errCode == 502) {
              message.error('连接断开');
            }
            if (request.errCode == 500) {
              message.error('连接服务器失败');
            }
          }
          break;
        case 'ConnecteInfo': //返回服务器信息
          {
            // if (request.data != null) {
            //     var defaultGrpId = request.data.defaultGroup;
            //     const connParam = { groupId: defaultGrpId, talkGroupType: 3, temGroupType: 0, isCreator: 0 }
            //     var result = client.add2MediaGroup(connParam);
            //     newGroupId = defaultGrpId;//记录当前组ID
            //     document.getElementById('txtGroupId').value = defaultGrpId;
            // }
          }
          break;
        case 'responseConnectMedia': //媒体连接
          {
            if (request.errCode == 200) {
              // document.getElementById('txtlog').value='媒体登录成功';
              console.log('媒体登录成功');

              setTimeout(async () => {
                await loadRealTimeVideo();
              }, 500);
            }
            if (request.errCode == 401) {
              // document.getElementById('txtlog').value='连接媒体断开';
            }
            if (request.errCode == 500) {
              // document.getElementById('txtlog').value='连接媒体服务器失败';
            }
            if (request.errCode == 502) {
              //document.getElementById('txtlog').value='连接媒体断开';
            }
          }
          break;
        case 'joinRoom': //加入组成功,返回组成员ID列表
          {
            // if (request.data.groupId == newGroupId)//判断是否为当前创建的组
            // {
            //     if (request.data != null && request.data.peers != null && request.data.peers.length > 0) {
            //         for (var peer of request.data.peers)//在线设备列表
            //         {
            //             var videoObj = createDomObject(peer.id, 3);
            //             client.addShowObject({ groupId: newGroupId, devId: peer.id, kind: 'audio', showObj: videoObj });//音频
            //         }
            //     }
            // }
          }
          break;
        case 'newPeer': //新成员加入时返回成员信息
          {
            // if (request.data.groupId == newGroupId)//判断是否为当前创建的组
            // {
            //     var videoObj = createDomObject(request.data.id, 3);
            //     client.addShowObject({ groupId: newGroupId, devId: request.data.id, kind: 'audio', showObj: videoObj });//音频
            // }
          }
          break;
        case 'peerClosed': //当组成员时退出组时返回
          {
            // var ulObj = document.getElementById("imglist");
            // var liList = ulObj.getElementsByTagName("li");
            // if (liList != null && liList.length > 0) {
            //     for (i = 0; i < liList.length; i++) {
            //         if (liList[i].id == request.data.devId) {
            //             liList[i].remove();
            //             break;
            //         }
            //     }
            // }
          }
          break;
        case 'responseConnectGateway':
          if (request.errCode === 502) {
            message.error('连接失败，请核查输入信息');
            if (client.value != null) {
              client.value.close();
              client.value = null;
            }
          }
          break;
        default:
          // message.error(JSON.stringify(request))
          break;
      }
      // document.getElementById('txtlog').append(JSON.stringify(request));
    });
    const connectModel = {
      host: 'yyzx.zfy.ygwl.net',
      port: '7709',
      uid: 'pc1',
      pwd: '000000',
      // localVideo: document.getElementById('local_video'),
      // localAudio: document.getElementById('local_audio'),
      ssl: true,
    };

    // 连接服务器
    await client.value.connect(connectModel);
  };

  const closeMcs8Video = async () => {
    await client.value.closeVideo(props.devId);
    await client.value.close();
  };

  onMounted(() => {
    init();
  });

  onUnmounted(() => {
    if (client.value) {
      closeMcs8Video();
    }
  });

  // 主动暴露组件方法
  defineExpose({
    openVideo: () => {
      if (client.value) {
        loadRealTimeVideo();
      }
    },
    closeVideo: () => {
      if (client.value) {
        closeMcs8Video();
      }
    },
  });
</script>

<style lang="less" scoped>
  .monitor-video-item {
    position: relative;
    background-color: rgb(8 95 148 / 30%);

    .video-box {
      width: 100%;
      height: 100%;

      .mcs8-video {
        position: relative;

        .close-btn {
          position: absolute;
          z-index: 1;
          top: 10px;
          right: 10px;
          color: #fff;
          font-size: 20px;
          cursor: pointer;
        }

        .video-layout {
          display: block;
          width: 100%;
        }
      }
    }

    .title-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 0.32rem;
      padding: 0 0.14rem;
      background-color: rgb(0 0 0 / 50%);
      color: #fff;
      font-size: 0.14rem;
      line-height: 0.32rem;
    }
  }
</style>
