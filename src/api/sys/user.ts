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
  return defHttp.post<LoginResultModel>(requestParams, {});
}

/**
 * @description: user logout
 */
export function doLogout() {
  const requestParams = { url: Api.Logout };
  return defHttp.get(requestParams);
}

/**
 * @description: get user info
 */
export function getUserInfo() {
  const requestParams = { url: Api.GetPermissionInfo };
  return defHttp.get<GetUserInfoModel>(requestParams, {});
}
