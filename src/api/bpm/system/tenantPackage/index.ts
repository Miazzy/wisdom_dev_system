import { defHttp } from '/@/utils/http/axios';

export interface TenantPackageVO {
  id: number;
  name: string;
  status: number;
  remark: string;
  creator: string;
  updater: string;
  updateTime: string;
  menuIds: number[];
  createTime: Date;
}

// 表单API
export enum TenPackageApi {
  GetTenantPackagePage = '/system/tenant-package/page',
  GetTenantPackage = '/system/tenant-package/get?id=',
  CreateTenantPackage = '/system/tenant-package/create',
  UpdateTenantPackage = '/system/tenant-package/update',
  DeleteTenantPackage = '/system/tenant-package/delete?id=',
  GetTenantPackageList = '/system/tenant-package/get-simple-list',
}

// 查询租户套餐列表
export const getTenantPackagePage = (params: any) => {
  const requestParams = { url: TenPackageApi.GetTenantPackagePage, params };
  return defHttp.get<any>(requestParams, {});
};

// 获得租户
export const getTenantPackage = (id: number) => {
  const requestParams = { url: TenPackageApi.GetTenantPackage + id };
  return defHttp.get<any>(requestParams, {});
};

// 新增租户套餐
export const createTenantPackage = (data: TenantPackageVO) => {
  const requestParams = { url: TenPackageApi.CreateTenantPackage, data };
  return defHttp.post<any>(requestParams, {});
};

// 修改租户套餐
export const updateTenantPackage = (data: TenantPackageVO) => {
  const requestParams = { url: TenPackageApi.UpdateTenantPackage, data };
  return defHttp.post<any>(requestParams, {});
};

// 删除租户套餐
export const deleteTenantPackage = (id: number) => {
  const requestParams = { url: TenPackageApi.DeleteTenantPackage + id };
  return defHttp.post<any>(requestParams, {});
};
// 获取租户套餐精简信息列表
export const getTenantPackageList = () => {
  const requestParams = { url: TenPackageApi.GetTenantPackageList };
  return defHttp.post<any>(requestParams, {});
};
