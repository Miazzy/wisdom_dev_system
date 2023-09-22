<template>
  <div style="margin-top: 16px">
    <el-form-item label="到期时间">
      <el-input v-model="userTaskForm.dueDate" clearable @change="updateElementTask('dueDate')" />
    </el-form-item>
    <el-form-item label="跟踪时间">
      <el-input
        v-model="userTaskForm.followUpDate"
        clearable
        @change="updateElementTask('followUpDate')"
      />
    </el-form-item>
    <el-form-item label="优先级">
      <el-input v-model="userTaskForm.priority" clearable @change="updateElementTask('priority')" />
    </el-form-item>
    友情提示：任务的分配规则，使用
    <router-link target="_blank" :to="{ path: '/bpm/manager/model' }"
      ><el-link type="danger">流程模型</el-link>
    </router-link>
    下的【分配规则】替代，提供指定角色、部门负责人、部门成员、岗位、工作组、自定义脚本等 7
    种维护的任务分配维度，更加灵活！
  </div>
</template>

<script lang="ts" setup>
  import { ref, toRaw, watch, nextTick, onBeforeUnmount } from 'vue';

  defineOptions({ name: 'UserTask' });
  const props = defineProps({
    id: String,
    type: String,
  });
  const defaultTaskForm = ref({
    assignee: '',
    candidateUsers: [],
    candidateGroups: [],
    dueDate: '',
    followUpDate: '',
    priority: '',
  });
  const userTaskForm = ref<any>({});
  // const mockData=ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  const bpmnElement = ref();
  const bpmnInstances = () => (window as any)?.bpmnInstances;

  const resetTaskForm = () => {
    for (let key in defaultTaskForm.value) {
      let value;
      if (key === 'candidateUsers' || key === 'candidateGroups') {
        value = bpmnElement.value?.businessObject[key]
          ? bpmnElement.value.businessObject[key].split(',')
          : [];
      } else {
        value = bpmnElement.value?.businessObject[key] || defaultTaskForm.value[key];
      }
      userTaskForm.value[key] = value;
    }
  };
  const updateElementTask = (key) => {
    const taskAttr = Object.create(null);
    if (key === 'candidateUsers' || key === 'candidateGroups') {
      taskAttr[key] =
        userTaskForm.value[key] && userTaskForm.value[key].length
          ? userTaskForm.value[key].join()
          : null;
    } else {
      taskAttr[key] = userTaskForm.value[key] || null;
    }
    bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), taskAttr);
  };

  watch(
    () => props.id,
    () => {
      bpmnElement.value = bpmnInstances().bpmnElement;
      nextTick(() => {
        resetTaskForm();
      });
    },
    { immediate: true },
  );
  onBeforeUnmount(() => {
    bpmnElement.value = null;
  });
</script>
