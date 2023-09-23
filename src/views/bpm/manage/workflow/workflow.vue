<template>
  <div>
    <!-- 搜索工作栏 -->
    <WfSearchBox
      ref="wfSearchBox"
      @handle="handleQuery"
      @reset="resetQuery"
      @open="openForm('create')"
      @import="importForm"
    />

    <!-- 搜索内容 -->
    <div class="search-content">
      <el-table v-loading="loading" :data="list">
        <el-table-column label="流程标识" align="center" prop="key" width="200" />
        <el-table-column label="流程名称" align="center" prop="name" width="200">
          <template #default="scope">
            <el-button type="primary" link @click="handleBpmnDetail(scope.row)">
              <span>{{ scope.row.name }}</span>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="流程分类" align="center" prop="category" width="100">
          <template #default="scope">
            <DictTag
              v-if="scope.row.category"
              :type="DICT_TYPE.BPM_MODEL_CATEGORY"
              :value="scope.row.category"
            />
          </template>
        </el-table-column>
        <el-table-column label="表单信息" align="center" prop="formType" width="200">
          <template #default="scope">
            <el-button
              v-if="scope.row.formType === 10"
              type="primary"
              link
              @click="handleFormDetail(scope.row)"
            >
              <span>{{ scope.row.formName }}</span>
            </el-button>
            <el-button
              v-else-if="scope.row.formType === 20"
              type="primary"
              link
              @click="handleFormDetail(scope.row)"
            >
              <span>{{ scope.row.formCustomCreatePath }}</span>
            </el-button>
            <label v-else>暂无表单</label>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="180"
          :formatter="dateFormatter"
        />
        <el-table-column label="最新部署的流程定义" align="center">
          <el-table-column
            label="流程版本"
            align="center"
            prop="processDefinition.version"
            width="100"
          >
            <template #default="scope">
              <el-tag v-if="scope.row.processDefinition">
                v{{ scope.row.processDefinition.version }}
              </el-tag>
              <el-tag v-else type="warning">未部署</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="激活状态"
            align="center"
            prop="processDefinition.version"
            width="85"
          >
            <template #default="scope">
              <el-switch
                v-if="scope.row.processDefinition"
                v-model="scope.row.processDefinition.suspensionState"
                :active-value="1"
                :inactive-value="2"
                @change="handleChangeState(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="部署时间" align="center" prop="deploymentTime" width="180">
            <template #default="scope">
              <span v-if="scope.row.processDefinition">
                {{ DateTools.format(scope.row.processDefinition.deploymentTime, 'YYYY-MM-DD') }}
              </span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="操作" align="center" width="240" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="openForm('update', scope.row.id)">
              修改流程
            </el-button>
            <el-button link type="primary" @click="handleDesign(scope.row)"> 设计流程 </el-button>
            <el-button link type="primary" @click="handleAssignRule(scope.row)">
              分配规则
            </el-button>
            <el-button link type="primary" @click="handleDeploy(scope.row)"> 发布流程 </el-button>
            <el-button link type="primary" @click="handleDefinitionList(scope.row)">
              流程定义
            </el-button>
            <el-button link type="danger" @click="handleDelete(scope.row.id)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </div>

    <!-- 表单弹窗：添加/修改流程 -->
    <FormDialog
      ref="formDialogRef"
      @success="getList"
      :visible="formDialogVisible"
      @update:visible="formDialogVisible = $event"
    />

    <!-- 表单弹窗：导入流程 -->
    <ImportDialog
      ref="importDialogRef"
      @success="getList"
      :visible="importDialogVisible"
      @update:visible="importDialogVisible = $event"
    />

    <!-- 弹窗：表单详情 -->
    <Dialog
      title="表单详情"
      v-model:visible="formDetailVisible"
      :width="800"
      :height="600"
      :showBtm="false"
    >
      <form-create :rule="formDetailPreview.rule" :option="formDetailPreview.option" />
    </Dialog>

    <!-- 弹窗：流程模型图的预览 -->
    <Dialog
      title="流程图"
      v-model:visible="bpmnDetailVisible"
      :width="800"
      :height="600"
      :showBtm="false"
    >
      <MyProcessViewer
        key="designer"
        v-model="bpmnXML"
        :value="bpmnXML"
        v-bind="bpmnControlForm"
        :prefix="bpmnControlForm.prefix"
      />
    </Dialog>
  </div>
