import { defHttp } from '/@/utils/http/axios';

export type UserGroupVO = {
  id: number;
  name: string;
  description: string;
  memberUserIds: number[];
  status: number;
  remark: string;
  createTime: string;
};

// BpmUserGroupApi
export enum BpmUserGroupApi {
  CreateUserGroup = '/bpm/user-group/create',
  UpdateUserGroup = '/bpm/user-group/update',
  DeleteUserGroup = '/bpm/user-group/delete?id=',
  GetUserGroup = '/bpm/user-group/get?id=',
  GetUserGroupPage = '/bpm/user-group/page',
  GetSimpleUserGroupList = '/bpm/user-group/list-all-simple',
}

// 创建用户组
export const createUserGroup = async (data: UserGroupVO) => {
  const requestParams = { url: BpmUserGroupApi.CreateUserGroup, data };
  return defHttp.post<any>(requestParams, {});
};

// 更新用户组
export const updateUserGroup = async (data: UserGroupVO) => {
  const requestParams = { url: BpmUserGroupApi.UpdateUserGroup, data };
  return defHttp.put<any>(requestParams, {});
};

// 删除用户组
export const deleteUserGroup = async (id: number) => {
  const requestParams = { url: BpmUserGroupApi.DeleteUserGroup + id };
  return defHttp.delete<any>(requestParams, {});
};

// 获得用户组
export const getUserGroup = async (id: number) => {
  const requestParams = { url: BpmUserGroupApi.GetUserGroup + id };
  return defHttp.get<any>(requestParams, {});
};

// 获得用户组分页
export const getUserGroupPage = async (params) => {
  const requestParams = { url: BpmUserGroupApi.GetUserGroupPage, params };
  return defHttp.get<any>(requestParams, {});
};

// 获取用户组精简信息列表
export const getSimpleUserGroupList = async (): Promise<UserGroupVO[]> => {
  const requestParams = { url: BpmUserGroupApi.GetSimpleUserGroupList };
  return defHttp.get<any>(requestParams, { isOnlyResult: true });
};
