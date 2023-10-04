import { defHttp } from '/@/utils/http/axios';

// 表单API
export enum SocialApi {
  SocialBind = '/system/social-user/bind',
  SocialUnbind = '/system/social-user/unbind',
  SocialAuthRedirect = '/system/auth/social-auth-redirect?type=',
}

// 社交绑定，使用 code 授权码
export const socialBind = (type, code, state) => {
  const data = { type, code, state };
  const requestParams = { url: SocialApi.SocialBind, data };
  return defHttp.post<any>(requestParams, {});
};

// 取消社交绑定
export const socialUnbind = (type, openid) => {
  const data = { type, openid };
  const requestParams = { url: SocialApi.SocialUnbind, data };
  return defHttp.delete<any>(requestParams, {});
};

// 社交授权的跳转
export const socialAuthRedirect = (type, redirectUri) => {
  const url = SocialApi.SocialAuthRedirect + type + '&redirectUri=' + redirectUri;
  const requestParams = { url };
  return defHttp.delete<any>(requestParams, {});
};
