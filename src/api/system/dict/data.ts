import { defHttp } from '/@/utils/http/axios';

// 表单API
export enum DictDataApi {
  GetDictDataMap = '/admin-api/system/dict-data/getMap',
}

// 查询字典数据列表
export const getDictDataMap = (params: any) => {
  const requestParams = { url: DictDataApi.GetDictDataMap, params };
  return defHttp.get<any>(requestParams, {});
};

// 查询字典数据（精简)列表
export const listSimpleDictData = () => {
  return defHttp.get({ url: '/system/dict-data/list-all-simple' });
};

// 查询字典数据列表
export const getDictDataPage = (params: any) => {
  return defHttp.get({ url: '/system/dict-data/page', params });
};

// 查询字典数据详情
export const getDictData = (id: number) => {
  return defHttp.get({ url: `/system/dict-data/get?id=${id}` });
};

// 新增字典数据
export const createDictData = (data: any) => {
  return defHttp.post({ url: '/system/dict-data/create', data });
};

// 修改字典数据
export const updateDictData = (data: any) => {
  return defHttp.put({ url: '/system/dict-data/update', data });
};

// 删除字典数据
export const deleteDictData = (id: number) => {
  return defHttp.delete({ url: `/system/dict-data/delete?id=${id}` });
};

// 导出字典类型数据
export const exportDictData = (params: any) => {
  return defHttp.get({ url: '/system/dict-data/export', params });
};
