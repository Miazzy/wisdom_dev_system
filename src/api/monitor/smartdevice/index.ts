import { defHttp } from '/@/utils/http/axios';

enum Api {
  // 首页电站数据
  getHomePageStationsUrl = '/da/home-page/stations',
  // 获得行车记录仪实时状态统计
  getDrRealStatusCountUrl = '/monitor/driving-recorder-real-status/getRealStatusCount',
  // 分页获得行车记录仪实时状态列表
  getDrPageUrl = '/monitor/driving-recorder-real-status/page',
  // 获得行车记录仪实时状态列表
  getDrListUrl = '/monitor/driving-recorder-real-status/list',
  // 导出行车记录仪实时状态
  exportDrExcelUrl = '/monitor/driving-recorder-real-status/export-excel',
  // 获得电子工牌实时状态统计
  getEwcRealStatusCountUrl = '/monitor/ele-work-card-real-status/getRealStatusCount',
  // 分页获得电子工牌实时状态列表
  getEwcPageUrl = '/monitor/ele-work-card-real-status/page',
  // 获得电子工牌实时状态列表
  getEwcListUrl = '/monitor/ele-work-card-real-status/list',
  // 导出电子工牌实时状态
  exportEwcExcelUrl = '/monitor/ele-work-card-real-status/export-excel',
  // 获得巡检仪实时状态统计
  getIiRealStatusCountUrl = '/monitor/inspection-instrument-real-status/getRealStatusCount',
  // 分页获得巡检仪实时状态列表
  getIiPageUrl = '/monitor/inspection-instrument-real-status/page',
  // 获得巡检仪实时状态列表
  getIiListUrl = '/monitor/inspection-instrument-real-status/list',
  // 导出巡检仪实时状态
  exportIiExcelUrl = '/monitor/inspection-instrument-real-status/export-excel',

  // 获得行车记录仪坐标列表
  getDrGpsListUrl = '/monitor/driving-recorder-gps/list',
  // 获得电子工牌坐标列表
  getEwcGpsListUrl = '/monitor/ele-work-card-gps/list',
  // 获得巡检仪坐标列表
  getIiGpsListUrl = '/monitor/inspection-instrument-gps/list',
  // 获取巡检仪文件
  getIiFilePageUrl = '/monitor/inspection-instrument-file/page',
}

export const getHomePageStations = (params) =>
  defHttp.get({ url: Api.getHomePageStationsUrl, params }, {});

export const getDrRealStatusCount = (params) =>
  defHttp.get({ url: Api.getDrRealStatusCountUrl, params }, { isOnlyResult: true });

export const getDrPage = (params) =>
  defHttp.get({ url: Api.getDrPageUrl, params }, { isOnlyResult: true });

export const getDrList = (params) =>
  defHttp.get({ url: Api.getDrListUrl, params }, { isOnlyResult: true });

export const exportDrExcel = (params) =>
  defHttp.post({ url: Api.exportDrExcelUrl, params, responseType: 'blob' }, { isOnlyResult: true });

export const getEwcRealStatusCount = (params) =>
  defHttp.get({ url: Api.getEwcRealStatusCountUrl, params }, { isOnlyResult: true });

export const getEwcPage = (params) =>
  defHttp.get({ url: Api.getEwcPageUrl, params }, { isOnlyResult: true });

export const getEwcList = (params) =>
  defHttp.get({ url: Api.getEwcListUrl, params }, { isOnlyResult: true });

export const exportEwcExcel = (params) =>
  defHttp.post(
    { url: Api.exportEwcExcelUrl, params, responseType: 'blob' },
    { isOnlyResult: true },
  );

export const getIiRealStatusCount = (params) =>
  defHttp.get({ url: Api.getIiRealStatusCountUrl, params }, { isOnlyResult: true });

export const getIiPage = (params) =>
  defHttp.get({ url: Api.getIiPageUrl, params }, { isOnlyResult: true });

export const getIiList = (params) =>
  defHttp.get({ url: Api.getIiListUrl, params }, { isOnlyResult: true });

export const exportIiExcel = (params) =>
  defHttp.post({ url: Api.exportIiExcelUrl, params, responseType: 'blob' }, { isOnlyResult: true });

export const getDrGpsList = (params) =>
  defHttp.get({ url: Api.getDrGpsListUrl, params }, { isOnlyResult: true });

export const getEwcGpsList = (params) =>
  defHttp.get({ url: Api.getEwcGpsListUrl, params }, { isOnlyResult: true });

export const getIiGpsList = (params) =>
  defHttp.get({ url: Api.getIiGpsListUrl, params }, { isOnlyResult: true });

export const getIiFilePage = (params) =>
  defHttp.get({ url: Api.getIiFilePageUrl, params }, { isOnlyResult: true });
