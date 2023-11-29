import { defHttp } from '/@/utils/http/axios';

// baseset Common API
export enum CommonApi {
  GetOrgStationPeriodTree = '/baseset/common/list-orgStationPeriodTree',
  GetOrgStationWarehouseTree = '/baseset/common/list-stationWarehouse',
  LIST_STATION_TREE = '/baseset/common/list-orgStationTree',
  LIST_STATION_PERSON = '/baseset/common/list-stationPerson',
}

export const getOrgStationPeriodTree = async (params) => {
  const requestParams = { url: CommonApi.GetOrgStationPeriodTree, params };
  return defHttp.post<any>(requestParams, { isOnlyResult: true });
};

export const getOrgStationWarehouseTree = async (params) => {
  const requestParams = { url: CommonApi.GetOrgStationWarehouseTree, params };
  return defHttp.post<any>(requestParams, { isOnlyResult: true });
};

// 获取电站树
export const getStationTree = (params) =>
  defHttp.post(
    {
      url: CommonApi.LIST_STATION_TREE,
      params,
    },
    {},
  );

// 获取电站下的组织人员
export const getStationPerson = (params) =>
  defHttp.post(
    {
      url: CommonApi.LIST_STATION_PERSON,
      params,
    },
    {},
  );
