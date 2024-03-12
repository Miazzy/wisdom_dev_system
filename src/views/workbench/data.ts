import { defHttp } from '/@/utils/http/axios';

enum Api {
  getIndexTreeUrl = '/oa/data-board/indexTree',

  saveDataBoardUrl = '/oa/data-board/save',

  getDataBoardUrl = '/oa/data-board/get',

  getDataBoardResultUrl = '/oa/data-board/get-data',

  // ########################快捷导航########################
  getMenuTreeUrl = '/system/auth/list-menus',

  saveMenuBoardUrl = '/oa/menu-board/save',

  getMenuBoardUrl = '/oa/menu-board/get',

  getMenuBoardResultUrl = '/oa/menu-board/get-data',
}

//获取树数据
export const getIndexTreeData = (params) => defHttp.post({ url: Api.getIndexTreeUrl, params });

//保存数据
export const saveDataBoard = (params) =>
  defHttp.post({ url: Api.saveDataBoardUrl, params }, { isOnlyResult: true });

//查询数据
export const getDataBoard = (params) =>
  defHttp.get({ url: Api.getDataBoardUrl, params }, { isOnlyResult: true });

export const getDataBoardResult = (params) =>
  defHttp.get({ url: Api.getDataBoardResultUrl, params }, { isOnlyResult: true });

// ########################快捷导航########################
//获取树数据
export const getMenuTreeData = (params) => defHttp.get({ url: Api.getMenuTreeUrl, params });

//保存数据
export const saveMenuBoard = (params) =>
  defHttp.post({ url: Api.saveMenuBoardUrl, params }, { isOnlyResult: true });

//查询数据
export const getMenuBoard = (params) =>
  defHttp.get({ url: Api.getMenuBoardUrl, params }, { isOnlyResult: true });

export const getMenuBoardResult = (params) =>
  defHttp.get({ url: Api.getMenuBoardResultUrl, params }, { isOnlyResult: true });

// ########################工作安排########################
export const getWorkRecord = (workScheduleId: string, stationId: string) =>
  defHttp.get(
    { url: `/oa/work-record/get?workScheduleId=${workScheduleId}&stationId=${stationId}` },
    { isOnlyResult: true },
  );

export const getWorkRecordPage = (params) =>
  defHttp.get({ url: '/oa/work-record/page', params }, { isOnlyResult: true });

export const saveWorkRecord = (params) => {
  if (!params.id) {
    return defHttp.post({ url: '/oa/work-record/create', params }, { isOnlyResult: true });
  }
  return defHttp.put({ url: '/oa/work-record/update', params }, { isOnlyResult: true });
};
