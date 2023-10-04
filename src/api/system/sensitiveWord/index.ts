import { defHttp } from '/@/utils/http/axios';
import qs from 'qs';

export interface SensitiveWordVO {
  id: number;
  name: string;
  status: number;
  description: string;
  tags: string[];
  createTime: Date;
}

export interface SensitiveWordTestReqVO {
  text: string;
  tag: string[];
}

export enum SensitiveWordApi {
  GetSensitiveWordPage = '/system/sensitive-word/page',
  GetSensitiveWord = '/system/sensitive-word/get?id=',
  CreateSensitiveWord = '/system/sensitive-word/create',
  UpdateSensitiveWord = '/system/sensitive-word/update',
  DeleteSensitiveWord = '/system/sensitive-word/delete?id=',
  ExportSensitiveWord = '/system/sensitive-word/export-excel',
  GetSensitiveWordTagList = '/system/sensitive-word/get-tags',
  ValidateText = '/system/sensitive-word/validate-text?',
}

// 查询敏感词列表
export const getSensitiveWordPage = (params: any) => {
  const requestParams = { url: SensitiveWordApi.GetSensitiveWordPage, params };
  return defHttp.get<any>(requestParams, {});
};

// 查询敏感词详情
export const getSensitiveWord = (id: number) => {
  const requestParams = { url: SensitiveWordApi.GetSensitiveWordPage + id };
  return defHttp.get<any>(requestParams, {});
};

// 新增敏感词
export const createSensitiveWord = (data: SensitiveWordVO) => {
  const requestParams = { url: SensitiveWordApi.CreateSensitiveWord, data };
  return defHttp.post<any>(requestParams, {});
};

// 修改敏感词
export const updateSensitiveWord = (data: SensitiveWordVO) => {
  const requestParams = { url: SensitiveWordApi.UpdateSensitiveWord, data };
  return defHttp.put<any>(requestParams, {});
};

// 删除敏感词
export const deleteSensitiveWord = (id: number) => {
  const requestParams = { url: SensitiveWordApi.DeleteSensitiveWord + id };
  return defHttp.delete<any>(requestParams, {});
};

// 导出敏感词
export const exportSensitiveWord = (params) => {
  const requestParams = { url: SensitiveWordApi.ExportSensitiveWord, params };
  return defHttp.download<any>(requestParams, {});
};

// 获取所有敏感词的标签数组
export const getSensitiveWordTagList = () => {
  const requestParams = { url: SensitiveWordApi.GetSensitiveWordTagList };
  return defHttp.get<any>(requestParams, {});
};

// 获得文本所包含的不合法的敏感词数组
export const validateText = (query: SensitiveWordTestReqVO) => {
  const searchUrl = qs.stringify(query, { arrayFormat: 'repeat' });
  const requestParams = { url: SensitiveWordApi.ValidateText + searchUrl };
  return defHttp.get<any>(requestParams, {});
};
