import { defHttp } from '/@/utils/http/axios';

export interface NotifyTemplateVO {
  id?: number;
  name: string;
  nickname: string;
  code: string;
  content: string;
  type: number;
  params: string;
  status: number;
  remark: string;
}

export interface NotifySendReqVO {
  userId: number | null;
  templateCode: string;
  templateParams: Map<String, Object>;
}

// 表单API
export enum TemplateAPI {
  GetNotifyTemplatePage = '/system/notify-template/page',
  GetNotifyTemplate = '/system/notify-template/get?id=',
  CreateNotifyTemplate = '/system/notify-template/create',
  UpdateNotifyTemplate = '/system/notify-template/update',
  DeleteNotifyTemplate = '/system/notify-template/delete?id=',
  SendNotify = '/system/notify-template/send-notify',
}

// 查询站内信模板列表
export const getNotifyTemplatePage = async (params: any) => {
  const requestParams = { url: TemplateAPI.GetNotifyTemplatePage, params };
  return defHttp.get<any>(requestParams, {});
};

// 查询站内信模板详情
export const getNotifyTemplate = async (id: number) => {
  const requestParams = { url: TemplateAPI.GetNotifyTemplate + id };
  return defHttp.get<any>(requestParams, {});
};

// 新增站内信模板
export const createNotifyTemplate = async (data: NotifyTemplateVO) => {
  const requestParams = { url: TemplateAPI.CreateNotifyTemplate, data };
  return defHttp.post<any>(requestParams, {});
};

// 修改站内信模板
export const updateNotifyTemplate = async (data: NotifyTemplateVO) => {
  const requestParams = { url: TemplateAPI.UpdateNotifyTemplate, data };
  return defHttp.put<any>(requestParams, {});
};

// 删除站内信模板
export const deleteNotifyTemplate = async (id: number) => {
  const requestParams = { url: TemplateAPI.DeleteNotifyTemplate + id };
  return defHttp.delete<any>(requestParams, {});
};

// 发送站内信
export const sendNotify = (data: NotifySendReqVO) => {
  const requestParams = { url: TemplateAPI.SendNotify, data };
  return defHttp.post<any>(requestParams, {});
};
