import { defHttp } from '/@/utils/http/axios';

export interface LoginLogVO {
  id: number;
  logType: number;
  traceId: number;
  userId: number;
  userType: number;
  username: string;
  status: number;
  userIp: string;
  userAgent: string;
  createTime: Date;
}

// 表单API
export enum LoginLogApi {
  GetLoginLogPage = '/system/login-log/page',
  ExportLoginLog = '/system/login-log/export',
}

// 查询登录日志列表
export const getLoginLogPage = (params: any) => {
  const requestParams = { url: LoginLogApi.GetLoginLogPage, params };
  return defHttp.get<any>(requestParams, {});
};

// 导出登录日志
export const exportLoginLog = (params) => {
  const requestParams = { url: LoginLogApi.ExportLoginLog, params };
  return defHttp.download<any>(requestParams, {});
};
