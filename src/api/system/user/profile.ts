import { defHttp } from '/@/utils/http/axios';

export interface ProfileDept {
  id: number;
  name: string;
}
export interface ProfileRole {
  id: number;
  name: string;
}
export interface ProfilePost {
  id: number;
  name: string;
}
export interface SocialUser {
  id: number;
  type: number;
  openid: string;
  token: string;
  rawTokenInfo: string;
  nickname: string;
  avatar: string;
  rawUserInfo: string;
  code: string;
  state: string;
}
export interface ProfileVO {
  id: number;
  username: string;
  nickname: string;
  dept: ProfileDept;
  roles: ProfileRole[];
  posts: ProfilePost[];
  socialUsers: SocialUser[];
  email: string;
  mobile: string;
  sex: number;
  avatar: string;
  status: number;
  remark: string;
  loginIp: string;
  loginDate: Date;
  createTime: Date;
}
export interface UserProfileUpdateReqVO {
  nickname: string;
  email: string;
  mobile: string;
  sex: number;
}

// 表单API
export enum ProfileApi {
  GetUserProfile = '/system/user/profile/get',
  UpdateUserProfile = '/system/user/profile/update',
  UpdateUserPassword = '/system/user/profile/update-password',
  UploadAvatar = '/system/user/profile/update-avatar',
}

// 查询用户个人信息
export const getUserProfile = () => {
  const requestParams = { url: ProfileApi.GetUserProfile };
  return defHttp.get<any>(requestParams, {});
};

// 修改用户个人信息
export const updateUserProfile = (data: UserProfileUpdateReqVO) => {
  const requestParams = { url: ProfileApi.UpdateUserProfile, data };
  return defHttp.put<any>(requestParams, {});
};

// 用户密码重置
export const updateUserPassword = (oldPassword: string, newPassword: string) => {
  const data = { oldPassword: oldPassword, newPassword: newPassword };
  const requestParams = { url: ProfileApi.UpdateUserPassword, data };
  return defHttp.put<any>(requestParams, {});
};

// 用户头像上传
export const uploadAvatar = (data) => {
  const requestParams = { url: ProfileApi.UploadAvatar, data };
  return defHttp.put<any>(requestParams, {});
};
