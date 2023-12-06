import { defHttp } from '/@/utils/http/axios';

export enum Api {
  getPowerStationUrl = '/baseset/powerstation/get',
}

// 查询电站基础信息
export const getPowerStation = (params) => defHttp.get({ url: Api.getPowerStationUrl, params }, {});
