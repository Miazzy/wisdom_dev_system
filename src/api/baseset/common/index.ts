import { defHttp } from '/@/utils/http/axios';

// baseset Common API
export enum CommonApi {
  GetOrgStationPeriodTree = '/baseset/common/list-orgStationPeriodTree',
  GetOrgStationWarehouseTree = '/baseset/common/list-stationWarehouse',
  LIST_STATION = '/baseset/common/list-station',
  LIST_STATION_TREE = '/baseset/common/list-orgStationTree',
  LIST_STATION_PERSON = '/baseset/common/list-stationPerson',
  GetMaterialCategoryTreeData = '/baseset/material-category/getTreeData',
}

export const getOrgStationPeriodTree = async (params) => {
  const requestParams = { url: CommonApi.GetOrgStationPeriodTree, params };
  return defHttp.post<any>(requestParams, { isOnlyResult: true });
};

export const getOrgStationWarehouseTree = async (params) => {
  const requestParams = { url: CommonApi.GetOrgStationWarehouseTree, params };
  return defHttp.post<any>(requestParams, { isOnlyResult: true });
};

export const getMaterialCategoryTreeData = async (params) => {
  const requestParams = { url: CommonApi.GetMaterialCategoryTreeData, params };
  return defHttp.get<any>(requestParams, { isOnlyResult: true });
};

// 获取电站列表
export const getStationList = (params) =>
  defHttp.post(
    {
      url: CommonApi.LIST_STATION,
      params,
    },
    { isOnlyResult: true },
  );

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
export const getStationPerson = (stationId: string) => {
  return defHttp.post(
    {
      url: `${CommonApi.LIST_STATION_PERSON}?stationId=${stationId}`,
    },
    { isOnlyResult: true },
  );
};
