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
  const headers = { Authorization: 'Bearer' };
  const requestParams = { url: Api.Login, params, headers };
  return defHttp.post<LoginResultModel>(requestParams, {});
}

/**
 * @description: user logout
 */
export function doLogout() {
  const headers = { Authorization: 'Bearer #{{TOKEN}}' };
  const requestParams = { url: Api.Logout, headers };
  return defHttp.get(requestParams);
}

/**
 * @description: get user info
 */
export function getUserInfo() {
  const headers = { Authorization: 'Bearer #{{TOKEN}}' };
  const requestParams = { url: Api.GetPermissionInfo, headers };
  return defHttp.get<GetUserInfoModel>(requestParams, {});
}
