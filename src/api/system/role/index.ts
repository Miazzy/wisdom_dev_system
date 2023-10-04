import { defHttp } from '/@/utils/http/axios';

export interface RoleVO {
  id: number;
  name: string;
  code: string;
  sort: number;
  status: number;
  type: number;
  dataScope: number;
  dataScopeDeptIds: number[];
  createTime: Date;
}

export interface UpdateStatusReqVO {
  id: number;
  status: number;
}

// 表单API
export enum SystemRoleApi {
  GetRolePage = '/system/role/page',
  GetSimpleRoleList = '/system/role/list-all-simple',
  GetRole = '/system/role/get?id=',
  CreateRole = '/system/role/create',
  UpdateRole = '/system/role/update',
  UpdateRoleStatus = '/system/role/update-status',
  DeleteRole = '/system/role/delete?id=',
  ExportRole = '/system/role/export-excel',
}

// 查询角色列表
export const getRolePage = async (params: any) => {
  const requestParams = { url: SystemRoleApi.GetRolePage, params };
  return defHttp.get<any>(requestParams, {});
};

// 查询角色（精简)列表
export const getSimpleRoleList = async (): Promise<RoleVO[]> => {
  const requestParams = { url: SystemRoleApi.GetSimpleRoleList };
  return defHttp.get<any>(requestParams, {});
};

// 查询角色详情
export const getRole = async (id: number) => {
  const requestParams = { url: SystemRoleApi.GetRole + id };
  return defHttp.get<any>(requestParams, {});
};

// 新增角色
export const createRole = async (data: RoleVO) => {
  const requestParams = { url: SystemRoleApi.CreateRole, data };
  return defHttp.post<any>(requestParams, {});
};

// 修改角色
export const updateRole = async (data: RoleVO) => {
  const requestParams = { url: SystemRoleApi.UpdateRole, data };
  return defHttp.put<any>(requestParams, {});
};

// 修改角色状态
export const updateRoleStatus = async (data: UpdateStatusReqVO) => {
  const requestParams = { url: SystemRoleApi.UpdateRoleStatus, data };
  return defHttp.put<any>(requestParams, {});
};

// 删除角色
export const deleteRole = async (id: number) => {
  const requestParams = { url: SystemRoleApi.DeleteRole + id };
  return defHttp.delete<any>(requestParams, {});
};

// 导出角色
export const exportRole = (params) => {
  const requestParams = { url: SystemRoleApi.ExportRole, params };
  return defHttp.download<any>(requestParams, {});
};
