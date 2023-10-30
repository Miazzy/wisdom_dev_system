import { defHttp } from '/@/utils/http/axios';

export type OrgVO = {
  id: string;
};

// 表单API
export enum OrgApi {
  GetListTree = '/system/org/list-tree',
}

export const getListTree = async (params) => {
  const requestParams = { url: OrgApi.GetListTree, params };
  return defHttp.post<any>(requestParams, { isOnlyResult: true });
};
