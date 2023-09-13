<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <div class="search-form">
      <el-form class="ml-15px" :model="queryParams" ref="queryFormRef" :inline="true">
        <div class="form-line">
          <el-form-item label="流程标识" prop="key">
            <el-input
              v-model="queryParams.key"
              placeholder="请输入流程标识"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="流程名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入流程名称"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="流程分类" prop="category">
            <el-select v-model="queryParams.category" placeholder="请选择流程分类" clearable>
              <el-option
                v-for="dict in getDictTypeWflow()"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="form-line form-bottom">
          <el-form-item>
            <el-button @click="handleQuery">
              <span style="margin-left: 5px"> {{ searchName }} </span>
            </el-button>
            <el-button @click="resetQuery">
              <span style="margin-left: 5px"> {{ resetName }} </span>
            </el-button>
            <el-button type="primary" plain @click="openForm('create')">
              <span style="margin-left: 5px"> {{ newWflowName }} </span>
            </el-button>
            <el-button type="success" plain @click="openImportForm">
              <span style="margin-left: 5px"> {{ importWflowName }} </span>
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

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
            <dict-tag :type="DICT_TYPE.BPM_MODEL_CATEGORY" :value="scope.row.category" />
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
            <el-button
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
              v-hasPermi="['bpm:model:update']"
            >
              修改流程
            </el-button>
            <el-button
              link
              type="primary"
              @click="handleDesign(scope.row)"
              v-hasPermi="['bpm:model:update']"
            >
              设计流程
            </el-button>
            <el-button
              link
              type="primary"
              @click="handleAssignRule(scope.row)"
              v-hasPermi="['bpm:task-assign-rule:query']"
            >
              分配规则
            </el-button>
            <el-button
              link
              type="primary"
              @click="handleDeploy(scope.row)"
              v-hasPermi="['bpm:model:deploy']"
            >
              发布流程
            </el-button>
            <el-button
              link
              type="primary"
              v-hasPermi="['bpm:process-definition:query']"
              @click="handleDefinitionList(scope.row)"
            >
              流程定义
            </el-button>
            <el-button
              link
              type="danger"
              @click="handleDelete(scope.row.id)"
              v-hasPermi="['bpm:model:delete']"
            >
              删除
            </el-button>
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
  </ContentWrap>
