<!--
 * @Description: 
 * @Date: 2023-09-14 14:31:30
 * @LastEditTime: 2023-10-28 14:50:34
 * @FilePath: \ygwl-framework\src\components\Framework\ApprovalDrawer\ApprovalDrawer.vue
-->
<template>
  <BasicDrawer
    class="test"
    v-bind="$attrs"
    :isDetail="true"
    width="33.33%"
    :headerStyle="{ display: 'none' }"
    :drawerStyle="{ boxShadow: '0px 1px 3px 0px #E9E9E9', borderTop: '1px solid #F0F0F0' }"
    showFooter
    footerHeight="64"
  >
    <OrganDialog
      :title="`组织人员Dialog`"
      :visible="organVisible"
      @update:visible="organVisible = $event"
      :tdata="treeData"
      :tfields="{ key: 'nodeId', title: 'nodeName' }"
      :width="800"
      :height="600"
      @cancel="cancelOrganDialog"
      @confirm="handleOrganConfirm"
    />

    <div>
      <Tabs class="fit-approval-tab" v-model:activeKey="activeKey">
        <TabPane key="1" tab="流程审批">
          <ApprovalTab ref="approvalTabRef" :flowData="currentNodeData" type="approval" />
        </TabPane>
        <TabPane key="2" tab="流程轨迹" force-render>
          <ApprovalTab ref="trackTabRef" :flowData="flowData" type="track" />
        </TabPane>
        <TabPane key="3" tab="关联业务">
          <div>关联业务</div>
        </TabPane>
      </Tabs>
    </div>
    <template #footer>
      <Button class="fit-footer-btn" type="primary" v-if="props.isHandle == 1" @click="handleAgree"
        >同意</Button
      >
      <Button class="fit-footer-btn" v-if="props.isHandle == 1" @click="handleReject">驳回</Button>
