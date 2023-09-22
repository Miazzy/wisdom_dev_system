import { defHttp } from '/@/utils/http/axios';

export type TaskAssignVO = {
  id: number;
  modelId: string;
  processDefinitionId: string;
  taskDefinitionKey: string;
  taskDefinitionName: string;
  options: string[];
  type: number;
};

// 表单API
export enum BpmTaskAssignRuleApi {
  GetTaskAssignRuleList = '/bpm/task-assign-rule/list',
  CreateTaskAssignRule = '/bpm/task-assign-rule/create',
  UpdateTaskAssignRule = '/bpm/task-assign-rule/update',
}

export const getTaskAssignRuleList = async (params) => {
  const requestParams = { url: BpmTaskAssignRuleApi.GetTaskAssignRuleList, params };
  return defHttp.get<any>(requestParams, {});
};

export const createTaskAssignRule = async (data: TaskAssignVO) => {
  const requestParams = { url: BpmTaskAssignRuleApi.CreateTaskAssignRule, data };
  return defHttp.post<any>(requestParams, {});
};

export const updateTaskAssignRule = async (data: TaskAssignVO) => {
  const requestParams = { url: BpmTaskAssignRuleApi.UpdateTaskAssignRule, data };
  return defHttp.put<any>(requestParams, {});
};
