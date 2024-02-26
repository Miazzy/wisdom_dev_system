import { defHttp } from '/@/utils/http/axios';

export enum Api {
  CREATE_URL = '/system/role/create',
  UPDATE_URL = '/system/role/update',
  UPDATE_STATUS_URL = '/system/role/updateStatus',
  UPDATE_BATCH_SORT_URL = '/system/role/updateBatchSort',
  DELETE_URL = '/system/role/delete',
  GET_URL = '/system/role/get',
  GET_NEXT_SORT_URL = '/system/role/getNextSort',
  TREE_URL = '/system/role/tree',
  PAGE_URL = '/system/role/page',
  PERMISSION_CREATE_BATCH_URL = '/system/role/permission/createBatch',
  PERMISSION_PAGE_URL = '/system/role/permission/page',
  PERMISSION_LIST_URL = '/system/role/permission/list',
  PERMISSION_EXPORT_EXCEL_URL = '/system/role/permission/export-excel',
  AUTHORIZE_CREATE_BATCH_URL = '/system/role/authorize/createBatch',
  AUTHORIZE_PAGE_URL = '/system/role/authorize/page',
  AUTHORIZE_LIST_URL = '/system/role/authorize/list',
  AUTHORIZE_EXPORT_EXCEL_URL = '/system/role/authorize/export-excel',
  DATA_PERMISSION_CREATE_URL = '/system/role/data-permission/create',
  DATA_PERMISSION_GET_URL = '/system/role/data-permission/get',
}

// 添加角色管理
export const createData = (params) =>
  defHttp.post(
    {
      url: Api.CREATE_URL,
      params,
    },
    {},
  );

// 修改角色管理
export const updateData = (params) =>
  defHttp.put(
    {
      url: Api.UPDATE_URL,
      params,
    },
    {},
  );

export const saveData = (params) => {
  if (!params.id) {
    return createData(params);
  }
  return updateData(params);
};

// 修改角色管理状态
export const updateStatus = (id: string, status: number) =>
  defHttp.put(
    {
      url: `${Api.UPDATE_STATUS_URL}?id=${id}&status=${status}`,
    },
    {},
  );

// 批量修改角色管理排序
export const updateBatchSort = (params) =>
  defHttp.put(
    {
      url: Api.UPDATE_BATCH_SORT_URL,
      params,
    },
    {},
  );

// 删除角色管理
export const deleteData = (id) =>
  defHttp.delete(
    {
      url: `${Api.DELETE_URL}?id=${id}`,
    },
    {},
  );

// 获取角色管理
export const getData = (id) =>
  defHttp.get(
    {
      url: `${Api.GET_URL}?id=${id}`,
    },
    { isOnlyResult: true },
  );

// 获取下一个排序
export const getNextSort = (parentId: string = '') =>
  defHttp.get(
    {
      url: `${Api.GET_NEXT_SORT_URL}?parentId=${parentId}`,
    },
    { isOnlyResult: true },
  );

// 获取角色管理树
export const getTree = (params) =>
  defHttp.get(
    {
      url: Api.TREE_URL,
      params,
    },
    { isOnlyResult: true },
  );

// 分页获取角色管理列表
export const getPage = (params) =>
  defHttp.get(
    {
      url: Api.PAGE_URL,
      params,
    },
    { isOnlyResult: true },
  );

// 批量保存角色权限关系
export const createPermissionBatch = (params) =>
  defHttp.post(
    {
      url: Api.PERMISSION_CREATE_BATCH_URL,
      params,
    },
    {},
  );

// 批量保存角色授权管理
export const createAuthorizeBatch = (params) =>
  defHttp.post(
    {
      url: Api.AUTHORIZE_CREATE_BATCH_URL,
      params,
    },
    {},
  );

// 分页获取角色权限关系列表
export const getPermissionPage = (params) =>
  defHttp.get(
    {
      url: Api.PERMISSION_PAGE_URL,
      params,
    },
    { isOnlyResult: true },
  );

// 获取角色权限关系列表
export const getPermissionList = (roleId: string) =>
  defHttp.get(
    {
      url: `${Api.PERMISSION_LIST_URL}?roleId=${roleId}`,
    },
    { isOnlyResult: true },
  );

// 分页获取角色授权管理列表
export const getAuthorizePage = (params) =>
  defHttp.get(
    {
      url: Api.AUTHORIZE_PAGE_URL,
      params,
    },
    { isOnlyResult: true },
  );

// 分页获取角色授权管理列表
export const getAuthorizeList = (roleId: string, authKind: string) =>
  defHttp.get(
    {
      url: `${Api.AUTHORIZE_LIST_URL}?roleId=${roleId}&authKind=${authKind}`,
    },
    { isOnlyResult: true },
  );

// 导出角色权限关系列表
export const exportPermissionExcel = (params) =>
  defHttp.post(
    {
      url: Api.PERMISSION_EXPORT_EXCEL_URL,
      params,
      responseType: 'blob',
    },
    { isOnlyResult: true },
  );

// 导出角色授权管理列表
export const exportAuthorizeExcel = (params) =>
  defHttp.post(
    {
      url: Api.AUTHORIZE_EXPORT_EXCEL_URL,
      params,
      responseType: 'blob',
    },
    { isOnlyResult: true },
  );

// 保存角色数据权限
export const saveDataPermission = (params) =>
  defHttp.post(
    {
      url: Api.DATA_PERMISSION_CREATE_URL,
      params,
    },
    {},
  );

// 获取角色数据权限
export const getDataPermissionByRoleId = (roleId: string) =>
  defHttp.get(
    {
      url: `${Api.DATA_PERMISSION_GET_URL}?roleId=${roleId}`,
    },
    { isOnlyResult: true },
  );
