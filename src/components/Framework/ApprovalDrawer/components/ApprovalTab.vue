<template>
  <div class="approval-tab">
    <!-- <div class="flow-item">
      <div class="flow-item-left">
        <div class="circle-out">
          <div class="circle-inner-text blue">云</div>
          <div class="status-icon green">
            <Icon class="fit-status-icon" icon="ant-design:check-outlined" color="#fff" size="8" />
          </div>
        </div>
        <div class="flow-vertical-line solid"></div>
      </div>
      <div class="flow-item-right">
        <div class="flow-row-1">
          <span class="node-name-text">发起申请</span>
          <span class="node-time-text">2010-05-01 16:30:05</span>
        </div>
        <div class="flow-row-2">
          <span class="person-text">设计部－电气组工程师－杨光云</span>
        </div>
      </div>
    </div>
    <div class="flow-item">
      <div class="flow-item-left">
        <div class="circle-out">
          <div class="circle-inner-icon">
            <Icon icon="ant-design:usergroup-delete-outlined" color="#fff" size="16" />
          </div>
          <div class="status-icon green">
            <Icon class="fit-status-icon" icon="ant-design:check-outlined" color="#fff" size="8" />
          </div>
        </div>
      </div>
      <div class="flow-item-right">
        <div class="flow-row-1">
          <span class="node-name-text">多人并审</span>
        </div>
        <div class="flow-item">
          <div class="flow-item-left">
            <div class="circle-out">
              <div class="circle-inner-text blue">福</div>
              <div class="status-icon green">
                <Icon
                  class="fit-status-icon"
                  icon="ant-design:check-outlined"
                  color="#fff"
                  size="8"
                />
              </div>
            </div>
            <div class="flow-vertical-line solid"></div>
          </div>
          <div class="flow-item-right">
            <div class="flow-row-1">
              <span class="node-name-text">终端公司工程部负责人</span>
              <span class="node-time-text">2010-05-01 16:30:05</span>
            </div>
            <div class="flow-row-2">
              <span class="person-text">开发部－李福</span>
              <span class="flow-status-text blue">(发起)</span>
            </div>
            <div class="flow-row-3">
              <div class="comment-text">同意</div>
            </div>
          </div>
        </div>
        <div class="flow-item">
          <div class="flow-item-left">
            <div class="circle-out">
              <div class="circle-inner-text blue">林</div>
              <div class="status-icon green">
                <Icon
                  class="fit-status-icon"
                  icon="ant-design:check-outlined"
                  color="#fff"
                  size="8"
                />
              </div>
            </div>
            <div class="flow-vertical-line solid"></div>
          </div>
          <div class="flow-item-right">
            <div class="flow-row-1">
              <span class="node-name-text">终端公司工程部负责人</span>
              <span class="node-time-text">2010-05-01  16:30:05</span>
            </div>
            <div class="flow-row-2">
              <span class="person-text">工程部－周克林</span>
              <span class="flow-status-text green"> (同意)</span>
            </div>
            <div class="flow-row-3">
              <div class="comment-text">无异议同意此流程无异议同意此流程无异议同意此流程无异议</div>
            </div>
          </div>
        </div>
        <div class="flow-item">
          <div class="flow-item-left">
            <div class="circle-out">
              <div class="circle-inner-text blue">林</div>
              <div class="status-icon green">
                <Icon
                  class="fit-status-icon"
                  icon="ant-design:check-outlined"
                  color="#fff"
                  size="8"
                />
              </div>
            </div>
            <div class="flow-vertical-line solid"></div>
          </div>
          <div class="flow-item-right">
            <div class="flow-row-1">
              <span class="node-name-text">终端公司工程部负责人</span>
              <span class="node-time-text">2010-05-01  16:30:05</span>
            </div>
            <div class="flow-row-2">
              <span class="person-text">工程部－王林</span>
              <span class="flow-status-text green">(同意)</span>
            </div>
            <div class="flow-row-3">
              <div class="comment-text">同意没有为什么同意没有为什么同意没有为什么同意没有为什么同意没有为什么同意没有为什么</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flow-item">
      <div class="flow-item-left">
        <div class="circle-out">
          <div class="circle-inner-text blue">青</div>
          <div class="status-icon blue">
            <Icon class="fit-status-icon" icon="ic:round-edit" color="#fff" size="8" />
          </div>
        </div>
        <div class="flow-vertical-line dash"></div>
      </div>
      <div class="flow-item-right">
        <div class="flow-row-1">
          <span class="node-name-text">工程管理部负责人</span>
          <span class="node-time-text">2010-05-01 16:30:05</span>
        </div>
        <div class="flow-row-2">
          <span class="person-text">工程部－张长青</span>
          <span class="flow-status-text blue">(审批中)</span>
        </div>
        <div class="flow-row-3">
          <Textarea class="fit-comment-textarea" v-model:value="comment" placeholder="回复意见" :auto-size="{ minRows: 5 }" :bordered="false" />
        </div>
      </div>
    </div>
    <div class="flow-item">
      <div class="flow-item-left">
        <div class="circle-out">
          <div class="circle-inner-text gray">林</div>
        </div>
      </div>
      <div class="flow-item-right">
        <div class="flow-row-1">
          <span class="node-name-text">工程管理部总负责人</span>
          <span class="node-time-text">2010-05-01 16:30:05</span>
        </div>
        <div class="flow-row-2">
          <span class="person-text">工程部－李木林</span>
        </div>
      </div>
    </div> -->

    <div class="flow-item" v-for="(item, index) in innerFlowData" :key="item.id">
      <div class="flow-item-left">
        <div class="circle-out">
          <div class="circle-inner-text blue">{{
            item.assigneeUser.name ? item.assigneeUser.name.slice(-1) : ''
          }}</div>
          <div v-if="item.result && item.result !== 1" class="status-icon green">
            <Icon class="fit-status-icon" icon="ant-design:check-outlined" color="#fff" size="8" />
          </div>
          <div v-if="item.result && item.result === 1" class="status-icon blue">
            <Icon class="fit-status-icon" icon="ic:round-edit" color="#fff" size="8" />
          </div>
        </div>
        <div
          class="flow-vertical-line"
          v-if="index < flowData.length - 1"
          :class="item.result === 1 ? 'dashed' : 'solid'"
        ></div>
      </div>
      <div class="flow-item-right">
        <div class="flow-row-1">
          <span class="node-name-text">{{ item.name }}</span>
          <span class="node-time-text">{{ item.endTime }}</span>
        </div>
        <div class="flow-row-2">
          <span class="person-text">{{
            item.assigneeUser.deptName + '－' + item.assigneeUser.name
          }}</span>
          <span
            v-if="item.result && resultObj[item.result]"
            class="flow-status-text"
            :style="{ color: resultObj[item.result].color }"
            >({{ resultObj[item.result].text }})</span
          >
        </div>
        <div class="flow-row-3">
          <div v-if="props.type != 'approval'" class="comment-text">{{ item.reason }}</div>
          <Textarea
            v-if="props.type === 'approval' && item.result === 1 && editAuthority(item)"
            class="fit-comment-textarea"
            v-model:value="item.reason"
            placeholder="回复意见"
            :maxlength="200"
            :auto-size="{ minRows: 5 }"
            :bordered="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, toRaw, reactive, onMounted, watch } from 'vue';
  import { Textarea } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { useUserStore } from '/@/store/modules/user';

  const comment = ref<string>('');

  const userStore = useUserStore();

  const props = defineProps({
    flowData: { type: Array },
    type: { type: String }, // approval:审批，track:轨迹
  });
  const resultObj = reactive({
    '1': {
      text: '正在处理',
      color: '#1890FF',
    },
    '2': {
      text: '通过',
      color: '#25C28A',
    },
    '3': {
      text: '不通过',
      color: '#FF4D4F',
    },
    '4': {
      text: '打回',
      color: '#FF4D4F',
    },
    '5': {
      text: '已终止',
      color: '#999',
    },
    '6': {
      text: '已取消',
      color: '#999',
    },
    '7': {
      text: '已转办',
      color: '#999',
    },
  });

  const innerFlowData = ref([]);
  function handleFlowData(data) {
    // 流程数据是倒序的
    if (props.type === 'track') {
      let arr = [];
      data?.forEach((item) => {
        arr.unshift(item);
      });
      innerFlowData.value = arr;
    } else if (props.type === 'approval') {
      innerFlowData.value = data;
    }
  }

  // TODO 编辑权限
  const editAuthority = (item) => {
    const getUserInfo = toRaw(userStore.getUserInfo);
    return item.assigneeUser.id === getUserInfo.userId && item.processInstanceStatus === 1;
  };

  defineExpose({
    innerFlowData,
  });

  watch(
    () => props.flowData,
    (newValue) => {
      handleFlowData(newValue);
    },
  );

  onMounted(() => {
    handleFlowData(props.flowData);
  });
