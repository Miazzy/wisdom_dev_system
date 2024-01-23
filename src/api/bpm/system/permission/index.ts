import { defHttp } from '/@/utils/http/axios';

export interface PermissionAssignUserRoleReqVO {
  userId: number;
  roleIds: number[];
}

export interface PermissionAssignRoleMenuReqVO {
  roleId: number;
  menuIds: number[];
}

export interface PermissionAssignRoleDataScopeReqVO {
  roleId: number;
  dataScope: number;
  dataScopeDeptIds: number[];
}

// 表单API
export enum PostApi {
  GetRoleMenuList = '/system/permission/list-role-menus?roleId=',
  AssignRoleMenu = '/system/permission/assign-role-menu',
  AssignRoleDataScope = '/system/permission/assign-role-data-scope',
  GetUserRoleList = '/system/permission/list-user-roles?userId=',
  AssignUserRole = '/system/permission/assign-user-role',
}

// 查询角色拥有的菜单权限
export const getRoleMenuList = async (roleId: number) => {
  const requestParams = { url: PostApi.GetRoleMenuList + roleId };
  return defHttp.get<any>(requestParams, {});
};

// 赋予角色菜单权限
export const assignRoleMenu = async (data: PermissionAssignRoleMenuReqVO) => {
  const requestParams = { url: PostApi.AssignRoleMenu, data };
  return defHttp.get<any>(requestParams, {});
};

// 赋予角色数据权限
export const assignRoleDataScope = async (data: PermissionAssignRoleDataScopeReqVO) => {
  const requestParams = { url: PostApi.AssignRoleDataScope, data };
  return defHttp.post<any>(requestParams, {});
};

// 查询用户拥有的角色数组
export const getUserRoleList = async (userId: number) => {
  const requestParams = { url: PostApi.GetUserRoleList + userId };
  return defHttp.get<any>(requestParams, {});
};

// 赋予用户角色
export const assignUserRole = async (data: PermissionAssignUserRoleReqVO) => {
  const requestParams = { url: PostApi.AssignUserRole, data };
  return defHttp.post<any>(requestParams, {});
};
