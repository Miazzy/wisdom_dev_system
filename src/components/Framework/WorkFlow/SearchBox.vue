<template>
  <div class="search-form">
    <el-form class="ml-15px" ref="queryFormRef" :inline="true">
      <div class="form-line">
        <el-form-item label="流程标识" prop="key">
          <el-input
            v-model="qparams.key"
            placeholder="请输入流程标识"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="流程名称" prop="name">
          <el-input
            v-model="qparams.name"
            placeholder="请输入流程名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="流程分类" prop="category">
          <el-select v-model="qparams.category" placeholder="请选择流程分类" clearable>
            <el-option
              v-for="dict in getDictTypeWflow()"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery">
            <span style="margin-left: 0px"> {{ searchName }} </span>
          </el-button>
          <el-button @click="resetQuery">
            <span style="margin-left: 0px"> {{ resetName }} </span>
          </el-button>
        </el-form-item>
      </div>
      <div class="form-line form-bottom">
        <el-form-item>
          <el-button type="primary" plain @click="openForm">
            <span style="margin-left: 0px"> {{ newWflowName }} </span>
          </el-button>
          <el-button type="success" plain @click="importForm">
            <span style="margin-left: 0px"> {{ importWflowName }} </span>
          </el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, watch, PropType, reactive } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getDictTypeWflow } from '@/utils/dict';
  import type { ParamsType } from '/#/workflow';

  const { t } = useI18n();
  const emit = defineEmits(['handle', 'reset', 'open', 'import']);

  const props = defineProps({
    params: { type: Object as PropType<ParamsType> },
  });
  const qparams = reactive<ParamsType>({
    pageNo: 1,
    pageSize: 10,
    key: '',
    name: '',
    category: '',
  });

  const searchName = t('routes.basic.bpm.manage.wflowpage.search'); // 搜索
  const resetName = t('routes.basic.bpm.manage.wflowpage.reset'); // 重置
  const newWflowName = t('routes.basic.bpm.manage.wflowpage.newwflow'); // 新建流程
  const importWflowName = t('routes.basic.bpm.manage.wflowpage.importwflow'); // 导入流程

  // 搜索按钮操作
  const handleQuery = () => {
    emit('handle', qparams);
  };

  // 重置按钮操作
  const resetQuery = () => {
    emit('reset', qparams);
  };

  // 新建表单
  const openForm = () => {
    emit('open', qparams, 'create');
  };

  // 导入表单
  const importForm = () => {
    emit('import', qparams);
  };

  watch(
    () => props.params,
    (newValue) => {
      //
    },
  );

  onMounted(() => {
    //
  });
</script>
<style lang="less" scoped>
  .search-form {
    height: 140px;
    margin: 15px 15px 10px 10px;
    padding: 5px;
    border: 1px solid #fafafa;
    background: #fcfcfc;
    line-height: 140px;

    .ml-15px {
      margin-left: 15px;
    }

    .form-line {
      width: 100%;
      height: 50px;
      margin-top: 5px;

      &:first-child {
        margin-top: -25px;
      }
    }
  }
</style>
