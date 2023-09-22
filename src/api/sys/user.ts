import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel';

enum Api {
  Login = '/admin-api/system/auth/login',
  Logout = '/admin-api/system/auth/logout',
  RefreshToken = '/admin-api/system/auth/refresh-token',
  ListMenus = '/admin-api/system/auth/list-menus',
  GetPermissionInfo = '/admin-api/system/auth/get-permission-info',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams) {
  const requestParams = { url: Api.Login, params };
  return defHttp.post<LoginResultModel>(requestParams, { isOnlyResult: true });
}

/**
 * @description: user logout
 */
export function doLogout() {
  const requestParams = { url: Api.Logout };
  return defHttp.get(requestParams, { isOnlyResult: true });
}

/**
 * @description: get user info
 */
export function getUserInfo() {
  const requestParams = { url: Api.GetPermissionInfo };
  return defHttp.get<GetUserInfoModel>(requestParams, { isOnlyResult: true });
}

/**
 * @description: refresh token
 */
export function execRefreshToken(rtoken: string) {
  const requestParams = { url: Api.RefreshToken + '?refreshToken=' + rtoken };
  return defHttp.post<any>(requestParams, { isOnlyResult: true });
}

/**
 * @description: get user info
 */
export function getListMenus() {
  const requestParams = { url: Api.ListMenus };
  return defHttp.get<any>(requestParams, { isOnlyResult: true });
}
