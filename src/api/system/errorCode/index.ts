import { defHttp } from '/@/utils/http/axios';

export interface ErrorCodeVO {
  id: number | undefined;
  type: number;
  applicationName: string;
  code: number | undefined;
  message: string;
  memo: string;
  createTime: Date;
}

// 表单API
export enum ErrorCodeApi {
  GetErrorCodePage = '/system/error-code/page',
  GetErrorCode = '/system/error-code/get?id=',
  CreateErrorCode = '/system/error-code/create',
  UpdateErrorCode = '/system/error-code/update',
  DeleteErrorCode = '/system/error-code/delete?id=',
  ExcelErrorCode = '/system/error-code/export-excel',
}

// 查询错误码列表
export const getErrorCodePage = (params: any) => {
  const requestParams = { url: ErrorCodeApi.GetErrorCodePage, params };
  return defHttp.get<any>(requestParams, {});
};

// 查询错误码详情
export const getErrorCode = (id: number) => {
  const requestParams = { url: ErrorCodeApi.GetErrorCode + id };
  return defHttp.get<any>(requestParams, {});
};

// 新增错误码
export const createErrorCode = (data: ErrorCodeVO) => {
  const requestParams = { url: ErrorCodeApi.CreateErrorCode, data };
  return defHttp.post<any>(requestParams, {});
};

// 修改错误码
export const updateErrorCode = (data: ErrorCodeVO) => {
  const requestParams = { url: ErrorCodeApi.UpdateErrorCode, data };
  return defHttp.put<any>(requestParams, {});
};

// 删除错误码
export const deleteErrorCode = (id: number) => {
  const requestParams = { url: ErrorCodeApi.DeleteErrorCode + id };
  return defHttp.delete<any>(requestParams, {});
};
// 导出错误码
export const excelErrorCode = (params) => {
  const requestParams = { url: ErrorCodeApi.ExcelErrorCode, params };
  return defHttp.download<any>(requestParams, {});
};