</script>

<style lang="less" scoped>
  .approval-tab {
    padding: 2px 20px;

    .flow-item {
      display: flex;
      margin-bottom: 7px;

      &:last-child {
        margin-bottom: 0;
      }

      .flow-item-left {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 28px;

        .circle-out {
          position: relative;

          .circle-inner-text {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            font-size: 15px;
            line-height: 26px;
            text-align: center;

            &.blue {
              border: 1px solid #1890ff;
              color: #1890ff;
            }
          }

          .circle-inner-icon {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background-color: #1890ff;
            line-height: 28px;
            text-align: center;
          }

          .status-icon {
            position: absolute;
            right: -4px;
            bottom: -4px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            text-align: center;

            &.green {
              background-color: #25c28a;
            }

            &.blue {
              background-color: #1890ff;
            }

            :deep(.fit-status-icon.anticon) {
              vertical-align: 0.8em;
            }
          }
        }

        .flow-vertical-line {
          flex: 1;
          width: 1px;
          min-height: 23px;
          margin-top: 7px;

          &.solid {
            border-left: 1px solid #1890ff;
          }
        }
      }

      .flow-item-right {
        flex: 1;
        padding-left: 9px;

        .flow-row-1 {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .node-name-text {
          font-size: 16px;
          line-height: 28px;
        }

        .node-time-text {
          font-size: 12px;
        }

        .person-text {
          font-size: 13px;
        }

        .flow-status-text {
          margin-left: 4px;
          font-size: 13px;

          &.blue {
            color: #1890ff;
          }

          &.green {
            color: #25c28a;
          }
        }

        .comment-text {
          font-size: 13px;
          line-height: 22px;
        }

        :deep(.fit-comment-textarea.ant-input) {
          margin: 4px 0 7px;
          padding: 7px 8px;
          border-radius: 2px;
          font-size: 13px;
        }
      }
    }
  }
</style>
