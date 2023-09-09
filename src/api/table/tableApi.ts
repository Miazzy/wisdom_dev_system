import { defHttp } from '/@/utils/http/axios';

enum Api {
  LIST_DATA = '/table/getListData',
  ADD_DATA = '/table/addListData',
  EDIT_DATA = '/table/editListData',
  DEL_DATA = '/table/delListData',
}

// table列表
export const getListDataApi = (params) =>
  defHttp.get({ url: '/scomms-po/station/list', params }, {});

// 新增
export const addListDataApi = (params) =>
  defHttp.post({ url: '/scomms-po/station/save', params }, {});

// 编辑
export const editListDataApi = (params) =>
  defHttp.post({ url: '/scomms-po/station/update', params }, {});

// 删除
export const delListDataApi = (params) =>
  defHttp.post({ url: '/scomms-po/station/del', params }, {});
