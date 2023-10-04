import { defHttp } from '/@/utils/http/axios';

// 表单API
export enum AreaApi {
  GetAreaTree = '/system/area/tree',
  GetChildrenArea = '/system/area/get-children?id=',
  GetAreaListByIds = '/system/area/get-by-ids?ids=',
  GetAreaByIp = '/system/area/get-by-ip?ip=',
}

// 获得地区树
export const getAreaTree = async () => {
  const requestParams = { url: AreaApi.GetAreaTree };
  return defHttp.get<any>(requestParams, {});
};

export const getChildrenArea = async (id: number) => {
  const requestParams = { url: AreaApi.GetChildrenArea + id };
  return defHttp.get<any>(requestParams, {});
};

export const getAreaListByIds = async (ids) => {
  const requestParams = { url: AreaApi.GetAreaListByIds + ids };
  return defHttp.get<any>(requestParams, {});
};

// 获得 IP 对应的地区名
export const getAreaByIp = async (ip: string) => {
  const requestParams = { url: AreaApi.GetAreaByIp + ip };
  return defHttp.get<any>(requestParams, {});
};
