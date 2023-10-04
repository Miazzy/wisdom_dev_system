import { defHttp } from '/@/utils/http/axios';

export interface MailLogVO {
  id: number;
  userId: number;
  userType: number;
  toMail: string;
  accountId: number;
  fromMail: string;
  templateId: number;
  templateCode: string;
  templateNickname: string;
  templateTitle: string;
  templateContent: string;
  templateParams: string;
  sendStatus: number;
  sendTime: Date;
  sendMessageId: string;
  sendException: string;
}

// 表单API
export enum MailLogAPI {
  GetMailLogPage = '/system/mail-log/page',
  GetMailLog = '/system/mail-log/get?id=',
}

// 查询邮件日志列表
export const getMailLogPage = async (params: any) => {
  const requestParams = { url: MailLogAPI.GetMailLogPage, params };
  return defHttp.get<any>(requestParams, {});
};

// 查询邮件日志详情
export const getMailLog = async (id: number) => {
  const requestParams = { url: MailLogAPI.GetMailLog + id };
  return defHttp.get<any>(requestParams, {});
};
