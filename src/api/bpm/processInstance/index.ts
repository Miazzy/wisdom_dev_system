import { defHttp } from '/@/utils/http/axios';

export type Task = {
  id: string;
  name: string;
};

export type ProcessInstanceVO = {
  id: number;
  name: string;
  processDefinitionId: string;
  category: string;
  result: number;
  tasks: Task[];
  fields: string[];
  status: number;
  remark: string;
  businessKey: string;
  createTime: string;
  endTime: string;
};

// 表单API
export enum BpmProInstanceApi {
  MyProcessInstancePage = '/bpm/process-instance/my-page',
  CreateProcessInstance = '/bpm/process-instance/create',
  CancelProcessInstance = '/bpm/process-instance/cancel',
  GetProcessInstance = '/bpm/process-instance/get?id=',
  AbortProcessInstance = '/bpm/process-instance/abort?id=',
  GetFallbackNode = '/bpm/process-instance/getFallbackNode',
  BackTask = '/bpm/process-instance/back?taskId=',
  ReplenishTask = '/bpm/process-instance/replenish?taskId=',
  DeleteProcessInstance = '/bpm/process-instance/delete',
  GetFlowData = '/bpm/process-instance/getFlowData?bizId=',
}

export const getMyProcessInstancePage = async (params) => {
  const requestParams = { url: BpmProInstanceApi.MyProcessInstancePage, params };
  return defHttp.get<any>(requestParams, { isOnlyResult: true });
};

export const createProcessInstance = async (data) => {
  const requestParams = { url: BpmProInstanceApi.CreateProcessInstance, data };
  return defHttp.post<any>(requestParams, {});
};

export const cancelProcessInstance = async (id: string, reason: string) => {
  const data = { id, reason };
  const requestParams = { url: BpmProInstanceApi.CancelProcessInstance, data };
  return defHttp.delete<any>(requestParams, {});
};

export const deleteProcessInstance = async (id: string) => {
  const data = { id };
  const requestParams = { url: BpmProInstanceApi.DeleteProcessInstance, data };
  return defHttp.delete<any>(requestParams, {});
};

export const getProcessInstance = async (id: string) => {
  const requestParams = { url: BpmProInstanceApi.GetProcessInstance + id };
  const isOnlyResult = true;
  let result = null;
  try {
    result = await defHttp.get<any>(requestParams, { isOnlyResult });
  } catch (error) {
    console.error('查询流程信息异常, WorkFlow Get Process Instance:', error);
    result = await defHttp.get<any>(requestParams, { isOnlyResult });
  }
  return result;
};

//终止流程实例
export const abortProcessInstance = async (data) => {
  const requestParams = { url: BpmProInstanceApi.AbortProcessInstance, data };
  return defHttp.post<any>(requestParams, {});
};

export const getFallbackNode = async (params) => {
  const requestParams = { url: BpmProInstanceApi.GetFallbackNode, params };
  return defHttp.get<any>(requestParams, { isOnlyResult: true });
};

export const backTask = async (params) => {
  const requestParams = {
    url: BpmProInstanceApi.BackTask + params.taskId + '&targetKey=' + params.targetKey,
  };
  return defHttp.post<any>(requestParams, {});
};

export const replenishTask = async (params) => {
  const requestParams = {
    url: BpmProInstanceApi.ReplenishTask + params.taskId + '&targetKey=' + params.targetKey,
  };
  return defHttp.post<any>(requestParams, {});
};

export const getFlowData = async (bizId) => {
  const requestParams = { url: BpmProInstanceApi.GetFlowData+bizId };
  return defHttp.get<any>(requestParams, { isOnlyResult: true });
};