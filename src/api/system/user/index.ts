import { defHttp } from '/@/utils/http/axios';

export interface UserVO {
  id: number;
  username: string;
  nickname: string;
  deptId: number;
  postIds: string[];
  email: string;
  mobile: string;
  sex: number;
  avatar: string;
  loginIp: string;
  status: number;
  remark: string;
  loginDate: Date;
  createTime: Date;
}

// 表单API
export enum SystemRoleApi {
  GetUserPage = '/system/user/page',
  GetUser = '/system/user/get?id=',
  CreateUser = '/system/user/create',
  UpdateUser = '/system/user/update',
  DeleteUser = '/system/user/delete?id=',
  ExportUser = '/system/user/export',
  ImportUserTemplate = '/system/user/get-import-template',
  ResetUserPwd = '/system/user/update-password',
  UpdateUserStatus = '/system/user/update-status',
  GetSimpleUserList = '/system/user/list-all-simple',
}

// 查询用户管理列表
export const getUserPage = (params: any) => {
  const requestParams = { url: SystemRoleApi.GetUserPage, params };
  return defHttp.get<any>(requestParams, {});
};

// 查询用户详情
export const getUser = (id: number) => {
  const requestParams = { url: SystemRoleApi.GetUser + id };
  return defHttp.get<any>(requestParams, {});
};

// 新增用户
export const createUser = (data: UserVO) => {
  const requestParams = { url: SystemRoleApi.CreateUser, data };
  return defHttp.post<any>(requestParams, {});
};

// 修改用户
export const updateUser = (data: UserVO) => {
  const requestParams = { url: SystemRoleApi.UpdateUser, data };
  return defHttp.put<any>(requestParams, {});
};

// 删除用户
export const deleteUser = (id: number) => {
  const requestParams = { url: SystemRoleApi.DeleteUser + id };
  return defHttp.put<any>(requestParams, {});
};

// 导出用户
export const exportUser = (params) => {
  const requestParams = { url: SystemRoleApi.ExportUser, params };
  return defHttp.download<any>(requestParams, {});
};

// 下载用户导入模板
export const importUserTemplate = () => {
  const requestParams = { url: SystemRoleApi.ImportUserTemplate };
  return defHttp.download<any>(requestParams, {});
};

// 用户密码重置
export const resetUserPwd = (id: number, password: string) => {
  const data = { id, password };
  const requestParams = { url: SystemRoleApi.ResetUserPwd, data };
  return defHttp.put<any>(requestParams, {});
};

// 用户状态修改
export const updateUserStatus = (id: number, status: number) => {
  const data = { id, status };
  const requestParams = { url: SystemRoleApi.UpdateUserStatus, data };
  return defHttp.put<any>(requestParams, {});
};

// 获取用户精简信息列表
export const getSimpleUserList = (): Promise<UserVO[]> => {
  const requestParams = { url: SystemRoleApi.GetSimpleUserList };
  return defHttp.get<any>(requestParams, { isOnlyResult: true });
};
