import { defHttp } from '/@/utils/http/axios';

export interface MailTemplateVO {
  id: number;
  name: string;
  code: string;
  accountId: number;
  nickname: string;
  title: string;
  content: string;
  params: string;
  status: number;
  remark: string;
}

export interface MailSendReqVO {
  mail: string;
  templateCode: string;
  templateParams: Map<String, Object>;
}

// 表单API
export enum MailTemplateAPI {
  GetMailTemplatePage = '/system/mail-template/page',
  GetMailTemplate = '/system/mail-template/get?id=',
  CreateMailTemplate = '/system/mail-template/create',
  UpdateMailTemplate = '/system/mail-template/update',
  DeleteMailTemplate = '/system/mail-template/delete?id=',
  SendMail = '/system/mail-template/send-mail',
}

// 查询邮件模版列表
export const getMailTemplatePage = async (params: any) => {
  const requestParams = { url: MailTemplateAPI.GetMailTemplatePage, params };
  return defHttp.get<any>(requestParams, {});
};

// 查询邮件模版详情
export const getMailTemplate = async (id: number) => {
  const requestParams = { url: MailTemplateAPI.GetMailTemplate + id };
  return defHttp.get<any>(requestParams, {});
};

// 新增邮件模版
export const createMailTemplate = async (data: MailTemplateVO) => {
  const requestParams = { url: MailTemplateAPI.GetMailTemplate, data };
  return defHttp.post<any>(requestParams, {});
};

// 修改邮件模版
export const updateMailTemplate = async (data: MailTemplateVO) => {
  const requestParams = { url: MailTemplateAPI.UpdateMailTemplate, data };
  return defHttp.put<any>(requestParams, {});
};

// 删除邮件模版
export const deleteMailTemplate = async (id: number) => {
  const requestParams = { url: MailTemplateAPI.DeleteMailTemplate + id };
  return defHttp.delete<any>(requestParams, {});
};

// 发送邮件
export const sendMail = (data: MailSendReqVO) => {
  const requestParams = { url: MailTemplateAPI.SendMail, data };
  return defHttp.post<any>(requestParams, {});
};
