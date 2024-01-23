import { defHttp } from '/@/utils/http/axios';

export interface MailAccountVO {
  id: number;
  mail: string;
  username: string;
  password: string;
  host: string;
  port: number;
  sslEnable: boolean;
}

// 表单API
export enum MailAccountAPI {
  GetMailAccountPage = '/system/mail-account/page',
  GetMailAccount = '/system/mail-account/get?id=',
  CreateMailAccount = '/system/mail-account/create',
  UpdateMailAccount = '/system/mail-account/update',
  DeleteMailAccount = '/system/mail-account/delete?id=',
  GetSimpleMailAccountList = '/system/mail-account/list-all-simple',
}

// 查询邮箱账号列表
export const getMailAccountPage = async (params: any) => {
  const requestParams = { url: MailAccountAPI.GetMailAccountPage, params };
  return defHttp.get<any>(requestParams, {});
};

// 查询邮箱账号详情
export const getMailAccount = async (id: number) => {
  const requestParams = { url: MailAccountAPI.GetMailAccount + id };
  return defHttp.get<any>(requestParams, {});
};

// 新增邮箱账号
export const createMailAccount = async (data: MailAccountVO) => {
  const requestParams = { url: MailAccountAPI.CreateMailAccount, data };
  return defHttp.post<any>(requestParams, {});
};

// 修改邮箱账号
export const updateMailAccount = async (data: MailAccountVO) => {
  const requestParams = { url: MailAccountAPI.UpdateMailAccount, data };
  return defHttp.put<any>(requestParams, {});
};

// 删除邮箱账号
export const deleteMailAccount = async (id: number) => {
  const requestParams = { url: MailAccountAPI.DeleteMailAccount + id };
  return defHttp.delete<any>(requestParams, {});
};

// 获得邮箱账号精简列表
export const getSimpleMailAccountList = async () => {
  const requestParams = { url: MailAccountAPI.GetSimpleMailAccountList };
  return defHttp.get<any>(requestParams, {});
};
