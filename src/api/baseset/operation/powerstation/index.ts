import { defHttp } from '/@/utils/http/axios';

export enum Api {
  getPowerStationUrl = '/baseset/powerstation/get',
  getAllPowerStationUrl = '/baseset/powerstation/list',
}

// 查询电站基础信息
export const getPowerStation = (params) => defHttp.get({ url: Api.getPowerStationUrl, params }, {});

// 查询所有电站基础信息
export const getAllPowerStation = () =>
  defHttp.get({ url: Api.getAllPowerStationUrl }, { isOnlyResult: true });
