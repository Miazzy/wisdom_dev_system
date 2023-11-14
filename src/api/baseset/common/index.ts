import { defHttp } from '/@/utils/http/axios';

// baseset Common API
export enum CommonApi {
  GetOrgStationPeriodTree = '/baseset/common/list-orgStationPeriodTree',
}

export const getOrgStationPeriodTree = async (params) => {
  const requestParams = { url: CommonApi.GetOrgStationPeriodTree, params };
  return defHttp.post<any>(requestParams, { isOnlyResult: true });
};
