import { defHttp } from '/@/utils/http/axios';

// 表单API
export enum FileApi {
  GetBizId = '/infra/file/getBizId',
  Upload = '/infra/file/upload',
  GetFiles = '/infra/file/getFiles',
  DeleteFile = '/infra/file/delete',
}

export const getBizId = async (params) => {
  const requestParams = { url: FileApi.GetBizId, params };
  return defHttp.get<any>(requestParams, { isOnlyResult: true });
};

export const uploadFile = async (params) => {
  const requestParams = {
    url: FileApi.Upload,
    params,
    headers: { 'Content-Type': 'multipart/form-data' },
  };
  return defHttp.post<any>(requestParams, { isOnlyResult: true });
};

export const getFiles = async (params) => {
  const requestParams = { url: FileApi.GetFiles, params };
  return defHttp.get<any>(requestParams, { isOnlyResult: true });
};

export const deleteFile = async (id: number) => {
  const requestParams = { url: FileApi.DeleteFile + '?id=' + id };
  return defHttp.delete<any>(requestParams, { isOnlyResult: true });
};
