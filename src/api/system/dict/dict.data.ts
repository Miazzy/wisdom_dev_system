import { defHttp } from '/@/utils/http/axios';

export type DictDataVO = {
  id: number | undefined;
  sort: number | undefined;
  label: string;
  value: string;
  dictType: string;
  status: number;
  colorType: string;
  cssClass: string;
  remark: string;
  createTime: Date;
};

// 表单API
export enum DictDataApi {
  ListSimpleDictData = '/system/dict-data/list-all-simple',
  GetDictDataPage = '/system/dict-data/page',
  GetDictData = '/system/dict-data/get?id=',
  CreateDictData = '/system/dict-data/create',
  UpdateDictData = '/system/dict-data/update',
  DeleteDictData = '/system/dict-data/delete?id=',
  ExportDictData = '/system/dict-data/export',
}

// 查询字典数据（精简)列表
export const listSimpleDictData = () => {
  const requestParams = { url: DictDataApi.ListSimpleDictData };
  return defHttp.get<any>(requestParams, {});
};

// 查询字典数据列表
export const getDictDataPage = (params: any) => {
  const requestParams = { url: DictDataApi.GetDictDataPage, params };
  return defHttp.get<any>(requestParams, {});
};

// 查询字典数据详情
export const getDictData = (id: number) => {
  const requestParams = { url: DictDataApi.GetDictData + id };
  return defHttp.get<any>(requestParams, {});
};

// 新增字典数据
export const createDictData = (data: DictDataVO) => {
  const requestParams = { url: DictDataApi.CreateDictData, data };
  return defHttp.post<any>(requestParams, {});
};

// 修改字典数据
export const updateDictData = (data: DictDataVO) => {
  const requestParams = { url: DictDataApi.UpdateDictData, data };
  return defHttp.put<any>(requestParams, {});
};

// 删除字典数据
export const deleteDictData = (id: number) => {
  const requestParams = { url: DictDataApi.DeleteDictData + id };
  return defHttp.delete<any>(requestParams, {});
};

// 导出字典类型数据
export const exportDictData = (params) => {
  const requestParams = { url: DictDataApi.ExportDictData, params };
  return defHttp.get<any>(requestParams, {});
};