</template>
<script lang="ts" setup>
  import { DICT_TYPE } from '@/utils/dict';
  import { DateTools, dateFormatter } from '@/utils/dateUtil';
  import { ref, reactive, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import WfSearchBox from '/@/components/Framework/WorkFlow/WfSearchBox.vue';
  import DictTag from '@/components/Framework/Tag/DictTag/DictTag.vue';
  import { getTableDataWflow } from './workflow';
  import Pagination from '@/components/Framework/Pagination/Pagination.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import Dialog from '@/components/Framework/Modal/Dialog.vue';
  import FormDialog from './formDialog.vue';
  import ImportDialog from './importDialog.vue';
  import { getModelPage, deployModel, deleteModel } from '@/api/bpm/model';
  import { MyProcessViewer } from '@/components/Bpm/package';

  defineOptions({ name: 'WorkFlow' });
  const message = useMessage(); // 消息弹窗
  const { push } = useRouter(); // 路由

  const loading = ref(true); // 列表的加载中
  const total = ref(0); // 列表的总页数
  const list = ref([]); // 列表的数据
  const wfSearchBox = ref(); // 搜索的表单

  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    key: undefined,
    name: undefined,
    category: undefined,
  });

  /** 流程图的详情按钮操作 */
  const bpmnDetailVisible = ref(false);
  const bpmnXML = ref('');
  const bpmnControlForm = ref({
    prefix: 'flowable',
  });

  /** 流程表单的详情按钮操作 */
  const formDetailVisible = ref(false);
  const formDetailPreview = ref({
    rule: [],
    option: {},
  });

  const importDialogVisible = ref(false);
  /** 导入流程操作 */
  const importDialogRef = ref();
  const importForm = () => {
    importDialogVisible.value = true;
    importDialogRef.value.open();
  };

  const formDialogVisible = ref(false);
  /** 添加/修改操作 */
  const formDialogRef = ref();
  const openForm = (type: string, id?: number) => {
    formDialogVisible.value = true;
    formDialogRef.value.open(type, id);
  };

  /** 搜索按钮操作 */
  const handleQuery = (params) => {
    queryParams.pageNo = 1;
    getList(params);
  };

  /** 重置按钮操作 */
  const resetQuery = (params) => {
    const formRef = wfSearchBox.value.$refs.queryFormRef;
    formRef.resetFields();
    handleQuery(params);
  };

  // 查询流程表格列表数据
  const getList = async (params) => {
    loading.value = true;
    try {
      getModelPage({
        pageNo: queryParams.pageNo,
        pageSize: queryParams.pageSize,
        key: params ? params.key : '',
        name: params ? params.name : '',
        category: params ? params.category : '',
      }).then((data) => {
        list.value = data.result.list;
        total.value = data.result.total;
      });
    } finally {
      loading.value = false;
    }
  };

  // 执行删除流程记录操作
  const handleDelete = async (id: number) => {
    try {
      // 删除的二次确认
      await message.delConfirm(`请确认是否删除此流程数据项？`);

      // 调用集维后端接口，删除流程相应数据 TODO
      deleteModel(id).then(() => {
        // 刷新列表
        getList();
      });
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
      deployModel(row.id).then(() => {
        // 刷新列表
        getList();
      });

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

  /** 点击任务分配按钮 */
  const handleAssignRule = (row) => {
    push({
      name: 'BpmTaskAssignRuleList',
      query: {
        modelId: row.id,
      },
    });
  };

  /** 跳转到指定流程定义列表 */
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
    bpmnDetailVisible.value = true;
    const data = { bpmnXml: '' }; // TODO 需袁老师联调接口，获取流程设计XML详情
    bpmnXML.value = data.bpmnXml || '';
  };

  /** 初始化 **/
  onMounted(() => {
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
