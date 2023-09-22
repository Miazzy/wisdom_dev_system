import { defHttp } from '/@/utils/http/axios';

// 表单传入参数
export type FormVO = {
  id: number;
  name: string;
  conf: string;
  fields: string[];
  status: number;
  remark: string;
  createTime: string;
};

// 表单API
export enum BpmFormApi {
  CreateForm = '/bpm/form/create',
  UpdateForm = '/bpm/form/update',
  DeleteForm = '/bpm/form/delete?id=',
  GetForm = '/bpm/form/get?id=',
  GetFormPage = '/bpm/form/page',
  GetSimpleFormList = '/bpm/form/list-all-simple',
}

// 创建工作流的表单定义
export const createForm = async (data: FormVO) => {
  const requestParams = { url: BpmFormApi.CreateForm, data };
  return defHttp.post<any>(requestParams, {});
};

// 更新工作流的表单定义
export const updateForm = async (data: FormVO) => {
  const requestParams = { url: BpmFormApi.UpdateForm, data };
  return defHttp.put<any>(requestParams, {});
};

// 删除工作流的表单定义
export const deleteForm = async (id: number) => {
  const requestParams = { url: BpmFormApi.DeleteForm + id };
  return defHttp.delete<any>(requestParams, {});
};

// 获得工作流的表单定义
export const getForm = async (id: number) => {
  const requestParams = { url: BpmFormApi.GetForm + id };
  return defHttp.get<any>(requestParams, {});
};

// 获得工作流的表单定义分页
export const getFormPage = async (params) => {
  const requestParams = { url: BpmFormApi.GetFormPage, params };
  return defHttp.get<any>(requestParams, {});
};

// 获得动态表单的精简列表
export const getSimpleFormList = async () => {
  const requestParams = { url: BpmFormApi.GetSimpleFormList };
  return defHttp.get<any>(requestParams, {});
};
