import { defHttp } from '/@/utils/http/axios';

// baseset Common API
export enum CommonApi {
  GetOrgStationPeriodTree = '/baseset/common/list-orgStationPeriodTree',
  GetOrgStationWarehouseTree = '/baseset/common/list-stationWarehouse',
}

export const getOrgStationPeriodTree = async (params) => {
  const requestParams = { url: CommonApi.GetOrgStationPeriodTree, params };
  return defHttp.post<any>(requestParams, { isOnlyResult: true });
};

export const getOrgStationWarehouseTree = async (params) => {
  const requestParams = { url: CommonApi.GetOrgStationWarehouseTree, params };
  return defHttp.post<any>(requestParams, { isOnlyResult: true });
};
