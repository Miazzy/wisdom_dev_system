import { defHttp } from '/@/utils/http/axios';

enum Api {
  getIndexTreeUrl = '/oa/data-board/indexTree',

  saveDataBoardUrl = '/oa/data-board/save',

  getDataBoardUrl = '/oa/data-board/get',
}

//获取树数据
export const getIndexTreeData = (params) => defHttp.post({ url: Api.getIndexTreeUrl, params });

//保存数据
export const saveDataBoard = (params) =>
  defHttp.post({ url: Api.saveDataBoardUrl, params }, { isOnlyResult: true });

//查询数据
export const getDataBoard = (params) =>
  defHttp.get({ url: Api.getDataBoardUrl, params }, { isOnlyResult: true });
