<template>
  <!-- 搜索工作栏 -->
  <div class="search-box" style="width: calc(100% - 20px); height: calc(100% - 20px); margin: 10px">
    <!-- 标题 -->
    <BillTitle :options="billTitleOptions" />

    <CommonTree
      :title="`电站树`"
      @select="handleSelect"
      :value="treeData"
      class="w-1/4"
      :isShowOperationBtns="true"
      :fieldNames="{ key: 'nodeId', title: 'nodeName' }"
      @edit="handleTreeEdit"
      @add="handleTreeAdd"
      @delete="handleTreeDelete"
      @refresh="handleTreeRefresh"
    />
    <div class="" style="width: 100%">
      <span style="float: left"> SearchBox </span>
      <!-- search box -->
      <SearchBox
        v-model:searchText="searchTableText"
        :columns="searchBoxColumns"
        :data="searchBoxData"
        :vfield="'date'"
        :pagination="false"
        twidth="500px"
        @select="tableBoxSelect"
        style="width: 220px; height: 60px"
      />
      <span style="float: left"> TreeBox </span>
      <!-- tree box -->
      <TreeBox
        v-model:searchText="searchTreeText"
        :tfields="{ key: 'nodeId', title: 'nodeName' }"
        :data="treeData"
        @select="treeBoxSelect"
        style="width: 220px; height: 60px"
        twidth="400px"
      />
    </div>

    <Button @click="handleOpenCgDialog">打开分类Dialog</Button>
    <Button @click="handleOpenOgDialog">打开组织Dialog</Button>
    <CategoryDialog
      :title="`分类树Dialog`"
      v-model:visible="modalVisible"
      :tdata="treeData"
      :tfields="{ key: 'nodeId', title: 'nodeName' }"
      :gcolumns="searchBoxColumns"
      :gdata="searchBoxData"
      :width="800"
      :height="600"
      @confirm="handleCategoryConfirm"
    />
    <OrganDialog
      :title="`组织人员Dialog`"
      :visible="organVisible"
      @update:visible="organVisible = $event"
      :tdata="treeData"
      :tfields="{ key: 'nodeId', title: 'nodeName' }"
      :width="800"
      :height="600"
      @confirm="handleOrganConfirm"
    />
    <br />
    <span style="margin-top: 10px; margin-left: 5px; display: block"> {{ categoryConfirm }} </span>
    <br />
    <span style="margin-top: 10px; margin-left: 5px; display: block"> {{ organConfirm }} </span>

    <span style="float: left"> DictSelectBox </span>
    <br />

    <DictSelectBox
      v-model:value="selectedValue"
      :multiple="`multiple`"
      :type="DICT_TYPE.BPM_MODEL_CATEGORY"
      :width="220"
      @change="handleDictSelectBoxChange"
    />

    <DictSelectBox
      v-model:value="selectedValue"
      :multiple="`multiple`"
      :type="DICT_TYPE.SYSTEM_USER_SEX"
      :width="220"
      style="margin-left: 5px"
      @change="handleDictSelectBoxChange"
    />

    <DictSelectBox
      v-model:value="selectedValue"
      :type="DICT_TYPE.INFRA_CONFIG_TYPE"
      :width="220"
      style="margin-left: 5px"
      @change="handleDictSelectBoxChange"
    />

    <XButton preIcon="ep:folder-opened" title="打开文件" />
    <XTextButton preIcon="ep:folder-opened" title="打开文件" />

    <!-- 审批按钮 -->
    <div style="margin: 16px 0 0 16px">
      <Button @click="handleOpenApprovalDrawer">审批</Button>
    </div>

    <!-- 流程审批抽屉组件 -->
    <ApprovalDrawer
      @register="approvalDrawerRegister"
      :flowData="flowData"
      @agree="handleAgree"
      @reject="handleReject"
      @save="handleSave"
      @end="handleEnd"
      @transfer="handleTransfer"
      @notice="handleNotice"
      @collect="handleCollect"
    />

    <BubbleChart
      :data="chartData"
      :width="300"
      :height="300"
      :font-size="fontSize"
      :font-color="fontColor"
      :bubble-color="bubbleColor"
    />
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { Button } from 'ant-design-vue';
  import SearchBox from '@/components/Framework/Combox/SearchBox.vue';
  import TreeBox from '@/components/Framework/Combox/TreeBox.vue';
  import CommonTree from '@/components/Framework/Tree/CommonTree.vue';
  import DictSelectBox from '@/components/Framework/Combox/DictSelectBox.vue';
  import BillTitle from '/@/components/Framework/BillTitle/BillTitle.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { TreeItem } from '/@/components/Tree';
  import { useDrawer } from '/@/components/Drawer';
  import ApprovalDrawer from '/@/components/Framework/ApprovalDrawer/ApprovalDrawer.vue';
  import CategoryDialog from '/@/components/Framework/Modal/CategoryDialog.vue';
  import OrganDialog from '@/components/Framework/Modal/OrganDialog.vue';
  import XButton from '@/components/Framework/XButton/XButton.vue';
  import XTextButton from '@/components/Framework/XButton/XTextButton.vue';
  import type { Dayjs } from 'dayjs';
  import { DICT_TYPE } from '@/utils/dict';
  import BubbleChart from '/@/components/Framework/Chart/BubbleChart.vue';
  // import { BillTitleOptions } from '/@/components/Framework/BillTitle/types';
  import Dialog from '@/components/Framework/Modal/Dialog.vue';
  import dayjs from 'dayjs';

  type RangeValue = [Dayjs, Dayjs];

  defineOptions({ name: 'WorkFlow' });
  const message = useMessage(); // 消息弹窗
  const { push } = useRouter(); // 路由

  const loading = ref(true); // 列表的加载中
  const total = ref(0); // 列表的总页数
  const list = ref([]); // 列表的数据
  const queryFormRef = ref(); // 搜索的表单
  const tableData = ref([]);
  const rangeValue = ref<RangeValue>();
  const modalVisible = ref(false);
  const organVisible = ref(false);
  const categoryConfirm = ref('');
  const organConfirm = ref('');
  const selectedValue = ref([]);

  const billTitleOptions = reactive<any>({});
  billTitleOptions.title = '电站填报';
  billTitleOptions.infoItems = [
    {
      key: 'billCode',
      label: '单据编号',
      value: 'DZSSDL-202308110001',
      position: 'left',
    },
    {
      key: 'fillinDate',
      label: '制单日期',
      value: '2023-08-11 13:38',
      position: 'center',
    },
    {
      key: 'createPerson',
      label: '创建人',
      value: '软件部.管理员',
      position: 'right',
    },
  ];

  const searchBoxColumns = ref([
    { title: '类型', dataIndex: 'typeName', key: 'typeName', fixed: 'left', minWidth: 100 },
    { title: '年份', dataIndex: 'year', key: 'year', fixed: 'left', minWidth: 100 },
    { title: '月份', dataIndex: 'month', key: 'month', fixed: 'left', minWidth: 100 },
    { title: '期间', dataIndex: 'date', key: 'date', minWidth: 150 },
  ]);

  const searchBoxData = ref([
    { typeName: '财务部类型-吉林通榆', year: '2020', month: '06', date: '2020-06' },
    { typeName: '市场部类型-吉林通榆', year: '2020', month: '07', date: '2020-07' },
    { typeName: '华南分部类型-江苏如东', year: '2020', month: '08', date: '2020-08' },
    { typeName: '西北分部类型-吉林通榆', year: '2020', month: '09', date: '2020-09' },
    { typeName: '华东分部类型-吉林通榆', year: '2020', month: '10', date: '2020-10' },
    { typeName: '商务部类型-江苏如东', year: '2020', month: '11', date: '2020-11' },
    { typeName: '研发部类型', year: '2020', month: '12', date: '2020-12' },
    { typeName: '财务部类型', year: '2021', month: '01', date: '2021-01' },
    { typeName: '研发部类型', year: '2021', month: '02', date: '2021-02' },
    { typeName: '财务部类型', year: '2021', month: '03', date: '2021-03' },
    { typeName: '市场部类型', year: '2021', month: '04', date: '2021-04' },
  ]);

  const treeData = ref<TreeItem[]>([]); // 左侧电站树数据
  const searchTreeText = ref('');
  const searchTableText = ref('');

  const chartData = [
    { name: '江苏', value: 12, color: 'red' },
    { name: '山东', value: 11, color: 'green' },
    { name: '吉林', value: 10, color: 'yellow' },
    { name: '浙江', value: 9, color: 'blue' },
    { name: '湖北', value: 8, color: 'skyblue' },
    { name: '黑龙江', value: 7, color: 'purple' },
    { name: '天津', value: 7, color: 'purple' },
  ];
  const fontSize = ref('18px');
  const fontColor = 'white';
  const bubbleColor = 'red';

  // 查询左侧电站树数据
  async function queryDeptTreeList() {
    const result = JSON.parse(
      // '[{"id":"0","deptName":"华东分部","dept":"华东分部","orderNo":1,"createTime":"1994-03-30 00:48:18","remark":"认约快改们构想记指历社","status":"0","children":[{"id":"0-0","deptName":"研发部","orderNo":1,"createTime":"1996-08-28 05:09:32","remark":"号专六机局两其系油其员","status":"1","parentDept":"0"},{"id":"0-1","deptName":"市场部","orderNo":2,"createTime":"2017-12-07 08:08:03","remark":"装它做眼革提影委看地联命使美","status":"0","parentDept":"0"},{"id":"0-2","deptName":"商务部","orderNo":3,"createTime":"1983-06-08 07:21:54","remark":"切建叫入能权展容式值","status":"0","parentDept":"0"},{"id":"0-3","deptName":"财务部","orderNo":4,"createTime":"2008-08-13 15:14:15","remark":"多群示列众社强且白科矿改指","status":"1","parentDept":"0"}]},{"id":"1","deptName":"华南分部","orderNo":2,"createTime":"2020-03-04 23:20:18","remark":"受至己思元照再老代外四米办别品","status":"0","children":[{"id":"1-0","deptName":"研发部","orderNo":1,"createTime":"2004-06-14 18:04:06","remark":"义厂明到非很该信委十须明","status":"1","parentDept":"1"},{"id":"1-1","deptName":"市场部","orderNo":2,"createTime":"1993-08-29 18:05:18","remark":"下美四打者究日外公半最参备很百对称省","status":"1","parentDept":"1"},{"id":"1-2","deptName":"商务部","orderNo":3,"createTime":"2022-03-02 21:47:12","remark":"性出被间报速始六研想日我改","status":"0","parentDept":"1"},{"id":"1-3","deptName":"财务部","orderNo":4,"createTime":"1972-02-10 15:29:13","remark":"两段选段及向集太段数叫分","status":"1","parentDept":"1"}]},{"id":"2","deptName":"西北分部","orderNo":3,"createTime":"1982-12-26 23:06:46","remark":"江保学学却复前导作清油按那内成常","status":"0","children":[{"id":"2-0","deptName":"研发部","orderNo":1,"createTime":"2014-10-08 22:36:15","remark":"得省最做铁用种采她员特大听程斯例","status":"1","parentDept":"2"},{"id":"2-1","deptName":"市场部","orderNo":2,"createTime":"1973-08-08 20:39:11","remark":"间适事地和北我白者等调美果团置日元","status":"1","parentDept":"2"},{"id":"2-2","deptName":"商务部","orderNo":3,"createTime":"2013-03-14 04:32:44","remark":"着性下极别问拉和都手住","status":"0","parentDept":"2"},{"id":"2-3","deptName":"财务部","orderNo":4,"createTime":"2006-01-21 06:18:01","remark":"理正指加转气龙照光最上连生口对马名治越","status":"0","parentDept":"2","children":[{"id":"2-3-0","deptName":"研发部","orderNo":1,"createTime":"1996-08-28 05:09:32","remark":"号专六机局两其系油其员","status":"1","parentDept":"0"},{"id":"2-3-1","deptName":"市场部","orderNo":2,"createTime":"2017-12-07 08:08:03","remark":"装它做眼革提影委看地联命使美","status":"0","parentDept":"0"},{"id":"2-3-2","deptName":"商务部","orderNo":3,"createTime":"1983-06-08 07:21:54","remark":"切建叫入能权展容式值","status":"0","parentDept":"0"},{"id":"2-3-3","deptName":"财务部","orderNo":4,"createTime":"2008-08-13 15:14:15","remark":"多群示列众社强且白科矿改指","status":"1","parentDept":"0"}]}]}]',
      `{"code":0,"result":[{"orgId":"AABAB68C2D0440ADA0A52AE93B9508A0","parentId":"HZ93a0a37bcad63b017bd784ee2012e7","code":"GFJLTYYYZ","fullId":"/HZ93a0bf6ab8dd83016ab8deaca70009.ogn/91EEFF16B1FF4F5CBF5CECDB928689DB.ogn/0C3B5ADB82C748C5828846EC7B717CCE.dpt/HZ93a0a37bcad63b017bd784ee2012e7.dpt/AABAB68C2D0440ADA0A52AE93B9508A0.dpt","name":"吉林通榆","deviceCategory":null,"deviceType":null,"categoryName":null,"typeName":null,"propertyValue":"fisheries","stationId":null,"nodeId":"AABAB68C2D0440ADA0A52AE93B9508A0","nodeName":"吉林通榆","nodeType":null,"typeSort":null,"categorySort":null,"typeCode":null,"children":[]},{"orgId":"BC583036CFFA4EB3AE4ECCC21E57F682","parentId":"HZ93a0a37bcad63b017bd784ee2012e7","code":"GFJSRDYYZ","fullId":"/HZ93a0bf6ab8dd83016ab8deaca70009.ogn/91EEFF16B1FF4F5CBF5CECDB928689DB.ogn/0C3B5ADB82C748C5828846EC7B717CCE.dpt/HZ93a0a37bcad63b017bd784ee2012e7.dpt/BC583036CFFA4EB3AE4ECCC21E57F682.dpt","name":"江苏如东","deviceCategory":null,"deviceType":null,"categoryName":null,"typeName":null,"propertyValue":"station","stationId":"HZ93a0a35f810e6e015f904d09562813","nodeId":"BC583036CFFA4EB3AE4ECCC21E57F682","nodeName":"江苏如东","nodeType":null,"typeSort":null,"categorySort":null,"typeCode":null,"children":[{"orgId":null,"parentId":null,"code":null,"fullId":null,"name":null,"deviceCategory":"gfq","deviceType":"jzsnbq","categoryName":null,"typeName":"jzsnbq","propertyValue":null,"stationId":"HZ93a0a35f810e6e015f904d09562813","nodeId":"7e14c133613b443590005078554bb797","nodeName":"gfq-cateGory","nodeType":"category","typeSort":null,"categorySort":1,"typeCode":"gfq","children":[{"orgId":null,"parentId":null,"code":null,"fullId":null,"name":null,"deviceCategory":"gfq","deviceType":"zcsnbq","categoryName":"gfq","typeName":"zcsnbq","propertyValue":null,"stationId":"HZ93a0a35f810e6e015f904d09562813","nodeId":"0d76f0a575a94fa599f63d8eb1a4283f","nodeName":"zcsnbq-type","nodeType":"type","typeSort":1,"categorySort":null,"typeCode":"zcsnbq","children":[]},{"orgId":null,"parentId":null,"code":null,"fullId":null,"name":null,"deviceCategory":"gfq","deviceType":"jzsnbq","categoryName":"gfq","typeName":"jzsnbq","propertyValue":null,"stationId":"HZ93a0a35f810e6e015f904d09562813","nodeId":"7e14c133613b443590005078554bb797","nodeName":"jzsnbq-type","nodeType":"type","typeSort":2,"categorySort":null,"typeCode":"jzsnbq","children":[]}]}]},{"orgId":"HZ93a0a35fd71b32015fd849228c100a","parentId":"HZ93a0a37bcad63b017bd784ee2012e7","code":"GFSDZBYYZ","fullId":"/HZ93a0bf6ab8dd83016ab8deaca70009.ogn/91EEFF16B1FF4F5CBF5CECDB928689DB.ogn/0C3B5ADB82C748C5828846EC7B717CCE.dpt/HZ93a0a37bcad63b017bd784ee2012e7.dpt/HZ93a0a35fd71b32015fd849228c100a.dpt","name":"山东高青","deviceCategory":null,"deviceType":null,"categoryName":null,"typeName":null,"propertyValue":"fisheries","stationId":null,"nodeId":"HZ93a0a35fd71b32015fd849228c100a","nodeName":"山东高青","nodeType":null,"typeSort":null,"categorySort":null,"typeCode":null,"children":[]},{"orgId":"HZ93a0a36120d1490161260327b63ea4","parentId":"HZ93a0a37bcad63b017bd784ee2012e7","code":"SDPD","fullId":"/HZ93a0bf6ab8dd83016ab8deaca70009.ogn/91EEFF16B1FF4F5CBF5CECDB928689DB.ogn/0C3B5ADB82C748C5828846EC7B717CCE.dpt/HZ93a0a37bcad63b017bd784ee2012e7.dpt/HZ93a0a36120d1490161260327b63ea4.dpt","name":"山东平度","deviceCategory":null,"deviceType":null,"categoryName":null,"typeName":null,"propertyValue":"fisheries","stationId":null,"nodeId":"HZ93a0a36120d1490161260327b63ea4","nodeName":"山东平度","nodeType":null,"typeSort":null,"categorySort":null,"typeCode":null,"children":[]},{"orgId":"HZ93a0a367e001980167e84d6e2962a4","parentId":"HZ93a0a37bcad63b017bd784ee2012e7","code":"tjdgyyz","fullId":"/HZ93a0bf6ab8dd83016ab8deaca70009.ogn/91EEFF16B1FF4F5CBF5CECDB928689DB.ogn/0C3B5ADB82C748C5828846EC7B717CCE.dpt/HZ93a0a37bcad63b017bd784ee2012e7.dpt/HZ93a0a367e001980167e84d6e2962a4.dpt","name":"天津大港","deviceCategory":null,"deviceType":null,"categoryName":null,"typeName":null,"propertyValue":"fisheries","stationId":null,"nodeId":"HZ93a0a367e001980167e84d6e2962a4","nodeName":"天津大港","nodeType":null,"typeSort":null,"categorySort":null,"typeCode":null,"children":[]}],"message":""}`,
    );
    const list = result.result as unknown as TreeItem[];
    treeData.value = list;
  }
  // 左侧树状菜单选中事件
  function handleSelect(node) {
    // TODO node：被选中的节点，element：相关事件对象
  }
  // 编辑树的回调
  function handleTreeEdit(node) {
    console.log('handleTreeEdit', node);
  }
  // 新增树节点的的回调
  function handleTreeAdd(node) {
    console.log('handleTreeAdd', node);
  }
  // 删除树节点的回调
  function handleTreeDelete(node) {
    console.log('handleTreeDelete', node);
  }
  // 刷新树的回调
  function handleTreeRefresh() {
    console.log('handleTreeRefresh');
    queryDeptTreeList();
  }

  function handleDictSelectBoxChange(value, node, allNodes) {
    console.log('selectedValue:', selectedValue.value);
  }

  const [approvalDrawerRegister, { openDrawer: openApprovalDrawer }] = useDrawer();

  // 打开流程审批抽屉
  function handleOpenApprovalDrawer() {
    openApprovalDrawer(true);
    queryFlowNodeList();
  }

  const flowData = ref([]);
  // 获取流程节点数据
  async function queryFlowNodeList() {
    const flowNodeList = JSON.parse(
      '[{"id":"fa4b117c-5395-11ee-b5c1-480fcf57f666","name":"总经理审批","claimTime":null,"createTime":"2023-09-15 15:03:31","suspensionState":null,"processInstance":{"id":"0e1ab04c-5390-11ee-b5c1-480fcf57f666","name":"业务报销","startUserId":129,"startUserNickname":"宋彪","processDefinitionId":"BMProc:1:c38d2a4b-4886-11ee-8c22-480fcf57f666"},"endTime":null,"durationInMillis":null,"result":1,"reason":null,"definitionKey":"Activity_1ge9o3y","assigneeUser":{"id":128,"nickname":"饶勇","deptId":138,"deptName":"总经办"}},{"id":"6186a3a5-5395-11ee-b5c1-480fcf57f666","name":"财务部负责人审批","claimTime":null,"createTime":"2023-09-15 14:59:15","suspensionState":null,"processInstance":{"id":"0e1ab04c-5390-11ee-b5c1-480fcf57f666","name":"业务报销","startUserId":129,"startUserNickname":"宋彪","processDefinitionId":"BMProc:1:c38d2a4b-4886-11ee-8c22-480fcf57f666"},"endTime":"2023-09-15 15:03:31","durationInMillis":256225,"result":2,"reason":"同意。","definitionKey":"Activity_12fthtb","assigneeUser":{"id":130,"nickname":"曾宁若","deptId":139,"deptName":"财务部"}},{"id":"63d8cdd0-5391-11ee-b5c1-480fcf57f666","name":"部门领导审批","claimTime":null,"createTime":"2023-09-15 14:30:41","suspensionState":null,"processInstance":{"id":"0e1ab04c-5390-11ee-b5c1-480fcf57f666","name":"业务报销","startUserId":129,"startUserNickname":"宋彪","processDefinitionId":"BMProc:1:c38d2a4b-4886-11ee-8c22-480fcf57f666"},"endTime":"2023-09-15 14:59:15","durationInMillis":1714085,"result":2,"reason":"同意。","definitionKey":"Activity_0zvw3s2","assigneeUser":{"id":126,"nickname":"刘超","deptId":136,"deptName":"技术中心"}},{"id":"4b70bf0b-5390-11ee-b5c1-480fcf57f666","name":"财务部负责人审批","claimTime":null,"createTime":"2023-09-15 14:22:50","suspensionState":null,"processInstance":{"id":"0e1ab04c-5390-11ee-b5c1-480fcf57f 666","name":"业务报销","startUserId":129,"startUserNickname":"宋彪","processDefinitionId":"BMProc:1:c38d2a4b-4886-11ee-8c22-480fcf57f666"},"endTime":"2023-09-15 14:30:41","durationInMillis":470436,"result":4,"reason":"Change activity to Activity_0zvw3s2","definitionKey":"Activity_12fthtb","assigneeUser":{"id":130,"nickname":"曾宁若","deptId":139,"deptName":"财务部"}},{"id":"0e202e9c-5390-11ee-b5c1-480fcf57f666","name":"部门领导审批","claimTime":null,"createTime":"2023-09-15 14:21:07","suspensionState":null,"processInstance":{"id":"0e1ab04c-5390-11ee-b5c1-480fcf57f666","name":"业务报销","startUserId":129,"startUserNickname":"宋彪","processDefinitionId":"BMProc:1:c38d2a4b-4886-11ee-8c22-480fcf57f666"},"endTime":"2023-09-15 14:22:50","durationInMillis":102859,"result":2,"reason":"测试打回。","definitionKey":"Activity_0zvw3s2","assigneeUser":{"id":126,"nickname":"刘超","deptId":136,"deptName":"技术中心"}}]',
    );
    flowData.value = flowNodeList;
  }

  function handleOpenCgDialog() {
    modalVisible.value = true;
  }

  function handleOpenOgDialog() {
    organVisible.value = true;
  }

  const treeBoxSelect = (node, event) => {
    searchTreeText.value;
  };

  const tableBoxSelect = (node, event) => {
    searchTableText.value;
  };

  const handleCategoryConfirm = (node) => {
    categoryConfirm.value = '分类Dialog确定，返回结果：' + JSON.stringify(node);
    console.info('分类Dialog确定，返回结果：' + JSON.stringify(node));
  };

  const handleOrganConfirm = (nodeList) => {
    const message = nodeList.length > 0 ? JSON.stringify(nodeList) : '';
    organConfirm.value = '组织人员选择Dialog确定，返回结果：' + message;
    console.info('组织人员选择Dialog确定，返回结果：' + message);
  };

  const handleAgree = (flowData) => {
    console.log('同意', flowData);
  };

  const handleReject = (flowData) => {
    console.log('驳回', flowData);
  };

  const handleSave = (flowData) => {
    console.log('保存', flowData);
  };

  const handleEnd = (flowData) => {
    console.log('终止', flowData);
  };

  const handleTransfer = (flowData) => {
    console.log('转办', flowData);
  };

  const handleNotice = (flowData) => {
    console.log('知会', flowData);
  };

  const handleCollect = (flowData) => {
    console.log('收藏', flowData);
  };

  /** 初始化 **/
  onMounted(() => {
    queryDeptTreeList();
  });
</script>
<style scoped>
  .search-content {
    width: calc(100% - 25px);
    height: calc(100vh - 150px);
    margin: 15px 15px 10px 10px;
    background: #fefefe;
  }
</style>
