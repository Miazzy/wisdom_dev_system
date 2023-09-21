/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  loginName?: string;
  username?: string;
  password?: string;
  captchaVerification?: string;
}

export interface RoleInfo {
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  role: RoleInfo;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: any[];
  // 用户
  user: Object;
  // 权限
  permissions: any[];
  // 头像
  menus: any[];
}
