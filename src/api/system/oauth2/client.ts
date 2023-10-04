import { defHttp } from '/@/utils/http/axios';

export interface OAuth2ClientVO {
  id: number;
  clientId: string;
  secret: string;
  name: string;
  logo: string;
  description: string;
  status: number;
  accessTokenValiditySeconds: number;
  refreshTokenValiditySeconds: number;
  redirectUris: string[];
  autoApprove: boolean;
  authorizedGrantTypes: string[];
  scopes: string[];
  authorities: string[];
  resourceIds: string[];
  additionalInformation: string;
  isAdditionalInformationJson: boolean;
  createTime: Date;
}

// 表单API
export enum OauthAPI {
  GetOAuth2ClientPage = '/system/oauth2-client/page',
  GetOAuth2Client = '/system/oauth2-client/get?id=',
  CreateOAuth2Client = '/system/oauth2-client/create',
  UpdateOAuth2Client = '/system/oauth2-client/update',
  DeleteOAuth2Client = '/system/oauth2-client/delete?id=',
}

// 查询 OAuth2 客户端的列表
export const getOAuth2ClientPage = (params: any) => {
  const requestParams = { url: OauthAPI.GetOAuth2ClientPage, params };
  return defHttp.get<any>(requestParams, {});
};

// 查询 OAuth2 客户端的详情
export const getOAuth2Client = (id: number) => {
  const requestParams = { url: OauthAPI.GetOAuth2Client + id };
  return defHttp.get<any>(requestParams, {});
};

// 新增 OAuth2 客户端
export const createOAuth2Client = (data: OAuth2ClientVO) => {
  const requestParams = { url: OauthAPI.CreateOAuth2Client, data };
  return defHttp.post<any>(requestParams, {});
};

// 修改 OAuth2 客户端
export const updateOAuth2Client = (data: OAuth2ClientVO) => {
  const requestParams = { url: OauthAPI.UpdateOAuth2Client, data };
  return defHttp.put<any>(requestParams, {});
};

// 删除 OAuth2
export const deleteOAuth2Client = (id: number) => {
  const requestParams = { url: OauthAPI.DeleteOAuth2Client + id };
  return defHttp.delete<any>(requestParams, {});
};
