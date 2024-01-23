import { defHttp } from '/@/utils/http/axios';

export interface SmsTemplateVO {
  id: number | null;
  type: number | null;
  status: number;
  code: string;
  name: string;
  content: string;
  remark: string;
  apiTemplateId: string;
  channelId: number | null;
  channelCode?: string;
  params?: string[];
  createTime?: Date;
}

export interface SendSmsReqVO {
  mobile: string;
  templateCode: string;
  templateParams: Map<String, Object>;
}

export enum SmsTemplateApi {
  GetSmsTemplatePage = '/system/sms-template/page',
  GetSmsTemplate = '/system/sms-template/get?id=',
  CreateSmsTemplate = '/system/sms-template/create',
  UpdateSmsTemplate = '/system/sms-template/update',
  DeleteSmsTemplate = '/system/sms-template/delete?id=',
  ExportSmsTemplate = '/system/sms-template/export-excel',
  SendSms = '/system/sms-template/send-sms',
}

// 查询短信模板列表
export const getSmsTemplatePage = (params: any) => {
  const requestParams = { url: SmsTemplateApi.GetSmsTemplatePage, params };
  return defHttp.get<any>(requestParams, {});
};

// 查询短信模板详情
export const getSmsTemplate = (id: number) => {
  const requestParams = { url: SmsTemplateApi.GetSmsTemplate + id };
  return defHttp.get<any>(requestParams, {});
};

// 新增短信模板
export const createSmsTemplate = (data: SmsTemplateVO) => {
  const requestParams = { url: SmsTemplateApi.CreateSmsTemplate, data };
  return defHttp.post<any>(requestParams, {});
};

// 修改短信模板
export const updateSmsTemplate = (data: SmsTemplateVO) => {
  const requestParams = { url: SmsTemplateApi.UpdateSmsTemplate, data };
  return defHttp.put<any>(requestParams, {});
};

// 删除短信模板
export const deleteSmsTemplate = (id: number) => {
  const requestParams = { url: SmsTemplateApi.DeleteSmsTemplate + id };
  return defHttp.delete<any>(requestParams, {});
};

// 导出短信模板
export const exportSmsTemplate = (params) => {
  const requestParams = { url: SmsTemplateApi.ExportSmsTemplate, params };
  return defHttp.delete<any>(requestParams, {});
};

// 发送短信
export const sendSms = (data: SendSmsReqVO) => {
  const requestParams = { url: SmsTemplateApi.SendSms, data };
  return defHttp.post<any>(requestParams, {});
};
