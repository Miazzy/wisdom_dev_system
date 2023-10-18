import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel';

export enum SystemAuthApi {
  Login = '/system/auth/login',
  Logout = '/system/auth/logout',
  SysLogout = '/logout',
  RefreshToken = '/system/auth/refresh-token',
  ListMenus = '/system/auth/list-menus',
  GetPermissionInfo = '/system/auth/get-permission-info',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams) {
  const requestParams = { url: SystemAuthApi.Login, params };
  return defHttp.post<LoginResultModel>(requestParams, { isOnlyResult: true });
}

/**
 * @description: user logout
 */
export function doLogout() {
  const requestParams = { url: SystemAuthApi.Logout };
  return defHttp.post(requestParams, { isOnlyResult: true });
}

/**
 * @description: get user info
 */
export function getUserInfo() {
  const requestParams = { url: SystemAuthApi.GetPermissionInfo };
  return defHttp.get<GetUserInfoModel>(requestParams, { isOnlyResult: true });
}

/**
 * @description: refresh token
 */
export function execRefreshToken(rtoken: string) {
  const requestParams = { url: SystemAuthApi.RefreshToken + '?refreshToken=' + rtoken };
  return defHttp.post<any>(requestParams, { isOnlyResult: true });
}

/**
 * @description: get user info
 */
export function getListMenus() {
  const requestParams = { url: SystemAuthApi.ListMenus };
  return defHttp.get<any>(requestParams, { isOnlyResult: true });
}
