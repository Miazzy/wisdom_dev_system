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
}

export const getMyProcessInstancePage = async (params) => {
  const requestParams = { url: BpmProInstanceApi.MyProcessInstancePage, params };
  return defHttp.get<any>(requestParams, { isOnlyResult: true });
};

export const createProcessInstance = async (data) => {
  const requestParams = { url: BpmProInstanceApi.MyProcessInstancePage, data };
  return defHttp.post<any>(requestParams, {});
};

export const cancelProcessInstance = async (id: number, reason: string) => {
  const data = { id, reason };
  const requestParams = { url: BpmProInstanceApi.CancelProcessInstance, data };
  return defHttp.delete<any>(requestParams, {});
};

export const getProcessInstance = async (id: number) => {
  const requestParams = { url: BpmProInstanceApi.GetProcessInstance + id };
  return defHttp.get<any>(requestParams, {});
};
