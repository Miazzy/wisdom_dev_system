import { defHttp } from '/@/utils/http/axios';

export interface OAuth2TokenVO {
  id: number;
  accessToken: string;
  refreshToken: string;
  userId: number;
  userType: number;
  clientId: string;
  createTime: Date;
  expiresTime: Date;
}

// 表单API
export enum OauthAPI {
  GetAccessTokenPage = '/system/oauth2-token/page',
  DeleteAccessToken = '/system/oauth2-token/delete?accessToken=',
}

// 查询 token列表
export const getAccessTokenPage = (params: any) => {
  const requestParams = { url: OauthAPI.GetAccessTokenPage, params };
  return defHttp.get<any>(requestParams, {});
};

// 删除 token
export const deleteAccessToken = (accessToken: string) => {
  const requestParams = { url: OauthAPI.DeleteAccessToken + accessToken };
  return defHttp.delete<any>(requestParams, {});
};
