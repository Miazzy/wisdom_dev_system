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

    <!-- tree box -->
    <TreeBox
      :fieldNames="{ key: 'id', title: 'deptName' }"
      :data="treeData"
      style="width: 300px; height: 100px"
    />
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import SearchBox from '@/components/Framework/Combox/SearchBox.vue';
  import TreeBox from '@/components/Framework/Combox/TreeBox.vue';
  import CommonTree from '@/components/Framework/Tree/CommonTree.vue';
  import BillTitle from '/@/components/Framework/BillTitle/BillTitle.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { TreeItem } from '/@/components/Tree';
  import type { Dayjs } from 'dayjs';
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

  const treeData = ref<TreeItem[]>([]); // 左侧电站树数据
  // 查询左侧电站树数据
  async function queryDeptTreeList() {
    const deptList = JSON.parse(
      '[{"id":"0","deptName":"华东分部","orderNo":1,"createTime":"1994-03-30 00:48:18","remark":"认约快改们构想记指历社","status":"0","children":[{"id":"0-0","deptName":"研发部","orderNo":1,"createTime":"1996-08-28 05:09:32","remark":"号专六机局两其系油其员","status":"1","parentDept":"0"},{"id":"0-1","deptName":"市场部","orderNo":2,"createTime":"2017-12-07 08:08:03","remark":"装它做眼革提影委看地联命使美","status":"0","parentDept":"0"},{"id":"0-2","deptName":"商务部","orderNo":3,"createTime":"1983-06-08 07:21:54","remark":"切建叫入能权展容式值","status":"0","parentDept":"0"},{"id":"0-3","deptName":"财务部","orderNo":4,"createTime":"2008-08-13 15:14:15","remark":"多群示列众社强且白科矿改指","status":"1","parentDept":"0"}]},{"id":"1","deptName":"华南分部","orderNo":2,"createTime":"2020-03-04 23:20:18","remark":"受至己思元照再老代外四米办别品","status":"0","children":[{"id":"1-0","deptName":"研发部","orderNo":1,"createTime":"2004-06-14 18:04:06","remark":"义厂明到非很该信委十须明","status":"1","parentDept":"1"},{"id":"1-1","deptName":"市场部","orderNo":2,"createTime":"1993-08-29 18:05:18","remark":"下美四打者究日外公半最参备很百对称省","status":"1","parentDept":"1"},{"id":"1-2","deptName":"商务部","orderNo":3,"createTime":"2022-03-02 21:47:12","remark":"性出被间报速始六研想日我改","status":"0","parentDept":"1"},{"id":"1-3","deptName":"财务部","orderNo":4,"createTime":"1972-02-10 15:29:13","remark":"两段选段及向集太段数叫分","status":"1","parentDept":"1"}]},{"id":"2","deptName":"西北分部","orderNo":3,"createTime":"1982-12-26 23:06:46","remark":"江保学学却复前导作清油按那内成常","status":"0","children":[{"id":"2-0","deptName":"研发部","orderNo":1,"createTime":"2014-10-08 22:36:15","remark":"得省最做铁用种采她员特大听程斯例","status":"1","parentDept":"2"},{"id":"2-1","deptName":"市场部","orderNo":2,"createTime":"1973-08-08 20:39:11","remark":"间适事地和北我白者等调美果团置日元","status":"1","parentDept":"2"},{"id":"2-2","deptName":"商务部","orderNo":3,"createTime":"2013-03-14 04:32:44","remark":"着性下极别问拉和都手住","status":"0","parentDept":"2"},{"id":"2-3","deptName":"财务部","orderNo":4,"createTime":"2006-01-21 06:18:01","remark":"理正指加转气龙照光最上连生口对马名治越","status":"0","parentDept":"2","children":[{"id":"2-3-0","deptName":"研发部","orderNo":1,"createTime":"1996-08-28 05:09:32","remark":"号专六机局两其系油其员","status":"1","parentDept":"0"},{"id":"2-3-1","deptName":"市场部","orderNo":2,"createTime":"2017-12-07 08:08:03","remark":"装它做眼革提影委看地联命使美","status":"0","parentDept":"0"},{"id":"2-3-2","deptName":"商务部","orderNo":3,"createTime":"1983-06-08 07:21:54","remark":"切建叫入能权展容式值","status":"0","parentDept":"0"},{"id":"2-3-3","deptName":"财务部","orderNo":4,"createTime":"2008-08-13 15:14:15","remark":"多群示列众社强且白科矿改指","status":"1","parentDept":"0"}]}]}]'  
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
