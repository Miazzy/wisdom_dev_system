import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel';
import { useUserStore } from '/@/store/modules/user';

export enum SystemAuthApi {
  Login = '/system/auth/login',
  Logout = '/system/auth/logout',
  SysLogout = '/logout',
  RefreshToken = '/system/auth/refresh-token',
  ListMenus = '/system/auth/list-menus',
  GetPermissionInfo = '/system/auth/get-permission-info',
  CheckToken = '/system/oauth2/check-token?token=',
  OrganTree = '/system/org/list-tree',
  OrgStationTree = '/baseset/common/list-orgStationPeriodTree',
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
  const userStore = useUserStore();
  rtoken = rtoken ? rtoken : userStore.getRefreshToken;
  if (typeof rtoken == 'undefined' || rtoken == null || rtoken == '') {
    return new Promise<any>(() => {});
  }
  const requestParams = { url: SystemAuthApi.RefreshToken + '?refreshToken=' + rtoken };
  return defHttp.post<any>(requestParams, { isOnlyResult: true });
}

/**
 * @description: get menu list
 */
export function getListMenus() {
  const requestParams = { url: SystemAuthApi.ListMenus };
  return defHttp.get<any>(requestParams, { isOnlyResult: true });
}

/*
 * @description: get organ tree
 */
export function getOrganTree(params) {
  const requestParams = { url: SystemAuthApi.OrganTree, params };
  return defHttp.post<any>(requestParams, { isOnlyResult: true });
}

/**
 * @description: check token valid
 */
export function checkToken(token) {
  const userStore = useUserStore();
  token = token ? token : userStore.getToken;
  if (typeof token == 'undefined' || token == null || token == '') {
    return new Promise<any>(() => {});
  }
  const url = SystemAuthApi.CheckToken + token + `&client_id=default&client_secret=admin123`;
  const requestParams = { url };
  const options = { isOnlyResult: true };
  return defHttp.post<any>(requestParams, options);
}
