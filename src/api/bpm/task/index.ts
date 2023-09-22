import { defHttp } from '/@/utils/http/axios';

export type TaskVO = {
  id: number;
};

// 表单API
export enum BpmTaskApi {
  GetTodoTaskPage = '/bpm/task/todo-page',
  GetDoneTaskPage = '/bpm/task/done-page',
  CompleteTask = '/bpm/task/complete',
  ApproveTask = '/bpm/task/approve',
  RejectTask = '/bpm/task/reject',
  BackTask = '/bpm/task/back',
  UpdateTaskAssignee = '/bpm/task/update-assignee',
  GetTaskListByProcessInstanceId = '/bpm/task/list-by-process-instance-id?processInstanceId=',
  ExportTask = '/bpm/task/export',
}

export const getTodoTaskPage = async (params) => {
  const requestParams = { url: BpmTaskApi.GetTodoTaskPage, params };
  return defHttp.get<any>(requestParams, {});
};

export const getDoneTaskPage = async (params) => {
  const requestParams = { url: BpmTaskApi.GetDoneTaskPage, params };
  return defHttp.get<any>(requestParams, {});
};

export const completeTask = async (data) => {
  const requestParams = { url: BpmTaskApi.CompleteTask, data };
  return defHttp.put<any>(requestParams, {});
};

export const approveTask = async (data) => {
  const requestParams = { url: BpmTaskApi.ApproveTask, data };
  return defHttp.put<any>(requestParams, {});
};

export const rejectTask = async (data) => {
  const requestParams = { url: BpmTaskApi.RejectTask, data };
  return defHttp.put<any>(requestParams, {});
};

export const backTask = async (data) => {
  const requestParams = { url: BpmTaskApi.BackTask, data };
  return defHttp.put<any>(requestParams, {});
};

export const updateTaskAssignee = async (data) => {
  const requestParams = { url: BpmTaskApi.UpdateTaskAssignee, data };
  return defHttp.put<any>(requestParams, {});
};

export const getTaskListByProcessInstanceId = async (processInstanceId) => {
  const requestParams = { url: BpmTaskApi.GetTaskListByProcessInstanceId + processInstanceId };
  return defHttp.get<any>(requestParams, {});
};

// 导出任务
export const exportTask = async (params) => {
  const requestParams = { url: BpmTaskApi.ExportTask, params };
  return defHttp.download<any>(requestParams, {});
};
