import { defHttp } from '/@/utils/http/axios';

export interface TenantVO {
  id: number;
  name: string;
  contactName: string;
  contactMobile: string;
  status: number;
  domain: string;
  packageId: number;
  username: string;
  password: string;
  expireTime: Date;
  accountCount: number;
  createTime: Date;
}

export interface TenantPageReqVO {
  name?: string;
  contactName?: string;
  contactMobile?: string;
  status?: number;
  createTime?: Date[];
}

export interface TenantExportReqVO {
  name?: string;
  contactName?: string;
  contactMobile?: string;
  status?: number;
  createTime?: Date[];
}

// 表单API
export enum TenantApi {
  GetTenantPage = '/system/tenant/page',
  GetTenant = '/system/tenant/get?id=',
  CreateTenant = '/system/tenant/create',
  UpdateTenant = '/system/tenant/update',
  DeleteTenant = '/system/tenant/delete?id=',
  ExportTenant = '/system/tenant/export-excel',
}

// 查询租户列表
export const getTenantPage = (params: TenantPageReqVO) => {
  const requestParams = { url: TenantApi.GetTenantPage, params };
  return defHttp.get<any>(requestParams, {});
};

// 查询租户详情
export const getTenant = (id: number) => {
  const requestParams = { url: TenantApi.GetTenant + id };
  return defHttp.get<any>(requestParams, {});
};

// 新增租户
export const createTenant = (data: TenantVO) => {
  const requestParams = { url: TenantApi.CreateTenant, data };
  return defHttp.post<any>(requestParams, {});
};

// 修改租户
export const updateTenant = (data: TenantVO) => {
  const requestParams = { url: TenantApi.UpdateTenant, data };
  return defHttp.put<any>(requestParams, {});
};

// 删除租户
export const deleteTenant = (id: number) => {
  const requestParams = { url: TenantApi.DeleteTenant + id };
  return defHttp.delete<any>(requestParams, {});
};

// 导出租户
export const exportTenant = (params: TenantExportReqVO) => {
  const requestParams = { url: TenantApi.ExportTenant, params };
  return defHttp.download<any>(requestParams, {});
};
