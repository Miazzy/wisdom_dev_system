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
  token?: string;
  role?: RoleInfo;
  accessToken?: string | number;
  refreshToken?: string | number;
  expiresTime?: string | number;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  userId?: string | number;
  username?: string;
  realName?: string;
  avatar?: string; // 头像
  desc?: string;
  homePath?: string;

  user: Object; // 用户
  permissions: any[]; // 权限
  roles: any[];
  menus: any[];
  multiOrganization?: Boolean //是否多组织
}
