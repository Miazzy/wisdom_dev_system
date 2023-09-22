import { defHttp } from '/@/utils/http/axios';

export type LeaveVO = {
  id: number;
  result: number;
  type: number;
  reason: string;
  processInstanceId: string;
  startTime: string;
  endTime: string;
  createTime: string;
};

// 表单API
export enum BpmLeaveApi {
  CreateLeave = '/bpm/oa/leave/create',
  GetLeave = '/bpm/oa/leave/get?id=',
  GetLeavePage = '/bpm/oa/leave/page',
}

// 创建请假申请
export const createLeave = async (data: LeaveVO) => {
  const requestParams = { url: BpmLeaveApi.CreateLeave, data };
  return defHttp.post<any>(requestParams, {});
};

// 获得请假申请
export const getLeave = async (id: number) => {
  const requestParams = { url: BpmLeaveApi.GetLeave + id };
  return defHttp.get<any>(requestParams, {});
};

// 获得请假申请分页
export const getLeavePage = async (params) => {
  const requestParams = { url: BpmLeaveApi.GetLeavePage, params };
  return defHttp.get<any>(requestParams, {});
};
