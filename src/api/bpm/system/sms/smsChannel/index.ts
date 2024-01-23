import { defHttp } from '/@/utils/http/axios';

export interface SmsChannelVO {
  id: number;
  code: string;
  status: number;
  signature: string;
  remark: string;
  apiKey: string;
  apiSecret: string;
  callbackUrl: string;
  createTime: Date;
}

export enum SmsLogApi {
  GetSmsChannelPage = '/system/sms-channel/page',
  GetSimpleSmsChannelList = '/system/sms-channel/list-all-simple',
  GetSmsChannel = '/system/sms-channel/get?id=',
  CreateSmsChannel = '/system/sms-channel/create',
  UpdateSmsChannel = '/system/sms-channel/update',
  DeleteSmsChannel = '/system/sms-channel/delete?id=',
}

// 查询短信渠道列表
export const getSmsChannelPage = (params: any) => {
  const requestParams = { url: SmsLogApi.GetSmsChannelPage, params };
  return defHttp.get<any>(requestParams, {});
};

// 获得短信渠道精简列表
export function getSimpleSmsChannelList() {
  const requestParams = { url: SmsLogApi.GetSimpleSmsChannelList };
  return defHttp.get<any>(requestParams, {});
}

// 查询短信渠道详情
export const getSmsChannel = (id: number) => {
  const requestParams = { url: SmsLogApi.GetSmsChannel + id };
  return defHttp.get<any>(requestParams, {});
};

// 新增短信渠道
export const createSmsChannel = (data: SmsChannelVO) => {
  const requestParams = { url: SmsLogApi.CreateSmsChannel, data };
  return defHttp.get<any>(requestParams, {});
};

// 修改短信渠道
export const updateSmsChannel = (data: SmsChannelVO) => {
  const requestParams = { url: SmsLogApi.UpdateSmsChannel, data };
  return defHttp.put<any>(requestParams, {});
};

// 删除短信渠道
export const deleteSmsChannel = (id: number) => {
  const requestParams = { url: SmsLogApi.DeleteSmsChannel + id };
  return defHttp.delete<any>(requestParams, {});
};
