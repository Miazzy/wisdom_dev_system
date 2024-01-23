import { defHttp } from '/@/utils/http/axios';

export type OperateLogVO = {
  id: number;
  userNickname: string;
  traceId: string;
  userId: number;
  module: string;
  name: string;
  type: number;
  content: string;
  exts: Map<String, Object>;
  requestMethod: string;
  requestUrl: string;
  userIp: string;
  userAgent: string;
  javaMethod: string;
  javaMethodArgs: string;
  startTime: Date;
  duration: number;
  resultCode: number;
  resultMsg: string;
  resultData: string;
};

// 表单API
export enum OperateLogApi {
  GetOperateLogPage = '/system/operate-log/page',
  ExportOperateLog = '/system/operate-log/export',
}

// 查询操作日志列表
export const getOperateLogPage = (params: any) => {
  const requestParams = { url: OperateLogApi.GetOperateLogPage, params };
  return defHttp.get<any>(requestParams, {});
};
// 导出操作日志
export const exportOperateLog = (params) => {
  const requestParams = { url: OperateLogApi.ExportOperateLog, params };
  return defHttp.download<any>(requestParams, {});
};