<Button class="fit-footer-btn" v-if="props.isHandle == 1" @click="handleFlowSave">保存</Button>
      <Dropdown>
        <template #overlay>
          <Menu @click="handleMenuClick">
            <MenuItem v-if="props.isHandle == 1" key="1">终止</MenuItem>
            <MenuItem v-if="props.isHandle == 1" key="2">转办</MenuItem>
            <MenuItem key="3">知会</MenuItem>
            <!-- <MenuItem key="4">收藏任务</MenuItem> -->
          </Menu>
        </template>
        <Button class="fit-footer-btn">
          更多
          <Icon icon="ant-design:down-outlined" color="#BFBFBF" size="14" />
        </Button>
      </Dropdown>
    </template>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { assign, forEach } from 'min-dash';
  import { watch, ref, toRaw, onMounted, createVNode } from 'vue';
  import { Tabs, TabPane, Button, Dropdown, Menu, MenuItem, message, Modal } from 'ant-design-vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import type { MenuProps } from 'ant-design-vue';
  import { propTypes } from '@/utils/propTypes';
  import Icon from '@/components/Icon/Icon.vue';

  import { BasicDrawer } from '/@/components/Drawer';
  import ApprovalTab from '/@/components/Framework/ApprovalDrawer/components/ApprovalTab.vue';
  import { useUserStore } from '/@/store/modules/user';
  import { TreeItem } from '/@/components/Tree';
  import OrganDialog from '@/components/Framework/Modal/OrganDialog.vue';
  import * as ProcessInstanceApi from '@/api/bpm/processInstance';
  import * as TaskApi from '@/api/bpm/task';

  const props = defineProps({
    flowData: { type: Array },
    processInstanceId: propTypes.string.def(''),
    isHandle: { type: Number, default: 1 }, //当前流程是否处理默认当前流程未处理（1 未处理、2 已处理）
  });

  const organVisible = ref(false);
  const organConfirm = ref('');
  const treeData = ref<TreeItem[]>([]); // 左侧电站树数据
  const processOperation = ref(0);

  const userStore = useUserStore();
  const getUserInfo = toRaw(userStore.getUserInfo);

  // 编辑权限
  const editAuthority = (item) => {
    return item.assigneeUser.id === getUserInfo.userId;
  };

  // 当前节点数据
  const currentNodeData = ref([]);
  watch(
    () => props.flowData,
    (newValue) => {
      const newArr = [];
      newValue?.forEach((item) => {
        if (item.result === 1 && editAuthority(item)) {
          newArr.push(item);
        }
      });
      currentNodeData.value = newArr;
    },
  );

  const trackTabRef = ref();
  const approvalTabRef = ref();

  const processInstanceId = ref(null);

  const activeKey = ref('1');

  const emit = defineEmits(['agree', 'reject', 'save', 'end', 'transfer', 'notice', 'collect']);

  // 更多
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const { key } = e;
    const { innerFlowData } = trackTabRef.value;
    switch (key) {
      case '1':
        // 终止
        // emit('end', innerFlowData);
        abortFlow();
        break;
      case '2':
        // 转办
        // emit('transfer', innerFlowData);
        handleProcessOperation(2);
        break;
      case '3':
        // 知会
        // emit('notice', innerFlowData);
        handleProcessOperation(3);
        break;
      case '4':
        // 收藏任务
        emit('collect', innerFlowData);
        break;
    }
  };

  // 同意
  function handleAgree() {
    const { innerFlowData } = trackTabRef.value;
    emit('agree', innerFlowData);
  }

  // 驳回
  function handleReject() {
    const { innerFlowData } = trackTabRef.value;
    emit('reject', innerFlowData);
  }

  // 保存
  function handleFlowSave() {
    const { innerFlowData } = trackTabRef.value;
    emit('save', innerFlowData);
  }

  function abortFlow() {
    const { innerFlowData } = trackTabRef.value;
    const myTask = getMyTask(innerFlowData);
    console.log('myTask', myTask);

    if (Object.keys(myTask).length === 0) {
      message.warning('没有权限操作。');
      return;
    }
    if (myTask.result == 2) {
      message.warning('此任务已处理。');
      return;
    }
    const params = {
      id: myTask.id,
      reason: '测试终止流程。',
    };

    Modal.confirm({
      title: () => '确认操作',
      icon: () => createVNode(ExclamationCircleOutlined),
      content: () => createVNode('div', { style: 'color:red;' }, '确定要终止当前任务吗？'),
      onOk() {
        ProcessInstanceApi.abortProcessInstance(params).then(() => {
          processOperation.value = 0;
          emit('onReload');
          message.success('操作成功。');
        });
      },
      class: 'test',
    });
  }

  // 处理流程操作
  function handleProcessOperation(operation) {
    processOperation.value = operation;
    const { innerFlowData } = trackTabRef.value;
    console.log('innerFlowData', innerFlowData);
    organVisible.value = true;
  }

  // 查询左侧电站树数据
  async function queryDeptTreeList() {
    const result = JSON.parse(
      // '[{"id":"0","deptName":"华东分部","dept":"华东分部","orderNo":1,"createTime":"1994-03-30 00:48:18","remark":"认约快改们构想记指历社","status":"0","children":[{"id":"0-0","deptName":"研发部","orderNo":1,"createTime":"1996-08-28 05:09:32","remark":"号专六机局两其系油其员","status":"1","parentDept":"0"},{"id":"0-1","deptName":"市场部","orderNo":2,"createTime":"2017-12-07 08:08:03","remark":"装它做眼革提影委看地联命使美","status":"0","parentDept":"0"},{"id":"0-2","deptName":"商务部","orderNo":3,"createTime":"1983-06-08 07:21:54","remark":"切建叫入能权展容式值","status":"0","parentDept":"0"},{"id":"0-3","deptName":"财务部","orderNo":4,"createTime":"2008-08-13 15:14:15","remark":"多群示列众社强且白科矿改指","status":"1","parentDept":"0"}]},{"id":"1","deptName":"华南分部","orderNo":2,"createTime":"2020-03-04 23:20:18","remark":"受至己思元照再老代外四米办别品","status":"0","children":[{"id":"1-0","deptName":"研发部","orderNo":1,"createTime":"2004-06-14 18:04:06","remark":"义厂明到非很该信委十须明","status":"1","parentDept":"1"},{"id":"1-1","deptName":"市场部","orderNo":2,"createTime":"1993-08-29 18:05:18","remark":"下美四打者究日外公半最参备很百对称省","status":"1","parentDept":"1"},{"id":"1-2","deptName":"商务部","orderNo":3,"createTime":"2022-03-02 21:47:12","remark":"性出被间报速始六研想日我改","status":"0","parentDept":"1"},{"id":"1-3","deptName":"财务部","orderNo":4,"createTime":"1972-02-10 15:29:13","remark":"两段选段及向集太段数叫分","status":"1","parentDept":"1"}]},{"id":"2","deptName":"西北分部","orderNo":3,"createTime":"1982-12-26 23:06:46","remark":"江保学学却复前导作清油按那内成常","status":"0","children":[{"id":"2-0","deptName":"研发部","orderNo":1,"createTime":"2014-10-08 22:36:15","remark":"得省最做铁用种采她员特大听程斯例","status":"1","parentDept":"2"},{"id":"2-1","deptName":"市场部","orderNo":2,"createTime":"1973-08-08 20:39:11","remark":"间适事地和北我白者等调美果团置日元","status":"1","parentDept":"2"},{"id":"2-2","deptName":"商务部","orderNo":3,"createTime":"2013-03-14 04:32:44","remark":"着性下极别问拉和都手住","status":"0","parentDept":"2"},{"id":"2-3","deptName":"财务部","orderNo":4,"createTime":"2006-01-21 06:18:01","remark":"理正指加转气龙照光最上连生口对马名治越","status":"0","parentDept":"2","children":[{"id":"2-3-0","deptName":"研发部","orderNo":1,"createTime":"1996-08-28 05:09:32","remark":"号专六机局两其系油其员","status":"1","parentDept":"0"},{"id":"2-3-1","deptName":"市场部","orderNo":2,"createTime":"2017-12-07 08:08:03","remark":"装它做眼革提影委看地联命使美","status":"0","parentDept":"0"},{"id":"2-3-2","deptName":"商务部","orderNo":3,"createTime":"1983-06-08 07:21:54","remark":"切建叫入能权展容式值","status":"0","parentDept":"0"},{"id":"2-3-3","deptName":"财务部","orderNo":4,"createTime":"2008-08-13 15:14:15","remark":"多群示列众社强且白科矿改指","status":"1","parentDept":"0"}]}]}]',
      `{"code":0,"result":[{"orgId":"AABAB68C2D0440ADA0A52AE93B9508A0","parentId":"HZ93a0a37bcad63b017bd784ee2012e7","code":"GFJLTYYYZ","fullId":"/HZ93a0bf6ab8dd83016ab8deaca70009.ogn/91EEFF16B1FF4F5CBF5CECDB928689DB.ogn/0C3B5ADB82C748C5828846EC7B717CCE.dpt/HZ93a0a37bcad63b017bd784ee2012e7.dpt/AABAB68C2D0440ADA0A52AE93B9508A0.dpt","name":"吉林通榆","deviceCategory":null,"deviceType":null,"categoryName":null,"typeName":null,"propertyValue":"fisheries","stationId":null,"nodeId":"AABAB68C2D0440ADA0A52AE93B9508A0","nodeName":"吉林通榆","nodeType":null,"typeSort":null,"categorySort":null,"typeCode":null,"children":[]},{"orgId":"BC583036CFFA4EB3AE4ECCC21E57F682","parentId":"HZ93a0a37bcad63b017bd784ee2012e7","code":"GFJSRDYYZ","fullId":"/HZ93a0bf6ab8dd83016ab8deaca70009.ogn/91EEFF16B1FF4F5CBF5CECDB928689DB.ogn/0C3B5ADB82C748C5828846EC7B717CCE.dpt/HZ93a0a37bcad63b017bd784ee2012e7.dpt/BC583036CFFA4EB3AE4ECCC21E57F682.dpt","name":"江苏如东","deviceCategory":null,"deviceType":null,"categoryName":null,"typeName":null,"propertyValue":"station","stationId":"HZ93a0a35f810e6e015f904d09562813","nodeId":"BC583036CFFA4EB3AE4ECCC21E57F682","nodeName":"江苏如东","nodeType":null,"typeSort":null,"categorySort":null,"typeCode":null,"children":[{"orgId":null,"parentId":null,"code":null,"fullId":null,"name":null,"deviceCategory":"gfq","deviceType":"jzsnbq","categoryName":null,"typeName":"jzsnbq","propertyValue":null,"stationId":"HZ93a0a35f810e6e015f904d09562813","nodeId":"7e14c133613b443590005078554bb797","nodeName":"gfq-cateGory","nodeType":"category","typeSort":null,"categorySort":1,"typeCode":"gfq","children":[{"orgId":null,"parentId":null,"code":null,"fullId":null,"name":null,"deviceCategory":"gfq","deviceType":"zcsnbq","categoryName":"gfq","typeName":"zcsnbq","propertyValue":null,"stationId":"HZ93a0a35f810e6e015f904d09562813","nodeId":"0d76f0a575a94fa599f63d8eb1a4283f","nodeName":"zcsnbq-type","nodeType":"type","typeSort":1,"categorySort":null,"typeCode":"zcsnbq","children":[]},{"orgId":null,"parentId":null,"code":null,"fullId":null,"name":null,"deviceCategory":"gfq","deviceType":"jzsnbq","categoryName":"gfq","typeName":"jzsnbq","propertyValue":null,"stationId":"HZ93a0a35f810e6e015f904d09562813","nodeId":"7e14c133613b443590005078554bb797","nodeName":"jzsnbq-type","nodeType":"type","typeSort":2,"categorySort":null,"typeCode":"jzsnbq","children":[]}]}]},{"orgId":"HZ93a0a35fd71b32015fd849228c100a","parentId":"HZ93a0a37bcad63b017bd784ee2012e7","code":"GFSDZBYYZ","fullId":"/HZ93a0bf6ab8dd83016ab8deaca70009.ogn/91EEFF16B1FF4F5CBF5CECDB928689DB.ogn/0C3B5ADB82C748C5828846EC7B717CCE.dpt/HZ93a0a37bcad63b017bd784ee2012e7.dpt/HZ93a0a35fd71b32015fd849228c100a.dpt","name":"山东高青","deviceCategory":null,"deviceType":null,"categoryName":null,"typeName":null,"propertyValue":"fisheries","stationId":null,"nodeId":"HZ93a0a35fd71b32015fd849228c100a","nodeName":"山东高青","nodeType":null,"typeSort":null,"categorySort":null,"typeCode":null,"children":[]},{"orgId":"HZ93a0a36120d1490161260327b63ea4","parentId":"HZ93a0a37bcad63b017bd784ee2012e7","code":"SDPD","fullId":"/HZ93a0bf6ab8dd83016ab8deaca70009.ogn/91EEFF16B1FF4F5CBF5CECDB928689DB.ogn/0C3B5ADB82C748C5828846EC7B717CCE.dpt/HZ93a0a37bcad63b017bd784ee2012e7.dpt/HZ93a0a36120d1490161260327b63ea4.dpt","name":"山东平度","deviceCategory":null,"deviceType":null,"categoryName":null,"typeName":null,"propertyValue":"fisheries","stationId":null,"nodeId":"HZ93a0a36120d1490161260327b63ea4","nodeName":"山东平度","nodeType":null,"typeSort":null,"categorySort":null,"typeCode":null,"children":[]},{"orgId":"HZ93a0a367e001980167e84d6e2962a4","parentId":"HZ93a0a37bcad63b017bd784ee2012e7","code":"tjdgyyz","fullId":"/HZ93a0bf6ab8dd83016ab8deaca70009.ogn/91EEFF16B1FF4F5CBF5CECDB928689DB.ogn/0C3B5ADB82C748C5828846EC7B717CCE.dpt/HZ93a0a37bcad63b017bd784ee2012e7.dpt/HZ93a0a367e001980167e84d6e2962a4.dpt","name":"天津大港","deviceCategory":null,"deviceType":null,"categoryName":null,"typeName":null,"propertyValue":"fisheries","stationId":null,"nodeId":"HZ93a0a367e001980167e84d6e2962a4","nodeName":"天津大港","nodeType":null,"typeSort":null,"categorySort":null,"typeCode":null,"children":[]}],"message":""}`,
    );
    const list = result.result as unknown as TreeItem[];
    treeData.value = list;
  }

  const handleOrganConfirm = (nodeList) => {
    // const message = nodeList.length > 0 ? JSON.stringify(nodeList) : '';
    // organConfirm.value = '组织人员选择Dialog确定，返回结果：' + message;
    // console.info('组织人员选择Dialog确定，返回结果：' + message);
    // console.log('processOperation.value', processOperation.value);

    const { innerFlowData } = trackTabRef.value;
    const myTask = getMyTask(innerFlowData);
    console.log('myTask', myTask);

    if (processOperation.value == 2) {
      if (myTask.result == 2) {
        message.warning('此任务已处理。');
        return;
      }
      const params = {
        id: myTask.id,
        assigneeUserId: '2c93a0a37a9af36d017aaccf38f93306',
      };
      TaskApi.updateTaskAssignee(params).then(() => {
        processOperation.value = 0;
        emit('onReload');
        message.success('操作成功。');
      });
    } else if (processOperation.value == 3) {
      const params = {
        id: myTask.id,
        ccToVos: [
          {
            userId: '2c93a0a37a9af36d017aaccf38f93306',
          },
        ],
      };
      TaskApi.addCcTo(params).then(() => {
        processOperation.value = 0;
        emit('onReload');
        message.success('操作成功。');
      });
    }
  };

  const cancelOrganDialog = () => {
    processOperation.value = 0;
  };

  //获取未处理任务节点
  function getMyTask(flowData) {
    const obj = {};
    flowData.forEach((item) => {
      if (item.assigneeUser.id === getUserInfo.userId) {
        assign(obj, item);
      }
    });
    return obj;
  }

  /** 初始化 **/
  onMounted(() => {
    queryDeptTreeList();
  });
</script>
<style lang="less">
  .vben-basic-drawer-footer {
    border-top-color: #eee;
  }
</style>
<style lang="less" scoped>
  .fit-approval-tab {
    :deep(.ant-tabs-tab) {
      font-size: 16px;

      &.ant-tabs-tab-active .ant-tabs-tab-btn {
        color: #1890ff;
      }
    }

    :deep(&.ant-tabs > .ant-tabs-nav .ant-tabs-nav-wrap) {
      padding: 0 20px;
    }

    :deep(.ant-tabs-ink-bar) {
      background-color: #1890ff;
    }
  }

  .fit-footer-btn.ant-btn {
    width: 64px;
    margin-right: 10px;
    padding: 4px 0;
    border-color: #d9d9d9;
    color: #262626;

    & > span + .anticon {
      margin-left: 0;
    }
  }

  .fit-footer-btn.ant-btn.ant-btn-primary {
    border-color: #1890ff;
    background: #1890ff;
    color: #fff;
  }
</style>
