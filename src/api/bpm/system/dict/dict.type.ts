import { defHttp } from '/@/utils/http/axios';

export type DictTypeVO = {
  id: number | undefined;
  name: string;
  type: string;
  status: number;
  remark: string;
  createTime: Date;
};

// 表单API
export enum DictTypeApi {
  ListSimpleDictData = '/system/dict-type/list-all-simple',
  GetDictTypePage = '/system/dict-type/page',
  GetDictType = '/system/dict-type/get?id=',
  CreateDictType = '/system/dict-type/create',
  UpdateDictType = '/system/dict-type/update',
  DeleteDictType = '/system/dict-type/delete?id=',
  ExportDictType = '/system/dict-type/export',
}

// 查询字典（精简)列表
export const getSimpleDictTypeList = () => {
  const requestParams = { url: DictTypeApi.ListSimpleDictData };
  return defHttp.get<any>(requestParams, {});
};

// 查询字典列表
export const getDictTypePage = (params: any) => {
  const requestParams = { url: DictTypeApi.GetDictTypePage, params };
  return defHttp.get<any>(requestParams, {});
};

// 查询字典详情
export const getDictType = (id: number) => {
  const requestParams = { url: DictTypeApi.GetDictType + id };
  return defHttp.get<any>(requestParams, {});
};

// 新增字典
export const createDictType = (data: DictTypeVO) => {
  const requestParams = { url: DictTypeApi.CreateDictType, data };
  return defHttp.post<any>(requestParams, {});
};

// 修改字典
export const updateDictType = (data: DictTypeVO) => {
  const requestParams = { url: DictTypeApi.UpdateDictType, data };
  return defHttp.put<any>(requestParams, {});
};

// 删除字典
export const deleteDictType = (id: number) => {
  const requestParams = { url: DictTypeApi.DeleteDictType + id };
  return defHttp.delete<any>(requestParams, {});
};
// 导出字典类型
export const exportDictType = (params) => {
  const requestParams = { url: DictTypeApi.ExportDictType, params };
  return defHttp.get<any>(requestParams, {});
};
