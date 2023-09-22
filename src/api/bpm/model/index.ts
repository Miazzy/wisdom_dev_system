<<<<<<< HEAD
import { defHttp } from '/@/utils/http/axios';

export type ProcessDefinitionVO = {
  id: string;
  version: number;
  deploymentTIme: string;
  suspensionState: number;
};

export type ModelVO = {
  id: number;
  formName: string;
  key: string;
  name: string;
  description: string;
  category: string;
  formType: number;
  formId: number;
  formCustomCreatePath: string;
  formCustomViewPath: string;
  processDefinition: ProcessDefinitionVO;
  status: number;
  remark: string;
  createTime: string;
  bpmnXml: string;
};

// 表单API
export enum BpmModelApi {
  GetModelPage = '/bpm/model/page',
  GetModel = '/bpm/model/get?id=',
  UpdateModel = '/bpm/model/update',
  UpdateModelState = '/bpm/model/update-state',
  CreateModel = '/bpm/model/create',
  DeleteModel = '/bpm/model/delete?id=',
  DeployModel = '/bpm/model/deploy?id=',
}

export const getModelPage = async (params) => {
  const requestParams = { url: BpmModelApi.GetModelPage, params };
  return defHttp.get<any>(requestParams, {});
};

export const getModel = async (id: number) => {
  const requestParams = { url: BpmModelApi.GetModel + id };
  return defHttp.get<any>(requestParams, {});
};

export const updateModel = async (data: ModelVO) => {
  const requestParams = { url: BpmModelApi.UpdateModel, data };
  return defHttp.put<any>(requestParams, {});
};

// 任务状态修改
export const updateModelState = async (id: number, state: number) => {
  const data = { id, state };
  const requestParams = { url: BpmModelApi.UpdateModelState, data };
  return defHttp.put<any>(requestParams, {});
};

export const createModel = async (data: ModelVO) => {
  const requestParams = { url: BpmModelApi.CreateModel, data };
  return defHttp.put<any>(requestParams, {});
};

export const deleteModel = async (id: number) => {
  const requestParams = { url: BpmModelApi.DeleteModel + id };
  return defHttp.delete<any>(requestParams, {});
};

export const deployModel = async (id: number) => {
  const requestParams = { url: BpmModelApi.DeployModel + id };
  return defHttp.post<any>(requestParams, {});
};
=======
// import request from '@/config/axios'

export type ProcessDefinitionVO = {
  id: string
  version: number
  deploymentTIme: string
  suspensionState: number
}

// √
export type ModelVO = {
  id: number
  formName: string
  key: string
  name: string
  description: string
  category: string
  formType: number
  formId: number
  formCustomCreatePath: string
  formCustomViewPath: string
  processDefinition: ProcessDefinitionVO
  status: number
  remark: string
  createTime: string
  bpmnXml: string
}

// export const getModelPage = async (params) => {
//   return await request.get({ url: '/bpm/model/page', params })
// }

// √
export const getModel = async (id: number) => {
  // TODO url: '/bpm/model/get?id=' + id
}

// √
export const updateModel = async (data: ModelVO) => {
  // TODO url: '/bpm/model/update'
}

// 任务状态修改
// export const updateModelState = async (id: number, state: number) => {
//   const data = {
//     id: id,
//     state: state
//   }
//   return await request.put({ url: '/bpm/model/update-state', data: data })
// }

// √
export const createModel = async (data: ModelVO) => {
  // TODO url: '/bpm/model/create'
}

// export const deleteModel = async (id: number) => {
//   return await request.delete({ url: '/bpm/model/delete?id=' + id })
// }

// export const deployModel = async (id: number) => {
//   return await request.post({ url: '/bpm/model/deploy?id=' + id })
// }
>>>>>>> 006f636e5f892115d812bc0c092617635f61184b