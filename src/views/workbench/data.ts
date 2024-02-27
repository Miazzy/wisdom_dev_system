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
