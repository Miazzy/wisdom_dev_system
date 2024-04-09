<template>
  <!-- 搜索工作栏 -->
  <div
    class="search-box"
    style="width: calc(100% - 20px); height: auto; margin: 10px; background: #fefefe"
  >
    <!-- 标题 -->
    <BillTitle :options="billTitleOptions" />

    <Marquee>
      <span>{{ '通知信息...' }}</span>
    </Marquee>

    <div style="margin: 10px 0 0 40px">
      <Tinymce
        v-model="richTextValue"
        :width="`calc(100% - 80px)`"
        :height="600"
        :maxChars="100"
        :disabled="true"
        @change="handleRichTextChange"
      />
    </div>

    <CommonTree
      :title="`电站树`"
      @select="handleSelect"
      :value="treeData"
      class="w-1/4"
      :isShowOperationBtns="false"
      :canEdit="true"
      :canAdd="true"
      :canDelete="false"
      :fieldNames="{ key: 'nodeId', title: 'nodeName' }"
      checkable
      @edit="handleTreeEdit"
      @add="handleTreeAdd"
      @delete="handleTreeDelete"
      @refresh="handleTreeRefresh"
      ref="myCommonTree"
    />

    <Button @click="handleCancelCheck">取消勾选</Button>
    <div class="" style="width: 100%">
      <span style="float: left"> SearchBox </span>
      <!-- search box -->
      <span style="margin-left: 10px">searchBoxSearchText: {{ searchBoxSearchText }}</span>
      <SearchBox
        v-model:value="searchTableText"
        v-model:searchText="searchBoxSearchText"
        :columns="searchBoxColumns"
        :data="searchBoxData"
        :vfield="'date'"
        :pagination="true"
        twidth="500px"
        style="width: 220px"
        @search="handleSearchBoxSearch"
        @select="tableBoxSelect"
      />
      <span style="float: left"> TreeBox </span>
      <!-- tree box -->
      <TreeBox
        v-model:value="searchTreeText"
        vmode="edit"
        :tfields="{ key: 'nodeId', title: 'nodeName' }"
        :data="treeData"
        :multiple="true"
        :expand-all="false"
        @select="treeBoxSelect"
        style="width: 220px"
        twidth="400px"
      />
      <span style="float: left"> SelectBox </span>
      <br />
      <SelectBox
        v-model:value="searchSelectText"
        :tfields="{ label: 'llll', value: 'vvv' }"
        :data="[
          { vvv: '01', llll: 'Lucy01' },
          { vvv: '02', llll: 'Lucy02' },
        ]"
        @change="handleSelectBox"
        twidth="220px"
      />
    </div>
    <br />
    <Button @click="handleOpenCgDialog" style="margin: 0 10px 0 0">打开分类Dialog</Button>
    <Button @click="handleOpenOgDialog" style="margin: 0 10px 0 0">打开组织Dialog</Button>
    <Button @click="handleOpen2OgDialog" style="margin: 0 10px 0 0">打开组织Dialog2</Button>
    <br />

    <div style="width: 800px; margin: 15px 0 0; text-align: left;">
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
      >
        <a-form-item
          label="Username"
          name="username"
          :rules="[{ required: true, message: 'Please input your username!' }]"
        >
          <a-input v-model:value="formState.username" />
        </a-form-item>

        <a-form-item
          label="Password"
          name="password"
          :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <a-form-item
          label="igValue"
          name="igValue"
          :rules="[{ required: true, message: '请输入igValue的范围' }]"
        >
          <InputGroup v-model:value="formState.igValue" style="margin: 10px 0" :width="300" />
        </a-form-item>

        <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
          <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>
      </a-form>
    </div>
    

    <InputGroup v-model:value="igValue" style="margin: 10px 0" :width="300" />
    <br />
    <span style="display: block; margin-top: 10px; margin-left: 5px"> {{ igValue }} </span>
    <br />
    <br />
    <UploadBox
      :vmode="'box'"
      :width="800"
      :height="550"
      :maxCount="20"
      :maxSize="100 * 1024 * 1024"
      :application="`baseset`"
      :module="`oaleave`"
      :bizId="`test-bizid-${Math.floor(Math.random() * 100000)}`"
    />
    <CategoryDialog
      :title="`分类树Dialog`"
      v-model:visible="modalVisible"
      :tdata="treeData"
      :tfields="{ key: 'nodeId', title: 'nodeName' }"
      :gcolumns="searchBoxColumns"
      :gdata="searchBoxData"
      :width="800"
      :height="600"
      @cancel="handleCategoryCancel"
      @confirm="handleCategoryConfirm"
    />

    <OrganDialog
      :title="`组织人员1Dialog`"
      v-model:visible="organVisible"
      v-model:value="organValue"
      :tdata="treeData"
      :tfields="{ key: 'nodeId', title: 'nodeName' }"
      :width="800"
      :height="600"
      @cancel="handleOrganCancel"
      @confirm="handleOrganConfirm"
    />

    <OrganDialog
      :title="`组织人员2Dialog`"
      v-model:visible="organ2Visible"
      v-model:value="organ2Value"
      :tdata="treeData"
      :tfields="{ key: 'nodeId', title: 'nodeName' }"
      :width="800"
      :height="600"
      @cancel="handleOrgan2Cancel"
      @confirm="handleOrgan2Confirm"
    />

    <Dialog v-model:visible="dialogVisible" />
    <br />
    <span style="display: block; margin-top: 10px; margin-left: 5px"> {{ categoryConfirm }} </span>
    <br />
    <span style="display: block; margin-top: 10px; margin-left: 5px"> {{ organConfirm }} </span>

    <span style="float: left"> DictSelectBox {{ username + `${JSON.stringify(userInfo)}` }} </span>
    <br />

    <DictSelectBox
      v-model:value="selectedValue"
      :multiple="`multiple`"
      :type="DICT_TYPE.BPM_MODEL_CATEGORY"
      :width="220"
      :disabled="true"
      @change="handleDictSelectBoxChange"
    />

    <DictSelectBox
      v-model:value="selectedValue"
      :multiple="`multiple`"
      :type="DICT_TYPE.SYSTEM_USER_SEX"
      :width="220"
      :maxTagCount="1"
      style="margin-left: 5px"
      @change="handleDictSelectBoxChange"
    />

    <DictSelectBox
      v-model:value="selectedSValue"
      :type="DICT_TYPE.INFRA_CONFIG_TYPE"
      :width="220"
      style="margin-left: 5px"
      @change="handleDictSelectBoxChange"
    />

    <DictSelectBox v-model:value="selectedSValue" :type="DICT_TYPE.CERTIFICATE" />

    <br /><br />

    <DictRadioGroup
      v-model:value="radioGroupValue"
      :type="DICT_TYPE.BPM_MODEL_CATEGORY"
      rtype="radio"
      :disabled="disabled"
    />
    <DictRadioGroup
      v-model:value="radioGroupValue"
      :type="DICT_TYPE.SYSTEM_USER_SEX"
      rtype="vertical"
      :disabled="disabled"
    />
    <DictRadioGroup
      v-model:value="radioGroupValue"
      :type="DICT_TYPE.INFRA_CONFIG_TYPE"
      rtype="button"
      :disabled="disabled"
    />

    <XButton preIcon="ep:folder-opened" title="打开文件" />
    <XTextButton preIcon="ep:folder-opened" title="打开文件" />

    <!-- 审批按钮 -->
    <div style="margin: 16px 0 0 16px">
      <Button @click="handleOpenApprovalDrawer">审批</Button>
      <Button @click="handlePushAndClose">关闭并跳转</Button>
      <Button @click="handleGenerateUUID">生成UUID</Button>
      <Button @click="reloadCurrrentTab">刷新当前</Button>
    </div>

    <div> {{ uuidVal }} </div>

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

    <!-- <BubbleChart
      :data="chartData"
      :width="300"
      :height="300"
      :font-size="fontSize"
      :font-color="fontColor"
      :bubble-color="bubbleColor"
    /> -->

    <!-- <BarChart
      :data="barData"
      :width="500"
      :height="300"
      :barColors="['#2D93AD', '#F56D0E', '#B0DEA7']"
      :lineColors="['#FF6384', '#3366FF']"
      :barWidth="50"
    /> -->

    <!-- <DonutChart :data="donutData" :width="300" :height="200" :radius="100" />
    <EchartPieChart
      :data="pieData"
      :width="400"
      :height="400"
      :colors="pieColors"
      :show-label="true"
    /> -->

    <!-- <ThreeDDonutChart :data="donutData" width="300" height="200" radius="100" /> -->
    <!-- <ThreeDPieChart :data="tchartData" :width="400" :height="400" /> -->

    <!-- <EchartBarChart
      :data="echartData"
      :colors="chartColors"
      :legendData="chartLegend"
      width="600"
      height="400"
    />

    <EchartLineBarChart :colors="chartColors" width="600" height="400" />
    <EchartPillarChart :data="pchartData" /> -->

    <!-- <NtgaleChart /> -->

    <Table
      :table-css-style="{ width: '1200px', margin: '5px 0px 5px 0px', height: 'auto' }"
      :data="tableDataSource"
      :columns="tableColumns"
    />

    <div style="width: 1200px; height: 400px; margin: 5px 0px 20px 0px">
      <UploadTable
        ref="uploadTable"
        :rows="uploadRows"
        :colwidths="uploadColWidths"
        :application="`baseset`"
        :module="`oaleave`"
      />
    </div>

    <BasicTable @register="registerTable" />
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { Button } from 'ant-design-vue';
  import { useTabs } from '/@/hooks/web/useTabs';
  import SearchBox from '@/components/Framework/Combox/SearchBox.vue';
  import TreeBox from '@/components/Framework/Combox/TreeBox.vue';
  import InputGroup from '@/components/Framework/InputGroup/InputGroup.vue';
  import SelectBox from '@/components/Framework/Combox/SelectBox.vue';
  import Icon from '@/components/Icon/Icon.vue';
  import TreeSelectBox from '@/components/Framework/Combox/TreeSelectBox.vue';
  import Marquee from '@/components/Framework/Marquee/Marquee.vue';
  import UploadBox from '@/components/Framework/Combox/UploadBox.vue';
  import CommonTree from '@/components/Framework/Tree/CommonTree.vue';
  import DictSelectBox from '@/components/Framework/Combox/DictSelectBox.vue';
  import DictRadioGroup from '@/components/Framework/Radio/DictRadioGroup.vue';
  import BillTitle from '/@/components/Framework/BillTitle/BillTitle.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { TreeItem } from '/@/components/Tree';
  import { useDrawer } from '/@/components/Drawer';
  import ApprovalDrawer from '/@/components/Framework/ApprovalDrawer/ApprovalDrawer.vue';
  import CategoryDialog from '/@/components/Framework/Modal/CategoryDialog.vue';
  import Table from '/@/components/Framework/Table/Table.vue';
  import UploadTable from '/@/components/Framework/Table/UploadTable.vue';
  import OrganDialog from '@/components/Framework/Modal/OrganDialog.vue';
  import UploadDialog from '@/components/Framework/Modal/UploadDialog.vue';
  import XButton from '@/components/Framework/XButton/XButton.vue';
  import XTextButton from '@/components/Framework/XButton/XTextButton.vue';
  import type { Dayjs } from 'dayjs';
  import { DICT_TYPE } from '@/utils/dict';
  import { buildUUID, buildShortUUID } from '@/utils/uuid';
  import { Maths } from '@/utils/math';
  // import BubbleChart from '/@/components/Framework/Chart/BubbleChart.vue';
  // import DonutChart from '/@/components/Framework/Chart/DonutChart.vue';
  // import EchartPieChart from '/@/components/Framework/Chart/EchartPieChart.vue';
  // import EchartChinaMap from '../../components/Framework/Chart/EchartChinaMap.vue';
  // import EchartBarChart from '../../components/Framework/Chart/EchartBarChart.vue';
  // import EchartPillarChart from '../../components/Framework/Chart/EchartPillarChart.vue';
  // import EchartLineBarChart from '../../components/Framework/Chart/EchartLineBarChart.vue';
  // import BarChart from '/@/components/Framework/Chart/BarChart.vue';
  // import ThreeDDonutChart from '../../components/Framework/Chart/ThreeDDonutChart.vue';
  // import NtgaleChart from '/@/components/Framework/Chart/NtgaleChart.vue';
  // import ThreeDPieChart from '/@/components/Framework/Chart/ThreeDPieChart.vue';
  // import { BillTitleOptions } from '/@/components/Framework/BillTitle/types';
  import Dialog from '@/components/Framework/Modal/Dialog.vue';
  // import dayjs from 'dayjs';
  import { DateTools } from '/@/utils/dateUtil';
  import { Tinymce } from '/@/components/Tinymce/index';
  import { useUserStore } from '/@/store/modules/user';
  import { reloadCurrrentTab, addTabAndClose } from '/@/utils/route';
  import { BasicTable, useTable, BasicColumn } from '@/components/Table';

  type RangeValue = [Dayjs, Dayjs];

  defineOptions({ name: 'WorkFlow' });
  const message = useMessage(); // 消息弹窗
  const { push } = useRouter(); // 路由
  const userStore = useUserStore();

  const userInfo = userStore.getUserInfo;
  const username = userInfo?.username;
  const disabled = ref(false);
  const dialogVisible = ref(false);
  const igValue = ref('399,502');

  const { pushCloseTab, updatePath, closeCurrentPage } = useTabs();

  const loading = ref(true); // 列表的加载中
  const total = ref(0); // 列表的总页数
  const list = ref([]); // 列表的数据
  const queryFormRef = ref(); // 搜索的表单
  const tableData = ref([]);
  const rangeValue = ref<RangeValue>();
  const modalVisible = ref(false);
  const organVisible = ref(false);
  const organ2Visible = ref(false);
  const uploadVisible = ref(false);
  const categoryConfirm = ref('');
  const organConfirm = ref('');
  const selectedValue = ref([]);
  const selectedSValue = ref('');
  const radioGroupValue = ref('');
  const searchSelectText = ref('');
  const searchBoxSearchText = ref('');
  const uuidVal = ref('');

  const formState = reactive<any>({
    username: '',
    password: '',
    igValue: '',
    remember: true,
  });

  const uploadTable = ref();
  const uploadRows = ref<any[]>([]);
  const uploadColWidths = ref<string[]>([]);
  uploadRows.value = [
    {
      filetype: '营业执照证件',
      fnamelist: '',
      bizId: 'test-row-00028341',
      maxCount: 2,
      maxSize: 1024 * 1024 * 4096,
      required: false,
    },
    {
      filetype: '经营合规证书',
      fnamelist: '',
      bizId: 'test-row-0002333',
      maxCount: 1,
      maxSize: 1024 * 1024 * 4096,
      required: true,
      // type: '': Number | Date | String ,
      format: 'YYYY-MM-DD', // 'date / time / datetime'
    },
  ];
  uploadColWidths.value = ['15%', '70%', '15%'];

  const validate = () => {
    uploadTable.value?.validate();
  };
  const handleClearTips = () => {
    uploadTable.value?.handleClearTips();
  };

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

  const searchBoxData = ref([]);

  const treeData = ref<TreeItem[]>([]); // 左侧电站树数据
  const searchTreeText = ref('吉林通榆');
  const searchTableText = ref('2020-06');

  const chartData = [
    { name: '江苏', label: '江苏', value: 12, color: 'red' },
    { name: '山东', label: '山东', value: 11, color: 'green' },
    { name: '吉林', label: '吉林', value: 10, color: 'yellow' },
    { name: '浙江', label: '浙江', value: 9, color: 'blue' },
    { name: '湖北', label: '湖北', value: 8, color: 'skyblue' },
    { name: '黑龙江', label: '黑龙江', value: 7, color: 'purple' },
    { name: '天津', label: '天津', value: 7, color: 'purple' },
  ];
  const barData = [
    { barValue: 30, lineValue: 40 },
    { barValue: 60, lineValue: 20 },
    { barValue: 80, lineValue: 50 },
  ];
  const donutData = [
    { label: 'Category A', value: 30 },
    { label: 'Category B', value: 50 },
    { label: 'Category C', value: 20 },
  ];
  const tchartData = [
    {
      label: 'Category 1',
      value: 30,
      color: 'red',
    },
    {
      label: 'Category 2',
      value: 25,
      color: 'blue',
    },
    {
      label: 'Category 3',
      value: 45,
      color: 'green',
    },
  ];
  const emapData = [
    { name: '衢州', value: 177 },
    { name: '廊坊', value: 193 },
    { name: '菏泽', value: 194 },
    { name: '合肥', value: 229 },
    { name: '武汉', value: 273 },
    { name: '大庆', value: 279 },
  ];
  const fontSize = ref('18px');
  const fontColor = 'white';
  const bubbleColor = 'red';

  const echartData = ref({
    categories: ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'],
    barData: [
      { name: 'Series A', data: [30, 20, 15, 25, 10] },
      { name: 'Series B', data: [25, 15, 10, 20, 5] },
    ],
    lineData: [
      { name: 'Series C', data: [15, 10, 8, 12, 7] },
      { name: 'Series D', data: [20, 14, 12, 18, 8] },
    ],
  });

  const pchartData = ref({
    lData: [25, 28, 39, 14, 22, 14, 33],
    mData: [15, 22, 39, 14, 31, 15, 20],
    sData: [13, 20, 10, 34, 15, 30, 11],
    mName: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    units: ['单位', '单位'],
  });

  const pieData = ref([
    { name: '圣彼得堡来客', value: 5.6 },
    { name: '陀思妥耶夫斯基全集', value: 1 },
    { name: '史记精注全译（全6册）', value: 0.8 },
    { name: '加德纳艺术通史', value: 0.5 },
    { name: '表象与本质', value: 0.5 },
    { name: '其它', value: 3.8 },
  ]);

  const chartColors = ref(['#3c8dbc', '#00a65a', '#f39c12', '#d81b60']);
  const chartLegend = ref(['Series A', 'Series B', 'Series C', 'Series D']);
  const pieColors = ref(['red', 'green', 'blue', 'yellow', 'skyblue', 'purple']);
  const organValue = ref([]);
  const organ2Value = ref([]);

  const chinaRegionData = ref([]);
  chinaRegionData.value = [
    { name: '四川省', value: 102 },
    { name: '云南省', value: 522 },
    { name: '河南省', value: 1023 },
    { name: '河北省', value: 3023 },
    { name: '山西省', value: 2023 },
    { name: '黑龙江省', value: 1523 },
    { name: '吉林省', value: 2932 },
    { name: '辽宁省', value: 0 },
    { name: '江苏省', value: 0 },
    { name: '浙江省', value: 0 },
    { name: '安徽省', value: 0 },
    { name: '福建省', value: 0 },
    { name: '江西省', value: 0 },
    { name: '山东省', value: 0 },
    { name: '湖北省', value: 0 },
    { name: '湖南省', value: 0 },
    { name: '广东省', value: 0 },
    { name: '海南省', value: 0 },
    { name: '贵州省', value: 0 },
    { name: '陕西省', value: 0 },
    { name: '甘肃省', value: 0 },
    { name: '青海省', value: 0 },
    { name: '台湾省', value: 0 },
    { name: '内蒙古自治区', value: 0 },
    { name: '广西壮族自治区', value: 0 },
    { name: '西藏自治区', value: 0 },
    { name: '宁夏回族自治区', value: 0 },
    { name: '新疆维吾尔自治区', value: 0 },
    { name: '北京市', value: 0 },
    { name: '天津市', value: 0 },
    { name: '上海市', value: 0 },
    { name: '重庆市', value: 0 },
    { name: '香港特别行政区', value: 0 },
    { name: '澳门特别行政区', value: 0 },
  ];

  const tableDataSource = ref<any[]>([]);
  const tableColumns = ref<any[]>([]);

  tableDataSource.value = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
  ];

  tableColumns.value = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      halign: 'center',
      talign: 'center',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: '10%',
      halign: 'center',
      talign: 'center',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
      width: '40%',
      halign: 'center',
      talign: 'left',
    },
  ];

  // 查询左侧电站树数据
  async function queryDeptTreeList() {
    const result = JSON.parse(
      // '[{"id":"0","deptName":"华东分部","dept":"华东分部","orderNo":1,"createTime":"1994-03-30 00:48:18","remark":"认约快改们构想记指历社","status":"0","children":[{"id":"0-0","deptName":"研发部","orderNo":1,"createTime":"1996-08-28 05:09:32","remark":"号专六机局两其系油其员","status":"1","parentDept":"0"},{"id":"0-1","deptName":"市场部","orderNo":2,"createTime":"2017-12-07 08:08:03","remark":"装它做眼革提影委看地联命使美","status":"0","parentDept":"0"},{"id":"0-2","deptName":"商务部","orderNo":3,"createTime":"1983-06-08 07:21:54","remark":"切建叫入能权展容式值","status":"0","parentDept":"0"},{"id":"0-3","deptName":"财务部","orderNo":4,"createTime":"2008-08-13 15:14:15","remark":"多群示列众社强且白科矿改指","status":"1","parentDept":"0"}]},{"id":"1","deptName":"华南分部","orderNo":2,"createTime":"2020-03-04 23:20:18","remark":"受至己思元照再老代外四米办别品","status":"0","children":[{"id":"1-0","deptName":"研发部","orderNo":1,"createTime":"2004-06-14 18:04:06","remark":"义厂明到非很该信委十须明","status":"1","parentDept":"1"},{"id":"1-1","deptName":"市场部","orderNo":2,"createTime":"1993-08-29 18:05:18","remark":"下美四打者究日外公半最参备很百对称省","status":"1","parentDept":"1"},{"id":"1-2","deptName":"商务部","orderNo":3,"createTime":"2022-03-02 21:47:12","remark":"性出被间报速始六研想日我改","status":"0","parentDept":"1"},{"id":"1-3","deptName":"财务部","orderNo":4,"createTime":"1972-02-10 15:29:13","remark":"两段选段及向集太段数叫分","status":"1","parentDept":"1"}]},{"id":"2","deptName":"西北分部","orderNo":3,"createTime":"1982-12-26 23:06:46","remark":"江保学学却复前导作清油按那内成常","status":"0","children":[{"id":"2-0","deptName":"研发部","orderNo":1,"createTime":"2014-10-08 22:36:15","remark":"得省最做铁用种采她员特大听程斯例","status":"1","parentDept":"2"},{"id":"2-1","deptName":"市场部","orderNo":2,"createTime":"1973-08-08 20:39:11","remark":"间适事地和北我白者等调美果团置日元","status":"1","parentDept":"2"},{"id":"2-2","deptName":"商务部","orderNo":3,"createTime":"2013-03-14 04:32:44","remark":"着性下极别问拉和都手住","status":"0","parentDept":"2"},{"id":"2-3","deptName":"财务部","orderNo":4,"createTime":"2006-01-21 06:18:01","remark":"理正指加转气龙照光最上连生口对马名治越","status":"0","parentDept":"2","children":[{"id":"2-3-0","deptName":"研发部","orderNo":1,"createTime":"1996-08-28 05:09:32","remark":"号专六机局两其系油其员","status":"1","parentDept":"0"},{"id":"2-3-1","deptName":"市场部","orderNo":2,"createTime":"2017-12-07 08:08:03","remark":"装它做眼革提影委看地联命使美","status":"0","parentDept":"0"},{"id":"2-3-2","deptName":"商务部","orderNo":3,"createTime":"1983-06-08 07:21:54","remark":"切建叫入能权展容式值","status":"0","parentDept":"0"},{"id":"2-3-3","deptName":"财务部","orderNo":4,"createTime":"2008-08-13 15:14:15","remark":"多群示列众社强且白科矿改指","status":"1","parentDept":"0"}]}]}]',
      `{"code":0,"result":[{"orgId":"AABAB68C2D0440ADA0A52AE93B9508A0","parentId":"HZ93a0a37bcad63b017bd784ee2012e7","code":"GFJLTYYYZ","fullId":"/HZ93a0bf6ab8dd83016ab8deaca70009.ogn/91EEFF16B1FF4F5CBF5CECDB928689DB.ogn/0C3B5ADB82C748C5828846EC7B717CCE.dpt/HZ93a0a37bcad63b017bd784ee2012e7.dpt/AABAB68C2D0440ADA0A52AE93B9508A0.dpt","name":"吉林通榆","deviceCategory":null,"deviceType":null,"categoryName":null,"typeName":null,"propertyValue":"fisheries","stationId":null,"nodeId":"AABAB68C2D0440ADA0A52AE93B9508A0","nodeName":"吉林通榆","nodeType":null,"typeSort":null,"categorySort":null,"typeCode":null,"children":[]},{"orgId":"BC583036CFFA4EB3AE4ECCC21E57F682","parentId":"HZ93a0a37bcad63b017bd784ee2012e7","code":"GFJSRDYYZ","fullId":"/HZ93a0bf6ab8dd83016ab8deaca70009.ogn/91EEFF16B1FF4F5CBF5CECDB928689DB.ogn/0C3B5ADB82C748C5828846EC7B717CCE.dpt/HZ93a0a37bcad63b017bd784ee2012e7.dpt/BC583036CFFA4EB3AE4ECCC21E57F682.dpt","name":"江苏如东","deviceCategory":null,"deviceType":null,"categoryName":null,"typeName":null,"propertyValue":"station","stationId":"HZ93a0a35f810e6e015f904d09562813","nodeId":"BC583036CFFA4EB3AE4ECCC21E57F682","nodeName":"江苏如东","nodeType":null,"typeSort":null,"categorySort":null,"typeCode":null,"children":[{"orgId":null,"parentId":null,"code":null,"fullId":null,"name":null,"deviceCategory":"gfq","deviceType":"jzsnbq","categoryName":null,"typeName":"jzsnbq","propertyValue":null,"stationId":"HZ93a0a35f810e6e015f904d09562813","nodeId":"7e14c133613b443590005078554bb321d","nodeName":"gfq-cateGory","nodeType":"category","typeSort":null,"categorySort":1,"typeCode":"gfq","children":[{"orgId":null,"parentId":null,"code":null,"fullId":null,"name":null,"deviceCategory":"gfq","deviceType":"zcsnbq","categoryName":"gfq","typeName":"zcsnbq","propertyValue":null,"stationId":"HZ93a0a35f810e6e015f904d09562813","nodeId":"0d76f0a575a94fa599f63d8eb1a4283f","nodeName":"zcsnbq-type","nodeType":"type","typeSort":1,"categorySort":null,"typeCode":"zcsnbq","children":[]},{"orgId":null,"parentId":null,"code":null,"fullId":null,"name":null,"deviceCategory":"gfq","deviceType":"jzsnbq","categoryName":"gfq","typeName":"jzsnbq","propertyValue":null,"stationId":"HZ93a0a35f810e6e015f904d09562813","nodeId":"7e14c133613b443590005078554bb797","nodeName":"jzsnbq-type","nodeType":"type","typeSort":2,"categorySort":null,"typeCode":"jzsnbq","children":[]}]}]},{"orgId":"HZ93a0a35fd71b32015fd849228c100a","parentId":"HZ93a0a37bcad63b017bd784ee2012e7","code":"GFSDZBYYZ","fullId":"/HZ93a0bf6ab8dd83016ab8deaca70009.ogn/91EEFF16B1FF4F5CBF5CECDB928689DB.ogn/0C3B5ADB82C748C5828846EC7B717CCE.dpt/HZ93a0a37bcad63b017bd784ee2012e7.dpt/HZ93a0a35fd71b32015fd849228c100a.dpt","name":"山东高青","deviceCategory":null,"deviceType":null,"categoryName":null,"typeName":null,"propertyValue":"fisheries","stationId":null,"nodeId":"HZ93a0a35fd71b32015fd849228c100a","nodeName":"山东高青","nodeType":null,"typeSort":null,"categorySort":null,"typeCode":null,"children":[]},{"orgId":"HZ93a0a36120d1490161260327b63ea4","parentId":"HZ93a0a37bcad63b017bd784ee2012e7","code":"SDPD","fullId":"/HZ93a0bf6ab8dd83016ab8deaca70009.ogn/91EEFF16B1FF4F5CBF5CECDB928689DB.ogn/0C3B5ADB82C748C5828846EC7B717CCE.dpt/HZ93a0a37bcad63b017bd784ee2012e7.dpt/HZ93a0a36120d1490161260327b63ea4.dpt","name":"山东平度","deviceCategory":null,"deviceType":null,"categoryName":null,"typeName":null,"propertyValue":"fisheries","stationId":null,"nodeId":"HZ93a0a36120d1490161260327b63ea4","nodeName":"山东平度","nodeType":null,"typeSort":null,"categorySort":null,"typeCode":null,"children":[]},{"orgId":"HZ93a0a367e001980167e84d6e2962a4","parentId":"HZ93a0a37bcad63b017bd784ee2012e7","code":"tjdgyyz","fullId":"/HZ93a0bf6ab8dd83016ab8deaca70009.ogn/91EEFF16B1FF4F5CBF5CECDB928689DB.ogn/0C3B5ADB82C748C5828846EC7B717CCE.dpt/HZ93a0a37bcad63b017bd784ee2012e7.dpt/HZ93a0a367e001980167e84d6e2962a4.dpt","name":"天津大港","deviceCategory":null,"deviceType":null,"categoryName":null,"typeName":null,"propertyValue":"fisheries","stationId":null,"nodeId":"HZ93a0a367e001980167e84d6e2962a4","nodeName":"天津大港","nodeType":null,"typeSort":null,"categorySort":null,"typeCode":null,"children":[]}],"message":""}`,
    );
    const list = result.result as unknown as TreeItem[];
    treeData.value = list;
  }

  // 设置富文本框数据绑定对象
  const richTextValue = ref('');
  // 处理富文本输入框change事件
  function handleRichTextChange(value) {
    // TODO 监听富文本框change事件
    richTextValue.value;
  }

  // 左侧树状菜单选中事件
  function handleSelect(node) {
    // TODO node：被选中的节点，element：相关事件对象
  }
  // 编辑树的回调
  function handleTreeEdit(node) {
    console.log('handleTreeEdit', node);
  }
  // 获取节点
  function handleSelectBox(node) {
    searchSelectText.value;
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

  function handlePushAndClose() {
    const path = '/monitor/PVArea/subareaOverviewe';
    pushCloseTab(path);
    // updatePath(path);
  }

  const [approvalDrawerRegister, { openDrawer: openApprovalDrawer }] = useDrawer();

  // 打开流程审批抽屉
  function handleOpenApprovalDrawer() {
    setTimeout(() => {
      closeCurrentPage();
    }, 100);
    openApprovalDrawer(true);
    queryFlowNodeList();
  }

  // 生成UUID函数
  function handleGenerateUUID() {
    uuidVal.value = buildUUID();
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

  function handleOpen2OgDialog() {
    organ2Visible.value = true;
  }

  function handleOpenUpDialog() {
    uploadVisible.value = true;
  }

  const treeBoxSelect = (node, event) => {
    searchTreeText.value;
  };

  const handleSearchBoxSearch = (value) => {
    searchBoxSearchText.value;
  };

  const tableBoxSelect = (node, event) => {
    searchBoxSearchText.value;
    searchTableText.value;
  };

  const handleCategoryCancel = () => {
    modalVisible.value = false; // 关闭弹框
  };

  const handleCategoryConfirm = (node) => {
    categoryConfirm.value = '分类Dialog确定，返回结果：' + JSON.stringify(node);
    console.info('分类Dialog确定，返回结果：' + JSON.stringify(node));
    modalVisible.value = false; // 关闭弹框
  };

  const handleOrganCancel = () => {
    organVisible.value = false; // 关闭弹框
  };

  const handleOrgan2Cancel = () => {
    organ2Visible.value = false; // 关闭弹框
  };

  const handleOrganConfirm = (nodeList) => {
    const message = nodeList.length > 0 ? JSON.stringify(nodeList) : '';
    organConfirm.value = '组织人员选择Dialog确定，返回结果：' + message;
    organVisible.value = false; // 关闭弹框
    console.info('组织人员选择Dialog确定，返回结果：' + message);
  };

  const handleOrgan2Confirm = (nodeList) => {
    const message = nodeList.length > 0 ? JSON.stringify(nodeList) : '';
    organConfirm.value = '组织人员选择Dialog确定，返回结果：' + message;
    organ2Visible.value = false; // 关闭弹框
    console.info('组织人员选择Dialog确定，返回结果：' + message);
  };

  const handleUploadCancel = () => {
    uploadVisible.value = false;
  };

  const handleUploadConfirm = () => {
    uploadVisible.value = false;
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
    selectedValue.value = ['1', '2'] as never[];
    selectedSValue.value = '1';
    radioGroupValue.value = '1';

    const result = Maths.add('3223.23', 392.135, 2);

    setTimeout(() => {
      selectedValue.value = [];
      selectedSValue.value = '';
      radioGroupValue.value = '';
      disabled.value = !disabled.value;
      validate();
    }, 5000);

    organValue.value = JSON.parse(
      `[{"key":"76@0d76f0a575a94fa599f63d8eb1a4283f","nodeId":"0d76f0a575a94fa599f63d8eb1a4283f","title":"zcsnbq-type","nodeName":"zcsnbq-type"},{"key":"18@7e14c133613b443590005078554bb797","nodeId":"7e14c133613b443590005078554bb797","title":"jzsnbq-type","nodeName":"jzsnbq-type"},{"key":"92@7e14c133613b443590005078554bb321d","nodeId":"7e14c133613b443590005078554bb321d","title":"gfq-cateGory","nodeName":"gfq-cateGory"}]`,
    );

    organ2Value.value = JSON.parse(
      `[{"key":"76@0d76f0a575a94fa599f63d8eb1a4283f","nodeId":"0d76f0a575a94fa599f63d8eb1a4283f","title":"zcsnbq-type","nodeName":"zcsnbq-type"},{"key":"18@7e14c133613b443590005078554bb797","nodeId":"7e14c133613b443590005078554bb797","title":"jzsnbq-type","nodeName":"jzsnbq-type"},{"key":"92@7e14c133613b443590005078554bb321d","nodeId":"7e14c133613b443590005078554bb321d","title":"gfq-cateGory","nodeName":"gfq-cateGory"}]`,
    );

    searchBoxData.value = [
      { typeName: '财务部类型', year: '2020', month: '01', date: '2020-01' },
      { typeName: '市场部类型', year: '2020', month: '02', date: '2020-02' },
      { typeName: '华南部类型', year: '2020', month: '03', date: '2020-03' },
      { typeName: '西北部类型', year: '2020', month: '04', date: '2020-04' },
      { typeName: '财务部类型', year: '2020', month: '05', date: '2020-05' },
      { typeName: '财务部类型', year: '2020', month: '06', date: '2020-06' },
      { typeName: '市场部类型', year: '2020', month: '07', date: '2020-07' },
      { typeName: '华南部类型', year: '2020', month: '08', date: '2020-08' },
      { typeName: '西北部类型', year: '2020', month: '09', date: '2020-09' },
      { typeName: '华东部类型', year: '2020', month: '10', date: '2020-10' },
      { typeName: '商务部类型', year: '2020', month: '11', date: '2020-11' },
      { typeName: '研发部类型', year: '2020', month: '12', date: '2020-12' },
      { typeName: '财务部类型', year: '2021', month: '01', date: '2021-01' },
      { typeName: '研发部类型', year: '2021', month: '02', date: '2021-02' },
      { typeName: '财务部类型', year: '2021', month: '03', date: '2021-03' },
      { typeName: '市场部类型', year: '2021', month: '04', date: '2021-04' },
    ];

    const date = DateTools.format(new Date(), 'YYYY-MM-DD');
  });

  const myCommonTree = ref();
  const handleCancelCheck = () => {
    myCommonTree.value.cancelCheck();
  };

  const testColumns: BasicColumn[] = [
    { title: '类型', dataIndex: 'typeName', width: 150 },
    { title: '年份', dataIndex: 'year', width: 150 },
    {
      title: '金额',
      dataIndex: 'money',
      width: 150,
      format: { type: 'Money', format: '$,###.00' },
    },
    { title: '日期', dataIndex: 'date', width: 120, format: { type: 'Date', format: 'datestime' } },
  ];
  tableData.value = ref([
    { typeName: '财务部类型', year: '2020', money: '3315000', date: '2020-01-15 17:08:40' },
    { typeName: '市场部类型', year: '2020', money: '11103750', date: '2020-02-15 17:08:40' },
    { typeName: '华南部类型', year: '2020', money: '2930.2', date: '2020-03-15 17:08:40' },
    { typeName: '西北部类型', year: '2020', money: '123', date: '2020-04-15 17:08:40' },
    { typeName: '财务部类型', year: '2020', money: '123.8889', date: '2020-05-15 17:08:40' },
  ]);

  const [registerTable] = useTable({
    dataSource: tableData.value,
    columns: testColumns,
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
