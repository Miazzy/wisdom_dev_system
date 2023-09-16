<template>
  <!-- 搜索工作栏 -->
  <div class="search-box" style="width: 100%; height: 1000px; margin: 10px 10px 10px 10px">
    <!-- 标题 -->
    <BillTitle :options="billTitleOptions" />

    <!-- search box -->
    <SearchBox
      :columns="searchBoxColumns"
      :data="searchBoxData"
      twidth="500px"
      style="width: 300px; height: 100px"
    />

    <!-- 部门树 -->
    <CommonTree
      :title="`电站树`"
      @select="handleSelect"
      :value="treeData"
      class="w-1/4"
      :isShowOperationBtns="true"
      :fieldNames="{ key: 'id', title: 'deptName' }"
      @edit="handleTreeEdit"
      @add="handleTreeAdd"
      @delete="handleTreeDelete"
      @refresh="handleTreeRefresh"
    />
  </div>
</template>
<script lang="ts" setup>
  import { DICT_TYPE } from '@/utils/dict';
  import { DateTools, dateFormatter } from '@/utils/dateUtil';
  import { ref, reactive, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import SearchBox from '@/components/Framework/Combox/SearchBox.vue';
  import CommonTree from '@/components/Framework/Tree/CommonTree.vue';
  import BillTitle from '/@/components/Framework/BillTitle/BillTitle.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { TreeItem } from '/@/components/Tree';

  defineOptions({ name: 'WorkFlow' });
  const message = useMessage(); // 消息弹窗
  const { push } = useRouter(); // 路由

  const loading = ref(true); // 列表的加载中
  const total = ref(0); // 列表的总页数
  const list = ref([]); // 列表的数据
  const queryFormRef = ref(); // 搜索的表单
  const tableData = ref([]);

  const billTitleOptions = reactive<BillTitleOptions>({});
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
    { title: '年份', dataIndex: 'year', key: 'year', fixed: 'left', minWidth: 100 },
    { title: '月份', dataIndex: 'month', key: 'month', fixed: 'left', minWidth: 100 },
    { title: '期间', dataIndex: 'date', key: 'date', minWidth: 150 },
  ]);

  const searchBoxData = ref([
    { year: '2020', month: '06', date: '2020-06' },
    { year: '2020', month: '07', date: '2020-07' },
  ]);

  const params = reactive({
    pageNo: 1,
    pageSize: 10,
    key: undefined,
    name: undefined,
    category: undefined,
  });

  /** 流程图的详情按钮操作 */
  const bpmnDetailVisible = ref(false);
  const bpmnXML = ref(null);
  const bpmnControlForm = ref({
    prefix: 'flowable',
  });

  /** 流程表单的详情按钮操作 */
  const formDetailVisible = ref(false);
  const formDetailPreview = ref({
    rule: [],
    option: {},
  });

  /** 添加/修改操作 */
  const importFormRef = ref();

  /** 添加/修改操作 */
  const formRef = ref();

  /** 搜索按钮操作 */
  const handleQuery = () => {
    params.pageNo = 1;
    getList();
  };

  /** 重置按钮操作 */
  const resetQuery = () => {
    queryFormRef.value.resetFields();
    handleQuery();
  };

  // 查询流程表格列表数据
  const getList = async () => {
    loading.value = true;
    try {
      const data = getTableDataWflow();
      list.value = data.list;
      total.value = data.total;
    } finally {
      loading.value = false;
    }
  };

  const openForm = (type: string, id?: number) => {
    formRef.value.open(type, id);
  };

  const importForm = () => {
    importFormRef.value.open();
  };

  // 执行删除流程记录操作
  const handleDelete = async (id: number) => {
    try {
      // 删除的二次确认
      await message.delConfirm(`请确认是否删除此流程数据项？`);

      // 调用集维后端接口，删除流程相应数据 TODO

      // 刷新列表
      await getList();
    } catch (e) {
      // console.error(e);
    }
  };

  //  设置流程激活状态
  const handleChangeState = async (row) => {
    const state = row.processDefinition.suspensionState;
    try {
      // 修改状态的二次确认
      const id = row.id;
      const statusState = state === 1 ? '激活' : '挂起';
      const content = '请确认是否' + statusState + '流程名字为"' + row.name + '"的数据项?';

      // 确认是否更新流程激活状态
      await message.confirm(content);

      // 调用集维后端接口，激活该流程状态 TODO

      // 刷新列表
      await getList();
    } catch {
      // 取消后，进行恢复按钮
      row.processDefinition.suspensionState = state === 1 ? 2 : 1;
    }
  };

  // 执行部署流程/发布流程操作
  const handleDeploy = async (row) => {
    try {
      // 删除的二次确认
      await message.confirm('请确认是否部署该流程？');

      // 调用集维后端接口，部署该流程 TODO

      // 刷新列表
      await getList();
    } catch (e) {
      // console.error(e);
    }
  };

  /** 设计流程 */
  const handleDesign = (row) => {
    push({
      name: 'BpmModelEditor',
      query: {
        modelId: row.id,
      },
    });
  };

  // 点击任务分配按钮
  const handleAssignRule = (row) => {
    push({
      name: 'BpmTaskAssignRuleList',
      query: {
        modelId: row.id,
      },
    });
  };

  // 跳转到指定流程定义列表
  const handleDefinitionList = (row) => {
    push({
      name: 'BpmProcessDefinition',
      query: {
        key: row.key,
      },
    });
  };

  const handleFormDetail = async (row) => {
    if (row.formType == 10) {
      // 设置表单
      const data = {};
      // 弹窗打开
      formDetailVisible.value = true;
    } else {
      await push({
        path: row.formCustomCreatePath,
      });
    }
  };

  const handleBpmnDetail = async (row) => {
    const data = getTableDataWflow();
    bpmnXML.value = data.bpmnXml || '';
    bpmnDetailVisible.value = true;
  };

  const treeData = ref<TreeItem[]>([]); // 左侧电站树数据
  // 查询左侧电站树数据
  async function queryDeptTreeList() {
    const deptList = JSON.parse(
      '[{"id":"0","deptName":"华东分部","orderNo":1,"createTime":"1994-03-30 00:48:18","remark":"认约快改们构想记指历社","status":"0","children":[{"id":"0-0","deptName":"研发部","orderNo":1,"createTime":"1996-08-28 05:09:32","remark":"号专六机局两其系油其员","status":"1","parentDept":"0"},{"id":"0-1","deptName":"市场部","orderNo":2,"createTime":"2017-12-07 08:08:03","remark":"装它做眼革提影委看地联命使美","status":"0","parentDept":"0"},{"id":"0-2","deptName":"商务部","orderNo":3,"createTime":"1983-06-08 07:21:54","remark":"切建叫入能权展容式值","status":"0","parentDept":"0"},{"id":"0-3","deptName":"财务部","orderNo":4,"createTime":"2008-08-13 15:14:15","remark":"多群示列众社强且白科矿改指","status":"1","parentDept":"0"}]},{"id":"1","deptName":"华南分部","orderNo":2,"createTime":"2020-03-04 23:20:18","remark":"受至己思元照再老代外四米办别品","status":"0","children":[{"id":"1-0","deptName":"研发部","orderNo":1,"createTime":"2004-06-14 18:04:06","remark":"义厂明到非很该信委十须明","status":"1","parentDept":"1"},{"id":"1-1","deptName":"市场部","orderNo":2,"createTime":"1993-08-29 18:05:18","remark":"下美四打者究日外公半最参备很百对称省","status":"1","parentDept":"1"},{"id":"1-2","deptName":"商务部","orderNo":3,"createTime":"2022-03-02 21:47:12","remark":"性出被间报速始六研想日我改","status":"0","parentDept":"1"},{"id":"1-3","deptName":"财务部","orderNo":4,"createTime":"1972-02-10 15:29:13","remark":"两段选段及向集太段数叫分","status":"1","parentDept":"1"}]},{"id":"2","deptName":"西北分部","orderNo":3,"createTime":"1982-12-26 23:06:46","remark":"江保学学却复前导作清油按那内成常","status":"0","children":[{"id":"2-0","deptName":"研发部","orderNo":1,"createTime":"2014-10-08 22:36:15","remark":"得省最做铁用种采她员特大听程斯例","status":"1","parentDept":"2"},{"id":"2-1","deptName":"市场部","orderNo":2,"createTime":"1973-08-08 20:39:11","remark":"间适事地和北我白者等调美果团置日元","status":"1","parentDept":"2"},{"id":"2-2","deptName":"商务部","orderNo":3,"createTime":"2013-03-14 04:32:44","remark":"着性下极别问拉和都手住","status":"0","parentDept":"2"},{"id":"2-3","deptName":"财务部","orderNo":4,"createTime":"2006-01-21 06:18:01","remark":"理正指加转气龙照光最上连生口对马名治越","status":"0","parentDept":"2"}]}]',
    ) as unknown as TreeItem[];
    treeData.value = deptList;
  }
  // 左侧树状菜单选中事件
  function handleSelect(node, element) {
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

  /** 初始化 **/
  onMounted(() => {
    queryDeptTreeList();
    getList();
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