</template>
<script lang="ts" setup>
  import { DICT_TYPE } from '@/utils/dict';
  import { DateTools, dateFormatter } from '@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ref, reactive, onMounted } from 'vue';
  import { useRouter } from 'vue-router';

  defineOptions({ name: 'WorkFlow' });

  const { t } = useI18n();
  const { push } = useRouter(); // 路由
  const searchName = t('routes.basic.bpm.manage.wflowpage.search'); // 搜索
  const resetName = t('routes.basic.bpm.manage.wflowpage.reset'); // 重置
  const newWflowName = t('routes.basic.bpm.manage.wflowpage.newwflow'); // 新建流程
  const importWflowName = t('routes.basic.bpm.manage.wflowpage.importwflow'); // 导入流程

  const loading = ref(true); // 列表的加载中
  const total = ref(0); // 列表的总页数
  const list = ref([]); // 列表的数据
  const queryFormRef = ref(); // 搜索的表单
  const tableData = ref([]);
  const queryParams = reactive({
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

  const getDictTypeWflow = () => {
    const type = JSON.parse(
      `[{"value":1,"label":"默认","colorType":"primary","cssClass":""},{"value":2,"label":"OA","colorType":"success","cssClass":""}]`,
    );
    return type;
  };

  const getTableDataWflow = () => {
    const data = JSON.parse(
      `{"list":[{"key":"vue3_huoqian","name":"vue3会签","description":null,"category":null,"formType":null,"formId":null,"formCustomCreatePath":null,"formCustomViewPath":null,"id":"de3a16a7-a0a5-11ed-9f70-acde48001122","formName":null,"createTime":1675086977675,"processDefinition":null},{"key":"vue3_normal","name":"vue3普通工作流","description":null,"category":"1","formType":10,"formId":23,"formCustomCreatePath":"","formCustomViewPath":null,"id":"3cd88b2c-a09c-11ed-b5b4-acde48001122","formName":"可以用的表单","createTime":1675082841452,"processDefinition":{"id":"vue3_normal:1:89a58529-a0a4-11ed-9f70-acde48001122","version":1,"deploymentTime":1675086404870,"suspensionState":1}},{"key":"aoteman112","name":"2","description":"3","category":"1","formType":10,"formId":18,"formCustomCreatePath":null,"formCustomViewPath":null,"id":"2a51b46b-9895-11ed-bd9b-b29457079be3","formName":"测试","createTime":1674200194590,"processDefinition":null},{"key":"test_file","name":"测试文件","description":null,"category":"2","formType":10,"formId":19,"formCustomCreatePath":null,"formCustomViewPath":null,"id":"dbd799ed-0d09-11ed-a0fd-427d68986255","formName":"测试文件","createTime":1658857151256,"processDefinition":{"id":"test_file:2:79d9b3fa-970e-11ed-ab4b-ee1dc3210acf","version":2,"deploymentTime":1674032392927,"suspensionState":1}},{"key":"oa_leave","name":"OA 请假","description":null,"category":"2","formType":20,"formId":null,"formCustomCreatePath":"/bpm/oa/leave/create","formCustomViewPath":"/bpm/oa/leave/detail","id":"5eba3e41-0b26-11ed-a881-427d68986255","formName":null,"createTime":1658649494428,"processDefinition":{"id":"oa_leave:4:9a228696-0b26-11ed-a881-427d68986255","version":4,"deploymentTime":1658649593120,"suspensionState":1}},{"key":"test_import","name":"测试导入流程","description":"哈哈哈","category":"1","formType":10,"formId":18,"formCustomCreatePath":null,"formCustomViewPath":null,"id":"96fbc9ad-051c-11ed-a88c-427d68986255","formName":"测试","createTime":1657985586866,"processDefinition":null},{"key":"qingjia","name":"请假测试","description":"哈哈哈哈3","category":"1","formType":20,"formId":23,"formCustomCreatePath":"12","formCustomViewPath":"23","id":"0feec618-0512-11ed-a88c-427d68986255","formName":"可以用的表单","createTime":1657981065316,"processDefinition":{"id":"qingjia:9:cd0ada66-98e0-11ed-94ae-b29457079be3","version":9,"deploymentTime":1674232679742,"suspensionState":1}},{"key":"test","name":"测试流程","description":"biubiu","category":"1","formType":10,"formId":23,"formCustomCreatePath":null,"formCustomViewPath":null,"id":"571f1c6f-04e2-11ed-86b8-427d68986255","formName":"可以用的表单","createTime":1657960568912,"processDefinition":{"id":"test:10:64457386-9b08-11ed-93bb-b29457079be3","version":10,"deploymentTime":1674469584513,"suspensionState":1}},{"key":"huoqian","name":"或签","description":"1231","category":"1","formType":10,"formId":17,"formCustomCreatePath":null,"formCustomViewPath":null,"id":"f72619aa-de72-11ec-b639-baed8c0f87bf","formName":null,"createTime":1653734589575,"processDefinition":{"id":"huoqian:4:b9e9513a-0981-11ed-9f76-427d68986255","version":4,"deploymentTime":1658468826470,"suspensionState":1}},{"key":"huiqian","name":"会签","description":null,"category":"1","formType":10,"formId":17,"formCustomCreatePath":null,"formCustomViewPath":null,"id":"ffdd0c91-de71-11ec-b7c0-baed8c0f87bf","formName":null,"createTime":1653734174698,"processDefinition":{"id":"huiqian:6:c10cc6b2-fe19-11ec-b39c-065114797fbf","version":6,"deploymentTime":1657214710726,"suspensionState":1}}],"total":10}`,
    );
    return data;
  };

  /** 搜索按钮操作 */
  const handleQuery = () => {
    queryParams.pageNo = 1;
    getList();
  };

  /** 重置按钮操作 */
  const resetQuery = () => {
    queryFormRef.value.resetFields();
    handleQuery();
  };

  /** 查询列表 */
  const getList = async () => {
    loading.value = true;
    try {
      const data = getTableDataWflow();
      debugger;
      list.value = data.list;
      total.value = data.total;
    } finally {
      loading.value = false;
    }
  };

  const openForm = (type: string, id?: number) => {
    formRef.value.open(type, id);
  };

  const openImportForm = () => {
    importFormRef.value.open();
  };

  /** 删除按钮操作 */
  const handleDelete = async (id: number) => {
    try {
      // 刷新列表
      await getList();
    } catch (e) {
      //
    }
  };

  /** 更新状态操作 */
  const handleChangeState = async (row) => {
    const state = row.processDefinition.suspensionState;
    try {
      // 修改状态的二次确认
      const id = row.id;
      const statusState = state === 1 ? '激活' : '挂起';
      const content = '是否确认' + statusState + '流程名字为"' + row.name + '"的数据项?';
      // 刷新列表
      await getList();
    } catch {
      // 取消后，进行恢复按钮
      row.processDefinition.suspensionState = state === 1 ? 2 : 1;
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

  /** 发布流程 */
  const handleDeploy = async (row) => {
    try {
      // 刷新列表
      await getList();
    } catch {
      //
    }
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
    const data = JSON.parse(
      `{"key":"vue3_huoqian","name":"vue3会签","description":null,"category":null,"formType":null,"formId":null,"formCustomCreatePath":null,"formCustomViewPath":null,"id":"de3a16a7-a0a5-11ed-9f70-acde48001122","formName":null,"createTime":1675086977675,"processDefinition":null}`,
    );
    bpmnXML.value = data.bpmnXml || '';
    bpmnDetailVisible.value = true;
  };

  /** 初始化 **/
  onMounted(() => {
    getList();
  });
</script>
<style scoped>
  .search-form {
    height: 150px;
    margin: 15px 15px 10px 10px;
    padding: 5px;
    border: 1px solid #fafafa;
    background: #fcfcfc;
    line-height: 150px;

    .ml-15px {
      margin-left: 15px;
    }

    .form-line {
      width: 100%;
      height: 50px;

      &:first-child {
        margin-top: -25px;
      }
    }
  }

  .search-content {
    width: calc(100% - 25px);
    height: calc(100vh - 150px);
    margin: 15px 15px 10px 10px;
    background: #fefefe;
  }

  .surely-table-body {
    div {
      div {
        display: none !important;
        opacity: 0 !important;
      }

      div.surely-table-body-viewport-container {
        display: block !important;
      }

      div.surely-table-body-scroll-measure {
        display: block !important;
      }

      div.surely-table-body-inner-measure {
        display: block !important;
      }
    }
  }
</style>
