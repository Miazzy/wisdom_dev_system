import { defHttp } from '/@/utils/http/axios';

export type TaskAssignVO = {
  id: number;
  modelId: string;
  processDefinitionId: string;
  taskDefinitionKey: string;
  taskDefinitionName: string;
  options: string[];//分配
  type: number;//分配类型
  ccId: number;
  ccOptions: string[];//抄送
  ccType: number;//抄送类型
};

// 表单API
export enum BpmTaskAssignRuleApi {
  GetTaskAssignRuleList = '/bpm/task-assign-rule/list',
  CreateTaskAssignRule = '/bpm/task-assign-rule/create',
  UpdateTaskAssignRule = '/bpm/task-assign-rule/update',
  CreateTaskCcRule = '/bpm/task-cc-rule/create',
  UpdateTaskCcRule = '/bpm/task-cc-rule/update',
}


export const getTaskAssignRuleList = async (params) => {
  const requestParams = { url: BpmTaskAssignRuleApi.GetTaskAssignRuleList, params };
  return defHttp.get<any>(requestParams, { isOnlyResult: true });
};

export const createTaskAssignRule = async (data: TaskAssignVO) => {
  const requestParams = { url: BpmTaskAssignRuleApi.CreateTaskAssignRule, data };
  return defHttp.post<any>(requestParams, {});
};

export const updateTaskAssignRule = async (data: TaskAssignVO) => {
  const requestParams = { url: BpmTaskAssignRuleApi.UpdateTaskAssignRule, data };
  return defHttp.put<any>(requestParams, {});
};

export const createTaskCcRule = async (data: TaskAssignVO) => {
  const requestParams = { url: BpmTaskAssignRuleApi.CreateTaskCcRule, data };
  return defHttp.post<any>(requestParams, {});
};

export const updateTaskCcRule = async (data: TaskAssignVO) => {
  const requestParams = { url: BpmTaskAssignRuleApi.UpdateTaskCcRule, data };
  return defHttp.put<any>(requestParams, {});
};
