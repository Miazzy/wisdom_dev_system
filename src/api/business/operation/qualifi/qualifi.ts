import { defHttp } from '/@/utils/http/axios';

enum Api {
  StationList = '/scomms-po/station/list',
  StationOutLine = '/jw/largeScreen/stationOutline/elec/today?stationId=24',
  StationSelectById = '/scomms-po/station/selectById',
}

export function getStationList() {
  return defHttp.get({ url: Api.StationList }, {});
}

export function getStationOutLine() {
  return defHttp.get({ url: Api.StationOutLine }, {});
}

export function getStationSelectById(params) {
  return defHttp.get({ url: Api.StationSelectById, params }, {});
}
