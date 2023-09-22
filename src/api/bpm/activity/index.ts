import { defHttp } from '/@/utils/http/axios';

// 表单API
export enum BpmActivityApi {
  ActivityList = '/bpm/activity/list',
}

// 获取Activity列表
export const getActivityList = async (params) => {
  const requestParams = { url: BpmActivityApi.ActivityList, params };
  return defHttp.post<any>(requestParams, {});
};
