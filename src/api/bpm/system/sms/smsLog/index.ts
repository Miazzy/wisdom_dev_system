import { defHttp } from '/@/utils/http/axios';

export interface SmsLogVO {
  id: number | null;
  channelId: number | null;
  channelCode: string;
  templateId: number | null;
  templateCode: string;
  templateType: number | null;
  templateContent: string;
  templateParams: Map<string, object> | null;
  apiTemplateId: string;
  mobile: string;
  userId: number | null;
  userType: number | null;
  sendStatus: number | null;
  sendTime: Date | null;
  sendCode: number | null;
  sendMsg: string;
  apiSendCode: string;
  apiSendMsg: string;
  apiRequestId: string;
  apiSerialNo: string;
  receiveStatus: number | null;
  receiveTime: Date | null;
  apiReceiveCode: string;
  apiReceiveMsg: string;
  createTime: Date | null;
}

export enum SmsLogApi {
  GetSmsLogPage = '/system/sms-log/page',
  ExportSmsLog = '/system/sms-log/export-excel',
}

// 查询短信日志列表
export const getSmsLogPage = (params: any) => {
  const requestParams = { url: SmsLogApi.GetSmsLogPage, params };
  return defHttp.get<any>(requestParams, {});
};

// 导出短信日志
export const exportSmsLog = (params) => {
  const requestParams = { url: SmsLogApi.ExportSmsLog, params };
  return defHttp.get<any>(requestParams, {});
};
